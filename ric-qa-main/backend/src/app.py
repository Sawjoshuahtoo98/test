from flask import Flask, request
from os import getenv
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
from src.predefined_chat import get_default_chat_history
import sys

# load environment variables
load_dotenv()

app = Flask(__name__)

# setup CORS headers
CORS(app)

# setup Gemini model
genai.configure(api_key=getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

@app.route('/api/v1')
def hello_world():
    return {'message': 'Hello, World!'}

default_chat_history = get_default_chat_history()
global_chat_history = {}

@app.route('/api/v1/generate-answer', methods=['POST'])
def generate_answer():
    try:
      client = request.args.get('client')

      if client not in global_chat_history:
          global_chat_history[client] = model.start_chat(history=default_chat_history)

      data = request.get_json()
      question = data['question']

      answer = global_chat_history[client].send_message(question,
                                                        generation_config=genai.types.GenerationConfig(
                                                        candidate_count=1,
                                                        max_output_tokens=25000,
                                                        temperature=1.0))
      return {'answer': answer.text}
    except Exception as e:
      # print to stderr
      sys.stderr.write(str(e) + '\n')
      sys.stderr.flush()
      return {'answer': 'Sorry, I couldn\'t answer the question'}
    except:
      return {'answer': 'Sorry, I couldn\'t answer the question'}

app.debug = False
if __name__ == '__main__': app.run(host='127.0.0.1')
