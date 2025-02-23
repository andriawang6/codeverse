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
from playsound import playsound

load_dotenv()
client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])
socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173")

interview_active = True

@socketio.on("connect")
def handle_connect():
    print("Client connected")
    # For this interview, we send a fixed prompt title
    prompt = "Investment Banking Interview"
    emit("send_problem", prompt)

@socketio.on("start_interview")
def handle_start_interview():
    global interview_active
    if interview_active:
        return
    interview_active = True
    threading.Thread(target=main).start()
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
    """Runs procedural logic for the investment banking interview."""
    print("Starting AI logic loop...")

    # Play intro sound asynchronously
    sound_done = threading.Event()
    threading.Thread(target=playsound_async, args=(os.getenv('FINANCE_PATH'), sound_done)).start()

    recorder = AudioToTextRecorder()
    initial_prompt = (
        "You're conducting an investment banking interview. Output only ONE SENTENCE. "
        "This is extremely important: NEVER include any spreadsheets, financial models, or prepend your role. "
        "Every response will be read aloud, so never include special characters like backticks, parentheses, or brackets. "
        "If the candidate says anything that isn't directly relevant to investment banking, gently guide them back on track. "
        "Prompt them to describe their intended financial approach or valuation methodology before asking for any detailed calculations. "
        "If the candidate asks for time, acknowledge it and wait for them to continue. At the very end, give the candidate feedback on their performance. "
        "Here's the past conversation history."
    )
    chat_history = initial_prompt
    chat = client.chats.create(model="gemini-2.0-flash")
    response = chat.send_message(initial_prompt)
    print("AI initial response:", response.text)

    sound_done.wait()  # Wait until the intro sound finishes
    text_to_speech(response.text)

    while interview_active:
        check_threads()
        # Listen to candidate's speech input
        speech = recorder.text()

        if not interview_active:
            break

        chat_history += f"\nCandidate: {speech}"
        print("Candidate said:", speech)

        response = chat.send_message(speech)
        print("AI response:", response.text)
        chat_history += f"\nInterviewer: {response.text}"

        if not interview_active:
            break

        # Notify frontend that audio is starting
        socketio.emit("audio_started")
        text_to_speech(response.text)
        # Notify frontend that audio has finished
        socketio.emit("audio_finished")

    # Play end sound when the interview loop is complete
    playsound(os.getenv('END_PATH'))

def run_socketio():
    """Run the Flask-SocketIO server."""
    socketio.run(app, host="0.0.0.0", port=5100, debug=True, use_reloader=False)

if __name__ == "__main__":
    run_socketio()
