// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';
import { ROLES } from '../constants/roles';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    name: 'Amber Sahay',
    role: ROLES.PLAYER, // change to ADMIN when needed
  });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
