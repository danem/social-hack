// ClientDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { SidebarNav } from '@components/SidebarNav/SidebarNav';
import { Checklist } from '../Checklist/Checklist';

type TimelineEvent = {
  type: string;
  description: string;
  date: string;
};

type ChecklistItem = {
  id: number;
  title: string;
  completed: boolean;
};

type Client = {
  id: number;
  name: string;
  issue: string;
  assigned_to: string;
  created_on: string;
  created_by: string;
  urgency: string;
  petition_worthy: boolean;
  damages_estimate: string;
  notes: string;
  timeline: TimelineEvent[]; // Now treated as a structured array
  checklist: ChecklistItem[];
};

export function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      if (id) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching client details:', error);
        } else {
          let timelineData;

          try {
            // Attempt to parse 'timeline' string to JSON
            if (typeof data.timeline === 'string') {
              // Replace single quotes with double quotes and parse
              const sanitizedTimeline = data.timeline.replace(/'/g, '"');
              timelineData = JSON.parse(sanitizedTimeline);
            } else {
              timelineData = data.timeline || [];
            }
          } catch (parseError) {
            console.error('Error parsing timeline:', parseError);
            timelineData = []; // Fallback to an empty array if parsing fails
          }

          setClient({
            ...data,
            timeline: timelineData,
            checklist: Array.isArray(data.checklist) ? data.checklist : []
          });
        }
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-full"><p className="text-lg">Loading...</p></div>;

  return client ? (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-grow p-8">
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          {/* Header */}
          <h1 className="text-3xl font-bold mb-4">{client.name} - {client.issue}</h1>
          
          {/* Case Details */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Case Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p><span className="font-medium">Status:</span> Newly Added</p>
                <p><span className="font-medium">Assigned To:</span> {client.assigned_to}</p>
                <p><span className="font-medium">Created On:</span> {client.created_on}</p>
                <p><span className="font-medium">Created By:</span> {client.created_by}</p>
              </div>
              <div className="space-y-2">
                <p><span className="font-medium">Urgency:</span> {client.urgency}</p>
                <p><span className="font-medium">Petition-Worthy:</span> {client.petition_worthy ? 'Yes' : 'No'}</p>
                <p><span className="font-medium">Damages (est):</span> {client.damages_estimate}</p>
              </div>
            </div>
          </section>

          {/* Checklist Section */}
          <section className="mt-6">
            <Checklist items={client.checklist} />
          </section>

          {/* Generate Legal Draft Section */}
          <section className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Generate Legal Draft</h2>
            <p className="text-gray-600 mb-2">Optional: for a customized legal draft, upload similar petitions or legal documents.</p>
            <div className="flex items-center space-x-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium">Generate</button>
              <input type="file" className="border border-gray-300 rounded-lg p-2" />
            </div>
          </section>

          {/* Tabs Section */}
          <section className="mt-6">
            <nav className="border-b border-gray-300 mb-4">
              <ul className="flex space-x-4">
                <li className="text-orange-600 font-semibold">Intake Process</li>
                <li className="text-gray-600">Notes</li>
                <li className="text-gray-600">Communications</li>
                <li className="text-gray-600">Files</li>
                <li className="text-gray-600">Legal Draft</li>
              </ul>
            </nav>
            <div>
              <h3 className="text-lg font-semibold mb-2">Initial Consultation</h3>
              <p>{client.notes}</p>
            </div>
          </section>

          {/* Timeline */}
          <section className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Timeline</h2>
            <ul className="space-y-4">
              {client.timeline.map((event, index) => (
                <li key={index} className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium">{event.type}</p>
                  <p>{event.description}</p>
                  <p className="text-sm text-gray-500">{event.date}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  ) : (
    <div className="flex justify-center items-center h-full"><p className="text-lg">Client not found</p></div>
  );
}