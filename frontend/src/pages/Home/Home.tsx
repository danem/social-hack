// App.tsx
import { SidebarNav } from "@components/SidebarNav/SidebarNav";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ClientDetails } from "../ClientDetails/ClientDetails";
import { ClientManagement } from "../ClientManagement/ClientManagement";

// Main App component
export function Home () {
  return (
    <div className="flex">
      <SidebarNav />
      <main className="bg-gray-100 flex-grow p-8">
        <ClientManagement/>
      </main>
    </div>
  );
};

export default Home;
