# Codeverse  

Codeverse is an AI-powered technical interviewer designed to simulate software engineering and financial interview scenarios. It provides real-time, interactive feedback on both coding and communication skills, helping users prepare for high-stakes technical interviews.  

## Features  

- **Live AI-Powered Interview Simulation** – Receive real-time feedback on code efficiency, problem-solving strategies, and communication clarity.  
- **Speech-to-Text Processing** – Converts spoken thoughts into text to analyze reasoning.  
- **Dynamic AI Responses** – Asks follow-up and clarification questions, provides hints, and offers structured feedback.  
- **Real-Time Code Evaluation** – Supports multi-language syntax highlighting and execution.  
- **Seamless Audio & Code Integration** – Uses Gemini API and Google Cloud TTS for natural, responsive conversation.  

## Tech Stack  

- **Frontend**: TypeScript, Mantine 
- **Backend**: Flask, Gemini API, Google Cloud TTS, Python  
- **Real-Time Communication**: Socket.io, Multithreading for fast response handling  

## Setup Instructions  
1. **Install dependencies**
   ```sh
   pip install -r backend/requirements.txt
   npm install 
2. **Run the backend**
   ```sh
   cd backend
   python main.py
3. **Run the fronend**
   ```sh
   npm run dev

# Future Improvements
- Personalized learning paths based on interview performance- Additional problem categories (quant, data science, cybersecurity)
- Enhanced analytics for tracking progress over time
