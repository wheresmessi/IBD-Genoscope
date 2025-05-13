import React from "react";
import { Link } from "react-router-dom";
import { Database, PenTool as Tool, Info } from "lucide-react";

const IBDGenoscope = () => {
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

      {/* Main Content - Added mt-16 for header spacing */}
      <main className="flex-grow mt-16 mb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Left Side - Description */}
                <div className="space-y-6 text-gray-600">
                  <div className="prose max-w-none">
                    <p className="text-lg">
                      <strong className="text-gray-900">Genetic Risk Database for Inflammatory Bowel Disease (IBD)</strong> is a powerful platform designed to assist researchers and clinicians in identifying genetic risk factors associated with IBD, including Crohn's Disease and Ulcerative Colitis.
                      Users can perform detailed <strong className="text-gray-900">SNP searches using rsID</strong>, allowing for precise identification of risk variants.
                    </p>
                    <p className="text-lg">
                      The system also enables <strong className="text-gray-900">Pathway Enrichment Analysis</strong>, helping to uncover critical biological pathways associated with disease progression.
                      Additionally, the <strong className="text-gray-900">Polygenic Risk Score (PRS) Calculator</strong> provides a structured genetic risk assessment.
                    </p>
                  </div>
                </div>

                {/* Right Side - Buttons with Navigation */}
                <div className="space-y-4">
                  <Link to="/select-dataset" className="block">
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center gap-3">
                      <Database className="w-6 h-6" />
                      <span>Search Datasets</span>
                    </button>
                  </Link>
                  
                  <Link to="/tools" className="block">
                    <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center gap-3">
                      <Tool className="w-6 h-6" />
                      <span>Tools</span>
                    </button>
                  </Link>
                  
                  <Link to="/about" className="block">
                    <button className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center gap-3">
                      <Info className="w-6 h-6" />
                      <span>About</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Fixed at bottom */}
      <footer className="bg-white shadow-sm py-4 px-6 fixed bottom-0 w-full">
        <p className="text-center text-gray-600">
          K. Lathika | Email: korrapatilathika@gmail.com
        </p>
      </footer>
    </div>
  );
};

export default IBDGenoscope;