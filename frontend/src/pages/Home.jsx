import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import LandingPage from "./LandingPage"

export default function Home() {
  const { isAuthenticated, loading, user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Only show content if NOT authenticated
  if (!isAuthenticated && !loading) {
    return (
      <LandingPage />
    );
  }

  // Return null while redirecting
  return null;
}

