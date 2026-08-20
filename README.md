# AI Image Generator Web Application

A full-stack AI image generation web application built with Flask and Pollinations.ai. Features a clean, custom-designed interface where users describe a scene in text and receive an AI-generated image, with support for multiple art styles, image history, and dark mode.

---

## Project Description

This project is an AI-powered image generator where users type a text prompt, choose an optional art style and aspect ratio, and receive a generated image in real time. Generated images are saved locally in the browser, so users can revisit, reuse prompts from, or download past generations at any time without needing an account.

---

## Screenshots

Project screenshots (light mode, dark mode, generated result, and full gallery view) are available in the [`screenshots/`](screenshots) folder of this repository.

---

## Features

### Core Features
- Attractive, custom-designed UI
- Text prompt input with real-time AI image generation
- Image preview section
- One-click download of the generated image
- Loading animation while an image is being generated

### Image Options
- Multiple art styles (Realistic, Anime, Oil Painting, Cartoon, Cyberpunk, Watercolor)
- Aspect ratio selection (Square, Portrait, Landscape)
- "Surprise me" random prompt generator
- Regenerate button to retry the same prompt for a new result

### History and Gallery
- Recent generations saved locally in the browser ("Contact Sheet")
- Full gallery view in a modal, showing complete history
- Click any past image to reload it along with its original prompt
- Delete individual images from history, or clear all history at once

### UI/UX
- Dark mode toggle, with the preference saved across visits
- Smooth scroll to the result after each generation
- Toast notifications for actions like downloads
- Generate button and input are disabled while a request is in progress, preventing duplicate submissions
- Custom favicon

### Error Handling
- Empty prompt validation
- Network failure handling
- Image generation failure handling, with a clear error message instead of a crash

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, Flask |
| Image Generation | Pollinations.ai (free, no API key required) |
| Frontend | HTML, CSS, JavaScript (vanilla, no framework) |
| Storage | Browser localStorage (history and gallery) |
| Fonts | Fraunces + Inter (Google Fonts) |

---

## Project Structure

```
ai-image-generator/
├── app.py                 # Flask routes and application logic
├── requirements.txt        # Python dependencies
├── .gitignore
├── screenshots/             # UI screenshots
├── templates/
│   └── index.html           # Main page
└── static/
    ├── css/
    │   └── style.css         # Styling (light/dark themes, responsive layout)
    └── js/
        └── script.js          # Frontend logic (DOM manipulation, API calls, history)
```

---

## Setup and Installation (Run Locally)

### Prerequisites
- Python 3.10 or later

### Steps

1. Clone the repository
   ```bash
   git clone https://github.com/tubashakeel67-ai/ai-image-generator.git
   cd ai-image-generator
   ```

2. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```

3. Run the app
   ```bash
   python app.py
   ```

4. Open in browser
   ```
   http://127.0.0.1:5000
   ```

No API key or environment configuration is needed — Pollinations.ai is used without authentication, keeping setup to just the steps above.

---

## What I Learned

The original plan was to use Google's Gemini 2.5 Flash Image API, but its free tier was found to require a linked billing account. The project was switched to Pollinations.ai, a genuinely free, no-key API, to stay within the project's cost constraints without compromising on functionality. This was a useful exercise in adapting a technical plan mid-build based on real-world API limitations.

Image history and gallery are intentionally stored in the browser's `localStorage` rather than a shared database — each user's history is private to their own browser, with no server-side storage of generated content.

---

## Future Improvements

- User authentication for cross-device history sync
- Server-side image history using a database
- Batch image generation (multiple results per prompt)
- Live deployment

---

## Author

**Tuba Shakeel**
GitHub: [tubashakeel67-ai](https://github.com/tubashakeel67-ai)
LinkedIn: [Tuba Shakeel](https://www.linkedin.com/in/tuba-shakeel-459091310)