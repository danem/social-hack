// App.tsx or main routing file
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClientManagement } from '../ClientManagement/ClientManagement';
import { ClientDetails } from '../ClientDetails/ClientDetails';
import { SidebarNav } from '@components/SidebarNav/SidebarNav';
import Transcriptor from '@components/Transcriptor/Transcriptor';

export default function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <SidebarNav />
        <main className="bg-gray-100 flex-grow p-8 overflow-y-scroll">
          <Routes>
            <Route path="/" element={<ClientManagement />} />
            <Route path="/client/:id" element={<ClientDetails />} />
            <Route path="/voice" element={<Transcriptor />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}