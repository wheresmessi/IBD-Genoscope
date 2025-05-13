import { useState } from "react";
import axios from "axios";
import { Search, Loader2, ExternalLink } from "lucide-react";

const PathwaySearch = () => {
  const [gene, setGene] = useState("");
  const [pathways, setPathways] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPathways = async () => {
    setError("");
    setPathways([]);
    setLoading(true);

    if (!gene.trim()) {
      setError("Please enter a valid gene symbol (e.g., HLA-DQA1)");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`http://localhost:5000/api/kegg/${gene}`);

      if (!data.pathways.length) {
        setError("No pathways found for this gene.");
      } else {
        setPathways(data.pathways);
      }
    } catch (err) {
      setError("Error fetching pathways. Please try another gene.");
    }

    setLoading(false);
  };

  const openPathwayImage = (pathwayId) => {
    const imageUrl = `http://rest.kegg.jp/get/${pathwayId}/image`;
    window.open(imageUrl, "_blank");
  };

  return (
    <div className="pathway-search-container">
      <div className="pathway-search-box">
        <h2 className="pathway-search-title">
          🔬 Gene Pathway Search
        </h2>

        <div className="pathway-search-content">
          <div className="pathway-search-input-group">
            <input
              type="text"
              placeholder="Enter Gene (e.g., HLA-DQA1)"
              value={gene}
              onChange={(e) => setGene(e.target.value.toUpperCase())}
              className="pathway-search-input"
            />
            <button
              onClick={fetchPathways}
              disabled={loading}
              className="pathway-search-button"
            >
              {loading ? (
                <Loader2 className="loader-icon" />
              ) : (
                <Search className="search-icon" />
              )}
              Search
            </button>
          </div>

          {error && (
            <p className="pathway-search-error">{error}</p>
          )}

          {pathways.length > 0 && (
            <div className="pathway-search-results">
              <h3 className="pathway-search-results-title">
                🧬 Pathways Found:
              </h3>
              <div className="pathway-search-results-list">
                {pathways.map((pathway, index) => (
                  <button
                    key={index}
                    onClick={() => openPathwayImage(pathway)}
                    className="pathway-search-result-item"
                  >
                    <span className="pathway-search-result-text">{pathway}</span>
                    <ExternalLink className="pathway-search-result-icon" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PathwaySearch;