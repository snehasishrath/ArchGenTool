# Archway Studio

A browser-based architecture design studio for turning business requirements into provider-aware cloud solution ideas, deployment guidance, and design export assets.

> Repository name: ArchGenTool  
> Product name: Archway Studio

[![Node.js](https://img.shields.io/badge/Node.js-20%20%7C%2022-43853d)](https://nodejs.org/) [![Static App](https://img.shields.io/badge/Runtime-Static%20browser%20app-0d9488)](https://developer.mozilla.org/en-US/docs/Glossary/Static_web_page)

## Overview

Archway Studio helps teams define a workload, choose AWS, Azure, or Google Cloud, and review a layered architecture with:

- workload mapping and recommended service tiers
- security and resilience guidance
- deployment and operations considerations
- planning-level cost estimates
- architecture exports for documentation and review

This project is intentionally lightweight: the browser app runs without a bundle step, and the Node.js server is only used to serve the static files and provide a health check endpoint.

## Features

- AWS, Azure, and Google Cloud architecture recommendations for web, data, AI/ML, and IoT/event workloads
- Interactive architecture diagrams with draggable components, layer-to-layer moves, pan and zoom controls, provider-specific flows, and automatic connector updates
- Editable design names, layer names, service details, diagram summaries, and integrations, synchronized with SVG, draw.io, Markdown, and JSON exports
- Collapsible navigation, configuration, and insights panels with browser-local layout persistence across refreshes
- Deployment, security, resilience, scalability, and implementation guidance
- Browser-local templates, design drafts, appearance settings, and panel layout preferences
- Export options for SVG, PNG, JPG, Markdown, PDF, draw.io, and JSON
- Built-in architecture guidance from the project docs and release notes

## Quick start

### Local run

Requires Node.js 20 or 22.

```powershell
npm start
```

Then open:

- `http://localhost:8080`

The server respects the `PORT` environment variable and exposes a `/healthz` endpoint. You can also open `index.html` directly in a modern browser if you only want the static client.

### Azure App Service

Deploy the project root as a Linux Web App using Node.js 20 or 22.

1. Create a Linux App Service Web App.
2. Deploy the project contents, including `package.json`, `server.js`, `index.html`, `app.js`, `styles.css`, and `docs/`.
3. Set the startup command to `npm start` if App Service does not detect it automatically.
4. Ensure the app listens on `0.0.0.0` and the App Service-assigned `PORT`.
5. Verify the deployment using `https://<app-name>.azurewebsites.net/healthz`.

Example ZIP deployment with Azure CLI:

```powershell
Compress-Archive -Path * -DestinationPath ..\archway-deploy.zip -Force
az webapp deploy --resource-group <resource-group> --name <app-name> --src-path ..\archway-deploy.zip --type zip
```

## Security and usage notes

This tool is a planning aid, not a deployment engine or a production governance system.

- recommendations are indicative and must be validated against provider documentation, quotas, pricing, and workload tests
- browser-local design drafts and settings are not protected by server-side authentication or authorization
- do not store credentials, secrets, regulated data, or sensitive architecture details in the local demo
- Microsoft Entra ID sign-in requires a registered app, matching redirect URI, and an HTTPS or localhost origin

## Project structure

```text
.
├── app.js                # UI logic and architecture generation
├── index.html            # app shell and resources dialog
├── styles.css            # interface styling and layout
├── server.js             # static file server and health endpoint
├── package.json          # Node.js runtime metadata and scripts
├── RELEASE_NOTES.md      # changelog
├── LICENSE               # proprietary source license
├── README.md             # project overview and quick start
├── VERSION               # current app version
├── docs/
│   ├── ARCHITECTURE-STANDARDS.md
│   └── DECISION-RECORDS.md
└── ...
```

## Documentation and references

- [RELEASE_NOTES.md](./RELEASE_NOTES.md)
- [LICENSE](./LICENSE)
- [Architecture standards](./docs/ARCHITECTURE-STANDARDS.md)
- [Decision records](./docs/DECISION-RECORDS.md)

## License

This project is distributed under a proprietary source license. See [LICENSE](./LICENSE) for complete terms.

## Summary

Archway Studio is designed for fast architectural exploration and documentation, especially in early design discussions, planning reviews, and environment comparisons. It focuses on clarity, portability, and easy local use while keeping the implementation lightweight.
