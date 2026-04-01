import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import './PostJobForm.css';

export default function PostJobForm({ onJobPosted }) {
  const { postJob, error } = useWeb3();
  const [formData, setFormData] = useState({
    freelancerAddress: '',
    description: '',
    amount: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!formData.freelancerAddress || !formData.description || !formData.amount) {
      setMessage('Please fill in all fields');
      setLoading(false);
      return;
    }

    const success = await postJob(formData.freelancerAddress, formData.description, parseFloat(formData.amount));
    
    if (success) {
      setMessage('Job posted successfully!');
      setFormData({ freelancerAddress: '', description: '', amount: '' });
      setTimeout(() => onJobPosted(), 1500);
    }
    setLoading(false);
  };

  return (
    <div className="post-job-container">
      <div className="post-job-card">
        <h2>Post a New Job</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="freelancerAddress">Freelancer Address</label>
            <input
              type="text"
              id="freelancerAddress"
              name="freelancerAddress"
              value={formData.freelancerAddress}
              onChange={handleChange}
              placeholder="0x..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Job Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the job requirements..."
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount (ETH)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.1"
              step="0.01"
              min="0"
              required
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Posting Job...' : 'Post Job'}
          </button>
        </form>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}