import React, { useState } from 'react';
import axios from 'axios';
import { Plus, AlertCircle } from 'lucide-react';
import "../styles/global.css"; // Import the global styles

export default function AddDataForm({ dataset, onSuccess }) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getFields = () => {
    if (dataset === 'clinvar') {
      return [
        { name: 'rsid', label: 'rsID', required: true },
        { name: 'gene', label: 'Gene', required: true },
        { name: 'phenotype', label: 'Phenotype', required: true },
        { name: 'clinical_significance', label: 'Clinical Significance', required: true },
        { name: 'chromosome', label: 'Chromosome', required: true },
        { name: 'dataset_link', label: 'Dataset Link', required: false }
      ];
    } else {
      return [
        { name: 'rsid', label: 'rsID', required: true },
        { name: 'gene', label: 'Gene', required: true },
        { name: 'risk_allele', label: 'Risk Allele', required: true },
        { name: 'odds_ratio', label: 'Odds Ratio', required: true },
        { name: 'dataset_link', label: 'Dataset Link', required: false }
      ];
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const missingFields = getFields()
        .filter(field => field.required && !formData[field.name])
        .map(field => field.label);

      if (missingFields.length > 0) {
        throw new Error(`Required fields missing: ${missingFields.join(', ')}`);
      }

      await axios.post(`http://localhost:5000/add-data`, {
        dataset,
        data: formData
      });

      setSuccess('Data added successfully!');
      setFormData({});
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to add data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-data-form">
      <h2><Plus size={18} /> Add New Data</h2>
      <form onSubmit={handleSubmit}>
        {getFields().map(field => (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              type="text"
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleInputChange}
              className="form-control"
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
          </div>
        ))}

        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
        
        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Data'}
        </button>
      </form>
    </div>
  );
}