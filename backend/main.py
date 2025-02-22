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

    while True:
        check_threads()
        speech = recorder.text()
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
