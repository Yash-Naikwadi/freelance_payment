import { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import '../styles/RegisterForm.css';

export default function RegisterForm() {
  const { registerAsClient, registerAsFreelancer, error } = useWeb3();
  const [loading, setLoading] = useState(false);

  const handleRegisterClient = async () => {
    setLoading(true);
    await registerAsClient();
    setLoading(false);
    setTimeout(() => window.location.reload(), 1500);
  };

  const handleRegisterFreelancer = async () => {
    setLoading(true);
    await registerAsFreelancer();
    setLoading(false);
    setTimeout(() => window.location.reload(), 1500);
  };

  return (
    <div className="register-form">
      <div className="register-header">
        <h1>Choose Your Role</h1>
        <p>Select whether you want to post jobs or apply for work.</p>
      </div>

      <div className="register-grid">
        <div className="register-card">
          <div className="card-icon">👤</div>
          <h3>Register as Client</h3>
          <p>Post jobs and hire freelancers</p>
          <ul className="features-list">
            <li>✓ Post job listings</li>
            <li>✓ Deposit funds securely</li>
            <li>✓ Review and approve work</li>
            <li>✓ Release payments instantly</li>
          </ul>
          <button
            className="register-btn client-btn"
            onClick={handleRegisterClient}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register as Client'}
          </button>
        </div>

        <div className="register-card">
          <div className="card-icon">💻</div>
          <h3>Register as Freelancer</h3>
          <p>Browse and apply for jobs</p>
          <ul className="features-list">
            <li>✓ Browse available jobs</li>
            <li>✓ Submit your work</li>
            <li>✓ Get paid instantly</li>
            <li>✓ Build your reputation</li>
          </ul>
          <button
            className="register-btn freelancer-btn"
            onClick={handleRegisterFreelancer}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register as Freelancer'}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
