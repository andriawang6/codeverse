from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import threading
from RealtimeSTT import AudioToTextRecorder
import time

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])
socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173")

# Store the latest code
current_code = "// Start coding here!"

@socketio.on("connect")
def handle_connect():
    print("Client connected")
    emit("update_code", {"code": current_code})  # Send the latest code on connection

@socketio.on("send_code")
def handle_code_submission(data):
    global current_code
    code = data.get("code")
    
    if code:
        current_code = code  # Update stored code
        print("Received code update:", code)
        emit("update_code", {"code": code}, broadcast=True)  # Broadcast to all clients

def check_threads():
    print(f"Active threads: {threading.active_count()}")
    for thread in threading.enumerate():
        print(f"Thread: {thread.name}")

def main():
    """Runs procedural logic in the main thread."""
    print("Starting AI logic loop...")
    recorder = AudioToTextRecorder()
    initial_prompt = "You are a technical interviewer conducting a LeetCode-style coding interview. The question you asked is Two Sum. Your responses must mimic the natural flow of a live technical interview by outputting only one line per turn. You should not walk the candidate through the question (only give simple hints, nothing that would give away the answer) and keep the response SHORT (around 1-3 sentences MAXIMUM). It is possible that some words may appear nonsensical or out of place due to transcription issues. In this scenario, do your best to phonetically interpret the text in the context of this prompt. Otherwise, if there are unclear portions, ask the interviewee to repeat their statement. This is very important: do not add any responses from the candidate. Only add one additional response as the interviewer. You should start out with basic introductions (no behavioral questions), and then provide the question. Don't introduce the problem, simply say that you will paste it in for the candidate to work with. NEVER prepend 'Interviewer: ' or anything similar to your answers. Make sure that you are working towards a logical ending point of the interview. If the candidate says anything that can't reasonably be part of the topic material of the interview, guide the candidate back on track. Unless the candidate is truly struggling, don't suggest specific data structures or algorithms. Just give very small hints as necessary. Only if a candidate gives an EXTREMELY vague description of their approach (i.e. just saying the name of a data structure), prompt them a few times to elaborate until they've described the algorithm that they intend to follow before asking them to code. Here's the past conversation history as well as what the candidate says next. I've appended the most recent code the candidate has produced immediately after this statement."
    chat_history = initial_prompt

    while True:
        check_threads()
        speech = recorder.text()
        chat_history += f"\nCandidate: {speech}"
        chat_history += f"\nCode: {current_code}"
        print("User said:", speech)
        print("Code:", current_code) 


        # Example: Call AI model (commented out if not needed)
        # response = call_gemini(speech)
        # print("AI Response:", response)

        # Example: Convert AI response to speech (if using TTS)
        # text_to_speech(response)
        
        time.sleep(1)  # To avoid busy-waiting

def run_socketio():
    """Run the Flask-SocketIO server with the reloader disabled."""
    socketio.run(app, host="0.0.0.0", port=5100, debug=True, use_reloader=False)

if __name__ == "__main__":
    # Start the Flask-SocketIO server in a background thread
    socket_server_thread = threading.Thread(target=run_socketio, daemon=True)
    socket_server_thread.start()

    # Run the main logic in the main thread
    main()
