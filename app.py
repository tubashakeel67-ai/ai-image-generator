from flask import Flask, render_template, request, jsonify
from urllib.parse import quote

app = Flask(__name__)

POLLINATIONS_URL = "https://image.pollinations.ai/prompt/"


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/generate', methods=['POST'])
def generate():
    prompt = request.form.get('prompt')
    style = request.form.get('style')

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    # append the chosen style to the prompt so it influences the output
    full_prompt = f"{prompt}, {style}" if style else prompt

    # Pollinations builds the image directly from the URL — no API key needed
    image_url = POLLINATIONS_URL + quote(full_prompt)

    return jsonify({"image": image_url})


if __name__ == '__main__':
    app.run(debug=True)