import React, { useEffect, useState } from 'react';
import { Center, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import pfp from '../components/pfp.jpg'; // Replace with your image path
import './pulsingCircle.css'; // CSS for the pulsing effect

// Connect to the backend running on port 5100
const socket = io('http://localhost:5100');

function IBInterview() {
  const navigate = useNavigate();
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);

  useEffect(() => {
    // Listen for events from the backend
    socket.on("audio_started", () => {
      setAudioPlaying(true);
    });

    socket.on("audio_finished", () => {
      setAudioPlaying(false);
    });

    socket.on("interview_started", () => {
      setInterviewStarted(true);
    });

    socket.on("interview_ended", () => {
      setInterviewStarted(false);
    });

    // Cleanup listeners on component unmount
    return () => {
      socket.off("audio_started");
      socket.off("audio_finished");
      socket.off("interview_started");
      socket.off("interview_ended");
    };
  }, []);

  const startInterview = () => {
    socket.emit("start_interview");
  };

  const endInterview = () => {
    socket.emit("end_interview");
    navigate("/");
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      {/* Button in top right */}
      <div style={{ position: "absolute", top: "20px", right: "20px", zIndex: 2 }}>
        {!interviewStarted ? (
          <Button
            size="lg"
            radius="xl"
            variant="gradient"
            gradient={{ from: "#266181", to: "#58D3E3" }}
            onClick={startInterview}
          >
            Start Interview
          </Button>
        ) : (
          <Button
            size="lg"
            radius="xl"
            variant="gradient"
            gradient={{ from: "#266181", to: "#58D3E3" }}
            onClick={endInterview}
          >
            Finish Interview
          </Button>
        )}
      </div>
      
      {/* Main Content */}
      <Center style={{ height: "100%", flexDirection: "column" }}>
        {/* Profile picture with pulsing circle */}
        <div style={{ position: "relative", width: 200, height: 200, marginBottom: 40 }}>
          <div className={audioPlaying ? "pulsing-circle active" : "pulsing-circle"} />
          <img
            src={pfp}
            alt="Interviewer"
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              objectFit: "cover",
              position: "relative",
              zIndex: 1,
            }}
          />
        </div>
      </Center>
    </div>
  );
}

export default IBInterview;
