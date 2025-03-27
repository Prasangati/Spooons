import React, { useState } from "react";
import "./Dashboard.css";
import LogOut from "../../components/Auth/LogOut"; //logout Button
import Journal from "./Journal"; // journal component

function Dashboard() {
   const [activeTab, setActiveTab] = useState("Journal");
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   
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

    <img src="/logo.png" alt="spooons Logo" className="sp-logo" />
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
               {activeTab === "Resources" && <p>Personalized mental health resources</p>}
            </section>
         </main>
      </div>
   );
}

export default Dashboard;