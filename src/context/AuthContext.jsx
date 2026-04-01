import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth from localStorage
    const initAuth = () => {
      try {
        const savedUser = localStorage.getItem("currentUser");
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setSession({ user: parsedUser });
        }
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const signUp = async (email, password, username) => {
    // Simulate minor delay for realism
    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    if (users.find((u) => u.email === email)) {
      throw new Error("User already exists with this email.");
    }

    const newUser = { 
      id: Date.now().toString(), 
      email, 
      username, 
      password,
      created_at: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    
    // Auto-login after signup
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setUser(newUser);
    setSession({ user: newUser });
    
    return { user: newUser };
  };

  const signIn = async (email, password) => {
    // Simulate minor delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find((u) => u.email === email && u.password === password);

    if (!foundUser) {
      throw new Error("Invalid email or password.");
    }

    localStorage.setItem("currentUser", JSON.stringify(foundUser));
    setUser(foundUser);
    setSession({ user: foundUser });
    
    return { user: foundUser };
  };

  const signInWithGoogle = async () => {
    // Mock Google Sign-In for frontend experience
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const mockGoogleUser = {
      id: "google-" + Date.now(),
      email: "google.user@example.com",
      username: "Google Explorer",
      password: "N/A",
      is_google: true,
      created_at: new Date().toISOString()
    };

    localStorage.setItem("currentUser", JSON.stringify(mockGoogleUser));
    setUser(mockGoogleUser);
    setSession({ user: mockGoogleUser });
    
    return { user: mockGoogleUser };
  };

  const signOut = async () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, isLoading, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
