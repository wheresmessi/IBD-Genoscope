import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, Database, Calculator } from "lucide-react";

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
      // Mock data for development - in production this would be a real API call
      setTimeout(() => {
        const mockData = generateMockData(dataset);
        setResults(mockData);
        setFilteredResults(mockData);
        setLoading(false);
      }, 800);
      
      // In production, use this:
      // const { data } = await axios.get(`http://localhost:5000/all-rsids?dataset=${dataset}`);
      // setResults(data);
      // setFilteredResults(data);
    } catch (error) {
      console.error("Error fetching dataset:", error);
      setError("Failed to load dataset. Please try again later.");
      setLoading(false);
    }
  };

  // Function to search SNP by rsID
  const searchSNP = async () => {
    if (!rsid.trim()) {
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      // Mock search for development
      setTimeout(() => {
        const mockData = generateMockData(dataset).filter(item => 
          item.rsid.toLowerCase().includes(rsid.toLowerCase())
        );
        setResults(mockData);
        setFilteredResults(mockData);
        setLoading(false);
      }, 500);
      
      // In production, use this:
      // const { data } = await axios.get(`http://localhost:5000/search?dataset=${dataset}&rsid=${rsid}`);
      // setResults(data);
      // setFilteredResults(data);
    } catch (error) {
      console.error("Error searching SNP:", error);
      setError("Failed to search for SNP. Please try again.");
      setLoading(false);
    }
  };

  // Handle search filtering
  useEffect(() => {
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
  }, [searchTerm, results]);

  // Generate mock data for development
  const generateMockData = (datasetType) => {
    const count = 20;
    const data = [];
    
    if (datasetType === 'clinvar') {
      for (let i = 0; i < count; i++) {
        data.push({
          rsid: `rs${100000 + i}`,
          gene: ['BRCA1', 'BRCA2', 'TP53', 'APC', 'CFTR'][Math.floor(Math.random() * 5)],
          chromosome: ['1', '2', '3', '4', '5', '6', '7', 'X', 'Y'][Math.floor(Math.random() * 9)],
          position: Math.floor(Math.random() * 100000000),
          clinical_significance: ['Pathogenic', 'Likely pathogenic', 'Uncertain significance', 'Likely benign', 'Benign'][Math.floor(Math.random() * 5)],
          phenotype: ['IBD', 'Crohn\'s disease', 'Ulcerative colitis', 'Not specified'][Math.floor(Math.random() * 4)]
        });
      }
    } else {
      for (let i = 0; i < count; i++) {
        data.push({
          rsid: `rs${200000 + i}`,
          gene: ['NOD2', 'IL23R', 'ATG16L1', 'IRGM', 'IL10'][Math.floor(Math.random() * 5)],
          chromosome: ['1', '2', '3', '4', '5', '6', '7', 'X', 'Y'][Math.floor(Math.random() * 9)],
          position: Math.floor(Math.random() * 100000000),
          risk_allele: ['A', 'C', 'G', 'T'][Math.floor(Math.random() * 4)],
          odds_ratio: (1 + Math.random() * 3).toFixed(2),
          p_value: (Math.random() * 0.001).toExponential(3)
        });
      }
    }
    
    return data;
  };

  return (
    <div>
      <header className="header">
        IBD Genoscope
      </header>
      
      <div className="main-container dataset-page">
        <div className="dataset-view">
          <div className="dataset-header">
            <h1>Dataset: {dataset === 'clinvar' ? 'ClinVar' : 'IBD Genetic Risk'}</h1>
            <button className="btn btn-secondary" onClick={() => navigate('/SelectDataset')}>
              Change Dataset
            </button>
          </div>

          <div className="tools-section">
            {/* SNP Search */}
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

            {/* PRS Calculator */}
            <div className="tool-card">
              <h2><Calculator size={18} /> PRS Calculator</h2>
              <div className="tool-content">
                <p>Calculate polygenic risk score based on genetic variants.</p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => navigate(`/tools?dataset=${dataset}`)}
                >
                  Open Calculator
                </button>
              </div>
            </div>
          </div>

          {/* Dataset Table Section */}
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
                        {Object.values(row).map((value, i) => (
                          <td key={i}>{value}</td>
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
      
      <footer className="footer">
        K. Lathika | Email: korrapatilathika@gmail.com
      </footer>
    </div>
  );
}