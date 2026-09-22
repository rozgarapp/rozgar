import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Toaster } from "./components/ui/sonner";
import Landing from "./pages/Landing";
import WorkersDirectory from "./pages/WorkersDirectory";
import WorkerProfile from "./pages/WorkerProfile";
import JobsPage from "./pages/JobsPage";
import PostJob from "./pages/PostJob";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import AuthPage from "./pages/AuthPage";
import AuthCallback from "./pages/AuthCallback";
import AdminSettings from "./pages/AdminSettings";
import Terms from "./pages/Terms.js";
import Privacy from "./pages/Privacy.js";
import Refund from "./pages/Refund.js";
import About from "./pages/About.js";
import Contact from "./pages/Contact.js";
import Faq from "./pages/Faq.js";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer.js";
import SupportWidget from "./components/SupportWidget";
import MatchBot from "./components/MatchBot";
import SplashScreen from "./components/SplashScreen";
import "./App.css";

function AppRouter() {
  const location = useLocation();
  if (location.hash?.includes("session_id=")) return <AuthCallback />;
  return (
    <>
      
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/workers" element={<WorkersDirectory />} />
        <Route path="/workers/:id" element={<WorkerProfile />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:userId" element={<ChatPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/admin" element={<AdminSettings />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <SplashScreen />
        <AppRouter />
        <SupportWidget />
        <MatchBot />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AppProvider>
  );
}
