'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  signup: (email: string, name?: string) => void;
  logout: () => void;
  onboardingStep: number; // 0: Not started, 1: Questions, 2: KnowYouBetter, 3: Recommendations, 4: Complete
  setOnboardingStep: (step: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [onboardingStep, setOnboardingStep] = useState(0);

  useEffect(() => {
    // Check local storage for persisted session
    const storedUser = localStorage.getItem('careerland_user');
    const storedStep = localStorage.getItem('careerland_step');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedStep) {
      setOnboardingStep(parseInt(storedStep));
    }
  }, []);

  const login = (email: string) => {
    const newUser = { email, name: email.split('@')[0] };
    setUser(newUser);
    localStorage.setItem('careerland_user', JSON.stringify(newUser));
  };

  const signup = (email: string, name?: string) => {
    const newUser = { email, name: name || email.split('@')[0] };
    setUser(newUser);
    localStorage.setItem('careerland_user', JSON.stringify(newUser));
    setOnboardingStep(1); // Start onboarding
    localStorage.setItem('careerland_step', '1');
  };

  const logout = () => {
    setUser(null);
    setOnboardingStep(0);
    localStorage.removeItem('careerland_user');
    localStorage.removeItem('careerland_step');
  };

  const updateStep = (step: number) => {
    setOnboardingStep(step);
    localStorage.setItem('careerland_step', step.toString());
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, onboardingStep, setOnboardingStep: updateStep }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
