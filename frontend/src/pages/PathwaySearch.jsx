import { useState } from "react";
import axios from "axios";

const PathwaySearch = () => {
    const [gene, setGene] = useState("");
    const [pathways, setPathways] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch pathways for the given gene
    const fetchPathways = async () => {
        setError("");
        setPathways([]);
        setLoading(true);

        if (!gene.trim()) {
            setError("⚠ Enter a valid gene symbol (e.g., HLA-DQA1)");
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.get(`http://localhost:5000/api/kegg/${gene}`);

            if (!data.pathways.length) {
                setError("❌ No pathways found for this gene.");
            } else {
                setPathways(data.pathways);
            }
        } catch (err) {
            setError("❌ Error fetching pathways. Try another gene.");
        }

        setLoading(false);
    };

    // Open pathway image in a new tab
    const openPathwayImage = (pathwayId) => {
        const imageUrl = `http://rest.kegg.jp/get/${pathwayId}/image`;
        window.open(imageUrl, "_blank");
    };

    return (
        <div className="pathway-container">
            <h2>🔬 Gene Pathway Search</h2>
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Enter Gene (e.g., HLA-DQA1)"
                    value={gene}
                    onChange={(e) => setGene(e.target.value.toUpperCase())}
                />
                <button onClick={fetchPathways} disabled={loading}>
                    {loading ? <span className="loader"></span> : "🔍 Search"}
                </button>
            </div>

            {error && <p className="error-msg">{error}</p>}

            {pathways.length > 0 && (
                <div className="pathway-results">
                    <h3>🧬 Pathways Found:</h3>
                    <ul>
                        {pathways.map((pathway, index) => (
                            <li key={index}>
                                <button onClick={() => openPathwayImage(pathway)}>
                                    {pathway}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PathwaySearch;
