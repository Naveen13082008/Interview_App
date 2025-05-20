import React, { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "./styles.css"; // Import CSS file

const InterviewApp = () => {
  const { transcript, listening } = useSpeechRecognition();
  const [response, setResponse] = useState("");

  // Placeholder function for AI-generated responses
  const getAIResponse = (question) => {
    setResponse(`AI-generated answer for: "${question}"`);
  };

  return (
    <div className="container">
      <h1 className="title">Interview App 🎤</h1>

      <button className="button" onClick={SpeechRecognition.startListening}>
        🎙️ Start Speaking
      </button>
      <button className="stopButton" onClick={SpeechRecognition.stopListening}>
        🛑 Stop
      </button>

      <p className="text">Your Question: {transcript}</p>

      <button className="button" onClick={() => getAIResponse(transcript)}>
        🔍 Generate AI Answer
      </button>
      
      <p className="response">{response}</p>
    </div>
  );
};

export default InterviewApp;