import { useWeb3 } from '../context/Web3Context';
import './Navigation.css';

export default function Navigation({ currentPage, setCurrentPage }) {
  const { isConnected, disconnectWallet } = useWeb3();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon">💼</div>
          <h2>FreelanceChain</h2>
        </div>

        {isConnected && (
          <div className="navbar-menu">
            <button
              className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentPage('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`nav-link ${currentPage === 'jobs' ? 'active' : ''}`}
              onClick={() => setCurrentPage('jobs')}
            >
              Jobs
            </button>
            <button
              className={`nav-link ${currentPage === 'profile' ? 'active' : ''}`}
              onClick={() => setCurrentPage('profile')}
            >
              Profile
            </button>
            <button className="disconnect-button" onClick={disconnectWallet}>
              Disconnect
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}