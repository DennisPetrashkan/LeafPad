from flask import Flask, jsonify, request
from openai import OpenAI
import pybase64

app = Flask(__name__)


@app.route('/', methods=['GET'])
def hello():
    return 'Hello, this is a GET request!'


@app.route('/transcript', methods=['POST'])
def process_audio():
    try:
        data = request.data
        print(data)
        client = OpenAI()

        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file = data
        )
        print(transcript)
    except Exception as e:
        print('Error:', str(e))
        return jsonify({'error': 'Internal Server Error'}), 500


if __name__ == '__main__':
    host = '0.0.0.0'
    port = 3001
    app.run(port=port, host=host, debug=False)
