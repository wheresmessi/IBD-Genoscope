import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, Database, Plus } from "lucide-react";
import AddDataForm from "../components/AddDataForm";

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
  const [showAddForm, setShowAddForm] = useState(false);

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-2 px-6 fixed top-0 w-full z-10">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          <h2 className="text-3xl font-bold text-blue-600 tracking-wide">
            IBD Genoscope
          </h2>
        </div>
      </header>

      <main className="flex-grow mt-16 mb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Dataset: {dataset === 'clinvar' ? 'ClinVar' : 'IBD Genetic Risk'}
              </h2>
              <div className="flex gap-3">
                <button 
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  onClick={() => navigate('/select-dataset')}
                >
                  Change Dataset
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  onClick={downloadCSV}
                >
                  Download CSV
                </button>
                <button 
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 
                    ${showAddForm 
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  <Plus size={16} /> {showAddForm ? 'Cancel' : 'Add New Data'}
                </button>
              </div>
            </div>

            {showAddForm && <AddDataForm dataset={dataset} onSuccess={() => {
              loadDataset();
              setShowAddForm(false);
            }} />}

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-4">
                <Search size={18} /> Search by rsID
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter rsID (e.g., rs1234)"
                  value={rsid}
                  onChange={(e) => setRsid(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button 
                  onClick={searchSNP}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Search SNP
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900">
                  <Database size={18} /> Data Explorer
                </h3>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search in results..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8 text-gray-600">Loading data...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">{error}</div>
              ) : filteredResults.length === 0 ? (
                <div className="text-center py-8 text-gray-600">No results found. Try a different search term.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white">
                    <thead>
                      <tr className="border-b border-gray-200">
                        {Object.keys(filteredResults[0]).map((key) => (
                          <th key={key} className="px-4 py-3 text-left text-sm font-semibold text-gray-900 bg-gray-50">
                            {key.replace('_', ' ').toUpperCase()}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResults.map((row, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                          {Object.entries(row).map(([key, value], i) => (
                            <td key={i} className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                              {key === "Dataset Link" ? (
                                <a href={value} className="text-blue-600 hover:text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">
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
      </main>

      <footer className="bg-white shadow-sm py-4 px-6 mt-auto">
        <p className="text-center text-gray-600">
          K. Lathika | Email: korrapatilathika@gmail.com
        </p>
      </footer>
    </div>
  );
}
