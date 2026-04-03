import { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import '../styles/JobsList.css';

export default function JobsList({ userRole }) {
  const { getNextJobId, getJob, submitWork, depositFunds, releasePayment, account, error } = useWeb3();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const nextId = await getNextJobId();
        if (!nextId) {
          setJobs([]);
          setLoading(false);
          return;
        }

        const jobsList = [];
        for (let i = 1; i < nextId; i++) {
          const job = await getJob(i);
          if (job) {
            jobsList.push({
              id: i,
              ...job
            });
          }
        }

        if (userRole === 'freelancer') {
          const filtered = jobsList.filter(job => job.freelancer.toLowerCase() === account?.toLowerCase());
          setJobs(filtered);
        } else {
          const filtered = jobsList.filter(job => job.client.toLowerCase() === account?.toLowerCase());
          setJobs(filtered);
        }
      } catch (err) {
        console.error('Error loading jobs:', err);
      }
      setLoading(false);
    };

    loadJobs();
  }, [getNextJobId, getJob, userRole, account]);

  const handleSubmitWork = async (jobId) => {
    setActionLoading(jobId);
    const success = await submitWork(jobId);
    setActionLoading(null);

    if (success) {
      alert('Work submitted successfully!');
      window.location.reload();
    } else {
      alert(error || 'Failed to submit work');
    }
  };

  const handleDepositFunds = async (jobId, amount) => {
    setActionLoading(jobId);
    const success = await depositFunds(jobId, amount);
    setActionLoading(null);

    if (success) {
      alert('Funds deposited successfully!');
      window.location.reload();
    } else {
      alert(error || 'Failed to deposit funds');
    }
  };

  const handleReleasePayment = async (jobId) => {
    setActionLoading(jobId);
    const success = await releasePayment(jobId);
    setActionLoading(null);

    if (success) {
      alert('Payment released successfully!');
      window.location.reload();
    } else {
      alert(error || 'Failed to release payment');
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return <div className="loading">Loading jobs...</div>;
  }

  if (jobs.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <h3>No jobs found</h3>
        <p>
          {userRole === 'freelancer'
            ? 'No jobs have been posted for you yet.'
            : 'You haven\'t posted any jobs yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="jobs-list">
      {jobs.map(job => (
        <div key={job.id} className="job-card">
          <div className="job-header">
            <div className="job-title">
              <h3>Job #{job.id}</h3>
              <p>{job.description}</p>
            </div>
            <div className="job-amount">{job.amount} ETH</div>
          </div>

          <div className="job-status">
            <div className={`status-item ${job.fundsDeposited ? 'completed' : ''}`}>
              <div className="status-dot"></div>
              <span>Funds Deposited</span>
            </div>
            <div className="status-arrow">→</div>
            <div className={`status-item ${job.workSubmitted ? 'completed' : ''}`}>
              <div className="status-dot"></div>
              <span>Work Submitted</span>
            </div>
            <div className="status-arrow">→</div>
            <div className={`status-item ${job.paymentReleased ? 'completed' : ''}`}>
              <div className="status-dot"></div>
              <span>Payment Released</span>
            </div>
          </div>

          <div className="job-details">
            <div className="detail-item">
              <span className="label">Client</span>
              <span className="value">{formatAddress(job.client)}</span>
            </div>
            <div className="detail-item">
              <span className="label">Freelancer</span>
              <span className="value">{formatAddress(job.freelancer)}</span>
            </div>
          </div>

          <div className="job-actions">
            {userRole === 'client' && (
              <>
                {!job.fundsDeposited && (
                  <button
                    className="action-btn deposit-btn"
                    onClick={() => handleDepositFunds(job.id, job.amount)}
                    disabled={actionLoading === job.id}
                  >
                    {actionLoading === job.id ? 'Depositing...' : 'Deposit Funds'}
                  </button>
                )}
                {job.workSubmitted && !job.paymentReleased && (
                  <button
                    className="action-btn release-btn"
                    onClick={() => handleReleasePayment(job.id)}
                    disabled={actionLoading === job.id}
                  >
                    {actionLoading === job.id ? 'Releasing...' : 'Release Payment'}
                  </button>
                )}
              </>
            )}

            {userRole === 'freelancer' && (
              <>
                {job.fundsDeposited && !job.workSubmitted && (
                  <button
                    className="action-btn submit-btn"
                    onClick={() => handleSubmitWork(job.id)}
                    disabled={actionLoading === job.id}
                  >
                    {actionLoading === job.id ? 'Submitting...' : 'Submit Work'}
                  </button>
                )}
              </>
            )}

            {job.paymentReleased && (
              <div className="action-btn completed-btn">✓ Completed</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
