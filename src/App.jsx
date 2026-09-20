import { useState, useEffect } from 'react';
import { useWallet } from './hooks/useWallet';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import './index.css';

function App() {
  const wallet = useWallet();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('royalix_user');
    if (user) setIsLoggedIn(true);
  }, []);

  // Go to dashboard only after BOTH login AND wallet connected
  const showDashboard = isLoggedIn && wallet.connected && !!wallet.address;

  const handleDisconnect = () => {
    wallet.disconnect();
    localStorage.removeItem('royalix_user');
    setIsLoggedIn(false);
  };

  return showDashboard ? (
    <Dashboard wallet={wallet} onDisconnect={handleDisconnect} />
  ) : (
    <LandingPage
      isLoggedIn={isLoggedIn}
      onLogin={() => setIsLoggedIn(true)}
      wallet={wallet}
    />
  );
}

export default App;
