import React, { useState, useRef } from 'react';
import { supabase } from '@utils/supabaseClient';

export default function Transcriptor() {
    const [transcription, setTranscription] = useState<string>('');
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const startRecording = async () => {
        try {
            setIsRecording(true);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            let chunks: Blob[] = [];
            mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(chunks, { type: 'audio/webm' });
                chunks = [];
                const audioFile = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });

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

                    const { data, error } = await supabase
                        .from('transcriptions')
                        .insert([{ text }]);

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
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h1 className="text-2xl font-semibold text-center mb-4">Live Transcription with OpenAI Whisper</h1>
            <div className="flex justify-center space-x-4 mb-6">
                <button
                    onClick={startRecording}
                    disabled={isRecording}
                    className={`px-4 py-2 rounded-lg font-medium ${
                        isRecording ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                >
                    Start Recording
                </button>
                <button
                    onClick={stopRecording}
                    disabled={!isRecording}
                    className={`px-4 py-2 rounded-lg font-medium ${
                        !isRecording ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                >
                    Stop Recording
                </button>
            </div>
            <p className="text-center mb-4">
                {isRecording ? (
                    <span className="text-yellow-600 font-medium">Recording...</span>
                ) : (
                    <span className="text-gray-600">Recording stopped.</span>
                )}
            </p>
            <div className="p-4 border rounded-lg bg-gray-100 text-gray-800">
                <h2 className="font-semibold mb-2">Transcription:</h2>
                <p className="whitespace-pre-wrap">{transcription || 'No transcription available yet.'}</p>
            </div>
        </div>
    );
}