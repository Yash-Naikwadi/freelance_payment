import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import './JobCard.css';

export default function JobCard({ job, userRole }) {
  const { completeJob, releasePayment, account } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCompleteJob = async () => {
    setLoading(true);
    setMessage('');
    const success = await completeJob(job.id);
    if (success) {
      setMessage('Job marked as completed!');
    }
    setLoading(false);
  };

  const handleReleasePayment = async () => {
    setLoading(true);
    setMessage('');
    const success = await releasePayment(job.id);
    if (success) {
      setMessage('Payment released successfully!');
    }
    setLoading(false);
  };

  const isFreelancer = userRole === 'freelancer' && job.freelancer.toLowerCase() === account.toLowerCase();
  const isClient = userRole === 'client' && job.client.toLowerCase() === account.toLowerCase();

  return (
    <div className="job-card">
      <div className="job-header">
        <h3 className="job-title">Job #{job.id}</h3>
        <div className="job-status">
          <span className={`status-badge ${job.completed ? 'completed' : 'active'}`}>
            {job.completed ? 'Completed' : 'Active'}
          </span>
        </div>
      </div>

      <div className="job-description">
        <p>{job.description}</p>
      </div>

      <div className="job-details">
        <div className="detail-item">
          <span className="detail-label">Client:</span>
          <span className="detail-value">{job.client.slice(0, 6)}...{job.client.slice(-4)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Freelancer:</span>
          <span className="detail-value">{job.freelancer.slice(0, 6)}...{job.freelancer.slice(-4)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Amount:</span>
          <span className="detail-value">{job.amount} ETH</span>
        </div>
      </div>

      <div className="job-actions">
        {isFreelancer && !job.completed && (
          <button
            className="action-button complete-button"
            onClick={handleCompleteJob}
            disabled={loading}
          >
            {loading ? 'Completing...' : 'Mark as Complete'}
          </button>
        )}

        {isClient && job.completed && (
          <button
            className="action-button release-button"
            onClick={handleReleasePayment}
            disabled={loading}
          >
            {loading ? 'Releasing...' : 'Release Payment'}
          </button>
        )}
      </div>

      {message && <div className="job-message">{message}</div>}
    </div>
  );
}