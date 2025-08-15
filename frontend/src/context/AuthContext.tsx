import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  role: 'doctor' | 'patient' | null;
  name?: string;
  userId?: string;
  login: (token: string, role: 'doctor' | 'patient', name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<'doctor' | 'patient' | null>(localStorage.getItem('role') as any);
  const [name, setName] = useState<string>(localStorage.getItem('name') || '');
  const [userId, setUserId] = useState<string | undefined>(localStorage.getItem('userId') || undefined);

  const login = (token: string, role: 'doctor' | 'patient', name?: string) => {
    const payload = JSON.parse(atob(token.split('.')[1])); // JWT’den userId al
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', payload.sub);
    if (name) localStorage.setItem('name', name);
    setToken(token);
    setRole(role);
    setName(name || '');
    setUserId(payload.sub);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('userId');
    setToken(null);
    setRole(null);
    setName('');
    setUserId(undefined);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, name, userId, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
