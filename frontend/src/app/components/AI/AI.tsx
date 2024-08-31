"use client";

import "./AI.css"
import React, { useState, useEffect } from 'react';

interface AIProps {
  question: string;
}

const AI: React.FC<AIProps> = ({ question }) => {
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAIResponse = async () => {
      try {
        const res = await fetch('https://meta-predict-8mjb.vercel.app/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: question }),
        });

        const data = await res.json();

        if (res.ok) {
          setResponse(data.result);
        } else {
          setError(data.error || 'An error occurred while processing your request.');
        }
      } catch (err) {
        setError('Failed to reach the server.');
      }
    };

    fetchAIResponse();
  }, [question]);

  return (
    <div className="ai-response">
      <h3>AI Response:</h3>
      {error ? <p style={{ color: 'red' }}>{error}</p> : <pre>{response}</pre>}
    </div>
  );
};

export default AI;
