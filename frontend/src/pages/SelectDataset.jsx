import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database } from 'lucide-react';

const SelectDataset = () => {
  const [dataset, setDataset] = useState("clinvar");
  const navigate = useNavigate();

  const handleNext = () => {
    navigate(`/dataset?dataset=${dataset}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <Database className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Select a Dataset
              </h2>
              <p className="text-gray-600">
                Choose a genetic dataset to explore risk factors for Inflammatory Bowel Disease.
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <select
                  value={dataset}
                  onChange={(e) => setDataset(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg appearance-none bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="clinvar">ClinVar</option>
                  <option value="ibd">GWAS Catalog</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectDataset;