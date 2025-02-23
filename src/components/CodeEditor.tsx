import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
  Box,
  Button,
  Container,
  Grid,
  Group,
  Select,
  Stack,
  Switch,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import logo from '../components/image.png';

const socket = io('http://localhost:5100'); // Connect to Flask WebSocket server

const languageOptions = [
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
];

const CodeEditor = () => {
  const [language, setLanguage] = useState('python');
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const monacoTheme = colorScheme === 'dark' ? 'vs-dark' : 'vs';
  const [code, setCode] = useState<string>('');
  const [problemText, setProblemText] = useState(''); // New state to store the problem text
  const [showProblemBox, setShowProblemBox] = useState(false); // State to control visibility of the box
  const [interviewActive, setInterviewActive] = useState(true);

  type ProblemKey =
    | 'Two Sum'
    | 'Reverse Linked List'
    | 'Merge Sorted Arrays'
    | 'Longest Substring Without Repeating Characters'
    | 'Palindrome Check'
    | 'Max Profit from Stock Prices';
  const problemDescriptions: Record<ProblemKey, string> = {
    'Two Sum':
      'Solve this: Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
    'Reverse Linked List':
      'Solve this: Given the head of a singly linked list, reverse the list and return its new head.',
    'Merge Sorted Arrays': 'Solve this: Given two sorted arrays, merge them into one sorted array.',
    'Longest Substring Without Repeating Characters':
      'Solve this: Given a string s, find the length of the longest substring without repeating characters.',
    'Palindrome Check':
      'Solve this: Given a string x, return true if x is a palindrome, and false otherwise.',
    'Max Profit from Stock Prices':
      'Solve this: You are given an array prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit you can achieve by buying and selling at different days.',
  };
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for real-time code updates from the backend
    socket.on('update_code', (data) => {
      setCode(data.code);
    });

    return () => {
      socket.off('update_code');
    };
  }, []);

  {
    /*useEffect(() => {
    const randomProblem = problems[Math.floor(Math.random() * problems.length)];
    setProblemText(randomProblem);
  }, []);*/
  }

  useEffect(() => {
    socket.on('send_problem', (problemName: ProblemKey) => {
      if (problemDescriptions[problemName]) {
        setProblemText(problemDescriptions[problemName]);
      } else {
        setProblemText('Problem description not found.');
      }
    });

    return () => {
      socket.off('send_problem');
    };
  }, []);

  // Emit code updates in real-time as the user types
  const handleCodeChange = (newValue: string | undefined) => {
    setCode(newValue || '');
    socket.emit('send_code', { code: newValue });
  };

  const endInterview = () => {
    socket.emit('end_interview');
    setInterviewActive(false);
    navigate('/');
  };

  return (
    <Container fluid>
      {/* Title Section - Full Width */}

      <Box
        style={{
          width: '100%',
          padding: '5px',
          backgroundColor: '#000000', // Corrected color
          borderBottom: '2px solid #ddd',
          marginBottom: '10px',
          color: 'gray',
        }}
      >
        <Group
          align="center"
          style={{
            width: '100%',
            justifyContent: 'center',
            paddingLeft: '20px',
            paddingRight: '20px',
          }}
        >
          {/* Left Side: Logo & Dropdown */}
          <Group>
            <img src={logo} alt="Logo" style={{ height: '40px' }} /> {/* Adjust path & size */}
          </Group>

          {/* Centered Title */}
          <Title style={{ color: '#89CFF0' }} order={1}>
            CrackIt
          </Title>
        </Group>
      </Box>

      {/* Main Layout - Two Columns */}
      <Grid grow gutter="xs">
        {/* Left Column - Problem Description */}
        <Grid.Col span={4}>
          <Container style={{ paddingTop: '20px' }}>
            <Title order={2} size="h2">
              Problem Statement
            </Title>
            <Text size="xl" mt="10px">
              {problemText}
            </Text>
          </Container>
        </Grid.Col>

        {/* Right Column - Code Editor */}
        <Grid.Col span={8}>
          <Container fluid style={{ height: '100vh', padding: 0 }}>
            <Stack style={{ height: '100%', justifyContent: 'space-between' }}>
              {/* Controls: Language Selector & Dark Mode Toggle */}
              <Group style={{ justifyContent: 'space-between', padding: '10px' }}>
                <Switch
                  label="Dark Mode"
                  checked={colorScheme === 'dark'}
                  onChange={toggleColorScheme}
                />
                <Select
                  label="Select Language"
                  placeholder="Choose a language"
                  data={languageOptions}
                  value={language}
                  onChange={(value) => setLanguage(value || 'javascript')}
                  style={{ width: 150 }}
                />
                {/*<Select
                  label="Difficulty"
                  data={["Easy", "Medium", "Hard"]}
                  placeholder="Select difficulty"
                  style={{ width: 150 }}
                />*/}
                <Button
                  size="lg"
                  radius="xl"
                  variant="gradient"
                  gradient={{ from: '#266181', to: '#58D3E3' }}
                  onClick={endInterview}
                  disabled={!interviewActive}
                >
                  Finish
                </Button>
              </Group>

              {/* Monaco Editor */}
              <div
                className="monaco-editor-wrapper"
                style={{ borderTop: '4px solid #888078', paddingTop: '5px' }}
              >
                <Editor
                  height="calc(100vh - 80px)"
                  language={language}
                  value={`//Type your solution here`}
                  onChange={handleCodeChange}
                  theme={monacoTheme}
                  options={{
                    lineNumbers: 'on',
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>
            </Stack>
          </Container>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default CodeEditor;
