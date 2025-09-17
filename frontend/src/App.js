import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Clients from "./pages/Clients/Client";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Sidebar from "./components/Sidebar/SideBar";
import Login from "./pages/Login/Login";
import Footer from "./components/Footer/Footer";
import "./App.css";

function AppContent() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const shouldHideSidebar =
    location.pathname.includes("/clients") ||
    location.pathname.includes("/about") ||
    location.pathname.includes("/contact");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedJWT = localStorage.getItem("jwt");

    if (storedUser && storedJWT) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("jwt");
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setShowLoginModal(false);

    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="app">
      <Header
        user={user}
        onLogout={handleLogout}
        onLoginClick={() => setShowLoginModal(true)}
      />
      <div className="main-content">
        {!shouldHideSidebar && <Sidebar onYearChange={() => {}} />}

        <div
          className={`page-content ${shouldHideSidebar ? "full-width" : ""}`}
        >
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/clients" element={<Clients user={user} />} />
            <Route path="/about" element={<About user={user} />} />
            <Route path="/contact" element={<Contact user={user} />} />
          </Routes>
        </div>
      </div>

      <Footer />

      <Login
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
