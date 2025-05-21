// document.getElementById("output").innerHTML = ""; // Clears old results before each check

// document.getElementById("checkSSL").addEventListener("click", async () => {
//     const fileInput = document.getElementById("fileInput");
//     const file = fileInput.files[0];

//     if (!file) {
//         document.getElementById("output").innerHTML = "<p>Please upload a TXT file.</p>";
//         return;
//     }

//     const reader = new FileReader();
//     reader.onload = async function(event) {
//         const fileContent = event.target.result;
//         const numbers = fileContent.split(",").map(num => num.trim());

//         if (!numbers.length || numbers[0] === "") {
//             document.getElementById("output").innerHTML = "<p>No valid numbers found in the file.</p>";
//             return;
//         }

//         try {
//             const response = await fetch("http://localhost:3000/check", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ numbers })
//             });

//             const result = await response.json();
//             displayResults(result);
//             createCSVDownload(result);
//         } catch (error) {
//             document.getElementById("output").innerHTML = "<p>Error fetching SSL certificates.</p>";
//         }
//     };

//     reader.readAsText(file);
// });

// function displayResults(results) {
//     // Sort results: Expired first, then Active
//     results.sort((a, b) => {
//         const currentDate = new Date();
//         const expiryDateA = new Date(a.valid_to);
//         const expiryDateB = new Date(b.valid_to);
//         const statusA = isNaN(expiryDateA.getTime()) || expiryDateA <= currentDate ? 0 : 1;
//         const statusB = isNaN(expiryDateB.getTime()) || expiryDateB <= currentDate ? 0 : 1;
//         return statusA - statusB; // Expired (0) comes first
//     });

//     let outputHTML = `
//         <h3>Results:</h3>
//         <table border="1" style="width: 100%; border-collapse: collapse;">
//             <thead>
//                 <tr>
//                     <th style="padding: 10px; background-color: #f2f2f2;">Hostname</th>
//                     <th style="padding: 10px; background-color: #f2f2f2;">Expiry Date</th>
//                     <th style="padding: 10px; background-color: #f2f2f2;">Expiry Status</th>
//                 </tr>
//             </thead>
//             <tbody>
//     `;

//     const currentDate = new Date();

//     results.forEach(({ website, valid_to }) => {
//         const hostnameMatch = website.match(/https:\/\/(\d{4}ntxcl\d{2})\.carmax\.org/);
//         const formattedHostname = hostnameMatch ? hostnameMatch[1] : "Invalid Format";
        
//         let expiryStatus = "N/A";
//         let expiryDate = valid_to;

//         if (valid_to && valid_to !== "Error fetching" && formattedHostname !== "Invalid Format") {
//             const parsedExpiryDate = new Date(valid_to);
            
//             if (!isNaN(parsedExpiryDate.getTime())) {
//                 expiryStatus = parsedExpiryDate > currentDate ? "✅ Active" : "❌ Expired";
//                 expiryDate = parsedExpiryDate.toISOString().split("T")[0];
//             } else {
//                 expiryDate = "❌ Not Found";
//                 expiryStatus = "N/A";
//             }
//         } else {
//             expiryDate = "❌ Not Found";
//             expiryStatus = "N/A";
//         }

//         outputHTML += `
//             <tr>
//                 <td style="padding: 10px;">${formattedHostname}</td>
//                 <td style="padding: 10px;">${expiryDate}</td>
//                 <td style="padding: 10px;">${expiryStatus}</td>
//             </tr>
//         `;
//     });

//     outputHTML += `
//             </tbody>
//         </table>
//         <button id="downloadCSV">Download CSV</button>
//     `;

//     document.getElementById("output").innerHTML = outputHTML;

//     document.getElementById("downloadCSV").addEventListener("click", () => {
//         downloadCSV(results);
//     });
// }

// function createCSVDownload(results) {
//     // Sort results: Expired first, then Active
//     results.sort((a, b) => {
//         const currentDate = new Date();
//         const expiryDateA = new Date(a.valid_to);
//         const expiryDateB = new Date(b.valid_to);
//         const statusA = isNaN(expiryDateA.getTime()) || expiryDateA <= currentDate ? 0 : 1;
//         const statusB = isNaN(expiryDateB.getTime()) || expiryDateB <= currentDate ? 0 : 1;
//         return statusA - statusB; // Expired (0) comes first
//     });

//     let csvContent = "data:text/csv;charset=utf-8,Hostname,Expiry Date,Expiry Status\n";
//     const currentDate = new Date();

//     results.forEach(({ website, valid_to }) => {
//         const hostnameMatch = website.match(/https:\/\/(\d{4}ntxcl\d{2})\.carmax\.org/);
//         const formattedHostname = hostnameMatch ? hostnameMatch[1] : "Invalid Format";

//         let expiryStatus = "N/A";
//         let expiryDate = valid_to;

//         if (valid_to && valid_to !== "Error fetching" && formattedHostname !== "Invalid Format") {
//             const parsedExpiryDate = new Date(valid_to);

//             if (!isNaN(parsedExpiryDate.getTime())) {
//                 expiryStatus = parsedExpiryDate > currentDate ? "Active" : "Expired";
//                 expiryDate = parsedExpiryDate.toISOString().split("T")[0];
//             } else {
//                 expiryDate = "Not Found";
//                 expiryStatus = "N/A";
//             }
//         } else {
//             expiryDate = "Not Found";
//             expiryStatus = "N/A";
//         }

//         csvContent += `${formattedHostname},${expiryDate},${expiryStatus}\n`;
//     });

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "ssl_certificates.csv");
//     link.style.display = "none";
//     document.body.appendChild(link);

//     window.downloadCSV = () => {
//         link.click();
//     };
// }


document.getElementById("output").innerHTML = ""; // Clears old results before each check

document.getElementById("checkSSL").addEventListener("click", async () => {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        document.getElementById("output").innerHTML = "<p>Please upload a TXT file.</p>";
        return;
    }

    const reader = new FileReader();
    reader.onload = async function (event) {
        const fileContent = event.target.result;
        const numbers = fileContent.split(",").map(num => num.trim());

        if (!numbers.length || numbers[0] === "") {
            document.getElementById("output").innerHTML = "<p>No valid numbers found in the file.</p>";
            return;
        }

        try {
            const response = await fetch("https://carmax-ssl.onrender.com/check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ numbers })
            });

            if (!response.ok) throw new Error("Network response was not OK");

            const result = await response.json();
            displayResults(result);
            createCSVDownload(result);
        } catch (error) {
            console.error("Fetch Error:", error);
            document.getElementById("output").innerHTML = "<p>Error fetching SSL certificates.</p>";
        }
    };

    reader.readAsText(file);
});

function displayResults(results) {
    results.sort((a, b) => {
        const currentDate = new Date();
        const expiryDateA = new Date(a.valid_to || "");
        const expiryDateB = new Date(b.valid_to || "");
        const statusA = isNaN(expiryDateA.getTime()) || expiryDateA <= currentDate ? 0 : 1;
        const statusB = isNaN(expiryDateB.getTime()) || expiryDateB <= currentDate ? 0 : 1;
        return statusA - statusB; // Expired (0) comes first
    });

    let outputHTML = `
        <h3>Results:</h3>
        <table border="1" style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th>Hostname</th>
                    <th>Expiry Date</th>
                    <th>Expiry Status</th>
                </tr>
            </thead>
            <tbody>
    `;

    results.forEach(({ website, valid_to }) => {
        const hostnameMatch = website.match(/https:\/\/(\d{4}ntxcl\d{2})\.carmax\.org/);
        const formattedHostname = hostnameMatch ? hostnameMatch[1] : "Invalid Format";

        let expiryStatus = "N/A";
        let expiryDate = valid_to || "❌ Not Found";

        if (valid_to && valid_to !== "Error fetching" && formattedHostname !== "Invalid Format") {
            const parsedExpiryDate = new Date(valid_to);
            if (!isNaN(parsedExpiryDate.getTime())) {
                expiryStatus = parsedExpiryDate > new Date() ? "✅ Active" : "❌ Expired";
                expiryDate = parsedExpiryDate.toISOString().split("T")[0];
            }
        }

        outputHTML += `
            <tr>
                <td>${formattedHostname}</td>
                <td>${expiryDate}</td>
                <td>${expiryStatus}</td>
            </tr>
        `;
    });

    outputHTML += `
            </tbody>
        </table>
        <button id="downloadCSV">Download CSV</button>
    `;

    document.getElementById("output").innerHTML = outputHTML;

    document.getElementById("downloadCSV").addEventListener("click", () => {
        downloadCSV(results);
    });
}

function createCSVDownload(results) {
    results.sort((a, b) => {
        const currentDate = new Date();
        const expiryDateA = new Date(a.valid_to || "");
        const expiryDateB = new Date(b.valid_to || "");
        const statusA = isNaN(expiryDateA.getTime()) || expiryDateA <= currentDate ? 0 : 1;
        const statusB = isNaN(expiryDateB.getTime()) || expiryDateB <= currentDate ? 0 : 1;
        return statusA - statusB; // Expired (0) comes first
    });

    let csvContent = "data:text/csv;charset=utf-8,Hostname,Expiry Date,Expiry Status\n";

    results.forEach(({ website, valid_to }) => {
        const hostnameMatch = website.match(/https:\/\/(\d{4}ntxcl\d{2})\.carmax\.org/);
        const formattedHostname = hostnameMatch ? hostnameMatch[1] : "Invalid Format";

        let expiryStatus = "N/A";
        let expiryDate = valid_to || "Not Found";

        if (valid_to && valid_to !== "Error fetching" && formattedHostname !== "Invalid Format") {
            const parsedExpiryDate = new Date(valid_to);
            if (!isNaN(parsedExpiryDate.getTime())) {
                expiryStatus = parsedExpiryDate > new Date() ? "Active" : "Expired";
                expiryDate = parsedExpiryDate.toISOString().split("T")[0];
            }
        }

        csvContent += `${formattedHostname},${expiryDate},${expiryStatus}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ssl_certificates.csv");
    link.style.display = "none";
    document.body.appendChild(link);

    window.downloadCSV = () => {
        link.click();
    };
}




// document.getElementById("checkSSL").addEventListener("click", async () => {
//     try {
//         document.getElementById("output").innerHTML = "<p>Processing request...</p>";

//         const addText = document.getElementById("addInput").value;
//         const removeText = document.getElementById("removeInput").value;

//         const numbersToAdd = addText.split(",").map(num => num.trim()).filter(num => num);
//         const numbersToRemove = removeText.split(",").map(num => num.trim()).filter(num => num);

//         // Update JSON file
//         const updateResponse = await fetch("http://localhost:3000/update", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ add: numbersToAdd, remove: numbersToRemove })
//         });

//         if (!updateResponse.ok) throw new Error("Failed to update servers.json");

//         // Fetch updated JSON
//         const updatedResponse = await fetch("http://localhost:3000/servers");
//         const updatedData = await updatedResponse.json();
//         if (!updatedData.servers) throw new Error("Invalid JSON response");

//         console.log("Sending request to SSL API...");
//         const sslResponse = await fetch("http://localhost:3000/check", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ numbers: updatedData.servers })
//         });

//         console.log("SSL Response Status:", sslResponse.status);

//         if (!sslResponse.ok) throw new Error("SSL request failed");

//         const result = await sslResponse.json();
//         console.log("SSL Response Data:", result);

//         // ✅ Update the UI with results before setting "Process complete."
//         displayResults(result);

//         document.getElementById("output").innerHTML += "<p>Process complete.</p>";

//     } catch (error) {
//         document.getElementById("output").innerHTML = `<p>Error processing request: ${error.message}</p>`;
//     }
// });

// function displayResults(results) {
//     let outputHTML = `
//         <h3>SSL Certificate Results:</h3>
//         <table border="1" style="width: 100%; border-collapse: collapse;">
//             <thead>
//                 <tr>
//                     <th style="padding: 10px; background-color: #f2f2f2;">Server</th>
//                     <th style="padding: 10px; background-color: #f2f2f2;">Expiry Date</th>
//                     <th style="padding: 10px; background-color: #f2f2f2;">Expiry Status</th>
//                 </tr>
//             </thead>
//             <tbody>
//     `;

//     results.forEach(({ server, valid_to }) => {
//         let expiryStatus = valid_to !== "Error fetching" 
//             ? (new Date(valid_to) > new Date() ? "✅ Active" : "❌ Expired") 
//             : "❌ Not Found";

//         let expiryDate = valid_to && valid_to !== "Error fetching" ? valid_to : "❌ Not Found";

//         outputHTML += `
//             <tr>
//                 <td style="padding: 10px;">${server}</td>
//                 <td style="padding: 10px;">${expiryDate}</td>
//                 <td style="padding: 10px;">${expiryStatus}</td>
//             </tr>
//         `;
//     });

//     outputHTML += `
//             </tbody>
//         </table>
//         <button id="downloadCSV">Download CSV</button>
//     `;

//     document.getElementById("output").innerHTML = outputHTML;

//     // Attach event listener for CSV download
//     document.getElementById("downloadCSV").addEventListener("click", () => {
//         downloadCSV(results);
//     });
// }


// function downloadCSV(results) {
//     let csvContent = "data:text/csv;charset=utf-8,Hostname,Expiry Date,Expiry Status\n";

//     results.forEach(({ website, valid_to }) => {
//         let expiryStatus = valid_to !== "Error fetching" 
//             ? (new Date(valid_to) > new Date() ? "Active" : "Expired") 
//             : "Not Found";

//         let expiryDate = valid_to && valid_to !== "Error fetching" ? valid_to : "Not Found";

//         csvContent += `${website},${expiryDate},${expiryStatus}\n`;
//     });

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "ssl_certificates.csv");
//     link.style.display = "none";
//     document.body.appendChild(link);

//     link.click();
// }




// async function getAccessToken() {
//     const tenantId = "YOUR_TENANT_ID"; // Replace with your Microsoft tenant ID
//     const clientId = "YOUR_CLIENT_ID"; // Replace with your Azure registered app client ID
//     const clientSecret = "YOUR_CLIENT_SECRET"; // Replace with your app secret

//     const tokenURL = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

//     const response = await fetch(tokenURL, {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: new URLSearchParams({
//             grant_type: "client_credentials",
//             client_id: clientId,
//             client_secret: clientSecret,
//             scope: "https://graph.microsoft.com/.default"
//         })
//     });

//     const data = await response.json();
//     return data.access_token;
// }

// async function fetchSharePointFile() {
//     const token = await getAccessToken();
//     const fileURL = "https://carmax.sharepoint.com/sites/esserversupport/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2Fesserversupport%2FShared%20Documents%2FKT%2D%20Cognizant%20Win%2DLinux%2DNutanix%2FSOP%20Docs%2FL1%20SOP%2FSSL%5FTesting%2Etxt&parent=%2Fsites%2Fesserversupport%2FShared%20Documents%2FKT%2D%20Cognizant%20Win%2DLinux%2DNutanix%2FSOP%20Docs%2FL1%20SOP";

//     try {
//         const response = await fetch(fileURL, {
//             method: "GET",
//             headers: {
//                 // "Authorization": `Bearer ${token}`,
//                 "Accept": "text/plain"
//             }
//         });

//         console.log(response)

//         if (!response.ok) throw new Error("Failed to fetch SharePoint file");

//         const fileContent = await response.text(); // Get raw text
//         processFileData(fileContent);
//     } catch (error) {
//         console.error("Error fetching SharePoint file:", error);
//     }
// }

// function processFileData(fileContent) {
//     const numbers = fileContent.split(",").map(num => num.trim());

//     if (!numbers.length || numbers[0] === "") {
//         console.error("No valid numbers found in file.");
//         return;
//     }

//     sendNumbersToSSLChecker(numbers);
// }

// async function sendNumbersToSSLChecker(numbers) {
//     try {
//         const response = await fetch("http://localhost:3000/check", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ numbers })
//         });

//         const result = await response.json();
//         console.log("SSL Results:", result);
//         displayResults(result);
//     } catch (error) {
//         console.error("Error sending numbers to SSL Checker:", error);
//     }
// }

// fetchSharePointFile();

// async function fetchSharePointFile() {
//     const fileURL = "https://carmax.sharepoint.com/sites/esserversupport/Shared%20Documents/KT- Cognizant Win-Linux-Nutanix/SOP Docs/L1 SOP/SSL_Testing.txt";

//     try {
//         const response = await fetch(fileURL);

//         if (!response.ok) throw new Error("Failed to fetch SharePoint file");

//         const fileContent = await response.text();
//         processFileData(fileContent);
//     } catch (error) {
//         console.error("Error fetching SharePoint file:", error);
//     }
// }

// function processFileData(fileContent) {
//     const numbers = fileContent.split(",").map(num => num.trim());

//     if (!numbers.length || numbers[0] === "") {
//         console.error("No valid numbers found in file.");
//         return;
//     }

//     sendNumbersToSSLChecker(numbers);
// }

// fetchSharePointFile();
