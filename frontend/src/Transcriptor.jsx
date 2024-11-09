import React, { useState } from 'react';
import axios from 'axios';

const transcribeAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm'); // Use .webm or another supported format
    formData.append('model', 'whisper-1');    

    try {
        console.log('Audio Blob:', audioBlob);
        const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
            headers: {
                'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Transcription:', response.data.text);
        return response.data.text;
    } catch (error) {
        console.error('Error transcribing audio:', error);
        if (error.response) {
            console.error('Error details:', error.response.data);
        }
    }
};


const Transcriptor = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);

    const handleRecordButtonClick = async () => {
        if (!isRecording) {
            // Start recording
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const options = { mimeType: 'audio/webm' }; // Ensure the format is supported
                const recorder = new MediaRecorder(stream, options);
                setMediaRecorder(recorder);
    
                let audioChunks = [];
                recorder.ondataavailable = (event) => {
                    audioChunks.push(event.data);
                };
    
                recorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    console.log('Audio Blob:', audioBlob);
                    await transcribeAudio(audioBlob);
                };
    
                recorder.start();
                setIsRecording(true);
            } catch (error) {
                console.error('Error accessing microphone:', error);
            }
        } else {
            // Stop recording
            if (mediaRecorder) {
                mediaRecorder.stop();
                setIsRecording(false);
            }
        }
    };
    

    return (
        <div>
            <button onClick={handleRecordButtonClick}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
        </div>
    );
};

export default Transcriptor;