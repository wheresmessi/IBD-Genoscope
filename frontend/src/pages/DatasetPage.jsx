import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, Database } from "lucide-react";

export default function DatasetPage() {
  const [searchParams] = useSearchParams();
  const dataset = searchParams.get("dataset") || "clinvar"; // Default dataset
  const navigate = useNavigate();

  const [results, setResults] = useState([]); // Stores dataset records
  const [filteredResults, setFilteredResults] = useState([]); // Stores search results
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [rsid, setRsid] = useState(""); // SNP Search input
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dataset when component loads
  useEffect(() => {
    loadDataset();
  }, [dataset]);

  // Function to load dataset from API
  const loadDataset = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`http://localhost:5000/all-rsids?dataset=${dataset}`);
      setResults(data);
      setFilteredResults(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dataset:", error);
      setError("Failed to load dataset. Please try again later.");
      setLoading(false);
    }
  };

  // Function to search SNP by rsID
  const searchSNP = async () => {
    if (!rsid.trim()) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`http://localhost:5000/search?dataset=${dataset}&rsid=${rsid}`);
      setResults(data);
      setFilteredResults(data);
      setLoading(false);
    } catch (error) {
      console.error("Error searching SNP:", error);
      setError("Failed to search for SNP. Please try again.");
      setLoading(false);
    }
  };

  // Handle search filtering with debouncing
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchTerm.trim() === "") {
        setFilteredResults(results);
      } else {
        setFilteredResults(
          results.filter((row) =>
            Object.values(row).some((value) =>
              String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
        );
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchTerm, results]);

  // Function to download dataset as CSV
  const downloadCSV = () => {
    if (filteredResults.length === 0) {
      alert("No data available to download.");
      return;
    }

    const csvHeader = Object.keys(filteredResults[0]).join(",") + "\n";
    const csvRows = filteredResults
      .map((row) => Object.values(row).map((value) => `"${value}"`).join(","))
      .join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + csvHeader + csvRows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${dataset}_dataset.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <header className="header">IBD Genoscope</header>
      <div className="main-container dataset-page">
        <div className="dataset-view">
          <div className="dataset-header">
            <h1>Dataset: {dataset === 'clinvar' ? 'ClinVar' : 'IBD Genetic Risk'}</h1>
            <div className="button-group">
              <button className="btn btn-secondary" onClick={() => navigate('/select-dataset')}>
                Change Dataset
              </button>
              <button onClick={downloadCSV} className="btn btn-primary">
                Download CSV
              </button>
            </div>
          </div>

          <div className="tools-section">
            <div className="tool-card">
              <h2><Search size={18} /> Search by rsID</h2>
              <div className="tool-content">
                <input
                  type="text"
                  placeholder="Enter rsID (e.g., rs1234)"
                  value={rsid}
                  onChange={(e) => setRsid(e.target.value)}
                  className="form-control"
                />
                <button onClick={searchSNP} className="btn btn-primary">Search SNP</button>
              </div>
            </div>
          </div>

          <div className="table-section">
            <div className="table-header">
              <h2><Database size={18} /> Data Explorer</h2>
              <div className="table-search">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search in results..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            {loading ? (
              <div className="loading-state">Loading data...</div>
            ) : error ? (
              <div className="error-state">{error}</div>
            ) : filteredResults.length === 0 ? (
              <div className="empty-state">No results found. Try a different search term.</div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      {Object.keys(filteredResults[0]).map((key) => (
                        <th key={key}>{key.replace('_', ' ').toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.map((row, index) => (
                      <tr key={index}>
                        {Object.entries(row).map(([key, value], i) => (
                          <td key={i}>
                            {key === "Dataset Link" ? (
                              <a href={value} target="_blank" rel="noopener noreferrer">
                                {value}
                              </a>
                            ) : (
                              value
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="footer">K. Lathika | Email: korrapatilathika@gmail.com</footer>
    </div>
  );
}
