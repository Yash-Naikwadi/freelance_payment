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
                Jobs
              </button>
              {isClient && (
                <button
                  className={`tab-btn ${activeTab === 'post' ? 'active' : ''}`}
                  onClick={() => setActiveTab('post')}
                >
                  Post Job
                </button>
              )}
            </div>

            <div className="tab-content">
              {activeTab === 'jobs' && (
                <JobsList userRole={isClient ? 'client' : 'freelancer'} />
              )}
              {activeTab === 'post' && isClient && (
                <PostJobForm />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
