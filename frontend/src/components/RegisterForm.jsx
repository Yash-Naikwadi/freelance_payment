import { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import '../styles/RegisterForm.css';

export default function RegisterForm() {
  const { registerAsClient, registerAsFreelancer, error } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleRegisterClient = async () => {
    setLoading(true);
    const ok = await registerAsClient();
    setLoading(false);
    if (ok) {
      setSuccess('Successfully registered as Client!');
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  const handleRegisterFreelancer = async () => {
    setLoading(true);
    const ok = await registerAsFreelancer();
    setLoading(false);
    if (ok) {
      setSuccess('Successfully registered as Freelancer!');
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  return (
    <div className="register-form">
      <div className="register-header">
        <h1>Welcome to Freelance Payment System</h1>
        <p>Choose your role to get started with secure blockchain payments.</p>
      </div>

      <div className="register-grid">
        <div className="register-card">
          <div className="card-icon">👤</div>
          <h3>I am a Client</h3>
          <p>Hire freelancers and pay securely via escrow</p>
          <button
            className="register-btn client-btn"
            onClick={handleRegisterClient}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Join as Client'}
          </button>
        </div>

        <div className="register-card">
          <div className="card-icon">💻</div>
          <h3>I am a Freelancer</h3>
          <p>Complete jobs and get paid instantly in ETH</p>
          <button
            className="register-btn freelancer-btn"
            onClick={handleRegisterFreelancer}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Join as Freelancer'}
          </button>
        </div>
      </div>

      {success && <div className="success-message" style={{ color: '#10b981', marginTop: '20px', fontWeight: 'bold' }}>{success}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
