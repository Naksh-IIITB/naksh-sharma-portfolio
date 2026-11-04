# Naksh Sharma — Portfolio

A compact, responsive portfolio built with plain HTML, CSS and JavaScript. Featured project cards are authored in `index.html`; `app.js` handles the searchable GitHub repository list and the browser-side Huffman algorithm demonstration.

The project descriptions are based on repository documentation. SafeCross links to its source repository, and the prompt-guard card distinguishes the contribution fork from its upstream repository. The Huffman panel implements byte-frequency tree construction, encoding and decoding in the browser; it does not claim to produce the repository's packed file format.

## Run locally

Serve this directory with any static file server:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. The site has no package dependencies or build step. When `repositories.json` is absent locally, the repository index falls back to GitHub's unauthenticated public API. If both sources are unavailable, featured project content remains usable.

## Deployment and repository data

`.github/workflows/pages.yml` publishes the repository root to GitHub Pages on pushes to `main` and on manual runs. Before deployment, it uses the workflow's short-lived GitHub token to build a JSON snapshot of the account's public repositories. The token is used only by the action and is never included in the deployed JavaScript or JSON. The site uses this snapshot first and falls back to the public API when no snapshot is available.

In repository **Settings → Pages**, select **GitHub Actions** as the deployment source if Pages has not been enabled.

## Updating content

- Edit the six statically authored cards and profile sections in `index.html`.
- Add repository descriptions, display names and categories in `REPOSITORY_NOTES` in `app.js`.
- The résumé PDF is served from `assets/Naksh_Sharma_Resume.pdf`; update the email, phone and LinkedIn links in the Contact section of `index.html` when those details change.
- The social preview is `assets/social-preview.jpg`; its editable vector source is `assets/social-preview.svg`.
