import React, { useState, useRef, useEffect } from 'react';
import './../styles/MockInterview.css';

const MockInterview = () => {
  const [role, setRole] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [interviewProgress, setInterviewProgress] = useState({});
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  // Load saved progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('interviewProgress');
    if (savedProgress) {
      setInterviewProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress when it changes
  useEffect(() => {
    if (Object.keys(interviewProgress).length > 0) {
      localStorage.setItem('interviewProgress', JSON.stringify(interviewProgress));
    }
  }, [interviewProgress]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/interview/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      setQuestions(data.questions || []);
      setCurrentQuestionIndex(0);
      setFeedback(null);
      setTranscript('');
      
      // Initialize progress tracking for this role
      const newProgress = {};
      data.questions.forEach((q, index) => {
        newProgress[index] = { attempted: false, score: null, feedback: null };
      });
      setInterviewProgress({ ...newProgress, role });
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Failed to fetch interview questions. Please try again.");
    }
  };

  const startRecording = async () => {
    try {
      setRecording(true);
      setFeedback(null);
      setTranscript('');

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
      };

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Error starting recording:", error);
      setRecording(false);
      alert("Failed to access microphone. Please check permissions and try again.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      
      // Stop all tracks on the stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setRecording(false);
  };

  const sendAudioForEvaluation = async () => {
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append('audio', audioBlob, 'response.wav');
    formData.append('question', questions[currentQuestionIndex]);
    // Add role context to help with evaluation
    formData.append('role', role);

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/interview/evaluate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      setTranscript(data.transcript || '');
      
      // Update with structured feedback
      const feedbackData = data.feedback || {
        score: 0,
        strengths: ["No strengths identified"],
        areas_to_improve: ["No specific feedback available"],
        example_answer: "No example answer available"
      };
      
      setFeedback(feedbackData);
      
      // Update progress
      setInterviewProgress(prev => ({
        ...prev,
        [currentQuestionIndex]: {
          attempted: true,
          score: feedbackData.score,
          feedback: feedbackData
        }
      }));
      
    } catch (error) {
      console.error("Error evaluating response:", error);
      setFeedback({
        score: 0,
        strengths: [],
        areas_to_improve: ["Error: Couldn't evaluate your answer. Please try again."],
        example_answer: ""
      });
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setTranscript('');
    setFeedback(null);
    setAudioBlob(null);
  };

  const resetInterview = () => {
    setQuestions([]);
    setRole('');
    setCurrentQuestionIndex(0);
    setFeedback(null);
    setTranscript('');
    setAudioBlob(null);
    setInterviewProgress({});
    localStorage.removeItem('interviewProgress');
  };

  const renderFeedbackScore = (score) => {
    const scoreColors = {
      1: "red",
      2: "orange",
      3: "yellow",
      4: "lightgreen",
      5: "green"
    };
    
    return (
      <div className="score-display">
        <h4>Score: {score}/5</h4>
        <div className="score-bar">
          {[1, 2, 3, 4, 5].map(num => (
            <div 
              key={num}
              className="score-segment"
              style={{
                backgroundColor: num <= score ? scoreColors[num] : "#e0e0e0",
                width: "20px",
                height: "20px",
                margin: "0 2px",
                display: "inline-block"
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    if (!questions.length) return null;
    
    const questionsAttempted = Object.values(interviewProgress)
      .filter(q => typeof q === 'object' && q.attempted)
      .length;
      
    const averageScore = Object.values(interviewProgress)
      .filter(q => typeof q === 'object' && q.score)
      .reduce((sum, q) => sum + q.score, 0) / questionsAttempted || 0;
    
    return (
      <div className="interview-summary">
        <h3>Interview Progress</h3>
        <p>Role: {role}</p>
        <p>Questions attempted: {questionsAttempted} of {questions.length}</p>
        <p>Average score: {averageScore.toFixed(1)}/5</p>
        
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{
              width: `${(questionsAttempted / questions.length) * 100}%`,
              backgroundColor: averageScore > 3 ? "green" : "orange",
              height: "10px"
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="mock-interview-container">
      <h2>AI-Powered Mock Interview</h2>

      {!questions.length ? (
        <div className="role-select">
          <label>Enter the role you're applying for:</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Software Engineer"
          />
          <button onClick={fetchQuestions} disabled={!role}>
            Start Interview
          </button>
        </div>
      ) : (
        <>
          {renderSummary()}
          
          <div className="interview-question-block">
            <h3>Question {currentQuestionIndex + 1} of {questions.length}</h3>
            <p className="question-text">{questions[currentQuestionIndex]}</p>

            {!recording && !audioBlob && (
              <button 
                className="record-button"
                onClick={startRecording}>
                🎙️ Start Recording
              </button>
            )}

            {recording && (
              <button 
                className="stop-button"
                onClick={stopRecording}>
                ⏹️ Stop Recording
              </button>
            )}

            {audioBlob && !loading && !feedback && (
              <div className="audio-preview">
                <audio 
                  ref={audioRef}
                  controls 
                  src={URL.createObjectURL(audioBlob)}>
                </audio>
                <div className="button-group">
                  <button onClick={() => setAudioBlob(null)}>Re-record</button>
                  <button onClick={sendAudioForEvaluation}>📤 Submit Answer</button>
                </div>
              </div>
            )}

            {loading && (
              <div className="loading">
                <p>Analyzing your answer...</p>
                <div className="spinner"></div>
              </div>
            )}

            {transcript && (
              <div className="result-section transcript-section">
                <h4>📝 Transcript:</h4>
                <p>{transcript}</p>
              </div>
            )}

            {feedback && (
              <div className="result-section feedback-section">
                <h4>💬 Feedback:</h4>
                
                {renderFeedbackScore(feedback.score)}
                
                <div className="feedback-details">
                  <div className="strengths">
                    <h5>✅ Strengths:</h5>
                    <ul>
                      {feedback.strengths.map((strength, i) => (
                        <li key={i}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="improvements">
                    <h5>🔍 Areas to Improve:</h5>
                    <ul>
                      {feedback.areas_to_improve.map((area, i) => (
                        <li key={i}>{area}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {feedback.example_answer && (
                    <div className="example-answer">
                      <h5>💡 Example Strong Answer:</h5>
                      <p>{feedback.example_answer}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="navigation-buttons">
              {currentQuestionIndex < questions.length - 1 && feedback && (
                <button onClick={nextQuestion}>➡️ Next Question</button>
              )}
              
              {currentQuestionIndex === questions.length - 1 && feedback && (
                <div className="completion-message">
                  <p>✅ You have completed the mock interview. Great job!</p>
                  <button onClick={resetInterview}>Start New Interview</button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MockInterview;