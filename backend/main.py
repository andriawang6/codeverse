from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import threading
from RealtimeSTT import AudioToTextRecorder
import time
from google import genai
from tts import text_to_speech
import os
from dotenv import load_dotenv
from questions import choose_random_question
from playsound import playsound

load_dotenv()
client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])
socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173")

# Store the latest code
current_code = ""
random_question = ""
interview_active = True

@socketio.on("connect")
def handle_connect():
    print("Client connected")
    random_question = choose_random_question()
    emit("send_problem", random_question)
    emit("update_code", {"code": current_code})  # Send the latest code on connection

@socketio.on("send_code")
def handle_code_submission(data):
    global current_code
    code = data.get("code")
    
    if code:
        current_code = code  # Update stored code
        print("Received code update:", code)
        emit("update_code", {"code": code}, broadcast=True)  # Broadcast to all clients

@socketio.on("end_interview")
def handle_end_interview():
    global interview_active
    interview_active = False
    print("Interview ended by user")
    emit("interview_ended", {"message": "Interview has ended."}, broadcast=True)

def check_threads():
    print(f"Active threads: {threading.active_count()}")
    for thread in threading.enumerate():
        print(f"Thread: {thread.name}")

def main():
    """Runs procedural logic in the main thread."""
    print("Starting AI logic loop...")

    playsound(os.getenv('INTRO_PATH'))

    recorder = AudioToTextRecorder()
    initial_prompt = f"You’re conducting a LeetCode-style coding interview on the question {random_question}. Mimic a natural conversation, outputting ONLY ONE SENTENCE. NEVER prepend 'Interviewer: ' or anything similar to your response. Don’t walk the candidate through the question (only give simple hints, nothing that would give away the answer) and keep the response short. Make sure that you are working towards a logical ending point of the interview. If the candidate says anything that can't reasonably be part of the topic material of the interview, guide the candidate back on track. Unless the candidate is truly struggling, don't suggest specific data structures or algorithms. Just give very small hints as necessary. Only if a candidate gives an EXTREMELY vague description of their approach (i.e. just saying the name of a data structure), prompt them a few times to elaborate until they've described the algorithm that they intend to follow before asking them to code. At the very end, provide detailed feedback on the candidate’s performance. Here's the past conversation history as well as the most recent code produced by the candidate. Interviewer: Here’s the problem: Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order."
    chat_history = initial_prompt
    chat = client.chats.create(model="gemini-2.0-flash")
    response = chat.send_message(initial_prompt)
    print(response.text)

    while interview_active:
        if not interview_active:
            break

        check_threads()
        code = ""
        speech = recorder.text()

        if not interview_active:
            break

        chat_history += f"\nCandidate: {speech}"
        chat_history += f"\nCode: {current_code}"
        if not current_code:
            code = "No code written yet"
        else:
            code = current_code
        print("User said:", speech)
        print("Code:", current_code) 

        response = chat.send_message(f"Current Code: {code} \n {speech}")
        print("AI: ", response.text)
        chat_history += f"\nInterviewer: {response.text}"

        # Example: Call AI model (commented out if not needed)
        # response = call_gemini(speech)
        # print("AI Response:", response)

        if not interview_active:
            break
        # Convert AI response to speech (if using TTS)
        text_to_speech(response.text)
        
    playsound(os.getenv('END_PATH'))




def run_socketio():
    """Run the Flask-SocketIO server with the reloader disabled."""
    socketio.run(app, host="0.0.0.0", port=5100, debug=True, use_reloader=False)

if __name__ == "__main__":
    # Start the Flask-SocketIO server in a background thread
    socket_server_thread = threading.Thread(target=run_socketio, daemon=True)
    socket_server_thread.start()

    # Run the main logic in the main thread
    main()
