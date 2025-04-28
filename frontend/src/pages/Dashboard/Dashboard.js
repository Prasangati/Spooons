import React, { useState, useEffect} from "react";
import "./Dashboard.css";
import LogOut from "../../components/Auth/LogOut"; //logout Button
import Journal from "./Journal"; // journal component
import Resources from "./Resources";
import {Link} from "react-router-dom"; // resources component

function Dashboard() {
   const [activeTab, setActiveTab] = useState("Journal");
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth > 768) {
          setIsSidebarOpen(false);
        }
      };
  
      window.addEventListener("resize", handleResize);
  
      return () => window.removeEventListener("resize", handleResize);
    }, []);
   const handleTabClick = (tab) => {
      setActiveTab(tab);
      setIsSidebarOpen(false); // sidebar on mobile view only
    };

   return (
      <div className="dashboard">
         {/* navbar */}
         <nav className="navbar">
  <div className="navbar-left">

  <button className="sidebarIcon mobile" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          ☰
   </button>

    <Link to="/" className="logo">
                    <img src="/logo.png" alt="Logo" />
    </Link>
    <ul className="nav-links desktop">
    <li className={activeTab === "Journal" ? "active" : ""} onClick={() => setActiveTab("Journal")}>Journal</li>
      <li className={activeTab === "Progress" ? "active" : ""} onClick={() => setActiveTab("Progress")}>Progress</li>
      <li className={activeTab === "Resources" ? "active" : ""} onClick={() => setActiveTab("Resources")}>Resources</li>
    </ul>
  </div>


        <div className="logout-container desktop">
          <LogOut />
        </div>
      </nav>
      {isSidebarOpen && (
        <div className="mobile-sidebar">
          <ul className="nav-links">
            <li className={activeTab === "Journal" ? "active" : ""} onClick={() => handleTabClick("Journal")}>Journal</li>
            <li className={activeTab === "Progress" ? "active" : ""} onClick={() => handleTabClick("Progress")}>Progress</li>
            <li className={activeTab === "Resources" ? "active" : ""} onClick={() => handleTabClick("Resources")}>Resources</li>
          </ul>
          <div className="logout-container">
            <LogOut />
          </div>
        </div>
      )}



         {/* Main Content */}
         <main className="main-content">
            <section className="dashboard-content">
               {activeTab === "Journal" && <Journal />}
               {activeTab === "Progress" && <p>Track your progress here</p>}
               {activeTab === "Resources" && <Resources />}
            </section>
         </main>
      </div>
   );
}

export default Dashboard;