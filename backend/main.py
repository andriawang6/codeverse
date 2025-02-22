from stt import transcribe

def main():
    #gemini for introducing prompt
    while True:
        stt = transcribe()
        print(stt)
        #get code editor
        #call geminin
        #call tts

if __name__ == '__main__':
    main()