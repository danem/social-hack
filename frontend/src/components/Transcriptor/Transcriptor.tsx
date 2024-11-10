import React, { useState, useRef } from 'react';
import { supabase } from '@utils/supabaseClient';

export default function Transcriptor() {
    const [transcription, setTranscription] = useState<string>('');
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const startRecording = async () => {
        try {
            setIsRecording(true);

            // Get access to the microphone
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            let chunks: Blob[] = [];

            // Collect audio data chunks
            mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            // Handle stopping and sending audio data
            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(chunks, { type: 'audio/webm' });
                chunks = [];

                // Convert Blob to a File to send to the API
                const audioFile = new File([audioBlob], 'audio.webm', {
                    type: 'audio/webm',
                });

                // Create FormData to send the audio file
                const formData = new FormData();
                formData.append('file', audioFile);
                formData.append('model', 'whisper-1');

                try {
                    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
                        },
                        body: formData
                    });

                    const result = await response.json();
                    const text = result.text || 'Transcription failed';
                    setTranscription(text);

                    // Save the transcription to Supabase
                    const { data, error } = await supabase
                        .from('transcriptions')
                        .insert([{ text }]); // Insert the transcription into the 'transcriptions' table

                    if (error) {
                        console.error('Error saving to Supabase:', error);
                    } else {
                        console.log('Transcription saved to Supabase:', data);
                    }
                } catch (error) {
                    console.error('Error during transcription:', error);
                    setTranscription('Error during transcription');
                }
            };

            mediaRecorderRef.current.start();
        } catch (error) {
            console.error('Error accessing the microphone:', error);
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <div>
            <h1>Live Transcription with OpenAI Whisper</h1>
            <button onClick={startRecording} disabled={isRecording}>Start Recording</button>
            <button onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>
            <p>{isRecording ? 'Recording...' : 'Recording stopped.'}</p>
            <p>Transcription: {transcription}</p>
        </div>
    );
}
