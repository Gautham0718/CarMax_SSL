// const express = require('express');
// const cors = require('cors');
// const https = require('https');

// const app = express();
// app.use(cors());
// app.use(express.json());

// async function getCertificateDetails(number) {
//     const suffixes = ["ntxcl01", "ntxcl02"];
    
//     for (const suffix of suffixes) {
//         const website = `https://${number}${suffix}.carmax.org:9440/console/#login`;
//         const url = new URL(website);
//         const options = {
//             host: url.hostname,
//             port: 9440,
//             rejectUnauthorized: false,
//             agent: false // Forces a fresh connection for every request
//         };

//         try {
//             const validTo = await new Promise((resolve, reject) => {
//                 const req = https.request(options, res => {
//                     const cert = res.connection.getPeerCertificate();
//                     let validDate = cert?.valid_to ? new Date(cert.valid_to) : null;
//                     let formattedDate = validDate
//                         ? `${validDate.getDate().toString().padStart(2, '0')}-${validDate.toLocaleString('en-US', { month: 'short' })}-${validDate.getFullYear().toString().slice(-2)}`
//                         : "N/A";

//                     resolve(formattedDate);
//                 });

//                 req.on('error', () => reject());
//                 req.end();
//             });

//             return { website, valid_to: validTo };
//         } catch {
//             continue;
//         }
//     }

//     return { website: `${number} (No valid suffix)`, valid_to: "Error fetching" };
// }

// // API Endpoint to handle requests from frontend.js
// app.post("/check", async (req, res) => {
//     const numbers = req.body.numbers;
//     let results = await Promise.all(numbers.map(getCertificateDetails));
//     res.json(results);
// });

// app.listen(3000, () => console.log("✅ Server running on port 3000"));


const express = require("express");
const cors = require("cors");
const https = require("https");
const dns = require("dns").promises;
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Function to resolve hostname to IP
async function resolveHostname(hostname) {
    try {
        const addresses = await dns.resolve(hostname);
        return addresses[0]; // Return first resolved IP
    } catch (error) {
        console.error(`❌ DNS resolution failed for ${hostname}:`, error);
        return null; // Return null if resolution fails
    }
}

// Function to fetch SSL certificate details with automatic fallback
async function getCertificateDetails(number) {
    const suffixes = ["ntxcl01", "ntxcl02"];
    let lastAttemptedWebsite = null;

    for (const suffix of suffixes) {
        const hostname = `${number}${suffix}.carmax.org`;
        const website = `https://${hostname}:9440/console/#login`;
        lastAttemptedWebsite = website;
        const resolvedIP = await resolveHostname(hostname);

        if (!resolvedIP) {
            console.warn(`⚠️ Skipping ${hostname}, DNS resolution failed.`);
            continue; // Move to the next suffix if DNS resolution fails
        }

        console.log(`✅ Using IP: ${resolvedIP} for ${hostname}`);

        const options = {
            host: resolvedIP,
            port: 9440,
            rejectUnauthorized: false,
            secureProtocol: "TLSv1_2_method",
            timeout: 10000, // Increase timeout to handle slow requests
            agent: new https.Agent({ keepAlive: true }) // Keep connection alive
        };

        try {
            const validTo = await new Promise((resolve, reject) => {
                const req = https.request(options, (res) => {
                    const cert = res.connection.getPeerCertificate();
                    if (!cert || !cert.valid_to) {
                        return reject(new Error("Certificate not found"));
                    }

                    let validDate = new Date(cert.valid_to);
                    let formattedDate = `${validDate.getDate().toString().padStart(2, "0")}-${validDate.toLocaleString("en-US", { month: "short" })}-${validDate.getFullYear().toString().slice(-2)}`;

                    resolve(formattedDate);
                });

                req.on("error", (err) => {
                    console.error(`❌ Request error for ${website}:`, err);
                    req.destroy(); // Ensure request cleanup
                    reject(err);
                });

                req.end(); // Close request properly
            });

            return { website, valid_to: validTo };
        } catch (error) {
            console.error(`❌ Error fetching certificate for ${website}:`, error);
        }
    }

    return { website: lastAttemptedWebsite || `${number} (No valid suffix)`, valid_to: "Error fetching certificate" };
}

// Controlled request execution to prevent race conditions
async function getCertificateDetailsSequentially(numbers) {
    let results = [];

    for (const number of numbers) {
        const result = await getCertificateDetails(number);
        results.push(result);
        await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay between requests
    }

    return results;
}

// Serve static files
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "src", "index.html"));
});

// API Endpoint with controlled request execution & caching prevention
app.post("/check", async (req, res) => {
    const numbers = req.body.numbers || [];
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Expires", "0"); // Prevent caching
    let results = await getCertificateDetailsSequentially(numbers);
    res.json(results);
});

// Server Port Configuration
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
