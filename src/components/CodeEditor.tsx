import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { IconAlertCircle } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
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
import { problemDescriptions, ProblemKey } from './Problems'

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
  const [problemName, setProblemName] = useState(''); // New state to store the problem text
  const [showProblemBox, setShowProblemBox] = useState(false); // State to control visibility of the box
  const [interviewActive, setInterviewActive] = useState(true);

  type MessageStatus = {
    message: string;
    color: string;
  };
  const messageStatus: Record<string, MessageStatus> = {
    'Status 0': { message: 'AI Speaking.', color: '#6171C1' },
    'Status 1': { message: 'Speak now.', color: '#00FF00' },
    'Status 2': { message: 'AI Thinking.', color: '#FFA500' },
    'Status 3': { message: 'AI Speaking.', color: '#BF40BF' },
  };
  const [status, setStatus] = useState('Status 0');

  // type ProblemKey =
  //   | 'Two Sum'
  //   | 'Reverse Linked List'
  //   | 'Merge Sorted Arrays'
  //   | 'Longest Substring Without Repeating Characters'
  //   | 'Palindrome Check'
  //   | 'Max Profit from Stock Prices';
  // const problemDescriptions: Record<ProblemKey, string> = {
  //   'Two Sum':
  //     'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
  //   'Reverse Linked List':
  //     'Given the head of a singly linked list, reverse the list and return its new head.',
  //   'Merge Sorted Arrays': 'Given two sorted arrays, merge them into one sorted array.',
  //   'Longest Substring Without Repeating Characters':
  //     'Given a string s, find the length of the longest substring without repeating characters.',
  //   'Palindrome Check': 'Given an string x, return true if x is a palindrome, and false otherwise.',
  //   'Max Profit from Stock Prices':
  //     'You are given an array prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit you can achieve by buying and selling at different days.',
  // };
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

  useEffect(() => {
    socket.on('status_update', (data) => {
      if (data.status) {
        setStatus(data.status);
      }
    });

    return () => {
      socket.off('status_update');
    };
  }, []);

  useEffect(() => {
    // Get a random problem from the available problem keys
    const randomProblemKey = Object.keys(problemDescriptions)[
      Math.floor(Math.random() * Object.keys(problemDescriptions).length)
    ] as ProblemKey;

    // Set the problem text and send the problem name to the backend
    setProblemName(randomProblemKey);
    setProblemText(problemDescriptions[randomProblemKey]);

    // Emit the selected problem to the backend
    socket.emit('send_problem', randomProblemKey);
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
          backgroundColor: '#2D3F93', // Corrected color
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
            <Link to="/">
              <img src={logo} alt="Logo" style={{ height: '40px' }} />
            </Link>
          </Group>

          {/* Centered Title */}
          <Title style={{ color: '#FFFFFF' }} order={1}>
            codeverse
          </Title>
        </Group>
      </Box>

      {/* Main Layout - Two Columns */}
      <Grid grow gutter="xs">
        {/* Left Column - Problem Description */}
        <Grid.Col span={4}>
          <Container style={{ paddingTop: '20px' }}>
            <Title
              order={2}
              size="h2"
              style={{
                fontFamily: 'Verdana, sans-serif',
                fontWeight: '600',
                fontSize: '25px',
                color: '#FFFFFF',
                lineHeight: '1.5',
                marginBottom: '10px',
              }}
            >
              {problemName}
            </Title>
            <Text
              size="xl"
              style={{
                fontFamily: 'Verdana, sans-serif',
                color: '#FFFFFF',
                fontSize: '15px',
                lineHeight: '1.5',
                whiteSpace: 'pre-line', 
              }}
            >
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

                <Group>
                  <IconAlertCircle
                    size={24}
                    color={messageStatus[status]?.color}
                    style={{ marginRight: '10px' }}
                  />
                  <Text size="lg" style={{ color: messageStatus[status]?.color }}>
                    {messageStatus[status]?.message}
                  </Text>
                </Group>

                <Button
                  size="lg"
                  radius="xl"
                  variant="gradient"
                  gradient={{ from: '#2D3F93', to: '#1E3A8A' }}
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
