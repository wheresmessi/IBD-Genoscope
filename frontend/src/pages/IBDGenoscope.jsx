import React from "react";
import { Link } from "react-router-dom"; // ✅ Import Link for navigation

const IBDGenoscope = () => {
  return (
    <div className="ibd-container">
      <header className="header">IBD Genoscope</header>

      <div className="ibd-content">
        {/* 🔹 Left Side - Description */}
        <div className="ibd-description">
          <p>
            <strong>Genetic Risk Database for Inflammatory Bowel Disease (IBD)</strong> is a powerful platform designed to assist researchers and clinicians in identifying genetic risk factors associated with IBD, including Crohn’s Disease and Ulcerative Colitis. 
            Users can perform detailed <strong>SNP searches using rsID</strong>, allowing for precise identification of risk variants.
          </p>
          <p>
            The system also enables <strong>Pathway Enrichment Analysis</strong>, helping to uncover critical biological pathways associated with disease progression. 
            Additionally, the <strong>Polygenic Risk Score (PRS) Calculator</strong> provides a structured genetic risk assessment.
          </p>
        </div>

        {/* 🔹 Right Side - Buttons with Navigation */}
        <div className="ibd-buttons">
          <Link to="/select-dataset">
            <button className="btn btn-primary">Search Datasets</button>
          </Link>
          <Link to="/tools">
            <button className="btn btn-primary">Tools</button>
          </Link>
          <Link to="/about">
            <button className="btn btn-primary">About</button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer>
        K. Lathika | Email: korrapatilathika@gmail.com
      </footer>
    </div>
  );
};

export default IBDGenoscope;