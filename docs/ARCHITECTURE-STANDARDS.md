# Architecture standards and best practices

Use this guide as a review aid, not as a compliance determination or a substitute for current provider documentation, organizational policy, or qualified professional review.

## Review checklist

### Business and quality attributes

- State the business outcomes, users, trust boundaries, and critical journeys.
- Define measurable service-level objectives for availability, latency, throughput, and supportability.
- Capture workload shape, peak and growth assumptions, dependencies, and data classification.
- Agree recovery time objective (RTO), recovery point objective (RPO), and acceptable degradation.

### Security and identity

- Assign explicit service and user identities; apply least privilege and remove standing access where practical.
- Require appropriate authentication, authorization, and administrative access controls.
- Encrypt data in transit and at rest; protect secrets and keys with managed controls and rotation.
- Review public exposure, API protections, segmentation, egress, vulnerability management, audit logging, and threat scenarios.
- Define data retention, deletion, privacy, residency, and incident response requirements.

### Reliability and operations

- Map failure domains, quotas, service dependencies, and provider-region availability.
- Design backups and recovery copies; test restore and failover procedures against approved RTO/RPO.
- Instrument logs, metrics, traces, and audit events; define actionable alerts and operational ownership.
- Document deployment, rollback, patching, incident, and disaster-recovery procedures.
- Validate resilience through representative load, fault, and recovery exercises.

### Performance, scale, and cost

- Model normal, peak, and burst demand; load-test with representative data and client behavior.
- Size and scale stateless compute independently; protect stateful services with pooling, limits, and back-pressure.
- Review storage growth, retention, network egress, backup copies, observability, licensing, and support charges.
- Verify service quotas and regional availability; use the provider pricing calculator for current estimates.
- Tag resources and define budgets, cost owners, alerts, and periodic optimization reviews.

### Governance and delivery

- Use reusable patterns and policy-as-code where appropriate; document deviations and risk owners.
- Define data, network, identity, and operational ownership across teams and suppliers.
- Track assumptions, open questions, decisions, and review dates.
- Assess accessibility and maintainability for end users, operators, and administrators.
- Reassess the design when requirements, threats, provider capabilities, or cost assumptions change.

## Reference frameworks

Use the current versions and scopes relevant to your organization:

- [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html).
- [Azure Well-Architected Framework](https://learn.microsoft.com/azure/well-architected/).
- [Google Cloud Architecture Framework](https://cloud.google.com/architecture/framework).
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) and applicable NIST security guidance.
- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks) for relevant platforms and services.
- [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/) for application and API security.

These references are maintained by their respective publishers. Archway Studio is not affiliated with or endorsed by them. Mention of a framework does not imply certification, implementation, or compliance.

## Review outcome

Record the decision, accepted risks, required actions, accountable owners, and review date. Do not approve a production design until critical security, reliability, privacy, operational, and cost questions have owners and evidence.
