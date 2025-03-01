import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const [dataset, setDataset] = useState("clinvar");
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [rsid, setRsid] = useState("");
  const [gene, setGene] = useState("");
  const [geneList, setGeneList] = useState("");
  const [snpIds, setSnpIds] = useState("");
  const [disease, setDisease] = useState("");
  const [prsScore, setPrsScore] = useState("");
  const [riskLevel, setRiskLevel] = useState("");

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredResults(results);
    } else {
      setFilteredResults(
        results.filter((row) =>
          Object.values(row).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      );
    }
  }, [searchTerm, results]);

  const loadDataset = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/all-rsids?dataset=${dataset}`);
      setResults(data);
    } catch (error) {
      console.error("Error fetching dataset:", error);
    }
  };

  const searchSNP = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/search?dataset=${dataset}&rsid=${rsid}`);
      setResults(data);
    } catch (error) {
      console.error("Error searching SNP:", error);
    }
  };

  const exploreGene = () => {
    console.log("Exploring gene:", gene);
  };

  const analyzePathways = () => {
    console.log("Analyzing pathways for:", geneList);
  };

  const calculatePRS = () => {
    console.log("Calculating PRS for:", snpIds);
    setPrsScore("0.85");
    setRiskLevel("High");
  };

  return (
    <div className="dashboard-container">
      <h1>IBD Genetic Risk Database</h1>

      {/* Dataset Selection & Load */}
      <div className="controls">
        <select onChange={(e) => setDataset(e.target.value)} className="dropdown">
          <option value="clinvar">ClinVar</option>
          <option value="ibd">IBD Genetic Risk</option>
        </select>
        <button onClick={loadDataset} className="btn">Load Dataset</button>
      </div>

      {/* SNP Search */}
      <div className="tool">
        <input
          type="text"
          placeholder="Enter rsID"
          value={rsid}
          onChange={(e) => setRsid(e.target.value)}
          className="input-box"
        />
        <button onClick={searchSNP} className="btn">Search SNP</button>
      </div>

      {/* Disease Filter */}
      <div className="tool">
        <select onChange={(e) => setDisease(e.target.value)} className="dropdown">
          <option value="">Select Disease</option>
          <option value="Crohn’s Disease">Crohn’s Disease</option>
          <option value="Ulcerative Colitis">Ulcerative Colitis</option>
        </select>
        <button className="btn">Filter</button>
      </div>

      {/* Gene Exploration */}
      <div className="tool">
        <input
          type="text"
          placeholder="Enter Gene Name"
          value={gene}
          onChange={(e) => setGene(e.target.value)}
          className="input-box"
        />
        <button onClick={exploreGene} className="btn">Explore Gene</button>
      </div>

      {/* Pathway Analysis */}
      <div className="tool">
        <input
          type="text"
          placeholder="Enter gene list (comma-separated)"
          value={geneList}
          onChange={(e) => setGeneList(e.target.value)}
          className="input-box"
        />
        <button onClick={analyzePathways} className="btn">Analyze Pathways</button>
      </div>

      {/* PRS Calculation */}
      <div className="tool">
        <input
          type="text"
          placeholder="Enter SNP rsIDs (comma-separated)"
          value={snpIds}
          onChange={(e) => setSnpIds(e.target.value)}
          className="input-box"
        />
        <button onClick={calculatePRS} className="btn">Calculate PRS</button>
      </div>

      {/* PRS Score Display */}
      <div className="prs-display">
        <strong>PRS Score:</strong> {prsScore} | <strong>Risk Level:</strong> {riskLevel}
      </div>

      {/* Search Table */}
      <input
        type="text"
        placeholder="Search dataset..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-box"
      />

      {/* Dataset Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {filteredResults.length > 0 &&
                Object.keys(filteredResults[0]).map((key) => <th key={key}>{key}</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
