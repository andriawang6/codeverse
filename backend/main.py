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
import ib

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
    emit("update_code", {"code": current_code})  # Send the latest code on connection

@socketio.on('send_problem')
def handle_send_problem(problem_name):
    global random_question
    random_question = problem_name  # Update the random question based on frontend choice

@socketio.on("send_code")
def handle_code_submission(data):
    global current_code
    code = data.get("code")
    
    if code:
        current_code = code  # Update stored code
        print("Received code update:", code)
        emit("update_code", {"code": code}, broadcast=True)  # Broadcast to all clients

@socketio.on("start_interview")
def handle_start_interview(data):
    global interview_active
    interview_active = True
    if interview_active:
        if data == 'swe':
            main()
        else:
            ib.main()
        emit("interview_started", {"message": "Interview has started."}, broadcast=True)

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

def playsound_async(sound_file, event):
    playsound(sound_file)
    event.set()

def main():
    """Runs procedural logic in the main thread."""
    print("Starting AI logic loop...")

    sound_done = threading.Event()
    threading.Thread(target=playsound_async, args=(os.getenv('INTRO_PATH'), sound_done)).start()

    recorder = AudioToTextRecorder()
    initial_prompt = f"You're conducting a coding interview on the Leetcode question {random_question}. Output only ONE SENTENCE. This is extremely important: NEVER write code or prepend your role. Every response will be read aloud, so never include special characters like backticks or parenthesis. If the candidate says anything that can't reasonably be part of the topic material of the interview, guide the candidate back on track. Prompt them to describe their intended algorithm before asking them to code. If the user asks for time, acknowledge it and wait for them to continue. Check the initial section of the prompt labeled Code: for the user's code. At the very end, give the candidate feedback on their performance. Here's the past conversation history as well as the most recent code produced by the candidate."
    chat_history = initial_prompt
    chat = client.chats.create(model="gemini-2.0-flash")
    response = chat.send_message(initial_prompt)
    print(response.text)

    sound_done.wait()
    while interview_active:
        if not interview_active:
            break

        check_threads()
        code = ""

        socketio.emit("status_update", {"status": "Status 1"})

        speech = recorder.text()

        if not interview_active:
            break

        socketio.emit("status_update", {"status": "Status 2"})

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

        socketio.emit("status_update", {"status": "Status 3"})

        # Convert AI response to speech (if using TTS)
        text_to_speech(response.text)
        
    playsound(os.getenv('END_PATH'))  

def run_socketio():
    """Run the Flask-SocketIO server with the reloader disabled."""
    socketio.run(app, host="0.0.0.0", port=5100, debug=True, use_reloader=False)

if __name__ == "__main__":
    # Start the Flask-SocketIO server in a background thread
    run_socketio()
