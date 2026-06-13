import React from "react";
import { Sidebar } from "./Sidebar";
import { Screen, Role } from "../types";

export const Layout = ({ children, screen, onNavigate, role, onLogout }: {
  children: React.ReactNode; screen: Screen; onNavigate: (s: Screen) => void;
  role: Role; onLogout: () => void;
}) => (
  <div className="flex min-h-screen" style={{ background: "#0A0F1E", fontFamily: "Inter, sans-serif" }}>
    <Sidebar screen={screen} onNavigate={onNavigate} role={role} onLogout={onLogout} />
    <main className="flex-1 overflow-y-auto" style={{ marginLeft: 240, padding: "32px 32px" }}>
      {children}
    </main>
  </div>
);

export default {};
