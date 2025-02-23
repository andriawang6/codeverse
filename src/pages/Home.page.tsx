import { Button, Container, Stack, Text, Title, Center, Overlay } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import bgImage from "../components/abstract_blue_tech.jpg";
import { io } from 'socket.io-client';

const socket = io('http://localhost:5100'); // Connect to Flask WebSocket server

export function HomePage() {
  const navigate = useNavigate();

  const handleStartInterview = () => {
    socket.emit("start_interview");
    navigate("/editor");
  }

  return (
    <div style={{
      position: "relative",
      height: "100vh",
      backgroundImage: `url(${bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}>
      <Overlay opacity={0.6} color="#000" zIndex={1} />
      <Center style={{ height: "100vh", position: "relative", zIndex: 2 }}>
        <Container>
          <Stack align="center">
            <Title order={1} size={60} fw={700} style={{ color: "white" }}>
              CrackIt
            </Title>
            <Text size="lg" c="gray.3" style={{ maxWidth: 600 }}>
              AI mock interviewer for technical roles
            </Text>
            <Button size="lg" radius="xl" variant="gradient" gradient={{ from: "#266181", to: "#58D3E3" }} onClick={handleStartInterview}> 
              Start Interview
            </Button>
          </Stack>
        </Container>
      </Center>
    </div>
  );
}