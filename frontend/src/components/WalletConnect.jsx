import { useWeb3 } from '../context/Web3Context';
import './WalletConnect.css';

export default function WalletConnect() {
  const { connectWallet, error } = useWeb3();

  const handleConnect = async () => {
    await connectWallet();
  };

  return (
    <div className="wallet-connect-container">
      <div className="wallet-connect-card">
        <div className="wallet-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            <path d="M9 12l2 2 4-4"></path>
          </svg>
        </div>
        <h1>Welcome to Freelance Payment System</h1>
        <p>A decentralized platform for secure freelance payments using blockchain technology</p>
        
        <div className="features">
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <h3>Secure Escrow</h3>
            <p>Smart contracts hold funds safely until work is completed</p>
          </div>
          <div className="feature">
            <div className="feature-icon">⚡</div>
            <h3>Instant Payments</h3>
            <p>Automatic payment release when both parties agree</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🌐</div>
            <h3>Decentralized</h3>
            <p>No intermediaries, full control over your transactions</p>
          </div>
        </div>

        <button className="connect-button" onClick={handleConnect}>
          Connect MetaMask Wallet
        </button>

        {error && <div className="error-message">{error}</div>}

        <div className="setup-info">
          <h3>Setup Instructions</h3>
          <ol>
            <li>Install MetaMask browser extension</li>
            <li>Connect to Ganache local network (127.0.0.1:8545)</li>
            <li>Import test accounts from Ganache</li>
            <li>Click "Connect MetaMask Wallet" above</li>
          </ol>
        </div>
      </div>
    </div>
  );
}