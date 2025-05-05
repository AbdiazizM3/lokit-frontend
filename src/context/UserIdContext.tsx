import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUserIdByEmail } from '../api';
import { useAuth } from './AuthContext';

type UserIdContextType = {
  userId: string | null;
};

const UserIdContext = createContext<UserIdContextType | undefined>(undefined);

export const UserIdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserId = async () => {
      if (!user?.email) {
        setUserId(null);
        return;
      }

      try {
        const userIdResponse = await getUserIdByEmail(user.email);
        setUserId(userIdResponse.userId.user_id);
      } catch (error) {
        console.error('Error fetching user ID:', error);
        setUserId(null);
      }
    };

    fetchUserId();
  }, [user?.email]);

  return (
    <UserIdContext.Provider value={{ userId }}>
      {children}
    </UserIdContext.Provider>
  );
};

export const useUserId = () => {
  const context = useContext(UserIdContext);
  if (context === undefined) {
    throw new Error('useUserId must be used within a UserIdProvider');
  }
  return context;
}; 