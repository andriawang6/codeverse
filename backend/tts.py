from google.cloud import texttospeech
import sounddevice as sd
import numpy as np
import threading

client = texttospeech.TextToSpeechClient(client_options={"api_endpoint": "us-central1-texttospeech.googleapis.com"})

def synthesize_speech(text):
    synthesis_input = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(language_code="en-US", name="en-US-Chirp-HD-O")
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.LINEAR16, sample_rate_hertz=24000)

    response = client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)
    return np.frombuffer(response.audio_content, dtype=np.int16)

def split_text(text, max_chars=100):
    words = text.split()
    chunks, current_chunk = [], ""

    for word in words:
        if len(current_chunk) + len(word) + 1 < max_chars:
            current_chunk += word + " "
        else:
            chunks.append(current_chunk.strip())
            current_chunk = word + " "
    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks

def worker(text_chunk, index, results, lock):
    audio_data = synthesize_speech(text_chunk)
    with lock:
        results[index] = audio_data

def text_to_speech(text):
    text_chunks = split_text(text)
    results = [None] * len(text_chunks)  # Fixed-size list
    lock = threading.Lock()
    threads = []

    for i, chunk in enumerate(text_chunks):
        thread = threading.Thread(target=worker, args=(chunk, i, results, lock))
        thread.start()
        threads.append(thread)

    for thread in threads:
        thread.join()

    full_audio = np.concatenate([audio for audio in results if audio is not None])

    with sd.OutputStream(samplerate=24000, channels=1, dtype='int16') as stream:
        stream.write(full_audio)