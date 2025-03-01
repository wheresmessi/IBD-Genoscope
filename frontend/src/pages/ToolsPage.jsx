import React, { useState } from "react";
import PRSChart from "./PRSChart"; // Import the PRS visualization component

const ToolsPage = () => {
    const [snps, setSnps] = useState([{ rsID: "", genotypeWeight: "" }]); // Array for multiple rsIDs
    const [prsResult, setPrsResult] = useState(null);
    const [error, setError] = useState("");

    // Handle input change for rsID & genotype weight
    const handleInputChange = (index, field, value) => {
        const updatedSnps = [...snps];
        updatedSnps[index][field] = value;
        setSnps(updatedSnps);
    };

    // Add a new SNP input field
    const addSNP = () => {
        setSnps([...snps, { rsID: "", genotypeWeight: "" }]);
    };

    // Remove an SNP input field
    const removeSNP = (index) => {
        setSnps(snps.filter((_, i) => i !== index));
    };

    // Calculate PRS
    const calculatePRS = async () => {
        setError("");
        setPrsResult(null);

        try {
            const response = await fetch("http://localhost:5000/calculate-prs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ snps }),
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            if (data.error) {
                setError(data.error);
            } else {
                setPrsResult(data);
            }
        } catch (error) {
            setError("Error fetching PRS data. Please try again.");
            console.error("Error:", error);
        }
    };

    return (
        <div className="tools-container">
            <h2>Polygenic Risk Score (PRS) Calculator</h2>

            {snps.map((snp, index) => (
                <div key={index} className="snp-input">
                    <input
                        type="text"
                        placeholder="Enter rsID"
                        value={snp.rsID}
                        onChange={(e) => handleInputChange(index, "rsID", e.target.value)}
                        className="input-field"
                    />
                    <input
                        type="number"
                        placeholder="Genotype Weight"
                        value={snp.genotypeWeight}
                        onChange={(e) => handleInputChange(index, "genotypeWeight", e.target.value)}
                        className="input-field"
                    />
                    {snps.length > 1 && (
                        <button onClick={() => removeSNP(index)} className="remove-button">✖</button>
                    )}
                </div>
            ))}

            <button onClick={addSNP} className="add-button">+ Add rsID</button>
            <button onClick={calculatePRS} className="calculate-button">Calculate PRS</button>

            {error && <p className="warning">{error}</p>}

            {prsResult && (
                <div className="result-box">
                    <h3>Total PRS Score: {prsResult.totalPRS}</h3>
                    <p>Risk Level: {prsResult.riskLevel}</p>

                    <h4>Individual rsID Scores:</h4>
                    <ul>
                        {prsResult.details.map((snp, idx) => (
                            <li key={idx}>
                                {snp.rsID}: {snp.prsScore || snp.error}
                            </li>
                        ))}
                    </ul>

                    {/* PRS Chart Visualization */}
                    <PRSChart prsScore={prsResult.totalPRS} />
                </div>
            )}
        </div>
    );
};

export default ToolsPage;