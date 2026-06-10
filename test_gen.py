import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv("backend/.env")
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

try:
    model = genai.GenerativeModel("gemini-flash-latest")
    res = model.generate_content("Say hi")
    print("SUCCESS:", res.text)
except Exception as e:
    print("ERROR:", e)
