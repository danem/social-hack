// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarNav } from "@components/SidebarNav/SidebarNav";
import { ClientDetails } from "../ClientDetails/ClientDetails";
import { ClientManagement } from "../ClientManagement/ClientManagement";
import { embedText, testActionItems, queryDocuments } from "../../models/documents";


// Main App component
export default function App() {
  testActionItems().then(console.log);
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