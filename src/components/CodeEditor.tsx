import React, { useState, useEffect } from "react";
import { Select, Container, Title, Stack, Group, Switch, useMantineColorScheme } from "@mantine/core";
import Editor from "@monaco-editor/react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5100"); // Connect to Flask WebSocket server

const languageOptions = [
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
];

const CodeEditor = () => {
  const [language, setLanguage] = useState("python");
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const monacoTheme = colorScheme === "dark" ? "vs-dark" : "vs";
  const [code, setCode] = useState("// Start coding here!");

  useEffect(() => {
    // Listen for real-time code updates from the backend
    socket.on("update_code", (data) => {
      setCode(data.code);
    });

    return () => {
      socket.off("update_code");
    };
  }, []);

  // Emit code updates in real-time as the user types
  const handleCodeChange = (newValue: string | undefined) => {
    setCode(newValue || "");
    socket.emit("send_code", { code: newValue });
  };

  return (
    <Container fluid style={{ height: "100vh", padding: 0 }}>
      <Stack style={{ height: "100%", justifyContent: "space-between" }}>
        {/* Header and Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
          <Title order={2}>CrackIt</Title>

          {/* Controls: Language Selector & Dark Mode Toggle */}
          <Group>
            <Select
              label="Select Language"
              placeholder="Choose a language"
              data={languageOptions}
              value={language}
              onChange={(value) => setLanguage(value || "javascript")}
              style={{ width: 150 }}
            />
            <Switch
              label="Dark Mode"
              checked={colorScheme === "dark"}
              onChange={toggleColorScheme}
            />
          </Group>
        </div>

        {/* Monaco Editor */}
        <Editor
          height="calc(100vh - 80px)"
          language={language}
          value={code}
          onChange={handleCodeChange} // Send updates in real-time
          theme={monacoTheme}
          options={{
            lineNumbers: "on",
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
          }}
        />
      </Stack>
    </Container>
  );
};

export default CodeEditor;
