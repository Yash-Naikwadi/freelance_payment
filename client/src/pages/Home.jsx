import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import '../styles/Home.css';

export default function Home() {
  const navigate = useNavigate();
  const { account, connectWallet, error } = useWeb3();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    const success = await connectWallet();
    setConnecting(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">FreelanceChain</span>
          </div>
          <div className="nav-subtitle">Secure Blockchain Payments</div>
        </div>
      </nav>

      <main className="home-main">
        <div className="hero-section">
          <h1>Secure Freelance Payments on Blockchain</h1>
          <p>Connect your wallet to post jobs, submit work, and release payments with complete transparency and security.</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Escrow Protection</h3>
              <p>Funds are held securely until work is submitted and approved.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Settlement</h3>
              <p>Payments are released instantly on blockchain with no intermediaries.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Transparent Workflow</h3>
              <p>Every transaction is recorded on-chain for complete transparency.</p>
            </div>
          </div>

          <div className="cta-section">
            <h2>Ready to get started?</h2>
            <p>Connect your MetaMask wallet to begin posting jobs or applying for work.</p>
            
            {error && <div className="error-message">{error}</div>}

            <button 
              className="connect-btn"
              onClick={handleConnect}
              disabled={connecting}
            >
              {connecting ? 'Connecting...' : 'Connect MetaMask Wallet'}
            </button>

            {account && (
              <div className="account-info">
                <p>Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2024 FreelanceChain. All rights reserved.</p>
      </footer>
    </div>
  );
}
