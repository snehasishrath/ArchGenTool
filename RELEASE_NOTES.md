# Release notes

## 1.1.0 — 2026-10-25

### Added

- Dependency-free Node.js static server compatible with Azure App Service Linux Node.js 20/22.
- App Service `PORT` binding, static file allowlist, `/healthz` health endpoint, and deployment instructions.

### Security and deployment notes

- App Service deployment serves the same client-side application; it does not add server-side authentication, authorization, account isolation, or shared persistence.
- ZIP deployments should include only application and documentation files; do not publish secrets or local workspace/user data.

## 1.0.0 — 2026-10-25

First documented Archway Studio release.

### Added

- AWS, Azure, and Google Cloud architecture generation for web, data, AI/ML, and IoT/event workloads.
- Editable architecture components, cloud service recommendations, network boundaries, connections, and integrations.
- Technical deployment specifications, security controls, resilience considerations, planning cost estimates, and implementation guidance.
- Browser-local templates, draft persistence, theme settings, and optional Microsoft Entra ID sign-in configuration.
- SVG, PNG, JPG, Markdown, print-to-PDF, editable draw.io, and JSON exports.
- Project version display, proprietary license terms, architecture standards guidance, and architecture decision records.

### Limitations

- Designs and estimates are planning aids; validate them with cloud providers and qualified engineering, security, operations, and governance reviewers.
- The local demo is not an identity system or access-control boundary. Data remains in browser storage.
- PDF export opens the browser print dialog; choose **Save as PDF** to create a PDF file.
