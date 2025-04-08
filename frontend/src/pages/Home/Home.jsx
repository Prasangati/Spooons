import React from "react";
import { useAuthContext } from "../../context/AuthContext";
import LandingPage from "../LandingPage/LandingPage";
import Loading from "../Loading/Loading";
import Dashboard from "../Dashboard/Dashboard";

export default function Home() {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Loading />
      </div>
    );
  }




  // Render Dashboard if authenticated, LandingPage otherwise
  return isAuthenticated ? <Dashboard /> : <LandingPage />;
}