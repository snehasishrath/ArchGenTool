# Architecture decision records

Decision records capture why a significant choice was made, alternatives considered, and consequences. The initial records below describe the Archway Studio tool itself. Add workload-specific records for individual production architectures.

## ADR-0001: Standalone browser-based workspace

- **Status:** Accepted
- **Date:** 2026-10-25

### Context

The studio should be straightforward to run and usable without a hosted backend or package build.

### Decision

Keep the application client-side and dependency-light. Persist drafts, templates, and settings in the current browser.

### Consequences

- The app is easy to run and can export portable design files.
- It has no server-side authorization, account isolation, shared workspace, or encrypted persistence.
- Local demo sign-in is not an access-control boundary; sensitive information must not be stored here.

## ADR-0002: Provider-aware architecture recommendations

- **Status:** Accepted
- **Date:** 2026-10-25

### Context

Users need comparable starting points across the three major cloud providers and common workload patterns.

### Decision

Generate provider-specific building blocks for AWS, Azure, and Google Cloud based on the selected workload and deployment options.

### Consequences

- Component names and recommendations are tailored to the selected provider.
- The recommendations are planning guidance, not validated deployment manifests or guarantees.
- Service availability, regional support, security, SKUs, quotas, and prices require current provider and engineering review.

## ADR-0003: SVG diagram source with portable exports

- **Status:** Accepted
- **Date:** 2026-10-25

### Context

Designs should remain clear in the browser and be portable to common documentation and diagram workflows.

### Decision

Render diagrams as SVG and provide SVG, PNG, JPG, Markdown, print-to-PDF, editable draw.io, and JSON exports from the current design state.

### Consequences

- Vector output remains scalable and draw.io output can be edited.
- Raster images are convenient for presentations; print-to-PDF depends on browser print support.
- Exported estimates and design details retain their planning-only status.

## ADR-0004: Node.js static hosting for Azure App Service

- **Status:** Accepted
- **Date:** 2026-10-25

### Context

The standalone browser application needs a supported Node.js entry point to run as a Linux Web App on Azure App Service.

### Decision

Use a dependency-free Node.js HTTP server. Bind to the `PORT` assigned by App Service, serve only an explicit allowlist of application and documentation files, and expose `/healthz` for health probes.

### Consequences

- The same client-side app can be deployed without a build step or runtime package dependencies.
- The server does not add authentication, authorization, tenant isolation, APIs for shared designs, or server-side persistence.
- Keep the static file allowlist synchronized with files that the app intentionally exposes.

## New decision template

```text
# ADR-NNNN: Decision title
Status: Proposed | Accepted | Rejected | Superseded
Date: YYYY-MM-DD
Decision owners:

## Context
Problem, constraints, requirements, and decision drivers.

## Decision
Chosen approach and rationale.

## Alternatives considered
Options, trade-offs, and reasons rejected.

## Consequences
Benefits, costs, risks, follow-up actions, and accountable owners.

## Review triggers
Events or dates that should reopen this decision.
```
