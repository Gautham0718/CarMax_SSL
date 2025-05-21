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

const express = require('express');
const cors = require('cors');
const https = require('https');
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

async function getCertificateDetails(number) {
    const suffixes = ["ntxcl01", "ntxcl02"];
    
    for (const suffix of suffixes) {
        const website = `https://${number}${suffix}.carmax.org:9440/console/#login`;
        const hostname = `${number}${suffix}.carmax.org`;
        const options = {
            host: hostname,
            port: 9440,
            rejectUnauthorized: false,
            agent: false // Forces a fresh connection for every request
        };

        try {
            const validTo = await new Promise((resolve, reject) => {
                const req = https.request(options, (res) => {
                    const cert = res.connection.getPeerCertificate();
                    let validDate = cert && cert.valid_to ? new Date(cert.valid_to) : null;
                    let formattedDate = validDate
                        ? `${validDate.getDate().toString().padStart(2, '0')}-${validDate.toLocaleString('en-US', { month: 'short' })}-${validDate.getFullYear().toString().slice(-2)}`
                        : "N/A";

                    resolve(formattedDate);
                });

                req.on('error', (err) => reject(err));
                req.end();
            });

            return { website, valid_to: validTo };
        } catch (error) {
            console.error(`Error fetching certificate for ${website}:`, error);
        }
    }

    return { website: `${number} (No valid suffix)`, valid_to: "Error fetching" };
}

// Serve static files from the "src" folder
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "src", "index.html"));
});


// API Endpoint to handle requests from frontend.js
app.post("/check", async (req, res) => {
    const numbers = req.body.numbers || [];
    let results = await Promise.all(numbers.map(getCertificateDetails));
    res.json(results);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
