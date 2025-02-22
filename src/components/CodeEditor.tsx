import React, { useState, useEffect } from "react";
import { Select, Container, Title, Stack, Group, Switch, useMantineColorScheme } from "@mantine/core";
import Editor from "@monaco-editor/react";

const languageOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
  { value: "typescript", label: "TypeScript" },
];

const CodeEditor = () => {
  const [language, setLanguage] = useState("javascript");
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const monacoTheme = colorScheme === "dark" ? "vs-dark" : "vs";

  const [code, setCode] = useState("// Start coding here!"); // Store editor content

  // Effect to read the code every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Editor Content:", code); // Auto-logs the editor's content every 10 sec
    }, 10000); // 10,000ms = 10 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [code]); // Runs whenever `code` changes

  return (
    <Container fluid style={{ height: "100vh", padding: 0 }}>
      <Stack style={{ height: "100%", justifyContent: "space-between" }}>
        {/* Header and Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
          <Title order={2}>AI Coding Interview Practice</Title>

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
          height="calc(100vh - 80px)"  // Full screen minus the header height
          language={language}
          value={code} // Bind editor to state
          onChange={(value) => setCode(value || "")} // Update state when user types
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
