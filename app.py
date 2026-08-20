from flask import Flask, render_template, request, jsonify
from urllib.parse import quote

app = Flask(__name__)

POLLINATIONS_URL = "https://image.pollinations.ai/prompt/"

RATIO_DIMENSIONS = {
    "square": (1024, 1024),
    "portrait": (768, 1024),
    "landscape": (1024, 768),
}


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/generate', methods=['POST'])
def generate():
    prompt = request.form.get('prompt')
    style = request.form.get('style')
    ratio = request.form.get('ratio', 'square')

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    # append the chosen style to the prompt so it influences the output
    full_prompt = f"{prompt}, {style}" if style else prompt

    width, height = RATIO_DIMENSIONS.get(ratio, RATIO_DIMENSIONS["square"])

    # Pollinations builds the image directly from the URL — no API key needed
    image_url = f"{POLLINATIONS_URL}{quote(full_prompt)}?width={width}&height={height}"

    return jsonify({"image": image_url})


if __name__ == '__main__':
    # debug=True is for local development only — turn off before deploying
    app.run(debug=True)