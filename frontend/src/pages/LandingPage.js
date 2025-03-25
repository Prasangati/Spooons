import Navbar from "../components/Landing/Navbar";
import HeroSection from "../components/Landing/HeroSection";
import FeatureSection from "../components/Landing/FeatureSection";
import { useAuthContext } from "../context/AuthContext";


function LandingPage() {
    const { isAuthenticated, loading, refreshAuth } = useAuthContext();

    return (
        <div>
            <Navbar />
            <HeroSection />
            <FeatureSection />
        </div>
    );
}

export default LandingPage;
