// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarNav } from "@components/SidebarNav/SidebarNav";
import { ClientDetails } from "../ClientDetails/ClientDetails";
import { ClientManagement } from "../ClientManagement/ClientManagement";

// Main App component
export default function App() {
  return (
    <Router>
      <div className="flex">
        <SidebarNav />
        <main className="bg-gray-100 flex-grow p-8">
          <Routes>
            <Route path="/" element={<ClientManagement />} />
            <Route path="/client-details" element={<ClientDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}