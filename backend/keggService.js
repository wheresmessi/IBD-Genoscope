const axios = require('axios');

const KEGG_BASE_URL = 'https://rest.kegg.jp';

async function getPathwaysForGene(geneId) {
    try {
        const pathwayResponse = await axios.get(`${KEGG_BASE_URL}/link/pathway/${geneId}`);
        const pathwayLines = pathwayResponse.data.trim().split("\n");

        if (!pathwayLines.length) return { geneId, pathways: [] };

        const pathwayIds = pathwayLines.map(line => line.split("\t")[1]);

        const pathwayDetails = await Promise.all(
            pathwayIds.map(async (pathway) => {
                const descResponse = await axios.get(`${KEGG_BASE_URL}/get/${pathway}`);
                const description = descResponse.data.split("\n")[1].replace("NAME", "").trim();
                return { pathway, description };
            })
        );

        return { geneId, pathways: pathwayDetails };
    } catch (error) {
        console.error("Error fetching pathways:", error);
        return { geneId, pathways: [] };
    }
}

module.exports = { getPathwaysForGene };
