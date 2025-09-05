import { useState } from "react";
import Login from "@/components/Login";
import Dashboard from "@/components/Dashboard";
import DataCapture from "@/components/DataCapture";

const Index = () => {
  const [currentView, setCurrentView] = useState<"login" | "dashboard" | "capture">("login");
  const [user, setUser] = useState<{ type: string; phone: string } | null>(null);

  const handleLogin = (userType: string, phone: string) => {
    setUser({ type: userType, phone });
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView("login");
  };

  const handleCapture = () => {
    setCurrentView("capture");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
  };

  if (currentView === "login") {
    return <Login onLogin={handleLogin} />;
  }

  if (currentView === "capture" && user) {
    return <DataCapture onBack={handleBackToDashboard} userType={user.type} />;
  }

  if (currentView === "dashboard" && user) {
    return (
      <Dashboard 
        userType={user.type}
        phoneNumber={user.phone}
        onCapture={handleCapture}
        onLogout={handleLogout}
      />
    );
  }

  return <Login onLogin={handleLogin} />;
};

export default Index;
