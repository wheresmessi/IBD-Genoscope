const express = require('express');
const { getPathwaysForGene } = require('./keggService');

const router = express.Router();

router.get('/kegg/:gene', async (req, res) => {
    const geneId = `hsa:${req.params.gene}`;
    const data = await getPathwaysForGene(geneId);
    res.json(data);
});

module.exports = router;
