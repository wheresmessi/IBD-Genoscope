import React, { useState } from "react";
import PathwaySearch from "./PathwaySearch";
import PRSChart from "./PRSChart";

const ToolsPage = () => {
    const [selectedTool, setSelectedTool] = useState(null);

    return (
        <div className="tools-container">
            <div className="tools-card">
                <h2>Select a Tool</h2>
                {!selectedTool ? (
                    <div className="tool-selection">
                        <button className="btn btn-primary" onClick={() => setSelectedTool("pathway")}>
                            🚀 Pathway Analysis
                        </button>
                        <button className="btn btn-secondary" onClick={() => setSelectedTool("prs")}>
                            🧬 PRS Calculator
                        </button>
                    </div>
                ) : (
                    <div>
                        <button className="btn btn-secondary" onClick={() => setSelectedTool(null)}>
                            ⬅ Back to Selection
                        </button>
                        {selectedTool === "pathway" && <PathwaySearch />}
                        {selectedTool === "prs" && <PRSCalculator />}
                    </div>
                )}
            </div>
        </div>
    );
};

const PRSCalculator = () => {
    const [snps, setSnps] = useState([{ rsID: "", genotypeWeight: "" }]);
    const [gene, setGene] = useState(""); // New Gene input state
    const [prsResult, setPrsResult] = useState(null);
    const [error, setError] = useState("");

    const handleInputChange = (index, field, value) => {
        const updatedSnps = [...snps];
        updatedSnps[index][field] = value;
        setSnps(updatedSnps);
    };

    const addSNP = () => setSnps([...snps, { rsID: "", genotypeWeight: "" }]);
    const removeSNP = (index) => setSnps(snps.filter((_, i) => i !== index));

    const calculatePRS = async () => {
        setError("");
        setPrsResult(null);

        try {
            const response = await fetch("http://localhost:5000/calculate-prs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ snps, gene }), // Include Gene in request
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            data.error ? setError(data.error) : setPrsResult(data);
        } catch (error) {
            setError("Error fetching PRS data. Please try again.");
            console.error("Error:", error);
        }
    };

    return (
        <div className="prs-container">
            <h2>Polygenic Risk Score (PRS) Calculator</h2>

            {/* Gene Input Field */}
            <div className="snp-input">
                <input
                    type="text"
                    placeholder="Enter Gene Name"
                    value={gene}
                    onChange={(e) => setGene(e.target.value)}
                />
            </div>

            {snps.map((snp, index) => (
                <div key={index} className="snp-input">
                    <input
                        type="text"
                        placeholder="Enter rsID"
                        value={snp.rsID}
                        onChange={(e) => handleInputChange(index, "rsID", e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Genotype Weight"
                        value={snp.genotypeWeight}
                        onChange={(e) => handleInputChange(index, "genotypeWeight", e.target.value)}
                    />
                    {snps.length > 1 && (
                        <button className="btn btn-danger" onClick={() => removeSNP(index)}>
                            ✖
                        </button>
                    )}
                </div>
            ))}
            <button className="btn btn-add" onClick={addSNP}>+ Add rsID</button>
            <button className="btn btn-primary" onClick={calculatePRS}>Calculate PRS</button>
            {error && <p className="error-msg">{error}</p>}
            {prsResult && (
                <div className="prs-result">
                    <h3>Total PRS Score: {prsResult.totalPRS}</h3>
                    <p>Risk Level: {prsResult.riskLevel}</p>
                    <h4>Individual rsID Scores:</h4>
                    <ul>
                        {prsResult.details.map((snp, idx) => (
                            <li key={idx}>{snp.rsID}: {snp.prsScore || snp.error}</li>
                        ))}
                    </ul>
                    <PRSChart prsScore={prsResult.totalPRS} />
                </div>
            )}
        </div>
    );
};

export default ToolsPage;