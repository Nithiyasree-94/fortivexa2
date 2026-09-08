import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [officer, setOfficer] = useState(() => {
    const saved = localStorage.getItem('cyber_officer_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const login = (officerId, department) => {
    const userSession = {
      officerId: officerId || 'CYB-IND-7049',
      name: officerId ? `Officer ${officerId.toUpperCase()}` : 'Insp. Vikram Rathore',
      department: department || 'Indian Cybercrime Coordination Centre (I4C)',
      badge: `MHA-TAG-${Math.floor(1000 + Math.random() * 9000)}`,
      clearanceLevel: 'LEVEL 4 RESTRICTED',
      sessionStartTime: new Date().toISOString()
    };
    setOfficer(userSession);
    localStorage.setItem('cyber_officer_session', JSON.stringify(userSession));
  };

  const logout = () => {
    setOfficer(null);
    localStorage.removeItem('cyber_officer_session');
  };

  return (
    <AuthContext.Provider value={{ officer, login, logout, isAuthenticated: !!officer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
