import React, { useState, useEffect } from 'react';
import supabase from './supabaseClient';

const SimilarDocumentsFinder = () => {
    const [latestTranscript, setLatestTranscript] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLatestTranscript = async () => {
            try {
                const { data, error } = await supabase
                    .from('transcriptions')
                    .select('text')
                    .order('created_at', { ascending: false })
                    .limit(1);

                if (error) {
                    console.error('Error fetching the latest transcript:', error);
                } else if (data.length > 0) {
                    setLatestTranscript(data[0].text);
                }
            } catch (err) {
                console.error('Error during fetching the latest transcript:', err);
            }
        };

        // fetchLatestTranscript();

        // Subscribe to changes in the 'transcriptions' table
        const subscription = supabase
            .channel('table-updates')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'transcriptions' },
                (payload) => {
                    console.log('New transcript added:', payload.new);
                    setLatestTranscript(payload.new.text);
                }
            )
            .subscribe();

        // Cleanup subscription on component unmount
        return () => {
            supabase.removeChannel(subscription);
        };
    }, []); // Run once when the component mounts

    useEffect(() => {
        const findSimilarDocuments = async () => {
            if (!latestTranscript) {
                console.warn('No latest transcript found');
                return;
            }

            setLoading(true);
            try {
                // Get the vector from the latest transcript
                const vector = await getEmbeddingFromText(latestTranscript);
                if (!vector) {
                    console.error('Failed to generate embedding');
                    setLoading(false);
                    return;
                }

                // Query Supabase using the generated vector
                const { data, error } = await supabase.rpc('vector_search', {
                    query_vector: vector,
                    top_k: 5 // Number of similar documents to retrieve
                });

                if (error) {
                    console.error('Error querying Supabase:', error);
                } else {
                    setResults(data);
                }
            } catch (err) {
                console.error('Error during search:', err);
            } finally {
                setLoading(false);
            }
        };

        // Only call findSimilarDocuments if latestTranscript is not empty
        if (latestTranscript) {
            findSimilarDocuments();
        }
    }, [latestTranscript]); // Run when latestTranscript changes

    const getEmbeddingFromText = async (text) => {
        try {
            const response = await fetch('https://api.openai.com/v1/embeddings', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'text-embedding-ada-002', // Replace with the appropriate embedding model
                    input: text
                })
            });
            const data = await response.json();
            return data.data[0].embedding;
        } catch (error) {
            console.error('Error generating embedding:', error);
            return null;
        }
    };

    return (
        <div>
            <h2>Latest Transcript: {latestTranscript}</h2>
            {loading ? (
                <p>Searching for similar documents...</p>
            ) : (
                results.length > 0 && (
                    <ul>
                        {results.map((doc, index) => (
                            <li key={index}>
                                <p><strong>ID:</strong> {doc.id}</p>
                                <p><strong>Metadata:</strong> {JSON.stringify(doc.metadata)}</p>
                            </li>
                        ))}
                    </ul>
                )
            )}
            {!loading && results.length === 0 && <p>No similar documents found yet.</p>}
        </div>
    );
};

export default SimilarDocumentsFinder;