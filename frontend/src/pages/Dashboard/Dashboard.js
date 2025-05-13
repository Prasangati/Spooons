import React, { useState, useEffect} from "react";
import "./Dashboard.css";
import LogOut from "../../components/Auth/LogOut"; //logout Button
import Journal from "./Journal"; // journal component
import Progress from "./Progress"; // progress component
import Resources from "./Resources";
import {Link} from "react-router-dom"; // resources component
import Stressors from "./Stressors";
import FloatingIcon from "../../components/Stressors/FloatingIcon";
import StressorsDetected from "../../components/Stressors/StressorsDetected";


function Dashboard() {
   const [activeTab, setActiveTab] = useState("Journal");
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   const [showModal, setShowModal] = useState(false);
   const [detectedStressors, setDetectedStressors] = useState([]);

   useEffect(() => {
    if (showModal) return; //  stop polling when modal is open

    const fetchStressors = async () => {
        try {
            const response = await api.get('/detected-stressors/recent/');
            setDetectedStressors(response.data || []);
        } catch (err) {
            console.error('Polling error:', err);
            }
    };

    fetchStressors(); // for the initial fetch
    const interval = setInterval(fetchStressors, 15000); // poll every 15s

    return () => clearInterval(interval); // cleanup
    }, [showModal]); // 🔁 re-run effect when `showModal` changes

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
                     <img src="/logo.png" alt="Logo"/>
                 </Link>
                 <div className="tab-switcher desktop">
                     <button
                         className={activeTab === "Journal" ? "tab-button active" : "tab-button"}
                         onClick={() => setActiveTab("Journal")}
                     >
                         Journal
                     </button>
                     <button
                         className={activeTab === "Stressors" ? "tab-button active" : "tab-button"}
                         onClick={() => setActiveTab("Stressors")}
                     >
                         Stressors
                     </button>
                     <button
                         className={activeTab === "Progress" ? "tab-button active" : "tab-button"}
                         onClick={() => setActiveTab("Progress")}
                     >
                         Progress
                     </button>
                     <button
                         className={activeTab === "Resources" ? "tab-button active" : "tab-button"}
                         onClick={() => setActiveTab("Resources")}
                     >
                         Resources
                     </button>
                 </div>
             </div>


             <div className="logout-container desktop">
                 <LogOut/>
             </div>
         </nav>
          {isSidebarOpen && (
              <div className="mobile-sidebar">
                  <ul className="nav-links">
                      <li className={activeTab === "Journal" ? "active" : ""}
                          onClick={() => handleTabClick("Journal")}>Journal
                      </li>
                      <li className={activeTab === "Stressors" ? "active" : ""}
                          onClick={() => handleTabClick("Stressors")}>Stressors
                      </li>
                      <li className={activeTab === "Progress" ? "active" : ""}
                          onClick={() => handleTabClick("Progress")}>Progress
                </li>
                <li className={activeTab === "Resources" ? "active" : ""}
                    onClick={() => handleTabClick("Resources")}>Resources
                </li>
            </ul>
            <div className="logout-container">
                <LogOut/>
            </div>
        </div>
      )}


          {/* Main Content */}
         <main className="main-content">
            <section className="dashboard-content">
               {activeTab === "Journal" && <Journal />}
                {activeTab === "Stressors" && <Stressors />}
               {activeTab === "Progress" && <Progress />}
               {activeTab === "Resources" && <Resources />}
            </section>
         </main>

          <FloatingIcon onClick={() => setShowModal(true)} />

          <StressorsDetected visible={showModal} onClose={() => setShowModal(false)}
            stressors={detectedStressors} />
      </div>
   );
}

export default Dashboard;