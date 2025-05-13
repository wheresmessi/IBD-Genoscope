import React, { useState } from "react";
import { ChevronLeft, Plus, Minus, Calculator, Network } from "lucide-react";
import PathwaySearch from "./PathwaySearch";
import PRSChart from "./PRSChart";

const ToolsPage = () => {
  const [selectedTool, setSelectedTool] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-blue-600 mb-8">
          Research Tools
        </h2>

        {!selectedTool ? (
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => setSelectedTool("pathway")}
              className="flex items-center gap-4 p-6 bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors text-white shadow-md"
            >
              <Network className="w-8 h-8 text-white" />
              <div className="text-left">
                <h3 className="text-xl font-semibold text-white">
                  Pathway Analysis
                </h3>
                <p className="text-blue-100 mt-1">
                  Analyze gene pathways and interactions
                </p>
              </div>
            </button>

            <button
              onClick={() => setSelectedTool("prs")}
              className="flex items-center gap-4 p-6 bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors text-white shadow-md"
            >
              <Calculator className="w-8 h-8 text-white" />
              <div className="text-left">
                <h3 className="text-xl font-semibold text-white">
                  PRS Calculator
                </h3>
                <p className="text-blue-100 mt-1">
                  Calculate polygenic risk scores
                </p>
              </div>
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedTool(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Tools
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
  const [gene, setGene] = useState("");
  const [prsResult, setPrsResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/calculate-prs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ snps, gene }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      data.error ? setError(data.error) : setPrsResult(data);
    } catch (error) {
      setError("Error calculating PRS. Please try again.");
      console.error("Error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter Gene Name"
          value={gene}
          onChange={(e) => setGene(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
        />

        {snps.map((snp, index) => (
          <div key={index} className="flex gap-4">
            <input
              type="number"
              placeholder="Genotype Weight"
              value={snp.genotypeWeight}
              onChange={(e) =>
                handleInputChange(index, "genotypeWeight", e.target.value)
              }
              className="flex-1 px-4 py-2 rounded-lg border bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
            />
            {snps.length > 1 && (
              <button
                onClick={() => removeSNP(index)}
                className="p-2 text-red-500 hover:text-red-600"
              >
                <Minus className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}

        <div className="flex gap-4">
          <button
            onClick={addSNP}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            <Plus className="w-5 h-5" />
            Add rsID
          </button>

          <button
            onClick={calculatePRS}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            Calculate PRS
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {prsResult && (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Results
            </h3>
            <div className="space-y-2">
              <p className="text-gray-600">
                Total PRS Score: {prsResult.totalPRS}
              </p>
              <p className="text-gray-600">
                Risk Level: {prsResult.riskLevel}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">
              Individual rsID Scores:
            </h4>
            <ul className="space-y-2">
              {prsResult.details.map((snp, idx) => (
                <li key={idx} className="text-gray-600">
                  {snp.rsID}: {snp.prsScore || snp.error}
                </li>
              ))}
            </ul>
          </div>

          <PRSChart prsScore={prsResult.totalPRS} />
        </div>
      )}
    </div>
  );
};

export default ToolsPage;