from flask import Flask, request, jsonify
import whisper
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Create a folder to temporarily store uploaded audio
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load Whisper model once at startup
model = whisper.load_model("base")

@app.route('/api/interview/transcribe', methods=['POST'])
def transcribe_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']
    filename = secure_filename(audio_file.filename)
    audio_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    audio_file.save(audio_path)

    try:
        result = model.transcribe(audio_path)
        os.remove(audio_path)  # Cleanup temp file

        return jsonify({
            'transcription': result['text'],
            'segments': result['segments'],
            'language': result['language']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
