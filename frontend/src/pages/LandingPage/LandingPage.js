import Navbar from "../../components/Landing/Navbar";
import HeroSection from "../../components/Landing/HeroSection";
import FeatureSection from "../../components/Landing/FeatureSection";
import DeveloperSection from "../../components/Landing/DeveloperSection";
import TimelineSection from "../../components/Landing/TimelineSection";

function LandingPage() {


    return (
        <div>
            <Navbar />
            <HeroSection />
            <FeatureSection />
            <TimelineSection />
            <DeveloperSection />
        </div>
    );
}

export default LandingPage;
