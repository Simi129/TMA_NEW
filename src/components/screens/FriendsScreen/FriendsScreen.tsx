import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { userService, User } from '../../../api/userService';

const FriendsScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [referrals, setReferrals] = useState<User[] | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        setDebugInfo('Fetching current user...');
        const user = await userService.getCurrentUser();
        setCurrentUser(user);
        setDebugInfo(prev => prev + '\nCurrent user fetched: ' + JSON.stringify(user));

        setDebugInfo(prev => prev + '\nFetching referrals...');
        const referralsData = await userService.getReferrals();
        setReferrals(referralsData);
        setDebugInfo(prev => prev + '\nReferrals fetched: ' + JSON.stringify(referralsData));
      } catch (error) {
        console.error('Failed to initialize data:', error);
        setError('Failed to load data. Please try again later.');
        setDebugInfo(prev => prev + '\nError occurred: ' + JSON.stringify(error));
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <h1>Friends Screen</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <h2>Current User:</h2>
      <pre>{JSON.stringify(currentUser, null, 2)}</pre>
      <h2>Referrals:</h2>
      <pre>{JSON.stringify(referrals, null, 2)}</pre>
      <h2>Debug Info:</h2>
      <pre>{debugInfo}</pre>
    </div>
  );
};

export default FriendsScreen;