import React, { useState } from "react";
import "./styles.css";

const App = () => {
  const [text, setText] = useState("");
  const [response, setResponse] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  let recognition;
  let timer;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser. Try Chrome!");
      return;
    }

    recognition = new SpeechRecognition();
    setRecordingTime(0);
    setIsRecording(true);

    timer = setInterval(() => {
      setRecordingTime(prevTime => prevTime + 1);
    }, 1000);

    recognition.onresult = async (event) => {
      stopListening(); // Stop recording when result is received

      const userQuestion = event.results[0][0].transcript;
      setText(userQuestion);

      console.log("User question:", userQuestion);

      // Instantly fetch and display answer
      const answer = await fetchAnswerFromGoogle(userQuestion);
      console.log("Fetched answer:", answer);
      setResponse(answer);
    };

    recognition.start();
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    clearInterval(timer);
    setIsRecording(false);
  };

  const fetchAnswerFromGoogle = async (query) => {
    const apiKey = "AIzaSyDMxp3E6XqoYGxbVRBLbroJ3bS59zJ-Ywg"; 
    const searchEngineId = "549f6cd653c5f45d0"; 
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        return ["No relevant answer found."];
      }

      return data.items.slice(0, 6).map(item => item.snippet);
    } catch (error) {
      console.error("Error fetching data:", error);
      return ["Error retrieving answer."];
    }
  };

  return (
    <div className="app-container">
      <h1>Make a Vioce and Get Your Answer</h1>

      <div className="flex-container">
        <div className="left-section">
          <button onClick={startListening} className="round-btn">
            🎙️
          </button>
          {isRecording && <p className="timer">⏳ {formatTime(recordingTime)}</p>}
          {isRecording && (
            <button onClick={stopListening} className="stop-btn">🛑</button>
          )}
        </div>

        {/* Divider Line */}
        <div className="divider"></div>

        <div className="right-section">
          {text && <h2>Question: {text}</h2>}
          <div className="grid-container">
            {response.map((answer, index) => (
              <div key={index} className="grid-item">{answer}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;