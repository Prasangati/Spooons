import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import SignupSuccess from "./pages/SignupSuccess/SignupSuccess";
import Home from "./pages/Home/Home";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import CSRFProvider from "./utils/CSRFContext";


const clientId = process.env.REACT_APP_CLIENT_ID;


function App() {


  return (
    <CSRFProvider>
      <GoogleOAuthProvider clientId={clientId}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup-success" element={<SignupSuccess />} />
            <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
            <Route path="*" element={<h1>Page Not Found</h1>} />
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </CSRFProvider>
  );
}

export default App;
