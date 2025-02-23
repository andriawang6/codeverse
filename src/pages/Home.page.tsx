import { Button, Container, Stack, Text, Center, Overlay } from "@mantine/core";
import { useNavigate } from "react-router-dom";

import bgImage from "../components/background.png";
import { io } from 'socket.io-client';

const socket = io("http://localhost:5100"); // Connect to Flask WebSocket server

export function HomePage() {
  const navigate = useNavigate();

  // Existing SWE interview start
  const handleStartInterview = () => {
    socket.emit("start_interview");
    navigate("/editor");
  };

  // New IB interview start
  const handleStartBankInterview = () => {
    socket.emit("start_bank_interview");
    navigate("/banking"); // This corresponds to your new Banking.tsx page
  };

  return (
    <div style={{
      position: "relative",
      height: "100vh",
      backgroundImage: `url(${bgImage})`,
      backgroundSize: "cover", // Ensures the image covers the screen
      backgroundPosition: "bottom",
    }}>
      <Overlay opacity={0.0} color="#000" zIndex={1} />
      <Center style={{
        height: "100vh",
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end", // Center content vertically
        alignItems: "right", // Center content horizontally
        padding: "0 20px", // Add some padding on the sides for smaller screens
      }}>
        <Container>
          <Stack 
            align="center" 
            style={{ marginTop: '-75%' }} // Add negative margin to move everything up
          >
            <Container><Text 
              size="lg" 
              c="gray.3" 
              style={{ maxWidth: 600, textAlign: "center" }}
            >
              AI mock interviewer for SWE and finance roles
            </Text>
            <Button
              size="lg"
              radius="xl"
              variant="gradient"
              gradient={{ from: "#FF4500 ", to: "#FF4500" }}
              onClick={handleStartInterview}
              style={{ marginTop: "15px", marginRight: "20px"}}
            >
              Start SWE Interview
            </Button>
            {/* New button for IB interviews */}
            <Button
              size="lg"
              radius="xl"
              variant="gradient"
              gradient={{ from: "#FF4500", to: "#FF4500" }}
              onClick={handleStartBankInterview}
              style={{ marginTop: "15px"}}
>
              Start IB Interview
            </Button>
            </Container>
          </Stack>
        </Container>
      </Center>
    </div>
  );
}
