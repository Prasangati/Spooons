import React from "react";
import { useAuthContext } from "../context/AuthContext";
import LandingPage from "./LandingPage";
import Loading from "./Loading";
import Dashboard from "./Dashboard/Dashboard";

export default function Home() {
  const { isAuthenticated, loading } = useAuthContext();

  // Show loading state while checking authentication
  if (loading) {
    return <Loading />;
  }

  // Render Dashboard if authenticated, LandingPage otherwise
  return isAuthenticated ? <Dashboard /> : <LandingPage />;
}