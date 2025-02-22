from RealtimeSTT import AudioToTextRecorder

def transcribe():
    print("Wait until it says 'speak now'")
    recorder = AudioToTextRecorder()
    return recorder.text()
