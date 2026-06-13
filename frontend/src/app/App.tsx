import { useState } from "react";
import { Screen, Role } from "./types";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import RoomPage from "./pages/RoomPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import LeavePage from "./pages/LeavePage";
import FeesPage from "./pages/FeesPage";
import MessPage from "./pages/MessPage";
import VisitorsPage from "./pages/VisitorsPage";
import ExpensesPage from "./pages/ExpensesPage";
import RoommatePage from "./pages/RoommatePage";
import NoticesPage from "./pages/NoticesPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoomsPage from "./pages/AdminRoomsPage";
import ProfilePage from "./pages/ProfilePage";

// Imported shared components
import { Layout } from "./components/Layout";
import { Toast } from "./components/Common";

// ─── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [role, setRole] = useState<Role>("student");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "warning" } | null>(null);

  const handleLogin = (r: Role) => {
    setRole(r);
    setScreen(r === "student" ? "dashboard" : "admin-dashboard");
    setToast({ msg: `Welcome back! Signed in as ${r}.`, type: "success" });
  };

  const handleLogout = () => {
    setScreen("login");
    setToast({ msg: "Signed out successfully.", type: "success" });
  };

  const handleNavigate = (s: Screen) => setScreen(s);

  if (screen === "login") {
    return (
      <div style={{ fontFamily: "Inter, sans-serif" }}>
        {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        <LoginPage onLogin={handleLogin} />
      </div>
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case "dashboard": return <StudentDashboard onNavigate={handleNavigate} />;
      case "room": return <RoomPage />;
      case "complaints": return <ComplaintsPage />;
      case "leave": return <LeavePage />;
      case "fees": return <FeesPage />;
      case "mess": return <MessPage />;
      case "visitors": return <VisitorsPage />;
      case "expenses": return <ExpensesPage />;
      case "roommate": return <RoommatePage />;
      case "notices": return <NoticesPage />;
      case "admin-dashboard": return <AdminDashboard />;
      case "admin-rooms": return <AdminRoomsPage />;
      case "profile": return <ProfilePage />;
      default: return <StudentDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <Layout screen={screen} onNavigate={handleNavigate} role={role} onLogout={handleLogout}>
        {renderScreen()}
      </Layout>
    </div>
  );
}
