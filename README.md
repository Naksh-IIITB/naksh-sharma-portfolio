# Naksh Sharma — Portfolio

A lightweight personal portfolio built with plain HTML, CSS, and JavaScript. The selected-work section gives a curated introduction to projects; the repository index loads public repositories directly from GitHub's unauthenticated API.

## Run locally

Open `index.html` in a browser, or serve the project directory with any static file server. For example:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

No build step, dependencies, API token, or secret is required. GitHub's public API is rate-limited for unauthenticated requests, so repository loading can pause temporarily if the public limit is reached; featured projects remain visible.

## Deploy

The included GitHub Actions workflow publishes the repository root to GitHub Pages on pushes to `main` and on manual runs. In the repository's **Settings → Pages**, choose **GitHub Actions** as the build and deployment source if Pages has not been enabled yet.

The site uses the public account endpoint at `https://api.github.com/users/Naksh-IIITB/repos`. Project notes in the selected-work section are curated locally; update `FEATURED` in `app.js` to adjust them.
