from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from yapper import PiperSpeaker, PiperVoiceUS
from fastapi.middleware.cors import CORSMiddleware
import asyncio

#setup
#pip install yapper-tts
#pip install fastapi uvicorn yapper-tts

#to run
#uvicorn filename:app --reload

#pip install realtimetts[all]

#app = FastAPI()

# Initialize TTS Speaker
lessac = PiperSpeaker(voice=PiperVoiceUS.AMY)

def speak_text(text: str):
    lessac = PiperSpeaker(voice=PiperVoiceUS.HFC_FEMALE)
    lessac.say(text)

# Example usage
speak_text("Hello, how are you? I am your interviewer today. Take a minute and read the question.")
speak_text("The problem is two sum, do you have any questions?")

"""
# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeInput(BaseModel):
    code: str

@app.get("/")
async def root():
    return {"message": "FastAPI TTS server is running!"}

@app.post("/speak")
async def speak_text():
     #Speaks the introductory message when the React app loads
    try:
        await asyncio.to_thread(lessac.say, "Hello, I will be your interviewer. Here is your problem. Take a minute to read it over.")
        return {"message": "Intro spoken"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/process_code")
async def process_code(input_data: CodeInput):
    #Speaks out the typed code
    try:
        code_text = f"You have typed the following code: {input_data.code}"
        await asyncio.to_thread(lessac.say, code_text)
        return {"message": "Code spoken"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




def speak_text(text: str):
    lessac = PiperSpeaker(voice=PiperVoiceUS.HFC_FEMALE)
    lessac.say(text)

# Example usage
speak_text("Hello, how are you? I am your interviewer today. Take a minute and read the question.")
speak_text("The problem is two sum, do you have any questions?")
"""
