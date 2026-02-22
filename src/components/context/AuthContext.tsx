'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  name?: string;
  apiToken?: string; // JWT from backend (received after Google OAuth callback)
}

interface AuthContextType {
  user: User | null;
  login: (email: string, apiToken?: string, name?: string) => void;
  signup: (email: string, name?: string, apiToken?: string) => void;
  logout: () => void;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  onboardingSessionId: string | null;
  setOnboardingSessionId: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [onboardingStep, setOnboardingStepState] = useState(0);
  const [onboardingSessionId, setOnboardingSessionIdState] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('careerland_user');
    const storedStep = localStorage.getItem('careerland_step');
    const storedSession = localStorage.getItem('careerland_onboarding_session');
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedStep) setOnboardingStepState(parseInt(storedStep));
    if (storedSession) setOnboardingSessionIdState(storedSession);
  }, []);

  const login = (email: string, apiToken?: string, name?: string) => {
    const newUser = { email, name: name || email.split('@')[0], apiToken };
    setUser(newUser);
    localStorage.setItem('careerland_user', JSON.stringify(newUser));
  };

  const signup = (email: string, name?: string, apiToken?: string) => {
    const newUser = { email, name: name || email.split('@')[0], apiToken };
    setUser(newUser);
    localStorage.setItem('careerland_user', JSON.stringify(newUser));
    setOnboardingStepState(1);
    localStorage.setItem('careerland_step', '1');
  };

  const logout = () => {
    setUser(null);
    setOnboardingStepState(0);
    setOnboardingSessionIdState(null);
    localStorage.removeItem('careerland_user');
    localStorage.removeItem('careerland_step');
    localStorage.removeItem('careerland_onboarding_session');
  };

  const setOnboardingStep = (step: number) => {
    setOnboardingStepState(step);
    localStorage.setItem('careerland_step', step.toString());
  };

  const setOnboardingSessionId = (id: string | null) => {
    setOnboardingSessionIdState(id);
    if (id) localStorage.setItem('careerland_onboarding_session', id);
    else localStorage.removeItem('careerland_onboarding_session');
  };

  return (
    <AuthContext.Provider value={{
      user, login, signup, logout,
      onboardingStep, setOnboardingStep,
      onboardingSessionId, setOnboardingSessionId,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
