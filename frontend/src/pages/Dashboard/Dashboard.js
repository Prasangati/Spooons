import React, { useState } from "react";
//import { useAuthContext } from "../../context/AuthContext"; 
import "./Dashboard.css";
import LogOut from "../../components/Auth/LogOut"; //logout Button
import Journal from "./Journal"; // journal component

function Dashboard() {
   const [activeTab, setActiveTab] = useState("Journal");
   //const { user } = useAuthContext(); 
  


   return (
      <div className="dashboard">
         {/* navbar */}
         <nav className="navbar">
            <img src="/logo.png" alt="spooons Logo" className="sp-logo" />
              {/* <span className="greeting">Hello, {user?.name || "Guest"}!</span> */}
            <ul className="nav-links">
               <li className={activeTab === "Journal" ? "active" : ""} onClick={() => setActiveTab("Journal")}>Journal</li>
               <li className={activeTab === "Progress" ? "active" : ""} onClick={() => setActiveTab("Progress")}>Progress</li>
               <li className={activeTab === "Resources" ? "active" : ""} onClick={() => setActiveTab("Resources")}>Resources</li>
            </ul>
               <LogOut />
               </nav>

         {/* Main Content */}
         <main className="main-content">
            <section className="dashboard-content">
            {/* <h1 className="greeting">{quotes[currentQuoteIndex]}</h1> */}
               {activeTab === "Journal" && <Journal />}
               {activeTab === "Progress" && <p>Track your progress here</p>}
               {activeTab === "Resources" && <p>Personalized mental health resources</p>}
            </section>
         </main>
      </div>
   );
}

export default Dashboard;