const axios = require("axios");

async function fetchKEGGData(gene) {
    try {
        const url = `http://rest.kegg.jp/link/pathway/hsa:${gene}`;
        const response = await axios.get(url);

        console.log("KEGG Response Status:", response.status);
        console.log("KEGG Response Data:", response.data || "No data received");
    } catch (error) {
        console.error("Error fetching KEGG data:", error.message);
    }
}

// Test with a sample gene
fetchKEGGData("TP53");

