// ClientDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

type Client = {
  id: number;
  name: string;
  issue: string;
  location: string;
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
          .select('id, name, issue, location')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching client details:', error);
        } else {
          setClient(data);
        }
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  return client ? (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{client.name}</h1>
      <p className="text-lg">Issue: {client.issue}</p>
      <p className="text-lg">Location: {client.location}</p>
    </div>
  ) : (
    <p>Client not found</p>
  );
}