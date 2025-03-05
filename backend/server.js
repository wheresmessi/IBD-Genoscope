const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const app = express();
app.use(cors());
app.use(express.json());

// Function to load and parse CSV data
const loadCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => resolve(results))
            .on("error", (error) => reject(error));
    });
};

// Load preprocessed datasets
let clinvarData = [];
let ibdData = [];

const loadData = async () => {
    clinvarData = await loadCSV(path.join(__dirname, "cleaned_clinvar_data.csv"));
    ibdData = await loadCSV(path.join(__dirname, "cleaned_risk_db_data_new.csv"));
};

// Load data initially
loadData().then(() => console.log("Datasets loaded successfully"));

// API to fetch all SNPs from the selected dataset
app.get("/all-rsids", (req, res) => {
    const { dataset } = req.query;

    if (dataset === "clinvar") {
        return res.json(clinvarData);
    } else if (dataset === "ibd") {
        return res.json(ibdData);
    } else {
        return res.status(400).json({ error: "Invalid dataset. Use 'clinvar' or 'ibd'" });
    }
});

// API to search SNPs by rsID
app.get("/search", (req, res) => {
    const { dataset, rsid } = req.query;
    
    let data;
    if (dataset === "clinvar") {
        data = clinvarData;
    } else if (dataset === "ibd") {
        data = ibdData;
    } else {
        return res.status(400).json({ error: "Invalid dataset. Use 'clinvar' or 'ibd'" });
    }

    const result = data.filter(item => item["rsID"]?.trim().toLowerCase() === rsid.toLowerCase());
    res.json(result);
});

// API to filter by disease (if the dataset contains disease info)
app.get("/filter-disease", (req, res) => {
    const { dataset, disease } = req.query;
    
    let data;
    if (dataset === "clinvar") {
        data = clinvarData;
    } else if (dataset === "ibd") {
        data = ibdData;
    } else {
        return res.status(400).json({ error: "Invalid dataset. Use 'clinvar' or 'ibd'" });
    }

    const result = data.filter(item => item["Disease"]?.toLowerCase() === disease.toLowerCase());
    res.json(result);
});

// API to explore genes
app.get("/explore-gene", (req, res) => {
    const { dataset, gene } = req.query;

    let data;
    if (dataset === "clinvar") {
        data = clinvarData;
    } else if (dataset === "ibd") {
        data = ibdData;
    } else {
        return res.status(400).json({ error: "Invalid dataset. Use 'clinvar' or 'ibd'" });
    }

    const result = data.filter(item => item["Gene"]?.toLowerCase() === gene.toLowerCase());
    res.json(result);
});

// API for pathway analysis (dummy response for now)
app.post("/analyze-pathways", (req, res) => {
    const { genes } = req.body;
    
    if (!genes || genes.length === 0) {
        return res.status(400).json({ error: "Gene list is required" });
    }

    res.json({
        message: "Pathway analysis completed",
        analyzedGenes: genes,
        pathways: ["Pathway 1", "Pathway 2", "Pathway 3"]
    });
});

app.post("/calculate-prs", (req, res) => {
    const { snps } = req.body; // Expect an array of { rsID, genotypeWeight }

    if (!snps || snps.length === 0) {
        return res.status(400).json({ error: "At least one rsID is required." });
    }

    let totalPRS = 0;
    let results = [];

    snps.forEach(({ rsID, genotypeWeight }) => {
        // Find SNP in dataset
        const snp = ibdData.find((entry) => entry["rsID"]?.trim().toLowerCase() === rsID.toLowerCase());

        if (!snp) {
            results.push({ rsID, error: "rsID not found" });
            return;
        }

        let beta = parseFloat(snp["beta"]);
        let orValue = parseFloat(snp["orValue"]);
        let effectSize;

        if (!isNaN(beta)) {
            effectSize = beta;
        } else if (!isNaN(orValue)) {
            effectSize = Math.log(orValue);
        } else {
            results.push({ rsID, error: "No valid beta or OR value found" });
            return;
        }

        const genotype = genotypeWeight ? parseFloat(genotypeWeight) : 1;
        const prsScore = genotype * effectSize;
        totalPRS += prsScore;

        results.push({ rsID, prsScore: prsScore.toFixed(2) });
    });

    let riskLevel = "Low";
    if (totalPRS > 1.5) riskLevel = "High";
    else if (totalPRS > 0.8) riskLevel = "Moderate";

    res.json({ totalPRS: totalPRS.toFixed(2), riskLevel, details: results });
});

const axios = require("axios");


// API Route to Fetch Pathways for a Gene
app.get("/api/kegg/:gene", async (req, res) => {
    try {
        const gene = req.params.gene;
        console.log("Fetching pathways for gene:", gene);

        // Step 1: Get KEGG ID
        const findGeneUrl = `http://rest.kegg.jp/find/genes/${gene}`;
        const findGeneResponse = await axios.get(findGeneUrl);

        // Extract KEGG ID from response
        const geneData = findGeneResponse.data.split("\n")[0]; // Take the first match
        const match = geneData.match(/(hsa:\d+)/);

        if (!match) {
            return res.status(404).json({ error: "Gene not found in KEGG database" });
        }

        const keggId = match[1];

        // Step 2: Get Pathways for the Gene
        const pathwayUrl = `http://rest.kegg.jp/link/pathway/${keggId}`;
        const pathwayResponse = await axios.get(pathwayUrl);

        // Process pathway data
        const pathways = pathwayResponse.data
            .split("\n")
            .filter(line => line.includes("path:hsa"))
            .map(line => {
                const parts = line.split("\t");
                return parts[1].replace("path:", "");
            });

        res.json({ geneId: keggId, pathways });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// API Route to Fetch Pathway Image
app.get("/api/kegg/pathway/:pathwayId", async (req, res) => {
    try {
        const pathwayId = req.params.pathwayId;
        console.log("Fetching pathway image for:", pathwayId);

        const imageUrl = `http://rest.kegg.jp/get/${pathwayId}/image`;
        console.log("KEGG Image URL:", imageUrl);

        const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });

        if (!imageResponse.data) {
            console.log("No image data received from KEGG.");
            return res.status(404).json({ error: "No pathway image found" });
        }

        // Convert image to Base64
        const base64Image = Buffer.from(imageResponse.data, "binary").toString("base64");
        const imageSrc = `data:image/png;base64,${base64Image}`;

        console.log("Successfully fetched pathway image.");
        res.json({ imageSrc });
    } catch (error) {
        console.error("Error fetching pathway image:", error.message);
        res.status(500).json({ error: "Failed to fetch pathway image", details: error.message });
    }
});



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));