import Navbar from "../../components/Landing/Navbar";
import HeroSection from "../../components/Landing/HeroSection";
import FeatureSection from "../../components/Landing/FeatureSection";
import TimelineSection from "../../components/Landing/TimelineSection";

function LandingPage() {


    return (
        <div>
            <Navbar />
            <HeroSection />
            <FeatureSection />
            <TimelineSection />
        </div>
    );
}

export default LandingPage;
