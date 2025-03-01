import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SelectDataset = () => {
  const [dataset, setDataset] = useState("clinvar");
  const navigate = useNavigate();

  const handleNext = () => {
    // Redirect to /dataset?dataset=XYZ
    navigate(`/dataset?dataset=${dataset}`);
  };

  return (
    <div>
      <header className="header">
        IBD Genoscope
      </header>
      
      <div className="main-container">
        <div className="dataset-container">
          <h1>Select a Dataset</h1>
          <p className="dataset-description">
            Choose a genetic dataset to explore risk factors for Inflammatory Bowel Disease.
          </p>
          
          <div className="dataset-selection">
            <select
              value={dataset}
              onChange={(e) => setDataset(e.target.value)}
              className="dropdown"
            >
              <option value="clinvar">ClinVar</option>
              <option value="ibd">IBD Genetic Risk</option>
            </select>
            
            <button onClick={handleNext} className="btn btn-primary">
              Next
            </button>
          </div>
        </div>
      </div>
      
      <footer className="footer">
        K. Lathika | Email: korrapatilathika@gmail.com
      </footer>
    </div>
  );
};

export default SelectDataset;