import { useState } from 'react';
import { useWeb3 } from './context/Web3Context';
import './App.css';
import Dashboard from './components/Dashboard';
import WalletConnect from './components/WalletConnect';
import Navigation from './components/Navigation';

function App() {
  const { isConnected, account, error } = useWeb3();
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div className="app-container">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <main className="main-content">
        {!isConnected ? (
          <WalletConnect />
        ) : (
          <>
            {error && (
              <div className="error-banner">
                <p>{error}</p>
              </div>
            )}
            <div className="account-info">
              <span className="account-label">Connected Account:</span>
              <span className="account-address">{account?.slice(0, 6)}...{account?.slice(-4)}</span>
            </div>
            <Dashboard currentPage={currentPage} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;