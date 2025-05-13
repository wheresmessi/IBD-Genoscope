import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm py-2 px-6 fixed top-0 w-full z-10">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          <h2 className="text-3xl font-bold text-blue-600 tracking-wide">
            IBD Genoscope
          </h2>
        </div>
      </header>

      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 rounded-full overflow-hidden mb-6">
                  <img
                    src="https://cdn3d.iconscout.com/3d/premium/thumb/female-scientist-3d-icon-download-in-png-blend-fbx-gltf-file-formats--science-research-avatar-pack-people-icons-9483748.png?f=webp"
                    alt="K. Lathika Chowdary"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  K. Lathika Chowdary
                </h2>
                <p className="text-lg text-blue-600 mb-1">
                  Bioinformatics Specialist
                </p>
                <p className="text-gray-600 mb-6">
                  korrapatilathika@gmail.com
                </p>
                <p className="text-gray-600 text-center">
                  Leading researcher in the field of bioinformatics with a focus on genetic markers
                  for Inflammatory Bowel Disease (IBD). Specializes in developing computational tools
                  for analyzing genetic data and identifying risk factors.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-blue-600 mb-4">
                  Our Mission
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  IBD GENOSCOPE aims to provide accessible tools for researchers and clinicians to analyze
                  genetic data related to Inflammatory Bowel Disease. Our platform facilitates the exploration
                  of genetic markers and calculation of polygenic risk scores to advance personalized medicine
                  approaches for IBD treatment.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-blue-600 mb-4">
                  Research Focus
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our research focuses on identifying genetic variants associated with IBD susceptibility,
                  disease progression, and treatment response. By leveraging large-scale genomic datasets
                  and advanced computational methods, we work to improve understanding of the genetic
                  architecture of IBD and develop predictive models for patient outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;