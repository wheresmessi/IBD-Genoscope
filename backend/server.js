const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const csvParser = require("csv-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    const { gene, snps } = req.body;

    if (!gene && (!snps || snps.length === 0)) {
        return res.status(400).json({ error: "At least one rsID or Gene is required." });
    }

    let totalPRS = 0;
    let results = [];
    let selectedSNPs = [];

    if (gene) {
        selectedSNPs = ibdData.filter(entry =>
            entry["Gene"]
                ?.split(",")
                .map(g => g.trim().toLowerCase())
                .includes(gene.toLowerCase())
        ).filter(snp => snp["beta"] && snp["beta"].toLowerCase() !== "n/a"); // Filter valid beta values
    } else {
        selectedSNPs = snps.map(({ rsID }) =>
            ibdData.find(entry => entry["rsID"]?.trim().toLowerCase() === rsID.toLowerCase())
        ).filter(snp => snp && snp["beta"] && snp["beta"].toLowerCase() !== "n/a"); // Ensure valid beta values
    }

    if (selectedSNPs.length === 0) {
        return res.status(404).json({ error: "No valid SNPs with Beta values found for the given Gene." });
    }

    selectedSNPs.forEach((snp) => {
        const rsID = snp["rsID"];
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

        const genotypeWeight = snps?.find(s => s.rsID === rsID)?.genotypeWeight || 1;
        const prsScore = parseFloat(genotypeWeight) * effectSize;
        totalPRS += prsScore;

        results.push({ rsID, prsScore: prsScore.toFixed(2) });
    });

    let riskLevel = "Low";
    if (totalPRS > 0.7) riskLevel = "High";
    else if (totalPRS > 0.4) riskLevel = "Moderate";

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

require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is missing in environment variables");
}

const USERS_CSV = "users.csv"; // Your CSV file

// Read users from CSV
const readUsersFromCSV = () => {
  return new Promise((resolve, reject) => {
    const users = [];
    fs.createReadStream(USERS_CSV)
      .pipe(csvParser())
      .on("data", (row) => users.push(row))
      .on("end", () => resolve(users))
      .on("error", (error) => reject(error));
  });
};

// Write new user to CSV
const appendUserToCSV = (user) => {
  fs.appendFileSync(USERS_CSV, `\n${user.email},${user.password}`);
};

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const users = await readUsersFromCSV();

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ message: "User not found" });

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

// Signup route
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const users = await readUsersFromCSV();

  if (users.some((u) => u.email === email)) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  appendUserToCSV({ email, password: hashedPassword });

  res.json({ message: "User registered successfully" });
});

// API to add new data to a dataset
app.post("/add-data", async (req, res) => {
    const { dataset, data } = req.body;

    if (!dataset || !data) {
        return res.status(400).json({ error: "Dataset and data are required" });
    }

    try {
        // Validate required fields
        const requiredFields = dataset === 'clinvar' 
            ? ['rsid', 'gene', 'phenotype', 'clinical_significance', 'chromosome']
            : ['rsid', 'gene', 'risk_allele', 'odds_ratio'];

        const missingFields = requiredFields.filter(field => !data[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                error: `Missing required fields: ${missingFields.join(', ')}` 
            });
        }

        // Format data according to dataset schema
        const formattedData = dataset === 'clinvar' 
            ? {
                rsID: data.rsid,
                Gene: data.gene,
                Phenotype: data.phenotype,
                "Clinical Significance": data.clinical_significance,
                Chromosome: data.chromosome,
                "Dataset Link": data.dataset_link || ''
            }
            : {
                rsID: data.rsid,
                Gene: data.gene,
                "Risk Allele": data.risk_allele,
                "Odds Ratio": data.odds_ratio,
                "Dataset Link": data.dataset_link || ''
            };

        // Add to memory dataset
        if (dataset === 'clinvar') {
            clinvarData.push(formattedData);
            // Append to CSV file
            const csvPath = path.join(__dirname, "cleaned_clinvar_data.csv");
            const csvLine = Object.values(formattedData).map(val => `"${val}"`).join(',') + '\n';
            fs.appendFileSync(csvPath, csvLine);
        } else if (dataset === 'ibd') {
            ibdData.push(formattedData);
            // Append to CSV file
            const csvPath = path.join(__dirname, "cleaned_risk_db_data_new.csv");
            const csvLine = Object.values(formattedData).map(val => `"${val}"`).join(',') + '\n';
            fs.appendFileSync(csvPath, csvLine);
        }

        res.json({ message: "Data added successfully", data: formattedData });
    } catch (error) {
        console.error("Error adding data:", error);
        res.status(500).json({ error: "Failed to add data" });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));