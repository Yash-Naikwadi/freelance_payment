import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import RegisterForm from '../components/RegisterForm';
import JobsList from '../components/JobsList';
import PostJobForm from '../components/PostJobForm';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { account, isClient, isFreelancer, disconnectWallet } = useWeb3();
  const [activeTab, setActiveTab] = useState('jobs');

  useEffect(() => {
    if (!account) {
      navigate('/');
    }
  }, [account, navigate]);

  if (!account) {
    return null;
  }

  const handleDisconnect = () => {
    disconnectWallet();
    navigate('/');
  };

  // Determine user role for the JobsList component
  const userRole = isClient ? 'client' : (isFreelancer ? 'freelancer' : null);

  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <div className="navbar-left">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">FreelanceChain</span>
          </div>
        </div>
        <div className="navbar-right">
          {(isClient || isFreelancer) && (
            <div className="role-badge">
              {isClient ? '👤 Client' : '💻 Freelancer'}
            </div>
          )}
          <div className="account-badge">
            {account.slice(0, 6)}...{account.slice(-4)}
          </div>
          <button className="disconnect-btn" onClick={handleDisconnect}>
            Disconnect
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        {!isClient && !isFreelancer ? (
          <div className="register-section">
            <RegisterForm />
          </div>
        ) : (
          <>
            <div className="tabs">
              <button
                className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
                onClick={() => setActiveTab('jobs')}
              >
                My Jobs
              </button>
              {isClient && (
                <button
                  className={`tab-btn ${activeTab === 'post' ? 'active' : ''}`}
                  onClick={() => setActiveTab('post')}
                >
                  Post a New Job
                </button>
              )}
            </div>

            <div className="tab-content">
              {activeTab === 'jobs' && (
                <div className="jobs-section">
                  <div className="section-header">
                    <h2>{isClient ? 'Jobs You Posted' : 'Jobs Assigned to You'}</h2>
                    <p>Manage your blockchain-secured freelance contracts</p>
                  </div>
                  <JobsList userRole={userRole} />
                </div>
              )}
              {activeTab === 'post' && isClient && (
                <div className="post-section">
                  <PostJobForm />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
