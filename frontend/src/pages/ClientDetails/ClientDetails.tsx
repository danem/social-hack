import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@utils/supabaseClient';
import { SidebarNav } from '@components/SidebarNav/SidebarNav';
import { Checklist } from '../Checklist/Checklist';
import { fetchLatestTranscript, getActionItems, queryDocuments } from '../../models/documents';
import { LegalDraft } from '../LegalDraft/LegalDraft';

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
  location: string;
  assigned_to: string;
  created_on: string;
  created_by: string;
  urgency: string;
  petition_worthy: boolean;
  damages_estimate: string;
  notes: string;
  timeline: TimelineEvent[];
  checklist: ChecklistItem[];
};

type Document = {
  id: string;
  metadata?: {
    file_name?: string;
    section_summary?: string;
  };
  similarity?: number;
};

export function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionChecklist, setActionChecklist] = useState<ChecklistItem[]>([]);
  const [isChecklistLoading, setIsChecklistLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Intake Process');
  const [relatedDocuments, setRelatedDocuments] = useState<Document[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [latestTranscript, setLatestTranscript] = useState<string | null>(null);
  const [transcriptLoading, setTranscriptLoading] = useState(true);

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
            if (typeof data.timeline === 'string') {
              const sanitizedTimeline = data.timeline.replace(/'/g, '"');
              timelineData = JSON.parse(sanitizedTimeline);
            } else {
              timelineData = data.timeline || [];
            }
          } catch (parseError) {
            console.error('Error parsing timeline:', parseError);
            timelineData = [];
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

    const generateChecklistFromTranscript = async () => {
      try {
        const transcript = await fetchLatestTranscript();
        console.log('transcript', transcript);
        setLatestTranscript(transcript || 'No recent transcript available');
        setTranscriptLoading(false);

        if (transcript) {
          const actionItems = await getActionItems(transcript);
          console.log('action items', actionItems);
          const formattedChecklist = actionItems.map((item: { task: string }, index: number) => ({
            id: index + 1,
            title: item.task,
            completed: false,
          }));
          setActionChecklist(formattedChecklist);

          // Query documents based on the transcript for the "Notes" tab
          const documents = await queryDocuments(transcript);
          console.log("documents", documents);
          if (documents) {
            setRelatedDocuments(documents);
          }
        }
      } catch (err) {
        console.error('Error generating checklist or querying documents:', err);
      } finally {
        setIsChecklistLoading(false);
        setDocumentsLoading(false);
      }
    };

    fetchClient();
    generateChecklistFromTranscript();
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
          <section className="mt-6">
                  {isChecklistLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                      <p className="ml-4 text-lg">Generating checklist...</p>
                    </div>
                  ) : (
                    <Checklist items={actionChecklist.length > 0 ? actionChecklist : client.checklist} />
                  )}
          </section>

          {/* Tabs Section */}
          <section className="mt-6">
            <nav className="border-b border-gray-300 mb-4">
              <ul className="flex space-x-4">
                {['Intake Process', 'Notes', 'Communications', 'Files', 'Legal Draft'].map(tab => (
                  <li
                    key={tab}
                    className={`cursor-pointer ${activeTab === tab ? 'text-orange-600 font-semibold' : 'text-gray-600'}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </li>
                ))}
              </ul>
            </nav>
            
            <div>
              {activeTab === 'Intake Process' && (
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
              )}
              {activeTab === 'Notes' && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Related Documents</h3>
                  {documentsLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                      <p className="ml-4 text-lg">Fetching related documents...</p>
                    </div>
                  ) : (
                    relatedDocuments.length > 0 ? (
                      <ul className="space-y-4">
                        {relatedDocuments.map((doc, index) => (
                          <li key={index} className="p-4 border border-gray-300 rounded-lg shadow-sm">
                            <h4 className="text-md font-bold">
                              {doc.metadata?.file_name || 'Untitled Document'}
                            </h4>
                            <p>
                              {doc.metadata?.section_summary || 'No summary available'}
                            </p>
                            <p className="text-sm text-gray-500">
                              Similarity Score: {doc.similarity ? doc.similarity.toFixed(2) : 'N/A'}
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No related documents found.</p>
                    )
                  )}
                </div>
              )}
              {activeTab === 'Communications' && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Latest Transcript</h3>
                  {transcriptLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                      <p className="ml-4 text-lg">Fetching latest transcript...</p>
                    </div>
                  ) : (
                    <p>{latestTranscript}</p>
                  )}
                </div>
              )}
              {activeTab === 'Files' && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Uploaded Files</h3>
                  <p>Files related to the case...</p>
                </div>
              )}
              {activeTab === 'Legal Draft' && (
                <LegalDraft 
                  clientName={client?.name || 'Unknown Client'} 
                  clientLocation={client?.location || 'Unknown Location'}
                />
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  ) : (
    <div className="flex justify-center items-center h-full"><p className="text-lg">Client not found</p></div>
  );
}
