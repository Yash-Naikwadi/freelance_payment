import { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import '../styles/PostJobForm.css';

export default function PostJobForm() {
  const { postJob, error } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    freelancerAddress: '',
    description: '',
    amount: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.freelancerAddress || !formData.description || !formData.amount) {
      alert('Please fill in all fields');
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(formData.freelancerAddress)) {
      alert('Invalid Ethereum address');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    setLoading(true);
    const success = await postJob(
      formData.freelancerAddress,
      formData.description,
      formData.amount
    );
    setLoading(false);

    if (success) {
      alert('Job posted successfully!');
      setFormData({ freelancerAddress: '', description: '', amount: '' });
    } else {
      alert(error || 'Failed to post job');
    }
  };

  return (
    <div className="post-job-form">
      <div className="form-header">
        <h2>Post a New Job</h2>
        <p>Create a job listing and specify the freelancer you want to hire</p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Freelancer Wallet Address</label>
          <input
            type="text"
            name="freelancerAddress"
            placeholder="0x..."
            value={formData.freelancerAddress}
            onChange={handleChange}
            disabled={loading}
            className="form-input"
          />
          <small>The wallet address of the freelancer you want to hire</small>
        </div>

        <div className="form-group">
          <label>Job Description</label>
          <textarea
            name="description"
            placeholder="Describe the job details, requirements, and deliverables..."
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
            className="form-textarea"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Payment Amount (ETH)</label>
          <input
            type="number"
            name="amount"
            placeholder="0.5"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={handleChange}
            disabled={loading}
            className="form-input"
          />
          <small>The amount in ETH to be held in escrow</small>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="submit-btn"
        >
          {loading ? 'Posting Job...' : 'Post Job'}
        </button>

        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}
