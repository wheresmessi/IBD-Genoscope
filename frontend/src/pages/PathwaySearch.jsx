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
            setError("Enter a valid gene symbol (e.g., HLA-DQA1)");
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
            setError("Error fetching pathways. Try another gene.");
        }

        setLoading(false);
    };

    // Open pathway image in a new tab
    const openPathwayImage = (pathwayId) => {
        const imageUrl = `http://rest.kegg.jp/get/${pathwayId}/image`;
        window.open(imageUrl, "_blank"); // Opens image in a new tab
    };

    return (
        <div className="container" style={{ textAlign: "center", padding: "20px" }}>
            <h2>Gene Pathway Search</h2>
            <input
                type="text"
                placeholder="Enter Gene (e.g., HLA-DQA1)"
                value={gene}
                onChange={(e) => setGene(e.target.value.toUpperCase())}
                style={{ padding: "8px", marginRight: "10px" }}
            />
            <button onClick={fetchPathways} disabled={loading} style={{ padding: "8px 15px" }}>
                {loading ? "Searching..." : "Search"}
            </button>

            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

            {pathways.length > 0 && (
                <div>
                    <h3>Pathways:</h3>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {pathways.map((pathway, index) => (
                            <li key={index} style={{ marginBottom: "10px" }}>
                                <button
                                    onClick={() => openPathwayImage(pathway)}
                                    style={{
                                        padding: "8px 15px",
                                        background: "#007bff",
                                        color: "#fff",
                                        border: "none",
                                        cursor: "pointer",
                                        borderRadius: "5px"
                                    }}
                                >
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
