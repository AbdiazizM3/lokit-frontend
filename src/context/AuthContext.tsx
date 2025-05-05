import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { getUserIdByEmail, getUser } from '../api';

type AuthContextType = {
  user: User | null;
  signOut: () => Promise<void>;
  isUserStaff: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isUserStaff, setIsUserStaff] = useState(false);

  const fetchUserStaffStatus = async (userEmail: string | null) => {
    if (!userEmail) return;
    try {
      const userIdResponse = await getUserIdByEmail(userEmail);
      const userResponse = await getUser(userIdResponse.userId.user_id);
      setIsUserStaff(userResponse.user.user_is_staff);
    } catch (error) {
      console.error('Error fetching user staff status:', error);
      setIsUserStaff(false);
    }
  };

  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
      setUser(user);
      if (user?.email) {
        fetchUserStaffStatus(user.email);
      } else {
        setIsUserStaff(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      setIsUserStaff(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signOut, isUserStaff }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 