import { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import RegisterForm from './RegisterForm';
import JobsList from './JobsList';
import PostJobForm from './PostJobForm';
import './Dashboard.css';

export default function Dashboard({ currentPage }) {
  const { account, isClient, isFreelancer } = useWeb3();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const checkUserRole = async () => {
      if (account) {
        const isClientResult = await isClient(account);
        const isFreelancerResult = await isFreelancer(account);
        
        if (isClientResult) setUserRole('client');
        else if (isFreelancerResult) setUserRole('freelancer');
        else setUserRole(null);
      }
      setLoading(false);
    };

    checkUserRole();
  }, [account, isClient, isFreelancer, refreshTrigger]);

  const handleRegistrationSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  if (!userRole) {
    return <RegisterForm onRegistrationSuccess={handleRegistrationSuccess} />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="role-badge">{userRole === 'client' ? '👤 Client' : '💻 Freelancer'}</div>
      </div>

      {currentPage === 'dashboard' && (
        <div className="dashboard-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <h3>Active Jobs</h3>
              <p className="stat-value">0</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <h3>Total Earnings</h3>
              <p className="stat-value">0 ETH</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <h3>Reputation</h3>
              <p className="stat-value">New</p>
            </div>
          </div>

          <div className="quick-actions">
            <h2>Quick Actions</h2>
            {userRole === 'client' && (
              <button className="action-button primary">Post a New Job</button>
            )}
            {userRole === 'freelancer' && (
              <button className="action-button primary">Browse Available Jobs</button>
            )}
          </div>
        </div>
      )}

      {currentPage === 'jobs' && (
        <div className="jobs-section">
          {userRole === 'client' && <PostJobForm onJobPosted={handleRegistrationSuccess} />}
          <JobsList userRole={userRole} />
        </div>
      )}

      {currentPage === 'profile' && (
        <div className="profile-section">
          <div className="profile-card">
            <h2>Your Profile</h2>
            <div className="profile-info">
              <p><strong>Wallet Address:</strong> {account}</p>
              <p><strong>Role:</strong> {userRole === 'client' ? 'Client' : 'Freelancer'}</p>
              <p><strong>Member Since:</strong> Today</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}