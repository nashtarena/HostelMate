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
import AdminStudentsPage from "./pages/AdminStudentsPage";
import AdminParentsPage from "./pages/AdminParentsPage";
import ProfilePage from "./pages/ProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import { Layout } from "./components/Layout";
import { Toast } from "./components/Common";

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [role, setRole] = useState<Role>("student");
  const [mustChangePwd, setMustChangePwd] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "warning" } | null>(null);

  const handleLogin = (r: Role, mustChangePassword: boolean) => {
    setRole(r);
    setMustChangePwd(mustChangePassword);
    if (mustChangePassword) {
      // Force password change before entering the app
      setScreen("change-password");
      setToast({ msg: "Please set a new password to continue.", type: "warning" });
    } else {
      setScreen(r === "student" || r === "parent" ? "dashboard" : "admin-dashboard");
      setToast({ msg: `Welcome back! Signed in as ${r}.`, type: "success" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setScreen("login");
    setMustChangePwd(false);
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

  // Force password change screen — no layout, no navigation
  if (screen === "change-password" && mustChangePwd) {
    return (
      <div style={{ fontFamily: "Inter, sans-serif" }}>
        {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        <ChangePasswordPage
          forced
          onSuccess={() => {
            setMustChangePwd(false);
            setScreen(role === "student" || role === "parent" ? "dashboard" : "admin-dashboard");
            setToast({ msg: "Password updated. Welcome!", type: "success" });
          }}
        />
      </div>
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case "dashboard":       return <StudentDashboard onNavigate={handleNavigate} />;
      case "room":            return <RoomPage />;
      case "complaints":      return <ComplaintsPage />;
      case "leave":           return <LeavePage />;
      case "fees":            return <FeesPage />;
      case "mess":            return <MessPage />;
      case "visitors":        return <VisitorsPage />;
      case "expenses":        return <ExpensesPage />;
      case "roommate":        return <RoommatePage />;
      case "notices":         return <NoticesPage />;
      case "admin-dashboard": return <AdminDashboard />;
      case "admin-rooms":     return <AdminRoomsPage />;
      case "admin-students":  return <AdminStudentsPage />;
      case "admin-parents":   return <AdminParentsPage />;
      case "profile":         return <ProfilePage />;
      case "change-password": return <ChangePasswordPage onSuccess={() => { setToast({ msg: "Password updated!", type: "success" }); setScreen("profile"); }} />;
      default:                return <StudentDashboard onNavigate={handleNavigate} />;
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
