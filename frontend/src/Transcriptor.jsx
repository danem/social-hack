import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

// Initialize Supabase client
const supabase = createClient(process.env.REACT_APP_SUPA_URL, process.env.REACT_APP_ANON_API_KEY);

const Transcriptor = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [text, setText] = useState('');
    let recognizer;

    useEffect(() => {
        // Subscribe to the 'transcriptions' table for real-time updates
        const channel = supabase
            .channel('transcriptions')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transcriptions' }, (payload) => {
                setText((prev) => prev + payload.new.text + ' ');
            })
            .subscribe();

        // Cleanup subscription on component unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleRecordButtonClick = () => {
        if (!isRecording) {
            // Start recording and transcribing with Azure
            try {
                const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.REACT_APP_AZURE_API_KEY, 'eastus'); // Replace 'eastus' with your region
                speechConfig.speechRecognitionLanguage = 'en-US'; // Set the language
                const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
                recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

                // Handle real-time transcription
                recognizer.recognizing = (s, e) => {
                    setText((prev) => prev + e.result.text + ' ');
                };

                recognizer.recognized = async (s, e) => {
                    if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
                        console.log('Recognized:', e.result.text);

                        // Save recognized text to Supabase
                        await supabase.from('transcriptions').insert([{ text: e.result.text }]);
                    }
                };

                recognizer.canceled = (s, e) => {
                    console.error('Recognition canceled:', e.reason);
                    recognizer.stopContinuousRecognitionAsync();
                    setIsRecording(false);
                };

                recognizer.sessionStopped = (s, e) => {
                    console.log('Session stopped.');
                    recognizer.stopContinuousRecognitionAsync();
                    setIsRecording(false);
                };

                recognizer.startContinuousRecognitionAsync();
                setIsRecording(true);
                setText('Recording in progress...');
            } catch (error) {
                console.error('Error starting Azure Speech service:', error);
                setText('Error starting Azure Speech service.');
            }
        } else {
            // Stop recording
            if (recognizer) {
                recognizer.stopContinuousRecognitionAsync(() => {
                    console.log('Stopped recording.');
                    setIsRecording(false);
                    setText('Recording stopped.');
                });
            }
        }
    };

    return (
        <div>
            <button onClick={handleRecordButtonClick}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            <p>{text}</p>
        </div>
    );
};

export default Transcriptor;