import React from 'react';

const About = () => {
  return (
    <div className="about-container">
      <h1>About IBD GENOSCOPE</h1>

      <div className="about-content">
        <div className="profile-card">
          <div className="avatar-container">
            <img
              src="https://cdn3d.iconscout.com/3d/premium/thumb/female-scientist-3d-icon-download-in-png-blend-fbx-gltf-file-formats--science-research-avatar-pack-people-icons-9483748.png?f=webp"
              alt="K. Lathika Chowdary"
              className="avatar-image"
            />
          </div>
          <div className="profile-info">
            <h2>K. Lathika Chowdary</h2>
            <p className="profile-title">Bioinformatics Specialist</p>
            <p className="profile-email">korrapatilathika@gmail.com</p>
            <div className="profile-description">
              <p>
                Leading researcher in the field of bioinformatics with a focus on genetic markers
                for Inflammatory Bowel Disease (IBD). Specializes in developing computational tools
                for analyzing genetic data and identifying risk factors.
              </p>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h3 style={{ color: "#3498db" }}>Our Mission</h3>
          <p>
            IBD GENOSCOPE aims to provide accessible tools for researchers and clinicians to analyze
            genetic data related to Inflammatory Bowel Disease. Our platform facilitates the exploration
            of genetic markers and calculation of polygenic risk scores to advance personalized medicine
            approaches for IBD treatment.
          </p>

          <h3 style={{ color: "#3498db" }}>Research Focus</h3>
          <p>
            Our research focuses on identifying genetic variants associated with IBD susceptibility,
            disease progression, and treatment response. By leveraging large-scale genomic datasets
            and advanced computational methods, we work to improve understanding of the genetic
            architecture of IBD and develop predictive models for patient outcomes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;