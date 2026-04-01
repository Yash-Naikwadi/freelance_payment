import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import './RegisterForm.css';

export default function RegisterForm({ onRegistrationSuccess }) {
  const { registerAsClient, registerAsFreelancer, error } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegisterClient = async () => {
    setLoading(true);
    setMessage('');
    const success = await registerAsClient();
    if (success) {
      setMessage('Successfully registered as Client!');
      setTimeout(() => onRegistrationSuccess(), 1500);
    }
    setLoading(false);
  };

  const handleRegisterFreelancer = async () => {
    setLoading(true);
    setMessage('');
    const success = await registerAsFreelancer();
    if (success) {
      setMessage('Successfully registered as Freelancer!');
      setTimeout(() => onRegistrationSuccess(), 1500);
    }
    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Choose Your Role</h1>
        <p>Select how you want to use the platform</p>

        <div className="role-options">
          <div className="role-option">
            <div className="role-icon">👤</div>
            <h2>Client</h2>
            <p>Post jobs and hire freelancers to complete your projects</p>
            <button
              className="register-button client-button"
              onClick={handleRegisterClient}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register as Client'}
            </button>
          </div>

          <div className="divider"></div>

          <div className="role-option">
            <div className="role-icon">💻</div>
            <h2>Freelancer</h2>
            <p>Browse jobs and offer your services to clients</p>
            <button
              className="register-button freelancer-button"
              onClick={handleRegisterFreelancer}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register as Freelancer'}
            </button>
          </div>
        </div>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="info-box">
          <h3>About Registration</h3>
          <p>You can only register as one role per wallet address. Choose carefully!</p>
        </div>
      </div>
    </div>
  );
}