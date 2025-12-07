import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

// Pages
import LandingPage from "../modules/landing/LandingPage";
import Login from "../modules/auth/Login";
import Register from "../modules/auth/Register";
import GameIntroScreen from "../modules/intro/GameIntroScreen";
import WorldContextScreen from "../modules/intro/WorldContextScreen";
import CharacterEntryChoiceScreen from "../modules/intro/CharacterEntryChoiceScreen";
import CharacterGridScreen from "../modules/character/CharacterGridScreen";
import CharacterBuilder from "../modules/character/CharacterBuilder";
import GamePage from "../modules/game/GamePage";

export default function AppRouter() {
  const { isLoading, user } = useAuth();

  // Check if character exists in localStorage
  const hasCharacter = () => {
    try {
      return !!localStorage.getItem("characterData");
    } catch {
      return false;
    }
  };

  return (
    <Router>
      <Routes>
        {/* ============= PUBLIC ROUTES ============= */}

        <Route
          path="/"
          element={
            !user ? (
              <LandingPage />
            ) : hasCharacter() ? (
              <Navigate to="/game" replace />
            ) : (
              <Navigate to="/intro" replace />
            )
          }
        />

        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />

        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <Register />}
        />

        {/* ============= INTRO FLOW (Protected) ============= */}

        <Route
          path="/intro"
          element={
            <ProtectedRoute isAuthLoading={isLoading} user={user}>
              {hasCharacter() ? (
                <Navigate to="/game" replace />
              ) : (
                <GameIntroScreen />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/intro/world"
          element={
            <ProtectedRoute isAuthLoading={isLoading} user={user}>
              {hasCharacter() ? (
                <Navigate to="/game" replace />
              ) : (
                <WorldContextScreen />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/intro/entry"
          element={
            <ProtectedRoute isAuthLoading={isLoading} user={user}>
              {hasCharacter() ? (
                <Navigate to="/game" replace />
              ) : (
                <CharacterEntryChoiceScreen />
              )}
            </ProtectedRoute>
          }
        />

        {/* ============= CHARACTER CREATION (Protected) ============= */}

        <Route
          path="/character/select"
          element={
            <ProtectedRoute isAuthLoading={isLoading} user={user}>
              <CharacterGridScreen />
            </ProtectedRoute>
          }
        />

        <Route
          path="/character"
          element={
            <ProtectedRoute isAuthLoading={isLoading} user={user}>
              <CharacterBuilder />
            </ProtectedRoute>
          }
        />

        {/* ============= GAME SCENE ============= */}

        <Route
          path="/game"
          element={
            <ProtectedRoute isAuthLoading={isLoading} user={user}>
              <GamePage />
            </ProtectedRoute>
          }
        />

        {/* ============= CATCH-ALL ============= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
