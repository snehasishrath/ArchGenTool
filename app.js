(() => {
  "use strict";

  const appVersion = "1.1.0";
  const storageKey = "archway-studio-current-design";
  const authSessionKey = "archway-studio-auth-session";
  const entraConfigKey = "archway-studio-entra-config";
  const themeStorageKey = "archway-studio-theme";
  const msalScriptUrl = "https://cdn.jsdelivr.net/npm/@azure/msal-browser@5.26.0/lib/msal-browser.min.js";
  const providers = {
    AWS: {
      mark: "A",
      markClass: "aws",
      regions: [["us-east-1", "US East (N. Virginia)"], ["us-west-2", "US West (Oregon)"], ["eu-west-1", "Europe (Ireland)"], ["ap-southeast-1", "Asia Pacific (Singapore)"]],
      components: {
        web: { edge: ["CloudFront CDN", "Global content delivery"], identity: ["AWS WAF + Shield", "Managed protection at the edge"], compute: ["ECS on Fargate", "Autoscaling container services"], data: ["Aurora PostgreSQL", "Multi-AZ relational database"], cache: ["ElastiCache Redis", "Low-latency session and cache layer"], events: ["Amazon EventBridge", "Decoupled business events"], storage: ["Amazon S3", "Durable object and asset storage"], observe: ["CloudWatch + X-Ray", "Logs, metrics, traces and alerting"] },
        data: { edge: ["CloudFront CDN", "Secure delivery for data applications"], identity: ["AWS WAF + Shield", "Managed protection at the edge"], compute: ["AWS Glue + Lambda", "Serverless ingestion and transforms"], data: ["Amazon Redshift", "Managed warehouse for analytics"], cache: ["ElastiCache Redis", "Cache frequently read metadata"], events: ["Amazon Kinesis", "Streaming data ingestion"], storage: ["Amazon S3 + Lake Formation", "Governed object storage and data lake"], observe: ["CloudWatch + CloudTrail", "Pipeline health and audit history"] },
        ai: { edge: ["CloudFront CDN", "Secure delivery for models and results"], identity: ["AWS WAF + Shield", "Managed protection at the edge"], compute: ["Amazon SageMaker", "Managed model training and inference"], data: ["Aurora PostgreSQL", "Transactional metadata store"], cache: ["ElastiCache Redis", "Low-latency prediction cache"], events: ["Amazon EventBridge", "Decoupled inference workflows"], storage: ["Amazon S3", "Versioned datasets and model artifacts"], observe: ["CloudWatch + SageMaker Model Monitor", "Service and model health"] },
        iot: { edge: ["AWS IoT Core", "Secure device connectivity"], identity: ["AWS WAF + Shield", "Managed edge and API protection"], compute: ["AWS Lambda", "Elastic event processing"], data: ["Amazon Timestream", "Purpose-built time-series store"], cache: ["ElastiCache Redis", "Hot device state cache"], events: ["Amazon Kinesis", "High-volume telemetry stream"], storage: ["Amazon S3", "Low-cost long-term telemetry"], observe: ["CloudWatch + IoT Device Defender", "Fleet and service health"] }
      }
    },
    Azure: {
      mark: "⊞",
      markClass: "azure",
      regions: [["eastus", "East US"], ["westus2", "West US 2"], ["westeurope", "West Europe"], ["southeastasia", "Southeast Asia"]],
      components: {
        web: { edge: ["Azure Front Door", "Global content delivery"], identity: ["Azure WAF + DDoS", "Managed protection at the edge"], compute: ["Azure Container Apps", "Autoscaling container services"], data: ["Azure Database for PostgreSQL", "Zone-redundant relational database"], cache: ["Azure Managed Redis", "Low-latency session and cache layer"], events: ["Azure Event Grid", "Decoupled business events"], storage: ["Azure Blob Storage", "Durable object and asset storage"], observe: ["Azure Monitor + App Insights", "Logs, metrics, traces and alerting"] },
        data: { edge: ["Azure Front Door", "Secure delivery for data applications"], identity: ["Azure WAF + DDoS", "Managed protection at the edge"], compute: ["Azure Data Factory", "Managed ingestion and transforms"], data: ["Azure Synapse Analytics", "Managed analytics warehouse"], cache: ["Azure Managed Redis", "Cache frequently read metadata"], events: ["Azure Event Hubs", "Streaming data ingestion"], storage: ["ADLS Gen2 + Purview", "Governed object storage and data lake"], observe: ["Azure Monitor + Activity Log", "Pipeline health and audit history"] },
        ai: { edge: ["Azure Front Door", "Secure delivery for models and results"], identity: ["Azure WAF + DDoS", "Managed protection at the edge"], compute: ["Azure Machine Learning", "Managed model training and inference"], data: ["Azure Database for PostgreSQL", "Transactional metadata store"], cache: ["Azure Managed Redis", "Low-latency prediction cache"], events: ["Azure Event Grid", "Decoupled inference workflows"], storage: ["Azure Blob Storage", "Versioned datasets and model artifacts"], observe: ["Azure Monitor + ML Monitor", "Service and model health"] },
        iot: { edge: ["Azure IoT Hub", "Secure device connectivity"], identity: ["Azure WAF + DDoS", "Managed edge and API protection"], compute: ["Azure Functions", "Elastic event processing"], data: ["Azure Data Explorer", "Purpose-built time-series analytics"], cache: ["Azure Managed Redis", "Hot device state cache"], events: ["Azure Event Hubs", "High-volume telemetry stream"], storage: ["ADLS Gen2", "Low-cost long-term telemetry"], observe: ["Azure Monitor + Defender for IoT", "Fleet and service health"] }
      }
    },
    GCP: {
      mark: "G",
      markClass: "gcp",
      regions: [["us-central1", "Iowa (us-central1)"], ["us-east1", "South Carolina (us-east1)"], ["europe-west1", "Belgium (europe-west1)"], ["asia-southeast1", "Singapore (asia-southeast1)"]],
      components: {
        web: { edge: ["Cloud CDN", "Global content delivery"], identity: ["Cloud Armor + IAM", "Managed protection at the edge"], compute: ["Cloud Run", "Autoscaling container services"], data: ["Cloud SQL for PostgreSQL", "Highly available relational database"], cache: ["Memorystore for Redis", "Low-latency session and cache layer"], events: ["Eventarc", "Decoupled business events"], storage: ["Cloud Storage", "Durable object and asset storage"], observe: ["Cloud Monitoring + Trace", "Logs, metrics, traces and alerting"] },
        data: { edge: ["Cloud CDN", "Secure delivery for data applications"], identity: ["Cloud Armor + IAM", "Managed protection at the edge"], compute: ["Dataflow + Dataform", "Managed ingestion and transforms"], data: ["BigQuery", "Serverless analytical warehouse"], cache: ["Memorystore for Redis", "Cache frequently read metadata"], events: ["Pub/Sub", "Streaming data ingestion"], storage: ["Cloud Storage + Dataplex", "Governed object storage and data lake"], observe: ["Cloud Monitoring + Audit Logs", "Pipeline health and audit history"] },
        ai: { edge: ["Cloud CDN", "Secure delivery for models and results"], identity: ["Cloud Armor + IAM", "Managed protection at the edge"], compute: ["Vertex AI", "Managed model training and inference"], data: ["Cloud SQL for PostgreSQL", "Transactional metadata store"], cache: ["Memorystore for Redis", "Low-latency prediction cache"], events: ["Eventarc", "Decoupled inference workflows"], storage: ["Cloud Storage", "Versioned datasets and model artifacts"], observe: ["Cloud Monitoring + Vertex AI", "Service and model health"] },
        iot: { edge: ["Cloud Load Balancing", "Secure device and API ingress"], identity: ["Cloud Armor + IAM", "Managed edge and API protection"], compute: ["Cloud Run", "Elastic event processing"], data: ["Bigtable", "Low-latency time-series data store"], cache: ["Memorystore for Redis", "Hot device state cache"], events: ["Pub/Sub", "High-volume telemetry stream"], storage: ["Cloud Storage", "Low-cost long-term telemetry"], observe: ["Cloud Monitoring + Cloud Logging", "Fleet and service health"] }
      }
    }
  };

  const workloadLabels = { web: "Web application", data: "Data platform", ai: "AI / machine learning", iot: "IoT / event processing" };
  const templateStorageKey = "archway-studio-custom-templates";
  const builtInTemplates = [
    { id: "commerce", name: "Global ecommerce", category: "Digital commerce", description: "Resilient storefront with personalized recommendations, secure checkout, and inventory updates.", requirement: "Build a global ecommerce platform with personalized product recommendations, secure checkout, and real-time inventory. Support seasonal traffic spikes and 99.95% availability.", workload: "web", traffic: "variable", multiRegion: true, provider: "AWS" },
    { id: "customer-data", name: "Customer data platform", category: "Data & analytics", description: "Unify customer profiles and deliver governed analytics across business systems.", requirement: "Create a secure customer data platform that unifies customer profiles and analytics for 2 million users. Ingest CRM, web, and mobile events with governed access and auditable data quality.", workload: "data", traffic: "high", multiRegion: true, provider: "AWS" },
    { id: "ai-documents", name: "AI document processing", category: "AI & machine learning", description: "Secure document ingestion, asynchronous extraction, and monitored model inference.", requirement: "Build a scalable AI-powered document processing service with real-time inference and secure storage. Accept PDF uploads, extract key fields, and route low-confidence results for human review.", workload: "ai", traffic: "variable", multiRegion: true, provider: "Azure" },
    { id: "serverless-api", name: "Serverless API platform", category: "Application platform", description: "Autoscaling API services with managed identity, cache, and resilient persistence.", requirement: "Create a public API platform for mobile and partner applications. Handle 5,000 requests per second at peak, protect endpoints with authentication and rate limits, and maintain 99.9% availability.", workload: "web", traffic: "high", multiRegion: false, provider: "GCP" },
    { id: "data-lake", name: "Enterprise data lake", category: "Data & analytics", description: "Governed batch and streaming ingestion with cataloged object storage and analytics.", requirement: "Build an enterprise data lake to ingest batch files and streaming events from finance, CRM, and operations systems. Enforce data classification, lineage, retention, and role-based access for analytics teams.", workload: "data", traffic: "high", multiRegion: true, provider: "AWS" },
    { id: "iot-telemetry", name: "IoT telemetry platform", category: "IoT & edge", description: "Secure device onboarding and event streaming into time-series and archival storage.", requirement: "Create an IoT telemetry platform for 100,000 connected sensors. Secure device identities, process MQTT messages in near real time, detect anomalies, and retain historical telemetry cost-effectively.", workload: "iot", traffic: "variable", multiRegion: true, provider: "Azure" },
    { id: "microservices", name: "Microservices marketplace", category: "Application platform", description: "Containerized service boundaries, asynchronous events, and separately scalable data tiers.", requirement: "Design a marketplace built from independently deployable services for catalog, orders, and fulfillment. Use event-driven workflows, isolate service data, and support rolling releases and fault containment.", workload: "web", traffic: "high", multiRegion: true, provider: "AWS" },
    { id: "healthcare", name: "Healthcare records portal", category: "Regulated workloads", description: "Privacy-focused patient access with strong identity, audit, encryption, and recovery controls.", requirement: "Build a patient portal for viewing records and appointment information. Apply strong identity controls, encrypt sensitive data, keep immutable audit trails, restrict private network access, and document recovery objectives.", workload: "web", traffic: "moderate", multiRegion: true, provider: "Azure" },
    { id: "fintech", name: "Real-time payments", category: "Financial services", description: "Low-latency payment processing with idempotency, fraud signals, and auditable events.", requirement: "Design a real-time payment processing service with idempotent transaction APIs, fraud scoring events, tamper-evident audit history, and a resilient ledger database. Prioritize secure key management and predictable low latency.", workload: "web", traffic: "high", multiRegion: true, provider: "GCP" },
    { id: "event-stream", name: "Event streaming backbone", category: "Integration & events", description: "Reliable shared event ingestion with replay, dead-letter handling, and consumer isolation.", requirement: "Build a shared event streaming backbone for several internal products and partner integrations. Support bursty producers, durable replay, schema validation, dead-letter handling, and independent consumer scaling.", workload: "data", traffic: "variable", multiRegion: true, provider: "AWS" }
  ];
  const stages = [
    { key: "clients", title: "01  CLIENTS" },
    { key: "edge", title: "02  EDGE & SECURITY" },
    { key: "compute", title: "03  APPLICATION & CACHE" },
    { key: "events", title: "04  EVENTS & INTEGRATIONS" },
    { key: "data", title: "05  DATA & STORAGE" },
    { key: "observe", title: "06  OPERATIONS" }
  ];
  const networkServices = {
    AWS: ["Amazon VPC", "NAT Gateway + VPC endpoints", "Isolated public and private subnets"],
    Azure: ["Azure Virtual Network", "NAT Gateway + Private Link", "Segmented private subnets"],
    GCP: ["Google Cloud VPC", "Cloud NAT + Private Service Connect", "Global VPC with private subnets"]
  };
  const gatewayServices = {
    AWS: ["Amazon API Gateway", "TLS termination · throttling · auth"],
    Azure: ["Azure API Management", "TLS termination · throttling · auth"],
    GCP: ["Google Cloud API Gateway", "TLS termination · throttling · auth"]
  };
  const secretsServices = {
    AWS: ["Secrets Manager + KMS", "Managed secrets and encryption keys"],
    Azure: ["Azure Key Vault", "Managed secrets, certificates and keys"],
    GCP: ["Secret Manager + Cloud KMS", "Managed secrets and encryption keys"]
  };
  const integrationCatalog = {
    web: ["Payments, tax & shipping APIs", "Verified webhooks · scoped credentials"],
    data: ["ERP, CRM & SaaS connectors", "API scopes · ingestion checkpoints"],
    ai: ["Document stores & model APIs", "Scoped identity · sensitive-data controls"],
    iot: ["MQTT devices & partner brokers", "Mutual TLS · device and topic identity"]
  };
  const $ = (id) => document.getElementById(id);
  let msalClient = null;
  let msalClientKey = "";
  let msalLoadPromise = null;
  let designAppInitialized = false;
  let editingTemplateId = null;
  let pendingDesignNodes = null;
  const state = {
    provider: "AWS",
    region: "us-east-1",
    secondRegion: "us-west-2",
    traffic: "high",
    workload: "web",
    multiRegion: true,
    layerGap: 33,
    designNodes: null,
    showAllRationale: false,
    storageWarningShown: false,
    toastTimer: null
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  }

  function escapeXml(value) {
    return escapeHtml(value);
  }

  function inferWorkload(text) {
    const value = text.toLowerCase();
    if (/e-?commerce|commerce|checkout|online store|shopping platform/.test(value)) return "web";
    if (/iot|device|sensor|telemetry/.test(value)) return "iot";
    if (/machine learning|\bml\b|\bai\b|model|inference|recommendation|personaliz/.test(value)) return "ai";
    if (/analytics|data platform|data lake|warehouse|customer data|profiles|pipeline/.test(value)) return "data";
    return "web";
  }

  function renderRegionOptions(preserveRegion) {
    const regionSelect = $("region-select");
    const regionList = providers[state.provider].regions;
    regionSelect.innerHTML = regionList.map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`).join("");
    state.region = preserveRegion && regionList.some(([value]) => value === state.region) ? state.region : regionList[0][0];
    regionSelect.value = state.region;
    const secondaryRegionSelect = $("secondary-region-select");
    const secondaryRegions = regionList.filter(([value]) => value !== state.region);
    secondaryRegionSelect.innerHTML = secondaryRegions.map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`).join("");
    state.secondRegion = secondaryRegions.some(([value]) => value === state.secondRegion) ? state.secondRegion : (secondaryRegions[0] || regionList[0])[0];
    secondaryRegionSelect.value = state.secondRegion;
    $("secondary-region-field").hidden = !state.multiRegion;
    $("provider-mark").textContent = providers[state.provider].mark;
    $("provider-mark").className = `provider-mark ${providers[state.provider].markClass}`;
    $("diagram-provider").textContent = state.provider;
  }

  function getCatalog() {
    return providers[state.provider].components[state.workload];
  }

  function getDefaultNodes() {
    const catalog = getCatalog();
    const eventTitle = catalog.events[0];
    const eventDescription = state.traffic === "variable" ? "Buffers traffic bursts" : catalog.events[1];
    return {
      clients: [{ id: "clients-default", name: "Web & mobile clients", note: "Customers · partner applications", kind: "clients" }],
      edge: [
        { id: "edge-service", name: catalog.edge[0], note: catalog.edge[1], kind: "edge" },
        { id: "edge-security", name: catalog.identity[0], note: "DDoS protection · managed rules", kind: "security" },
        { id: "edge-gateway", name: gatewayServices[state.provider][0], note: gatewayServices[state.provider][1], kind: "gateway" }
      ],
      compute: [
        { id: "app-compute", name: catalog.compute[0], note: catalog.compute[1], kind: "compute" },
        { id: "app-cache", name: catalog.cache[0], note: catalog.cache[1], kind: "cache" },
        { id: "app-secrets", name: secretsServices[state.provider][0], note: secretsServices[state.provider][1], kind: "security" }
      ],
      events: [{ id: "events-default", name: eventTitle, note: eventDescription, kind: "events" }],
      data: [{ id: "data-database", name: catalog.data[0], note: catalog.data[1], kind: "data" }, { id: "data-storage", name: catalog.storage[0], note: catalog.storage[1], kind: "data" }],
      observe: [{ id: "observe-default", name: catalog.observe[0], note: catalog.observe[1], kind: "observe" }]
    };
  }

  function getEffectiveNodes() {
    return state.designNodes || getDefaultNodes();
  }

  function copyDesignNodes(nodes) {
    return Object.fromEntries(stages.map(({ key }) => [key, nodes[key].map((item) => ({ ...item }))]));
  }

  function validateDesignNodes(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const layers = {};
    const validKinds = ["clients", "edge", "security", "gateway", "compute", "cache", "events", "data", "observe", "integration"];
    const ids = new Set();
    for (const { key } of stages) {
      if (!Array.isArray(value[key]) || value[key].length > 5) return null;
      layers[key] = [];
      for (const item of value[key]) {
        if (!item || typeof item !== "object" || typeof item.name !== "string" || typeof item.note !== "string" ||
            !item.name.trim() || item.name.length > 60 || item.note.length > 100 || !validKinds.includes(item.kind)) return null;
        const id = typeof item.id === "string" && item.id && !ids.has(item.id)
          ? item.id
          : `component-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        ids.add(id);
        layers[key].push({ id, name: item.name.trim(), note: item.note.trim(), kind: item.kind });
      }
    }
    return layers;
  }

  function serviceIcon(kind, x, y, color) {
    const common = `fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"`;
    const shapes = {
      clients: `<circle cx="8" cy="7" r="3"/><circle cx="17" cy="8" r="2.5"/><path d="M2.5 20v-1.5a5.5 5.5 0 0 1 11 0V20zM15 14a4 4 0 0 1 6.5 3v2H17"/>`,
      edge: `<path d="M5 17.5h13a3.5 3.5 0 0 0 .2-7 6.5 6.5 0 0 0-12.7-1.2A4.2 4.2 0 0 0 5 17.5z"/><path d="M5 21h14"/>`,
      security: `<path d="M12 2.8 20 6v5.3c0 4.5-3.1 8.1-8 10.1-4.9-2-8-5.6-8-10.1V6z"/><path d="m8.5 12 2.3 2.3 4.8-5"/>`,
      gateway: `<path d="M4 5h6v5H4zM14 14h6v5h-6z"/><path d="M10 7.5h4a3 3 0 0 1 3 3V14M7 10v5a2 2 0 0 0 2 2h5"/>`,
      compute: `<path d="m12 2.8 9 5v8.5l-9 5-9-5V7.8z"/><path d="m3.5 8 8.5 5 8.5-5M12 13v8"/>`,
      cache: `<path d="M4 7.5h16M4 12h16M4 16.5h16"/><circle cx="7" cy="7.5" r=".8" fill="${color}"/><circle cx="7" cy="12" r=".8" fill="${color}"/><circle cx="7" cy="16.5" r=".8" fill="${color}"/>`,
      events: `<circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 6h5a5 5 0 0 1 5 5v5M6 8v6a4 4 0 0 0 4 4h6"/>`,
      data: `<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>`,
      observe: `<path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6z"/><circle cx="12" cy="12" r="2.5"/>`,
      integration: `<path d="M9 15 15 9M7 17H5a4 4 0 0 1 0-8h4M17 7h2a4 4 0 0 1 0 8h-4"/>`
    };
    return `<g transform="translate(${x} ${y})"><svg width="24" height="24" viewBox="0 0 24 24" ${common}>${shapes[kind] || shapes.compute}</svg></g>`;
  }

  function renderDiagram() {
    const width = 1000;
    const layerGap = state.layerGap;
    const cardHeight = 50;
    const cardStart = 230;
    const cardEnd = 975;
    const layerStart = 86;
    const layerY = Object.fromEntries(stages.map((stage, index) => [stage.key, layerStart + index * (cardHeight + layerGap)]));
    const networkTop = layerY.compute - 14;
    const networkBottom = layerY.observe + 103;
    const integrationY = layerY.observe + 113;
    const height = integrationY + 62;
    const nodes = getEffectiveNodes();
    const catalog = getCatalog();
    const brandColor = { AWS: "#e99540", Azure: "#2584cb", GCP: "#4285f4" }[state.provider];
    const kindColors = { clients: "#8792a8", edge: "#468fc7", security: "#df9647", gateway: "#bd8a40", compute: "#8064e1", cache: "#8b74df", events: "#538bc9", data: "#32a183", observe: "#657c98" };
    const definitions = [
      `<defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fcfcff"/><stop offset="1" stop-color="#f8f9fd"/></linearGradient>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L8,4 L0,8 z" fill="#8878d4"/></marker>
        <marker id="arrow-reverse" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L8,4 L0,8 z" fill="#94abc4"/></marker>
      </defs>
      <rect x="0" y="0" width="${width}" height="${height}" rx="7" fill="url(#bg)"/>`
    ];
    const deployment = state.multiRegion
      ? `${state.region.toUpperCase()}  →  ${state.secondRegion.toUpperCase()}  ·  FAILOVER`
      : `${state.region.toUpperCase()}  ·  SINGLE REGION`;
    definitions.push(`<text x="24" y="30" fill="#53617b" font-family="Arial,sans-serif" font-size="15" font-weight="700" letter-spacing=".35">${escapeXml(`${state.provider} DEPLOYMENT`)}</text>`);
    definitions.push(`<text x="976" y="30" text-anchor="end" fill="#68738a" font-family="Arial,sans-serif" font-size="12" font-weight="700">${escapeXml(deployment)}</text>`);
    definitions.push(`<rect x="16" y="${networkTop}" width="968" height="${networkBottom - networkTop}" rx="12" fill="#f8f8ff" fill-opacity=".7" stroke="#9a8ce2" stroke-width="1.5" stroke-dasharray="6 5"/>`);
    definitions.push(`<text x="30" y="${layerY.compute + 14}" fill="#6356ab" font-family="Arial,sans-serif" font-size="12" font-weight="700" letter-spacing=".45">${escapeXml(`PRIVATE NETWORK · ${networkServices[state.provider][0]} · ${networkServices[state.provider][2]}`)}</text>`);
    definitions.push(`<rect x="16" y="${layerY.clients - 8}" width="968" height="${cardHeight + 16}" rx="10" fill="#f4f8fc" stroke="#dce5f0"/>`);
    definitions.push(`<rect x="16" y="${layerY.edge - 8}" width="968" height="${cardHeight + 16}" rx="10" fill="#fffaf3" stroke="#f1e4d3"/>`);
    let previousPopulatedY = null;
    stages.forEach((stage) => {
      const y = layerY[stage.key];
      const items = nodes[stage.key];
      const gap = 12;
      const cardWidth = Math.min(235, (cardEnd - cardStart - gap * (items.length - 1)) / Math.max(items.length, 1));
      const cardXs = items.map((_, index) => cardStart + index * (cardWidth + gap));
      if (items.length) {
        const centerY = y + cardHeight / 2;
        if (previousPopulatedY !== null) {
          definitions.push(`<path d="M200 ${previousPopulatedY} V${centerY}" fill="none" stroke="#8878d4" stroke-width="1.5"/>`);
        }
        const trunkEnd = cardXs[cardXs.length - 1] - 10;
        definitions.push(`<path d="M200 ${centerY} H${trunkEnd}" fill="none" stroke="#94abc4" stroke-width="1.5"/>`);
        cardXs.forEach((x) => definitions.push(`<path d="M${x - 10} ${centerY} H${x - 4}" fill="none" stroke="#8878d4" stroke-width="1.5" marker-end="url(#arrow)"/>`));
        previousPopulatedY = centerY;
      }
      items.forEach((item, itemIndex) => {
        const x = cardXs[itemIndex];
        const accent = kindColors[item.kind] || "#8064e1";
        const fill = item.kind === "security" ? "#fffaf4" : item.kind === "clients" ? "#f4f7fb" : item.kind === "data" || item.kind === "cache" ? "#f5fbf9" : item.kind === "observe" ? "#f6f8fc" : "#f9f8ff";
        const textWidth = Math.max(8, cardWidth - 91);
        const maxLabelLength = Math.max(8, Math.floor(textWidth / 7));
        const maxNoteLength = Math.max(8, Math.floor(textWidth / 6));
        const label = item.name.length > maxLabelLength ? `${item.name.slice(0, maxLabelLength - 1)}…` : item.name;
        const note = item.note.length > maxNoteLength ? `${item.note.slice(0, maxNoteLength - 1)}…` : item.note;
        definitions.push(`<g><title>${escapeXml(item.name)} — ${escapeXml(item.note)}</title><rect x="${x}" y="${y}" width="${cardWidth}" height="${cardHeight}" rx="7" fill="${fill}" stroke="#e2e6ef"/><rect x="${x}" y="${y + 8}" width="4" height="34" rx="2" fill="${accent}"/><rect x="${x + 11}" y="${y + 10}" width="30" height="30" rx="7" fill="${accent}" fill-opacity=".11"/>${serviceIcon(item.kind, x + 14, y + 13, accent)}<text x="${x + 50}" y="${y + 23}" fill="#35425e" font-family="Arial,sans-serif" font-size="12" font-weight="700">${escapeXml(label)}</text><text x="${x + 50}" y="${y + 39}" fill="#707c92" font-family="Arial,sans-serif" font-size="10">${escapeXml(note)}</text><text x="${x + cardWidth - 38}" y="${y + cardHeight - 5}" fill="${brandColor}" font-family="Arial,sans-serif" font-size="9" font-weight="700">${escapeXml(state.provider)}</text></g>`);
      });
      const labelY = stage.key === "compute" ? y + 35 : y + 12;
      definitions.push(`<text x="28" y="${labelY}" fill="${stage.key === "edge" ? "#af8050" : "#727d93"}" font-family="Arial,sans-serif" font-size="11" font-weight="700" letter-spacing=".35">${escapeXml(stage.title)}</text>`);
    });
    const external = integrationCatalog[state.workload];
    definitions.push(`<path d="M230 ${layerY.events + cardHeight - 5} H190 V${integrationY - 12} H370 V${integrationY + 25}" fill="none" stroke="#6889b5" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#arrow)"/>`);
    definitions.push(`<path d="M370 ${integrationY + 32} H180 V${layerY.events + cardHeight + 4} H230" fill="none" stroke="#94abc4" stroke-width="1.5" stroke-dasharray="2 3" marker-end="url(#arrow-reverse)"/>`);
    definitions.push(`<text x="25" y="${integrationY - 20}" fill="#7485a2" font-family="Arial,sans-serif" font-size="10">NAT · outbound HTTPS · signed webhook response</text>`);
    definitions.push(`<g><title>External integration: ${escapeXml(external[0])} — ${escapeXml(external[1])}</title><rect x="370" y="${integrationY}" width="260" height="50" rx="7" fill="#fffaf4" stroke="#f1e3d0"/>`);
    definitions.push(`<rect x="381" y="${integrationY + 10}" width="30" height="30" rx="7" fill="#e5a75e" fill-opacity=".12"/>${serviceIcon("integration", 384, integrationY + 13, "#c4843a")}`);
    definitions.push(`<text x="420" y="${integrationY + 22}" fill="#50566a" font-family="Arial,sans-serif" font-size="12" font-weight="700">${escapeXml(external[0].length > 26 ? `${external[0].slice(0, 24)}…` : external[0])}</text>`);
    definitions.push(`<text x="420" y="${integrationY + 38}" fill="#74798a" font-family="Arial,sans-serif" font-size="10">${escapeXml(external[1].length > 28 ? `${external[1].slice(0, 26)}…` : external[1])}</text>`);
    definitions.push(`<text x="700" y="${integrationY + 29}" fill="#8a806d" font-family="Arial,sans-serif" font-size="10" font-weight="700">TLS · SCOPED CREDENTIALS</text></g>`);
    const regionDescription = state.multiRegion ? `, primary region ${state.region} with failover to ${state.secondRegion}` : `, region ${state.region}`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(`${state.provider} ${workloadLabels[state.workload]} architecture diagram${regionDescription}. Layers flow top to bottom from clients through edge security and private networking to application, events, data, operations, and external integrations. Includes ${catalog.edge[0]}, ${gatewayServices[state.provider][0]}, ${catalog.events[0]}, ${catalog.data[0]}, and ${integrationCatalog[state.workload][0]}.`)}">${definitions.join("")}</svg>`;
    $("diagram-container").innerHTML = svg;
  }

  function getCost() {
    const baseCosts = {
      web: { compute: 1420, data: 1180, network: 680, ops: 410, security: 590 },
      data: { compute: 1880, data: 1640, network: 520, ops: 490, security: 380 },
      ai: { compute: 2480, data: 860, network: 420, ops: 470, security: 390 },
      iot: { compute: 1170, data: 1050, network: 790, ops: 510, security: 380 }
    };
    const costs = { ...baseCosts[state.workload] };
    const trafficFactor = { moderate: 0.68, high: 1, variable: 1.16 }[state.traffic];
    Object.keys(costs).forEach((key) => { costs[key] = Math.round(costs[key] * trafficFactor); });
    if (state.multiRegion) {
      costs.compute = Math.round(costs.compute * 1.3);
      costs.data = Math.round(costs.data * 1.24);
      costs.network = Math.round(costs.network * 1.12);
      costs.ops = Math.round(costs.ops * 1.08);
    }
    const providerFactor = { AWS: 1, Azure: 1.03, GCP: 0.97 }[state.provider];
    Object.keys(costs).forEach((key) => { costs[key] = Math.round(costs[key] * providerFactor); });
    const total = Object.values(costs).reduce((sum, value) => sum + value, 0);
    return { costs, total };
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
  }

  function getSecurityControls() {
    const controls = [
      ["Identity", "Least-privilege IAM + MFA"],
      ["Network", "Private subnets + zero trust"],
      ["Data", "Encryption at rest and in transit"],
      ["Detection", "Central audit logs + alerts"]
    ];
    if (state.workload === "ai") controls[3] = ["AI governance", "Model monitoring + audit trail"];
    if (state.workload === "iot") controls[3] = ["Device security", "Certificate identity + fleet monitoring"];
    return controls;
  }

  function getTechnicalSpecifications() {
    const regions = providers[state.provider].regions;
    const primaryRegion = regions.find(([value]) => value === state.region)[1];
    const secondaryRegion = regions.find(([value]) => value === state.secondRegion)[1];
    const nodes = getEffectiveNodes();
    const computeName = (nodes.compute.find((item) => item.kind === "compute") || nodes.compute[0] || {}).name || getCatalog().compute[0];
    const dataName = (nodes.data.find((item) => item.kind === "data") || nodes.data[0] || {}).name || getCatalog().data[0];
    const sizing = {
      web: { cpu: 2, memory: 4, databaseCpu: 2, databaseMemory: 8 },
      data: { cpu: 4, memory: 16, databaseCpu: 4, databaseMemory: 16 },
      ai: { cpu: 4, memory: 16, databaseCpu: 2, databaseMemory: 8 },
      iot: { cpu: 2, memory: 8, databaseCpu: 4, databaseMemory: 16 }
    }[state.workload];
    const replicaRange = { moderate: [2, 6], high: [3, 12], variable: [2, 20] }[state.traffic];
    const dataTierProfile = state.workload === "data"
      ? `${dataName} · begin with the smallest production-suitable/serverless capacity tier; calibrate warehouse or stream capacity to query concurrency, scan volume and ingestion window. Provider capacity units are not directly comparable.`
      : state.workload === "iot"
        ? `${dataName} · size the managed time-series/NoSQL tier from ingest rate, write throughput, retention and hot-data needs; use provider-specific nodes/shards rather than assuming a VM SKU.`
        : `${dataName} · initial reference size ${sizing.databaseCpu} vCPU / ${sizing.databaseMemory} GiB, with high availability enabled where supported. Validate storage, IOPS, connection limits and read-replica needs.`;
    const securityTools = {
      AWS: "AWS Security Hub, GuardDuty, Inspector, Config, CloudTrail, WAF and Shield",
      Azure: "Microsoft Defender for Cloud, Microsoft Sentinel, Azure Policy, Entra ID, Azure Monitor and WAF/DDoS Protection",
      GCP: "Security Command Center, Cloud Audit Logs, Organization Policy, Cloud IAM, Cloud Monitoring and Cloud Armor"
    }[state.provider];
    const autoscaler = {
      AWS: "ECS Service Auto Scaling / Application Auto Scaling for Fargate; EC2 Auto Scaling groups for VM-based compute",
      Azure: "Container Apps scale rules / KEDA; Azure Virtual Machine Scale Sets (VMSS) for VM-based compute",
      GCP: "Cloud Run or service-native worker autoscaling; Managed Instance Groups for VM-based compute"
    }[state.provider];
    const userIdentity = {
      AWS: "Amazon Cognito or an enterprise OIDC identity provider; OAuth 2.0 / OIDC authorization code with PKCE",
      Azure: "Microsoft Entra External ID or an enterprise OIDC identity provider; OAuth 2.0 / OIDC authorization code with PKCE",
      GCP: "Identity Platform or an enterprise OIDC identity provider; OAuth 2.0 / OIDC authorization code with PKCE"
    }[state.provider];
    const azGuidance = state.provider === "AWS"
      ? "Place stateless replicas across at least 2 Availability Zones (3 for higher availability where supported). Resolve AZ IDs in the target account; AZ letter names can map differently between accounts."
      : "Place stateless replicas across at least 2 Availability Zones (3 for higher availability where supported). Confirm zone support for each selected managed service in the target region.";
    const normalizedDataName = dataName.toLowerCase();
    const dataPort = normalizedDataName.includes("postgres")
      ? "TCP 5432 · PostgreSQL TLS"
      : normalizedDataName.includes("redshift")
        ? "TCP 5439 · Redshift TLS"
        : normalizedDataName.includes("synapse")
          ? "TCP 1433 · Synapse SQL TLS"
          : "TCP 443 · provider API / TLS";
    const ports = [
      ["End users / partners", "CDN, WAF and API ingress", "TCP 443 · HTTPS · TLS 1.2+", "Public ingress only at managed edge; apply WAF rules, authentication and rate limits."],
      ["Application services", "Managed APIs, events and cloud service endpoints", "TCP 443 · HTTPS", "Outbound allow-list; use private endpoints and workload identity where supported."],
      ["Application services", dataName, dataPort, "Private endpoint where supported; restrict to required application identities/subnets and encrypt in transit."],
      ...(nodes.compute.some((item) => item.kind === "cache")
        ? [["Application services", nodes.compute.find((item) => item.kind === "cache").name, "TCP 6379 · TLS where supported", "Private endpoint only; require authentication and encryption in transit."]]
        : []),
      ...(state.workload === "iot" ? [["Devices", getCatalog().edge[0], "TCP 8883 · MQTT over mutual TLS", "Device certificates, broker policy and per-device topic authorization."]] : [])
    ];
    const backupRows = state.multiRegion
      ? [
        ["Database protection", "Automated backups and point-in-time recovery; replicate or restore into the failover region. Set retention to policy (35 days is a starting point, not a requirement)."],
        ["Object data", "Enable versioning and lifecycle policies; copy critical data to the failover region and protect backup administration separately."],
        ["Recovery objectives", "Initial planning target: RPO ≤ 15 minutes and RTO ≤ 60 minutes. Validate against service capabilities, data volume and business requirements."],
        ["Exercises", "Run quarterly restore and regional-failover exercises; record evidence, dependencies and recovery runbooks."]
      ]
      : [
        ["Database protection", "Automated backups and point-in-time recovery; set retention to policy (35 days is a starting point, not a requirement)."],
        ["Object data", "Enable versioning, lifecycle policies and a separately protected backup copy; no secondary-region recovery is configured."],
        ["Recovery objectives", "Initial planning target: RPO ≤ 1 hour and RTO ≤ 4 hours. These are assumptions; confirm with service owners."],
        ["Exercises", "Run quarterly restore exercises and document the additional region, replication and DNS steps required for regional disaster recovery."]
      ];
    return [
      {
        title: "Deployment placement",
        rows: [
          ["Cloud / primary region", `${state.provider} · ${primaryRegion} (${state.region})`],
          ["Availability zones", azGuidance],
          ["Failover region", state.multiRegion ? `${secondaryRegion} (${state.secondRegion}); confirm cross-region service support, data residency and replication costs.` : "Not configured. This design provides regional availability-zone resilience only."],
          ["Network", `${networkServices[state.provider][0]}; ${networkServices[state.provider][2]}; private service connectivity via ${networkServices[state.provider][1]}.`]
        ]
      },
      {
        title: "Compute sizing & scaling",
        rows: [
          ["Primary compute", `${computeName} · initial reference size ${sizing.cpu} vCPU / ${sizing.memory} GiB memory per replica. Translate to the nearest supported service SKU after load testing; not a provider quote.`],
          ["Autoscale / scale set", `${autoscaler}. Configure ${replicaRange[0]} minimum / ${replicaRange[1]} maximum replicas for the ${state.traffic} traffic profile; distribute across zones and scale around 65% CPU plus request concurrency or queue age.`],
          ["Data tier", dataTierProfile],
          ["Workload notes", state.workload === "ai" ? "Benchmark model memory, accelerator/GPU needs, tokens per second and cold starts; GPU sizing is intentionally not assumed." : state.workload === "data" ? "Size workers independently by ingestion throughput, batch window and query concurrency; autoscale consumers separately from storage." : state.workload === "iot" ? "Scale broker consumers from message rate, payload size and backlog age; set explicit per-device and per-tenant quotas." : "Scale stateless application replicas independently; validate peak requests, concurrency, latency and database connection-pool limits."],
          ["Storage", "Capacity and performance tier are not inferred without data volume and retention inputs; estimate from ingest rate, growth, retention, IOPS and recovery-copy requirements."]
        ]
      },
      {
        title: "Ports & protocols",
        columns: ["Source", "Destination", "Port / protocol", "Security boundary"],
        rows: ports
      },
      {
        title: "End-user access & authentication",
        rows: [
          ["End-user entry", "Browser/mobile and approved partner clients enter through the provider CDN/WAF and API gateway; expose only required public endpoints over HTTPS 443."],
          ["User authentication", userIdentity],
          ["Authorization", "Validate token signature, issuer, audience, expiry and scopes/roles at the API; enforce tenant and resource-level authorization server-side."],
          ["Privileged user controls", "Require MFA for workforce and privileged roles; apply conditional access/risk policy and periodic access reviews. Customer MFA is a product policy decision."]
        ]
      },
      {
        title: "Management access & security tooling",
        rows: [
          ["Administrator access", "Federate workforce SSO to cloud IAM; use role-based least privilege, MFA, just-in-time elevation/PIM, separate production roles and audited approval. No shared accounts or long-lived access keys."],
          ["Host access", "Prefer managed control planes and private administration paths. Do not expose SSH/RDP publicly; use a governed bastion or session manager only if host administration is required."],
          ["Workload identity", "Use provider-managed workload identities and short-lived credentials; grant per-service roles to secrets, data stores and deployment pipelines."],
          ["Security operations", `${securityTools}. Centralize audit events, alert on identity/network/data threats, scan images and dependencies, and route incidents to the organization's SIEM/SOC.`],
          ["Encryption & secrets", `${secretsServices[state.provider][0]}; TLS in transit, provider-managed encryption at rest, customer-managed keys where required, rotation and access audit.`]
        ]
      },
      {
        title: "Backup & disaster recovery",
        rows: backupRows
      }
    ];
  }

  function renderSecurity() {
    $("security-controls").innerHTML = getSecurityControls().map(([label, text]) => `<li><span class="control-check" aria-hidden="true">✓</span><span><strong>${escapeHtml(label)}:</strong> ${escapeHtml(text)}</span></li>`).join("");
    $("security-controls").closest(".insight-section").querySelector(".count-badge").textContent = String(getSecurityControls().length);
  }

  function renderTechnologyStack() {
    const catalog = getCatalog();
    const parts = [catalog.edge[0], gatewayServices[state.provider][0], networkServices[state.provider][0], catalog.compute[0], catalog.events[0], catalog.data[0], secretsServices[state.provider][0], catalog.observe[0], integrationCatalog[state.workload][0]];
    $("technology-stack").innerHTML = parts.map((name) => `<span class="tech-pill">${escapeHtml(name)}</span>`).join("");
  }

  function getRationales() {
    const text = $("requirement-input").value.toLowerCase();
    const dynamicRationale = /recommend|personaliz/.test(text)
      ? { title: "Recommendations", copy: "Keep personalized ranking behind an application boundary; start with managed inference and add a feature store as the model matures." }
      : /inventory|order|checkout/.test(text)
        ? { title: "Consistent checkout", copy: "Keep order and inventory writes transactional; use idempotency keys and async events for downstream updates." }
        : /telemetry|sensor|device|iot/.test(text)
          ? { title: "Device ingestion", copy: "Use a broker and streaming buffer to absorb bursty device traffic before time-series storage." }
          : { title: "Independent services", copy: "Separate ingestion and application workloads so each can scale and deploy without blocking the other." };
    const rationale = [
      { title: "Resilient by design", copy: state.multiRegion ? "Multi-region failover reduces the impact of a regional outage; validate recovery objectives with failover exercises." : "Multi-zone deployment improves availability within one region; add a recovery region when RTO requirements warrant it." },
      { title: "Scale on demand", copy: state.traffic === "variable" ? "Queue-based buffering and autoscaling absorb unpredictable peaks without sizing every tier for the maximum." : "Autoscaling application capacity handles demand changes while managed data services reduce operational overhead." },
      dynamicRationale,
      { title: "Secure by default", copy: "Private service networking, least-privilege identity, encryption, and centralized audit logs provide layered controls." },
      { title: "Operationally visible", copy: "Centralized logs, metrics, traces, and alerts help operators detect incidents and measure service objectives." }
    ];
    return state.showAllRationale ? rationale : rationale.slice(0, 3);
  }

  function renderRationale() {
    $("rationale-list").innerHTML = getRationales().map((item, index) =>
      `<div class="rationale-item"><span class="rationale-number">${index + 1}</span><p><strong>${escapeHtml(item.title)}.</strong> ${escapeHtml(item.copy)}</p></div>`
    ).join("");
    $("rationale-toggle").innerHTML = state.showAllRationale ? 'Show less <span aria-hidden="true">↑</span>' : 'View all <span aria-hidden="true">→</span>';
  }

  function renderCost() {
    const { costs, total } = getCost();
    const rangeLow = Math.round(total * 0.8);
    const rangeHigh = Math.round(total * 1.33);
    $("cost-value").textContent = formatCurrency(total);
    $("cost-range").textContent = `Typical range: $${formatCurrency(rangeLow)} – $${formatCurrency(rangeHigh)}`;
    $("cost-total").innerHTML = `$${formatCurrency(total)} <small>/ month</small>`;
    $("cost-bar-fill").style.width = `${Math.min(100, 35 + total / 150)}%`;
    const descriptions = {
      compute: ["Compute & application", costs.compute],
      data: ["Database & storage", costs.data],
      network: ["Networking & delivery", costs.network],
      ops: ["Observability", costs.ops],
      security: ["Security & resilience", costs.security]
    };
    const ordered = Object.values(descriptions);
    $("cost-breakdown-list").innerHTML = ordered.map(([label, amount]) =>
      `<div class="breakdown-row"><span class="breakdown-name">${label}</span><span class="breakdown-track"><span style="width:${Math.max(6, Math.round(amount / total * 100))}%"></span></span><span class="breakdown-value">$${formatCurrency(amount)}</span></div>`
    ).join("");
    $("cost-details-button").querySelector("small").textContent = `Five service groups · $${formatCurrency(total)} / month`;
  }

  function buildSteps() {
    const providerName = { AWS: "AWS", Azure: "Azure", GCP: "Google Cloud" }[state.provider];
    const catalog = getCatalog();
    const nodes = getEffectiveNodes();
    const serviceName = (layer, kind, fallback) => (nodes[layer].find((item) => item.kind === kind) || nodes[layer][0] || {}).name || fallback;
    const computeName = serviceName("compute", "compute", catalog.compute[0]);
    const dataName = serviceName("data", "data", catalog.data[0]);
    const storageItem = nodes.data.find((item, index) => item.kind === "data" && index > 0);
    const storageName = storageItem ? storageItem.name : catalog.storage[0];
    const eventsName = serviceName("events", "events", catalog.events[0]);
    return [
      ["Confirm requirements & landing zone", `Agree on service-level objectives, RTO/RPO, data residency, and peak traffic. Set up ${providerName} accounts/projects, budgets, policy guardrails, and infrastructure-as-code.`],
      ["Establish network and security foundations", `Create ${networkServices[state.provider][0]} with ${networkServices[state.provider][1]}, then configure ${catalog.identity[0]}, ${gatewayServices[state.provider][0]}, managed secrets, private DNS, TLS, and centralized audit logging.`],
      ["Deploy application & data tiers", `Provision ${computeName}, ${dataName}, and ${storageName}. Use managed identity and separate dev, staging, and production environments.`],
      ["Connect events and external integrations", `Route ${eventsName} through ${networkServices[state.provider][1]} to ${integrationCatalog[state.workload][0]}. Scope credentials, validate inbound webhooks, and set retry and dead-letter policies.`],
      ["Add resilience & delivery pipelines", state.multiRegion ? `Replicate critical data between ${providers[state.provider].regions.find(([value]) => value === state.region)[1]} and ${providers[state.provider].regions.find(([value]) => value === state.secondRegion)[1]}; define health-based failover and backups, and test recovery objectives.` : "Enable zone redundancy, backups, and tested recovery procedures; document the recovery-region decision."],
      ["Operate, measure & optimize", `Instrument ${catalog.observe[0]}, load-test expected peaks, verify alerts and restore procedures, review the cost assumptions, and run a production readiness assessment.`]
    ];
  }

  function renderComponents() {
    const nodes = getEffectiveNodes();
    const network = networkServices[state.provider];
    const groups = [
      ["Network boundaries & gateways", "◇", [network, ["Subnet design", network[2]], gatewayServices[state.provider]]],
      ["Ingress & identity", "↗", nodes.edge.map(({ name, note }) => [name, note])],
      ["Application & secrets", "▧", nodes.compute.map(({ name, note }) => [name, note])],
      ["Events & external integrations", "⌁", [...nodes.events.map(({ name, note }) => [name, note]), integrationCatalog[state.workload]]],
      ["Data & observability", "▤", [...nodes.data, ...nodes.observe].map(({ name, note }) => [name, note])]
    ];
    const failover = state.multiRegion ? `, with failover in ${providers[state.provider].regions.find(([value]) => value === state.secondRegion)[1]}` : "";
    const technicalSpecs = getTechnicalSpecifications();
    $("components-view").innerHTML = `<p class="view-intro">Provider-native building blocks selected for a ${escapeHtml(workloadLabels[state.workload].toLowerCase())} workload on <strong>${escapeHtml(state.provider)}</strong>, in <strong>${escapeHtml(state.region)}</strong>${escapeHtml(failover)}.</p>${groups.map(([group, icon, entries]) =>
      `<section class="component-group"><h3><span aria-hidden="true">${icon}</span>${escapeHtml(group)}</h3><div class="component-list">${entries.map(([name, description]) =>
        `<article class="component-card"><strong>${escapeHtml(name)}</strong><small>${escapeHtml(description)}</small></article>`
      ).join("")}</div></section>`
    ).join("")}<section class="technical-specifications"><div class="technical-specifications-heading"><h3>Deployment technical specification</h3><p>Planning baseline · confirm service SKUs, quotas and recovery objectives before production.</p></div>${technicalSpecs.map((section) =>
      `<section class="technical-spec-section"><h4>${escapeHtml(section.title)}</h4>${section.columns
        ? `<div class="technical-table-wrap"><table class="technical-table"><thead><tr>${section.columns.map((column) => `<th scope="col">${escapeHtml(column)}</th>`).join("")}</tr></thead><tbody>${section.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`
        : `<dl class="technical-detail-list">${section.rows.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl>`}</section>`
    ).join("")}</section><div class="assumption-note"><strong>Security baseline:</strong> least-privilege identity, private network paths, encrypted data, centrally managed logs, and alerting. Validate regional availability and service limits before deployment.</div>`;
  }

  function renderDesignEditor() {
    const filter = $("editor-stage-filter").value;
    const stageOptions = [
      ["clients", "Clients"], ["edge", "Edge / security"], ["compute", "Application / cache"],
      ["events", "Events / integrations"], ["data", "Data / storage"], ["observe", "Operations"]
    ];
    const kindOptions = [
      ["clients", "Client"], ["edge", "Edge / network"], ["security", "Security"], ["gateway", "Gateway"],
      ["compute", "Compute"], ["cache", "Cache"], ["events", "Events"], ["data", "Data / storage"], ["observe", "Operations"], ["integration", "Integration"]
    ];
    $("design-component-list").innerHTML = stages.filter((stage) => filter === "all" || filter === stage.key).map((stage) => {
      const items = pendingDesignNodes[stage.key];
      return `<section class="design-editor-layer" data-editor-layer="${stage.key}">
        <h3>${escapeHtml(stage.title.replace(/^\d+\s+/, ""))}<span>${items.length}</span></h3>
        ${items.length ? items.map((item, index) => `<article class="design-component-row" data-component-index="${index}">
          <label>Component name<input data-component-field="name" maxlength="60" value="${escapeHtml(item.name)}" aria-label="${escapeHtml(stage.title)} component name"></label>
          <label>Purpose / connection<input data-component-field="note" maxlength="100" value="${escapeHtml(item.note)}" aria-label="${escapeHtml(stage.title)} component purpose"></label>
          <label>Icon<select data-component-field="kind" aria-label="${escapeHtml(stage.title)} component icon">${kindOptions.map(([kind, label]) => `<option value="${kind}"${item.kind === kind ? " selected" : ""}>${label}</option>`).join("")}</select></label>
          <label>Layer<select data-component-field="layer" aria-label="${escapeHtml(stage.title)} component layer">${stageOptions.map(([key, label]) => `<option value="${key}"${stage.key === key ? " selected" : ""}>${label}</option>`).join("")}</select></label>
          <div class="design-component-actions"><button type="button" class="button button-export" data-component-action="up" aria-label="Move ${escapeHtml(item.name)} earlier in layer"${index === 0 ? " disabled" : ""}>↑</button><button type="button" class="button button-export" data-component-action="down" aria-label="Move ${escapeHtml(item.name)} later in layer"${index === items.length - 1 ? " disabled" : ""}>↓</button><button type="button" class="button button-export design-component-remove" data-component-action="remove" aria-label="Remove ${escapeHtml(item.name)}">Remove</button></div>
        </article>`).join("") : '<p class="design-empty-layer">No components in this layer.</p>'}
      </section>`;
    }).join("");
    const total = Object.values(pendingDesignNodes).reduce((sum, items) => sum + items.length, 0);
    $("design-editor-count").textContent = `${total} component${total === 1 ? "" : "s"}`;
  }

  function openDesignEditor() {
    pendingDesignNodes = copyDesignNodes(getEffectiveNodes());
    $("editor-stage-filter").value = "all";
    $("editor-layer-gap").value = String(state.layerGap);
    $("design-editor-error").textContent = "";
    renderDesignEditor();
    $("design-editor-dialog").showModal();
  }

  function moveEditorComponent(layer, index, direction) {
    const items = pendingDesignNodes[layer];
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    [items[index], items[nextIndex]] = [items[nextIndex], items[index]];
    renderDesignEditor();
  }

  function applyDesignChanges() {
    const layerGap = Number($("editor-layer-gap").value);
    if (!Number.isInteger(layerGap) || layerGap < 20 || layerGap > 120) {
      $("design-editor-error").textContent = "Set the gap between layers to a whole number from 20 to 120 pixels.";
      $("editor-layer-gap").focus();
      return;
    }
    for (const { key } of stages) {
      const normalized = pendingDesignNodes[key].map((item) => ({
        ...item,
        name: item.name.trim(),
        note: item.note.trim()
      }));
      if (normalized.some((item) => !item.name)) {
        $("design-editor-error").textContent = "Every component needs a name. Add a name or remove the empty component.";
        return;
      }
      if (normalized.length > 5) {
        $("design-editor-error").textContent = "Each layer can contain at most five components so the diagram stays readable.";
        return;
      }
      pendingDesignNodes[key] = normalized;
    }
    state.designNodes = copyDesignNodes(pendingDesignNodes);
    state.layerGap = layerGap;
    render();
    $("design-editor-dialog").close();
    $("design-editor-error").textContent = "";
    showToast("Architecture changes applied to the diagram, component list, and documentation.");
  }

  function renderSteps() {
    $("steps-view").innerHTML = `<p class="view-intro">A practical path from architecture approval to a production-ready ${escapeHtml(providers[state.provider].regions.find(([value]) => value === state.region)[1])} deployment.</p><ol class="implementation-list">${buildSteps().map(([title, description], index) =>
      `<li><span class="implementation-number">${index + 1}</span><div class="step-content"><strong>${escapeHtml(title)}</strong><p>${escapeHtml(description)}</p></div></li>`
    ).join("")}</ol><div class="assumption-note"><strong>Estimate assumptions:</strong> planning-level USD figures, continuous production service, typical managed-service usage, and no committed-use discounts, support fees, taxes, data-transfer surprises, or licensing add-ons. Obtain a provider calculator estimate before approval.</div>`;
  }

  function render() {
    renderDiagram();
    renderSecurity();
    renderTechnologyStack();
    renderRationale();
    renderCost();
    renderComponents();
    renderSteps();
    $("diagram-title").textContent = {
      web: "Commerce, built to scale",
      data: "Data, connected end to end",
      ai: "AI, ready for production",
      iot: "Telemetry, at the edge"
    }[state.workload];
    const captions = {
      web: "Requests pass through edge security to a private network; asynchronous events connect the data tier to secure payment, tax and shipping integrations.",
      data: "Private connectors ingest ERP, CRM and SaaS data into governed storage; scoped credentials, checkpoints and pipeline monitoring protect each flow.",
      ai: "Documents enter through authenticated APIs; private model and event services connect secure repositories to inference and monitored storage.",
      iot: "Devices connect over mutually authenticated MQTT; a private network routes buffered events to time-series storage and partner brokers."
    };
    $("diagram-caption").textContent = captions[state.workload];
    $("availability-value").textContent = state.multiRegion ? "99.95%" : "99.9%";
    $("availability-detail").textContent = state.multiRegion ? "Multi-region failover" : "Multi-zone resilience";
    $("scalability-value").textContent = state.traffic === "moderate" ? "Medium" : "High";
    $("scalability-detail").textContent = state.traffic === "variable" ? "Burst-ready buffering" : "Autoscaling enabled";
    $("updated-time").textContent = "Just now";
    const count = Object.values(getEffectiveNodes()).reduce((sum, items) => sum + items.length, 0) + 1;
    document.querySelector(".tab-count").textContent = String(count);
    saveDraft();
  }

  function restoreDraft() {
    try {
      const serialized = window.localStorage.getItem(storageKey);
      if (!serialized) return;
      const draft = JSON.parse(serialized);
      if (!draft || typeof draft !== "object" || Array.isArray(draft)) throw new Error("The saved draft has an invalid format.");
      if (Object.prototype.hasOwnProperty.call(providers, draft.provider)) state.provider = draft.provider;
      if (["web", "data", "ai", "iot"].includes(draft.workload)) state.workload = draft.workload;
      if (["moderate", "high", "variable"].includes(draft.traffic)) state.traffic = draft.traffic;
      if (typeof draft.multiRegion === "boolean") state.multiRegion = draft.multiRegion;
      if (Number.isInteger(draft.layerGap) && draft.layerGap >= 20 && draft.layerGap <= 120) state.layerGap = draft.layerGap;
      const regions = providers[state.provider].regions;
      state.region = regions.some(([value]) => value === draft.region) ? draft.region : regions[0][0];
      const failoverRegions = regions.filter(([value]) => value !== state.region);
      state.secondRegion = failoverRegions.some(([value]) => value === draft.secondRegion) ? draft.secondRegion : (failoverRegions[0] || regions[0])[0];
      state.designNodes = validateDesignNodes(draft.designNodes);
      if (typeof draft.requirement === "string") $("requirement-input").value = draft.requirement;
      if (typeof draft.title === "string" && draft.title.trim()) $("architecture-title").textContent = draft.title.slice(0, 80);
      $("provider-select").value = state.provider;
      $("workload-select").value = state.workload;
      $("traffic-select").value = state.traffic;
      $("multi-region-toggle").checked = state.multiRegion;
    } catch (error) {
      showToast(`Could not restore the local design (${error.name}). The starter design is available.`);
    }
  }

  function saveDraft() {
    const draft = {
      provider: state.provider,
      region: state.region,
      secondRegion: state.secondRegion,
      traffic: state.traffic,
      workload: state.workload,
      multiRegion: state.multiRegion,
      layerGap: state.layerGap,
      requirement: $("requirement-input").value,
      title: $("architecture-title").textContent,
      designNodes: copyDesignNodes(getEffectiveNodes())
    };
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(draft));
      $("saved-label").textContent = "Saved in this browser";
    } catch (error) {
      $("saved-label").textContent = "Export to save";
      if (!state.storageWarningShown) {
        showToast(`Local draft storage is unavailable (${error.name}). Export the design to keep a copy.`);
        state.storageWarningShown = true;
      }
    }
  }

  function readCustomTemplates() {
      try {
        const value = JSON.parse(window.localStorage.getItem(templateStorageKey) || "[]");
        if (!Array.isArray(value)) throw new Error("Saved templates are not a list.");
        return value.filter((template) => template && typeof template.id === "string" && template.id.startsWith("custom-") &&
          typeof template.name === "string" && typeof template.category === "string" && typeof template.description === "string" &&
          typeof template.requirement === "string" && Object.prototype.hasOwnProperty.call(providers, template.provider) &&
          ["web", "data", "ai", "iot"].includes(template.workload) && ["moderate", "high", "variable"].includes(template.traffic) &&
          typeof template.multiRegion === "boolean");
      } catch (error) {
        showToast(`Could not load custom templates (${error.name}). Built-in templates remain available.`);
        return [];
      }
    }

  function getTemplates() {
    return [...builtInTemplates, ...readCustomTemplates()];
  }

  function renderTemplateCards() {
      const query = $("template-search").value.trim().toLowerCase();
      const allTemplates = getTemplates();
      const templates = allTemplates.filter((template) =>
        `${template.name} ${template.category} ${template.description} ${template.requirement}`.toLowerCase().includes(query)
      );
      $("template-count").textContent = String(allTemplates.length);
      $("template-empty").classList.toggle("hidden", templates.length > 0);
      $("template-card-grid").innerHTML = templates.map((template) => {
        const custom = template.id.startsWith("custom-");
        return `<article class="template-card">
          <div class="template-card-meta"><span class="template-category">${escapeHtml(template.category)}</span><span class="template-provider">${escapeHtml(template.provider)}</span></div>
          <h3>${escapeHtml(template.name)}</h3>
          <p>${escapeHtml(template.description)}</p>
          <div class="template-card-tags"><span>${escapeHtml(workloadLabels[template.workload])}</span><span>${escapeHtml(template.traffic === "variable" ? "Variable traffic" : `${template.traffic[0].toUpperCase()}${template.traffic.slice(1)} traffic`)}</span><span>${template.multiRegion ? "Multi-region" : "Single region"}</span></div>
          <div class="template-card-actions"><button class="button button-primary" type="button" data-template-action="use" data-template-id="${escapeHtml(template.id)}">Use template</button><button class="button button-export" type="button" data-template-action="edit" data-template-id="${escapeHtml(template.id)}" aria-label="${custom ? "Edit" : "Customize"} ${escapeHtml(template.name)}">${custom ? "Edit" : "Customize"}</button></div>
        </article>`;
      }).join("");
  }

  function showTemplateEditor(template = null) {
      editingTemplateId = template && template.id.startsWith("custom-") ? template.id : null;
      const isEditingCustom = Boolean(editingTemplateId);
      $("template-editor").reset();
      $("template-editor-error").textContent = "";
      $("template-editor-title").textContent = template ? (isEditingCustom ? "Edit custom template" : "Customize built-in template") : "Create custom template";
      $("template-name").value = template ? `${!isEditingCustom ? "Copy of " : ""}${template.name}` : "";
      $("template-category").value = template ? template.category : "";
      $("template-description").value = template ? template.description : "";
      $("template-requirement").value = template ? template.requirement : "";
      $("template-provider").value = template ? template.provider : state.provider;
      $("template-workload").value = template ? template.workload : state.workload;
      $("template-traffic").value = template ? template.traffic : state.traffic;
      $("template-multiregion").checked = template ? template.multiRegion : state.multiRegion;
      $("delete-template-button").classList.toggle("hidden", !isEditingCustom);
      $("template-card-grid").classList.add("hidden");
      $("template-library-toolbar").classList.add("hidden");
      $("template-empty").classList.add("hidden");
      $("template-editor").classList.remove("hidden");
      $("template-name").focus();
  }

  function showTemplateLibrary() {
      $("template-editor").classList.add("hidden");
      $("template-card-grid").classList.remove("hidden");
      $("template-library-toolbar").classList.remove("hidden");
      renderTemplateCards();
  }

  function useTemplate(template) {
      $("requirement-input").value = template.requirement;
      $("architecture-title").textContent = template.name;
      $("provider-select").value = template.provider;
      $("traffic-select").value = template.traffic;
      $("workload-select").value = template.workload;
      $("multi-region-toggle").checked = template.multiRegion;
      state.provider = template.provider;
      state.traffic = template.traffic;
      state.workload = template.workload;
      state.multiRegion = template.multiRegion;
      state.designNodes = null;
      state.region = providers[state.provider].regions[0][0];
      state.secondRegion = providers[state.provider].regions[1][0];
      renderRegionOptions(false);
      render();
      $("template-dialog").close();
      $("requirement").scrollIntoView({ behavior: "smooth", block: "start" });
      $("requirement-input").focus({ preventScroll: true });
      showToast(`Loaded “${template.name}”. Adjust the requirement or settings, then generate your design.`);
  }

  function saveCustomTemplate(event) {
      event.preventDefault();
      const customTemplates = readCustomTemplates();
      const template = {
        id: editingTemplateId || `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: $("template-name").value.trim(),
        category: $("template-category").value.trim(),
        description: $("template-description").value.trim(),
        requirement: $("template-requirement").value.trim(),
        provider: $("template-provider").value,
        workload: $("template-workload").value,
        traffic: $("template-traffic").value,
        multiRegion: $("template-multiregion").checked
      };
      if (!template.name || !template.category || !template.description || !template.requirement) {
        $("template-editor-error").textContent = "Complete the name, category, description, and business requirement.";
        return;
      }
      const existingIndex = customTemplates.findIndex((item) => item.id === editingTemplateId);
      if (existingIndex >= 0) customTemplates[existingIndex] = template;
      else customTemplates.push(template);
      try {
        window.localStorage.setItem(templateStorageKey, JSON.stringify(customTemplates));
        $("template-search").value = "";
        showTemplateLibrary();
        showToast(editingTemplateId ? "Custom template updated in this browser." : "Custom template saved in this browser.");
        editingTemplateId = null;
      } catch (error) {
        $("template-editor-error").textContent = `Could not save this template (${error.name}). Check browser storage and try again.`;
      }
  }

  function deleteCustomTemplate() {
      if (!editingTemplateId) return;
      const customTemplates = readCustomTemplates();
      const updated = customTemplates.filter((template) => template.id !== editingTemplateId);
      try {
        window.localStorage.setItem(templateStorageKey, JSON.stringify(updated));
        editingTemplateId = null;
        $("template-search").value = "";
        showTemplateLibrary();
        showToast("Custom template deleted.");
      } catch (error) {
        $("template-editor-error").textContent = `Could not delete this template (${error.name}).`;
    }
  }

  function updateStateFromControls() {
    const providerChanged = state.provider !== $("provider-select").value;
    const workloadChanged = state.workload !== $("workload-select").value;
    state.provider = $("provider-select").value;
    state.workload = $("workload-select").value;
    state.traffic = $("traffic-select").value;
    state.multiRegion = $("multi-region-toggle").checked;
    if (providerChanged || workloadChanged) state.designNodes = null;
    renderRegionOptions(true);
    render();
  }

  function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2800);
  }

  function setView(name) {
    document.querySelectorAll(".view-tab").forEach((tab) => {
      const active = tab.dataset.view === name;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    $("diagram-view").classList.toggle("hidden", name !== "diagram");
    $("components-view").classList.toggle("hidden", name !== "components");
    $("steps-view").classList.toggle("hidden", name !== "steps");
  }

  function makeMarkdown() {
    const { costs } = getCost();
    const costLines = Object.entries(costs).map(([name, value]) => `| ${name[0].toUpperCase()}${name.slice(1)} | $${formatCurrency(value)} |`).join("\n");
    const securityLines = getSecurityControls().map(([label, text]) => `- **${label}:** ${text}`).join("\n");
    const componentLines = [
      `### Network boundary\n- **Virtual network:** ${networkServices[state.provider][0]} (${networkServices[state.provider][2]})\n- **Private connectivity and egress:** ${networkServices[state.provider][1]}`,
      ...stages.map((stage) => `### ${stage.title.slice(4)}\n${getEffectiveNodes()[stage.key].map((item) => `- **${item.name}:** ${item.note}`).join("\n")}`),
      `### External integrations\n- **Integration endpoints:** ${integrationCatalog[state.workload][0]}\n- **Connectivity controls:** ${integrationCatalog[state.workload][1]}`
    ].join("\n\n");
    const implementationLines = buildSteps().map(([title, description], index) => `${index + 1}. **${title}.** ${description}`).join("\n");
    const rationales = getRationales().map((item) => `- **${item.title}:** ${item.copy}`).join("\n");
    const technicalSpecLines = getTechnicalSpecifications().map((section) => {
      if (section.columns) {
        return `### ${section.title}\n\n| ${section.columns.join(" | ")} |\n| ${section.columns.map(() => "---").join(" | ")} |\n${section.rows.map((row) => `| ${row.join(" | ")} |`).join("\n")}`;
      }
      return `### ${section.title}\n\n${section.rows.map(([label, value]) => `- **${label}:** ${value}`).join("\n")}`;
    }).join("\n\n");
    const primaryRegion = providers[state.provider].regions.find(([value]) => value === state.region)[1];
    const secondaryRegion = providers[state.provider].regions.find(([value]) => value === state.secondRegion)[1];
    const requirement = $("requirement-input").value.trim() || "No business requirement provided.";
    return `# ${$("architecture-title").textContent}

> Draft architecture generated by Archway Studio. Validate service availability, security posture, costs, and recovery objectives before production use.

## Requirement

${requirement}

## Architecture summary

- **Cloud:** ${state.provider}
- **Primary region:** ${primaryRegion} (\`${state.region}\`)
- **Failover region:** ${state.multiRegion ? `${secondaryRegion} (\`${state.secondRegion}\`)` : "Not configured"}
- **Workload:** ${workloadLabels[state.workload]}
- **Traffic profile:** ${state.traffic}
- **Resilience:** ${state.multiRegion ? "Multi-region failover" : "Single region with multi-zone resilience"}
- **Availability design target:** ${state.multiRegion ? "99.95%" : "99.9%"} (not an SLA)

## Architecture diagram

See the companion SVG export for the provider-specific architecture flow.

## Key components

${componentLines}

## Data flow

1. Users and producers connect over HTTPS to the provider-managed ingress and web application firewall.
2. Authenticated requests reach autoscaling application or workload services through private network paths.
3. Application services read and write to managed databases, cache, and durable object storage using managed identities.
4. Business events are buffered and processed asynchronously to decouple producers from downstream services.
5. Centralized metrics, logs, traces, audit records, and alerts provide operational visibility.

## Technical deployment specification

${technicalSpecLines}

## Security controls

${securityLines}
- Store credentials and encryption keys in managed secrets and key services; rotate them according to policy.
- Enforce private connectivity, data classification, retention policies, vulnerability scanning, and tested backups.

## Scalability and resilience

- Autoscale stateless compute horizontally and use queues or event streams to absorb bursts.
- Apply connection pooling, caching, rate limiting, quotas, and load tests to protect data services.
- ${state.multiRegion ? "Replicate critical data and test health-based regional failover against explicitly agreed RTO/RPO." : "Use zone redundancy and documented backups; multi-region recovery is not enabled in this design."}
- Measure service-level indicators and rehearse recovery and incident response.

## Estimated monthly cost (USD)

Planning estimate for continuous production use. Actual prices vary by region, traffic, retention, service configuration, discount, and data transfer.

| Service group | Estimate |
| --- | ---: |
${costLines}
| **Estimated total** | **$${formatCurrency(getCost().total)} / month** |

**Expected planning range:** $${formatCurrency(Math.round(getCost().total * 0.8))}–$${formatCurrency(Math.round(getCost().total * 1.33))} / month. Excludes support plans, taxes, commercial licensing, and unusual egress. Validate in the ${state.provider} pricing calculator.

## Architecture rationale

${rationales}

## Implementation steps

${implementationLines}

## Assumptions and review checklist

- SKU sizes, replica bounds and recovery objectives are planning baselines, not validated capacity commitments; confirm with representative load, vendor pricing and service quotas.
- Confirm regulatory, privacy, residency, and data-retention requirements with the security and legal teams.
- Confirm quotas, regional service availability, licensing, backup retention, RTO/RPO, and load assumptions.
- Complete a threat model, resilience test, cost review, and production readiness assessment before launch.
`;
  }
  function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type });
    downloadBlob(filename, blob);
  }

  function downloadBlob(filename, blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function safeFilename(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "architecture";
  }

  function setAuthStatus(message, isError = true) {
    const status = $("entra-status");
    status.textContent = message;
    status.classList.toggle("success", !isError);
  }

  function setAdminStatus(message, isError = true) {
    const status = $("admin-status");
    status.textContent = message;
    status.classList.toggle("success", !isError);
  }

  function applyTheme(theme) {
    const selectedTheme = theme === "dark" ? "dark" : "light";
    document.body.dataset.theme = selectedTheme;
    $("theme-select").value = selectedTheme;
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = selectedTheme === "dark" ? "#101522" : "#0d1220";
  }

  function restoreTheme() {
    try {
      const theme = window.localStorage.getItem(themeStorageKey);
      applyTheme(theme === "dark" ? "dark" : "light");
    } catch (error) {
      applyTheme("light");
      setAdminStatus(`Could not read saved appearance settings (${error.name}).`);
    }
  }

  function getDefaultRedirectUri() {
    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    return window.location.origin !== "null" && (window.location.protocol === "https:" || isLocalhost)
      ? `${window.location.origin}${window.location.pathname}`
      : "";
  }

  function openAdminPanel() {
    const config = readEntraConfig();
    $("entra-tenant-id").value = config && config.tenantId || "";
    $("entra-client-id").value = config && config.clientId || "";
    $("entra-redirect-uri").value = config && config.redirectUri || getDefaultRedirectUri();
    $("admin-dialog").showModal();
    $("theme-select").focus();
  }

  function readEntraConfig() {
    try {
      const value = JSON.parse(window.localStorage.getItem(entraConfigKey) || "null");
      return value && typeof value === "object" ? value : null;
    } catch (error) {
      setAuthStatus(`Could not read saved Entra settings (${error.name}).`);
      return null;
    }
  }

  function validateEntraConfig(values = null) {
    const tenantId = (values ? values.tenantId : $("entra-tenant-id").value).trim();
    const clientId = (values ? values.clientId : $("entra-client-id").value).trim();
    const redirectUri = (values ? values.redirectUri : $("entra-redirect-uri").value).trim();
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clientId)) {
      throw new Error("Enter a valid application (client) ID GUID.");
    }
    const tenantGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tenantId);
    const tenantDomain = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(?:\.(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?))*$/i.test(tenantId);
    if (!tenantGuid && !tenantDomain) {
      throw new Error("Enter a valid tenant ID GUID or verified domain.");
    }
    let redirect;
    try {
      redirect = new URL(redirectUri);
    } catch {
      throw new Error("Enter a valid HTTPS or localhost redirect URI.");
    }
    const isLocalhost = redirect.hostname === "localhost" || redirect.hostname === "127.0.0.1";
    if (redirect.protocol !== "https:" && !(redirect.protocol === "http:" && isLocalhost)) {
      throw new Error("The redirect URI must use HTTPS, or HTTP on localhost.");
    }
    if (window.location.origin === "null" || redirect.origin !== window.location.origin) {
      throw new Error("Serve this app over HTTPS or localhost and use its exact origin as the redirect URI.");
    }
    return { tenantId, clientId, redirectUri: redirect.href };
  }

  function loadMsal() {
    if (window.msal && window.msal.PublicClientApplication) return Promise.resolve(window.msal);
    if (msalLoadPromise) return msalLoadPromise;
    msalLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = msalScriptUrl;
      script.async = true;
      script.onload = () => {
        if (window.msal && window.msal.PublicClientApplication) resolve(window.msal);
        else reject(new Error("Microsoft Authentication Library loaded without its browser API."));
      };
      script.onerror = () => reject(new Error("Could not load Microsoft Authentication Library. Check your network and content-blocking settings."));
      document.head.appendChild(script);
    }).catch((error) => {
      msalLoadPromise = null;
      throw error;
    });
    return msalLoadPromise;
  }

  async function getMsalClient(config) {
    const key = `${config.tenantId}|${config.clientId}|${config.redirectUri}`;
    if (msalClient && key === msalClientKey) return msalClient;
    const msal = await loadMsal();
    const client = new msal.PublicClientApplication({
      auth: {
        clientId: config.clientId,
        authority: `https://login.microsoftonline.com/${encodeURIComponent(config.tenantId)}`,
        redirectUri: config.redirectUri,
        postLogoutRedirectUri: config.redirectUri
      },
      cache: { cacheLocation: "sessionStorage" }
    });
    await client.initialize();
    msalClient = client;
    msalClientKey = key;
    return client;
  }

  function showAuthenticatedApp(user) {
    const name = user.displayName || user.username || "Signed-in user";
    const initials = name.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("") || "U";
    $("login-screen").classList.add("hidden");
    $("app-shell").classList.remove("hidden");
    $("account-label").textContent = name;
    $("account-label").title = name;
    $("profile-name").textContent = name;
    $("profile-avatar").textContent = initials;
    $("profile-role").textContent = user.provider === "entra" ? "Microsoft Entra ID" : "Local demo · not secured";
    $("profile-sign-out").setAttribute("aria-label", `Sign out ${name}`);
    if (!designAppInitialized) {
      restoreDraft();
      renderRegionOptions(true);
      wireEvents();
      render();
      designAppInitialized = true;
    }
  }

  function showLogin() {
    $("app-shell").classList.add("hidden");
    $("login-screen").classList.remove("hidden");
    $("local-display-name").focus();
  }

  function signInLocally(displayName) {
    const user = { provider: "local", displayName: displayName.trim() };
    try {
      window.sessionStorage.setItem(authSessionKey, JSON.stringify(user));
    } catch (error) {
      setAuthStatus(`Could not start a local demo session (${error.name}).`);
      return;
    }
    showAuthenticatedApp(user);
  }

  async function signInWithEntra() {
    setAuthStatus("");
    try {
      const savedConfig = readEntraConfig();
      if (!savedConfig) throw new Error("Microsoft Entra ID is not configured. Sign in with the local demo and open Admin & settings to configure it.");
      const config = validateEntraConfig(savedConfig);
      window.localStorage.setItem(entraConfigKey, JSON.stringify(config));
      const client = await getMsalClient(config);
      const result = await client.loginPopup({
        scopes: ["openid", "profile"],
        redirectUri: config.redirectUri
      });
      if (!result.account) throw new Error("Microsoft sign-in completed without returning an account.");
      client.setActiveAccount(result.account);
      const user = { provider: "entra", displayName: result.account.name || result.account.username, username: result.account.username };
      window.sessionStorage.setItem(authSessionKey, JSON.stringify(user));
      showAuthenticatedApp(user);
    } catch (error) {
      setAuthStatus(error.message || `Microsoft sign-in failed (${error.name}).`);
    }
  }

  async function signOut() {
    let user = null;
    try {
      user = JSON.parse(window.sessionStorage.getItem(authSessionKey) || "null");
    } catch (error) {
      setAuthStatus(`Could not read the current session (${error.name}).`);
    }
    if (user && user.provider === "entra") {
      try {
        const config = readEntraConfig();
        if (config) {
          const client = await getMsalClient(config);
          await client.logoutPopup({ account: client.getActiveAccount() || client.getAllAccounts()[0], postLogoutRedirectUri: config.redirectUri });
        }
      } catch (error) {
        setAuthStatus(`Signed out of this app, but Microsoft sign-out could not complete (${error.message || error.name}).`);
      }
    }
    try {
      window.sessionStorage.removeItem(authSessionKey);
    } catch (error) {
      setAuthStatus(`Could not clear the current browser session (${error.name}).`);
    }
    showLogin();
  }

  function setAuthEvents() {
    $("local-login-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const displayName = $("local-display-name").value.trim();
      if (!displayName) {
        $("local-display-name").focus();
        return;
      }
      signInLocally(displayName);
    });
    $("save-entra-config").addEventListener("click", () => {
      try {
        const config = validateEntraConfig();
        window.localStorage.setItem(entraConfigKey, JSON.stringify(config));
        msalClient = null;
        msalClientKey = "";
        setAdminStatus("Entra settings saved in this browser. Sign out, then use Microsoft Entra ID on the sign-in page.", false);
      } catch (error) {
        setAdminStatus(error.message);
      }
    });
    $("clear-entra-config").addEventListener("click", () => {
      try {
        window.localStorage.removeItem(entraConfigKey);
        $("entra-tenant-id").value = "";
        $("entra-client-id").value = "";
        $("entra-redirect-uri").value = getDefaultRedirectUri();
        msalClient = null;
        msalClientKey = "";
        setAdminStatus("Saved Entra settings were cleared from this browser.", false);
      } catch (error) {
        setAdminStatus(`Could not clear Entra settings (${error.name}).`);
      }
    });
    $("theme-select").addEventListener("change", () => {
      const theme = $("theme-select").value === "dark" ? "dark" : "light";
      applyTheme(theme);
      try {
        window.localStorage.setItem(themeStorageKey, theme);
        setAdminStatus(`The ${theme} theme is now active and saved in this browser.`, false);
      } catch (error) {
        setAdminStatus(`The ${theme} theme is active for this session but could not be saved (${error.name}).`);
      }
    });
    $("admin-panel-open").addEventListener("click", openAdminPanel);
    document.querySelectorAll("[data-close-admin]").forEach((button) => {
      button.addEventListener("click", () => $("admin-dialog").close());
    });
    $("admin-dialog").addEventListener("click", (event) => {
      if (event.target === $("admin-dialog")) $("admin-dialog").close();
    });
    $("entra-login-button").addEventListener("click", signInWithEntra);
    $("sign-out-button").addEventListener("click", signOut);
    $("profile-sign-out").addEventListener("click", signOut);
  }

  async function restoreAuthentication() {
    let session = null;
    try {
      session = JSON.parse(window.sessionStorage.getItem(authSessionKey) || "null");
    } catch (error) {
      setAuthStatus(`Could not read the current browser session (${error.name}).`);
    }
    if (session && session.provider === "local" && typeof session.displayName === "string" && session.displayName.trim()) {
      showAuthenticatedApp(session);
      return;
    }
    if (session && session.provider === "entra") {
      const config = readEntraConfig();
      if (config && config.clientId && config.tenantId && config.redirectUri) {
        try {
          const client = await getMsalClient(config);
          const accounts = client.getAllAccounts();
          if (accounts.length) {
            const account = accounts[0];
            client.setActiveAccount(account);
            showAuthenticatedApp({ provider: "entra", displayName: account.name || account.username, username: account.username });
            return;
          }
        } catch (error) {
          setAuthStatus(`Could not restore Microsoft sign-in (${error.message || error.name}).`);
        }
      }
    }
    showLogin();
  }

  function exportSvg() {
    const svg = getExportSvg();
    if (!svg) return;
    downloadFile(`${safeFilename($("architecture-title").textContent)}-diagram.svg`, `<?xml version="1.0" encoding="UTF-8"?>\n${svg}`, "image/svg+xml;charset=utf-8");
    showToast("Architecture diagram exported as SVG.");
  }

  function exportMarkdown() {
    downloadFile(`${safeFilename($("architecture-title").textContent)}-architecture.md`, makeMarkdown(), "text/markdown;charset=utf-8");
    showToast("Architecture documentation exported as Markdown.");
  }

  function getExportSvg() {
    const svg = $("diagram-container").querySelector("svg");
    if (!svg) {
      showToast("Generate a design before exporting the diagram.");
      return null;
    }
    const clone = svg.cloneNode(true);
    const viewBox = (clone.getAttribute("viewBox") || "0 0 1000 676").split(/[\s,]+/).map(Number);
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", String(viewBox[2]));
    clone.setAttribute("height", String(viewBox[3]));
    return new XMLSerializer().serializeToString(clone);
  }

  async function exportRaster(format) {
    const svg = getExportSvg();
    if (!svg) return;
    let svgUrl = null;
    try {
      svgUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
      const image = new Image();
      const imageLoaded = new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = () => reject(new Error("The architecture diagram could not be rendered as an image."));
      });
      image.src = svgUrl;
      await imageLoaded;
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth * scale;
      canvas.height = image.naturalHeight * scale;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Image rendering is unavailable in this browser.");
      if (format === "jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((result) => result ? resolve(result) : reject(new Error("The browser could not encode the architecture image.")), format === "jpeg" ? "image/jpeg" : "image/png", 0.92);
      });
      const extension = format === "jpeg" ? "jpg" : "png";
      downloadBlob(`${safeFilename($("architecture-title").textContent)}-diagram.${extension}`, blob);
      showToast(`Architecture diagram exported as ${extension.toUpperCase()} (${canvas.width} × ${canvas.height}).`);
    } catch (error) {
      showToast(`Could not export the diagram image (${error.message || error.name}).`);
    } finally {
      if (svgUrl) URL.revokeObjectURL(svgUrl);
    }
  }

  function markdownToHtml(markdown) {
    const escapeInline = (value) => escapeHtml(value)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    const lines = markdown.split(/\r?\n/);
    const output = [];
    let index = 0;
    while (index < lines.length) {
      const line = lines[index].trim();
      if (!line) {
        index += 1;
        continue;
      }
      if (/^\|.*\|$/.test(line)) {
        const rows = [];
        while (index < lines.length && /^\s*\|.*\|\s*$/.test(lines[index])) {
          const cells = lines[index].trim().slice(1, -1).split("|").map((cell) => cell.trim());
          if (!cells.every((cell) => /^:?-{3,}:?$/.test(cell))) rows.push(cells);
          index += 1;
        }
        if (rows.length) {
          output.push(`<table><thead><tr>${rows[0].map((cell) => `<th>${escapeInline(cell)}</th>`).join("")}</tr></thead><tbody>${rows.slice(1).map((row) => `<tr>${rows[0].map((_, cellIndex) => `<td>${escapeInline(row[cellIndex] || "")}</td>`).join("")}</tr>`).join("")}</tbody></table>`);
        }
        continue;
      }
      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        const level = heading[1].length;
        output.push(`<h${level}>${escapeInline(heading[2])}</h${level}>`);
        index += 1;
        continue;
      }
      if (/^>\s?/.test(line)) {
        output.push(`<blockquote>${escapeInline(line.replace(/^>\s?/, ""))}</blockquote>`);
        index += 1;
        continue;
      }
      const listMatch = line.match(/^([-*]|\d+\.)\s+(.+)$/);
      if (listMatch) {
        const ordered = /^\d/.test(listMatch[1]);
        const tag = ordered ? "ol" : "ul";
        const items = [];
        while (index < lines.length) {
          const item = lines[index].trim().match(/^([-*]|\d+\.)\s+(.+)$/);
          if (!item || /^\d/.test(item[1]) !== ordered) break;
          items.push(`<li>${escapeInline(item[2])}</li>`);
          index += 1;
        }
        output.push(`<${tag}>${items.join("")}</${tag}>`);
        continue;
      }
      const paragraph = [line];
      index += 1;
      while (index < lines.length && lines[index].trim() && !/^(#{1,3}\s|>\s?|\|.*\||([-*]|\d+\.)\s)/.test(lines[index].trim())) {
        paragraph.push(lines[index].trim());
        index += 1;
      }
      output.push(`<p>${paragraph.map(escapeInline).join(" ")}</p>`);
    }
    return output.join("\n");
  }

  function exportPdf() {
    const svg = getExportSvg();
    if (!svg) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      showToast("The print document was blocked. Allow pop-ups for this page, then try again.");
      return;
    }
    const title = $("architecture-title").textContent;
    const documentation = makeMarkdown().replace(/^# .+\r?\n/, "");
    const documentHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)} — Architecture</title><style>
      :root{font-family:Arial,Helvetica,sans-serif;color:#172033;background:#fff;font-size:11pt;line-height:1.5}
      body{max-width:980px;margin:32px auto;padding:0 28px}h1,h2,h3{color:#18243c;line-height:1.2;break-after:avoid}h1{font-size:25pt;margin:0 0 18px}h2{font-size:17pt;margin:28px 0 10px;border-bottom:1px solid #dbe2ec;padding-bottom:6px}h3{font-size:13pt;margin:20px 0 8px}p,li{orphans:3;widows:3}blockquote{border-left:4px solid #5267d8;padding:8px 14px;background:#f3f5fb;color:#46516a;margin:16px 0}table{width:100%;border-collapse:collapse;margin:12px 0 20px;font-size:9.5pt;break-inside:avoid}th,td{border:1px solid #dbe2ec;text-align:left;padding:7px 9px;vertical-align:top}th{background:#f1f4f9}code{font-family:Consolas,monospace;background:#f1f4f9;padding:1px 4px}.diagram{margin:18px 0 28px;border:1px solid #dbe2ec;border-radius:8px;padding:12px;break-inside:avoid}.diagram svg{display:block;width:100%;height:auto}.document-content{break-before:page}@page{size:auto;margin:16mm}@media print{body{max-width:none;margin:0;padding:0}.diagram{border-color:#cbd3df}}
      </style></head><body><h1>${escapeHtml(title)}</h1><div class="diagram">${svg}</div><main class="document-content">${markdownToHtml(documentation)}</main><script>window.addEventListener("load",function(){window.setTimeout(function(){window.print()},300)})<\/script></body></html>`;
    try {
      printWindow.document.open();
      printWindow.document.write(documentHtml);
      printWindow.document.close();
      $("export-menu").classList.add("hidden");
      $("export-menu-button").setAttribute("aria-expanded", "false");
      showToast("Print dialog opened. Choose “Save as PDF” to create a PDF copy.");
    } catch (error) {
      printWindow.close();
      showToast(`Could not prepare the print document (${error.message || error.name}).`);
    }
  }

  function exportDrawio() {
    const nodes = getEffectiveNodes();
    const cell = (id, value, style, parent, x, y, width, height, type = "vertex") =>
      `<mxCell id="${escapeXml(id)}" value="${escapeXml(value).replace(/\r?\n/g, "&#xa;")}" style="${escapeXml(style)}" ${type}="1" parent="${escapeXml(parent)}"><mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry"/></mxCell>`;
    const stageRows = stages.map((stage, index) => ({ stage, items: nodes[stage.key], y: 104 + index * 136 })).filter(({ items }) => items.length);
    const networkTop = stageRows.find(({ stage }) => stage.key === "compute");
    const networkBottom = stageRows.find(({ stage }) => stage.key === "observe");
    const cells = ['<mxCell id="0"/>', '<mxCell id="1" parent="0"/>'];
    if (networkTop && networkBottom) {
      const height = networkBottom.y - networkTop.y + 104;
      cells.push(cell("network-boundary", `${networkServices[state.provider][0]} · ${networkServices[state.provider][2]}`, "swimlane;html=1;startSize=34;rounded=1;fillColor=#f5f7fb;swimlaneFillColor=#f5f7fb;strokeColor=#8391ad;fontStyle=1;container=0;collapsible=0;recursiveResize=0;", "1", 52, networkTop.y - 15, 1360, height));
    }
    cells.push(cell("design-title", `${$("architecture-title").textContent} · ${state.provider} · ${state.region}`, "text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=20;fontStyle=1;fontColor=#172033;", "1", 52, 24, 1360, 44));

    const componentPositions = new Map();
    let nextId = 2;
    for (const { stage, items, y } of stageRows) {
      const layerLabelId = `layer-label-${stage.key}`;
      cells.push(cell(layerLabelId, stage.title.replace(/^\d+\s+/, ""), "text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=12;fontStyle=1;fontColor=#39445c;whiteSpace=wrap;", "1", 58, y + 17, 148, 48));
      componentPositions.set(stage.key, []);
      items.forEach((item, index) => {
        const id = `component-${nextId++}`;
        const position = { id, x: 220 + index * 224, y, width: 204, height: 82 };
        componentPositions.get(stage.key).push(position);
        cells.push(cell(id, `${item.name}\n${item.note}`, "rounded=1;whiteSpace=wrap;html=1;arcSize=12;fillColor=#ffffff;strokeColor=#91a0bb;fontColor=#202b41;fontSize=12;spacing=8;align=left;verticalAlign=middle;shadow=1;", "1", position.x, position.y, position.width, position.height));
      });
    }
    for (let layerIndex = 1; layerIndex < stageRows.length; layerIndex += 1) {
      const previous = componentPositions.get(stageRows[layerIndex - 1].stage.key);
      const current = componentPositions.get(stageRows[layerIndex].stage.key);
      previous.forEach((source, sourceIndex) => {
        const target = current.length === 1 ? current[0] : previous.length === 1 ? current : [current[Math.min(sourceIndex, current.length - 1)]];
        for (const destination of Array.isArray(target) ? target : [target]) {
          cells.push(`<mxCell id="flow-${nextId++}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#6477bd;strokeWidth=2;endArrow=block;endFill=1;" edge="1" parent="1" source="${source.id}" target="${destination.id}"><mxGeometry relative="1" as="geometry"/></mxCell>`);
        }
      });
    }
    const integrationY = stageRows[stageRows.length - 1].y + 146;
    cells.push(cell("integration-label", "EXTERNAL INTEGRATIONS", "text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=12;fontStyle=1;fontColor=#39445c;", "1", 58, integrationY + 8, 148, 48));
    cells.push(cell("integration-endpoints", `${integrationCatalog[state.workload][0]}\n${integrationCatalog[state.workload][1]}`, "rounded=1;whiteSpace=wrap;html=1;arcSize=12;fillColor=#f2f0ff;strokeColor=#9b8bdd;fontColor=#30275f;fontSize=12;spacing=8;align=left;verticalAlign=middle;", "1", 220, integrationY, 428, 66));
    const xml = `<?xml version="1.0" encoding="UTF-8"?><mxfile host="app.diagrams.net" agent="Archway Studio" version="24.7.17"><diagram id="architecture" name="Architecture"><mxGraphModel dx="1460" dy="${integrationY + 130}" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1460" pageHeight="${integrationY + 130}" math="0" shadow="0"><root>${cells.join("")}</root></mxGraphModel></diagram></mxfile>`;
    downloadFile(`${safeFilename($("architecture-title").textContent)}-architecture.drawio`, xml, "application/vnd.jgraph.mxfile;charset=utf-8");
    showToast("Editable draw.io architecture exported.");
  }

  function exportJson() {
    const primary = providers[state.provider].regions.find(([value]) => value === state.region);
    const secondary = providers[state.provider].regions.find(([value]) => value === state.secondRegion);
    const { costs, total } = getCost();
    const architecture = {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      title: $("architecture-title").textContent,
      requirement: $("requirement-input").value.trim(),
      cloud: {
        provider: state.provider,
        primaryRegion: { id: state.region, name: primary ? primary[1] : state.region },
        multiRegion: state.multiRegion,
        secondaryRegion: state.multiRegion ? { id: state.secondRegion, name: secondary ? secondary[1] : state.secondRegion } : null
      },
      workload: { id: state.workload, name: workloadLabels[state.workload] },
      trafficProfile: state.traffic,
      layerGapPx: state.layerGap,
      components: stages.map((stage) => ({
        id: stage.key,
        name: stage.title.replace(/^\d+\s+/, ""),
        components: getEffectiveNodes()[stage.key].map(({ id, name, note, kind }) => ({ id, name, purpose: note, kind }))
      })),
      network: {
        boundary: networkServices[state.provider][0],
        segmentation: networkServices[state.provider][2],
        privateConnectivityAndEgress: networkServices[state.provider][1]
      },
      externalIntegrations: { endpoints: integrationCatalog[state.workload][0], connectivityControls: integrationCatalog[state.workload][1] },
      technicalSpecifications: getTechnicalSpecifications(),
      securityControls: getSecurityControls().map(([control, recommendation]) => ({ control, recommendation })),
      estimatedMonthlyCostUsd: {
        breakdown: costs,
        total,
        planningRange: { low: Math.round(total * 0.8), high: Math.round(total * 1.33) },
        assumptions: "Planning estimate only; validate in the provider pricing calculator."
      },
      implementationSteps: buildSteps().map(([title, description], index) => ({ order: index + 1, title, description })),
      architectureRationale: getRationales().map(({ title, copy }) => ({ title, rationale: copy }))
    };
    downloadFile(`${safeFilename($("architecture-title").textContent)}-architecture.json`, `${JSON.stringify(architecture, null, 2)}\n`, "application/json;charset=utf-8");
    showToast("Architecture project exported as JSON.");
  }

  function exportMenu() {
    const menu = $("export-menu");
    const button = $("export-menu-button");
    const opening = menu.classList.contains("hidden");
    menu.classList.toggle("hidden", !opening);
    button.setAttribute("aria-expanded", String(opening));
    if (opening) $("export-svg-button").focus();
    else button.focus();
  }

  function toggleResourcesMenu() {
    const menu = $("resources-menu");
    const button = $("resources-menu-button");
    const opening = menu.classList.contains("hidden");
    menu.classList.toggle("hidden", !opening);
    button.setAttribute("aria-expanded", String(opening));
    if (opening) menu.querySelector('[role="menuitem"]').focus();
    else button.focus();
  }

  function openResourceTopic(topic) {
    const resources = {
      standards: {
        section: "standards-topic",
        title: "Architecture standards & best practices",
        intro: "Use these prompts as design and review guidance, not as a claim of compliance or certification."
      },
      decisions: {
        section: "decisions-topic",
        title: "Architecture decision records",
        intro: "Capture context, alternatives, consequences, and review triggers. These initial records document the tool; add design-specific records for each production architecture."
      },
      readme: {
        section: "readme-topic",
        title: "Archway Studio · README",
        intro: "Project overview, setup instructions, capabilities, and important limitations."
      },
      "release-notes": {
        section: "release-notes-topic",
        title: "Release notes",
        intro: "Version history and the changes included in each Archway Studio release."
      },
      license: {
        section: "license-topic",
        title: "Proprietary license",
        intro: "Usage rights and distribution terms for Archway Studio."
      }
    };
    const resource = resources[topic];
    if (!resource) {
      showToast("That resource is not available.");
      return;
    }
    $("resources-dialog-title").textContent = resource.title;
    $("resources-dialog-intro").textContent = resource.intro;
    document.querySelectorAll(".resources-topic").forEach((section) => {
      section.classList.toggle("hidden", section.id !== resource.section);
    });
    $("resources-menu").classList.add("hidden");
    $("resources-menu-button").setAttribute("aria-expanded", "false");
    $("resources-dialog").showModal();
    $("resources-dialog-close").focus();
  }

  function generateDesign() {
    const requirement = $("requirement-input").value.trim();
    if (!requirement) {
      $("requirement-input").focus();
      showToast("Add a business requirement before generating a design.");
      return;
    }
    const previousWorkload = state.workload;
    state.workload = inferWorkload(requirement);
    if (previousWorkload !== state.workload) state.designNodes = null;
    $("workload-select").value = state.workload;
    $("architecture-title").textContent = /ecommerce|commerce|checkout|online store/.test(requirement.toLowerCase()) ? "Commerce platform" : requirement.split(/[.!?\n]/)[0].slice(0, 48) || "Architecture design";
    if (state.traffic === "moderate" && /spike|burst|seasonal|peak|variable/i.test(requirement)) {
      state.traffic = "variable";
      $("traffic-select").value = state.traffic;
    }
    render();
    setView("diagram");
    showToast("Architecture generated from your requirement. Review assumptions before implementation.");
  }

  function resetDesign() {
    $("requirement-input").value = "";
    $("architecture-title").textContent = "New architecture design";
    state.designNodes = null;
    state.layerGap = 33;
    $("workload-select").value = "web";
    $("traffic-select").value = "moderate";
    $("multi-region-toggle").checked = false;
    state.showAllRationale = false;
    updateStateFromControls();
    $("requirement-input").focus();
  }

  function showAssumptions() {
    showToast("Planning estimate only: continuous production use, typical managed-service traffic, no discounts or taxes. Validate with the selected cloud provider's pricing calculator.");
  }

  function fitDiagram() {
    const canvas = $("diagram-container");
    const wasZoomed = document.querySelector(".diagram-zoom");
    if (wasZoomed) {
      wasZoomed.remove();
      $("zoom-button").setAttribute("aria-label", "Fit architecture to view");
      return;
    }
    const modal = document.createElement("div");
    modal.className = "diagram-zoom";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Architecture diagram preview");
    modal.innerHTML = '<button class="zoom-close" type="button">Close diagram <span aria-hidden="true">×</span></button><div class="diagram-scroll"></div>';
    modal.querySelector(".diagram-scroll").innerHTML = canvas.innerHTML;
    document.body.appendChild(modal);
    modal.querySelector(".zoom-close").addEventListener("click", () => {
      modal.remove();
      $("zoom-button").focus();
    });
    modal.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        modal.remove();
        $("zoom-button").focus();
      }
    });
    modal.querySelector(".zoom-close").focus();
  }

  function wireEvents() {
    $("edit-architecture-button").addEventListener("click", openDesignEditor);
    $("editor-stage-filter").addEventListener("change", renderDesignEditor);
    $("design-component-list").addEventListener("input", (event) => {
      const input = event.target.closest("input[data-component-field]");
      if (!input) return;
      const row = input.closest(".design-component-row");
      const layer = row.closest("[data-editor-layer]").dataset.editorLayer;
      pendingDesignNodes[layer][Number(row.dataset.componentIndex)][input.dataset.componentField] = input.value;
    });
    $("design-component-list").addEventListener("change", (event) => {
      const select = event.target.closest("select[data-component-field]");
      if (!select) return;
      const row = select.closest(".design-component-row");
      const layer = row.closest("[data-editor-layer]").dataset.editorLayer;
      const index = Number(row.dataset.componentIndex);
      if (select.dataset.componentField === "kind") {
        pendingDesignNodes[layer][index].kind = select.value;
      } else if (select.dataset.componentField === "layer") {
        const targetLayer = select.value;
        if (pendingDesignNodes[targetLayer].length >= 5) {
          $("design-editor-error").textContent = "That layer already has five components. Move or remove a component before moving another here.";
          select.value = layer;
          return;
        }
        const [component] = pendingDesignNodes[layer].splice(index, 1);
        pendingDesignNodes[targetLayer].push(component);
        $("design-editor-error").textContent = "";
        renderDesignEditor();
      }
    });
    $("design-component-list").addEventListener("click", (event) => {
      const button = event.target.closest("[data-component-action]");
      if (!button) return;
      const row = button.closest(".design-component-row");
      const layer = row.closest("[data-editor-layer]").dataset.editorLayer;
      const index = Number(row.dataset.componentIndex);
      if (button.dataset.componentAction === "remove") pendingDesignNodes[layer].splice(index, 1);
      else moveEditorComponent(layer, index, button.dataset.componentAction === "up" ? -1 : 1);
      $("design-editor-error").textContent = "";
      renderDesignEditor();
    });
    $("design-add-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const name = $("new-component-name").value.trim();
      const layer = $("new-component-stage").value;
      if (!name) return;
      if (pendingDesignNodes[layer].length >= 5) {
        $("design-editor-error").textContent = "That layer already has five components. Move or remove a component before adding another.";
        return;
      }
      const defaultKinds = { clients: "clients", edge: "edge", compute: "compute", events: "events", data: "data", observe: "observe" };
      pendingDesignNodes[layer].push({
        id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        note: $("new-component-note").value.trim() || "Custom architecture component",
        kind: defaultKinds[layer] || "compute"
      });
      $("design-add-form").reset();
      $("new-component-stage").value = layer;
      $("editor-stage-filter").value = "all";
      $("design-editor-error").textContent = "";
      renderDesignEditor();
    });
    $("reset-design-components").addEventListener("click", () => {
      pendingDesignNodes = copyDesignNodes(getDefaultNodes());
      $("editor-stage-filter").value = "all";
      $("design-editor-error").textContent = "";
      renderDesignEditor();
    });
    $("apply-design-changes").addEventListener("click", applyDesignChanges);
    document.querySelectorAll("[data-close-design-editor]").forEach((button) => {
      button.addEventListener("click", () => $("design-editor-dialog").close());
    });
    $("design-editor-dialog").addEventListener("click", (event) => {
      if (event.target === $("design-editor-dialog")) $("design-editor-dialog").close();
    });
    $("open-templates").addEventListener("click", () => {
      $("template-search").value = "";
      showTemplateLibrary();
      $("template-dialog").showModal();
      $("template-search").focus();
    });
    $("template-search").addEventListener("input", renderTemplateCards);
    $("create-template-button").addEventListener("click", () => showTemplateEditor());
    $("template-card-grid").addEventListener("click", (event) => {
      const button = event.target.closest("[data-template-action]");
      if (!button) return;
      const template = getTemplates().find((item) => item.id === button.dataset.templateId);
      if (!template) {
        showToast("That template is no longer available. Refresh the template list and try again.");
        renderTemplateCards();
        return;
      }
      if (button.dataset.templateAction === "use") useTemplate(template);
      else showTemplateEditor(template);
    });
    $("template-editor").addEventListener("submit", saveCustomTemplate);
    $("cancel-template-edit").addEventListener("click", showTemplateLibrary);
    $("cancel-template-edit-secondary").addEventListener("click", showTemplateLibrary);
    $("delete-template-button").addEventListener("click", deleteCustomTemplate);
    document.querySelectorAll("[data-close-template-dialog]").forEach((button) => {
      button.addEventListener("click", () => $("template-dialog").close());
    });
    $("template-dialog").addEventListener("click", (event) => {
      if (event.target === $("template-dialog")) $("template-dialog").close();
    });
    $("provider-select").addEventListener("change", updateStateFromControls);
    $("region-select").addEventListener("change", () => {
      state.region = $("region-select").value;
      renderRegionOptions(true);
      render();
    });
    $("secondary-region-select").addEventListener("change", () => {
      state.secondRegion = $("secondary-region-select").value;
      render();
    });
    $("traffic-select").addEventListener("change", updateStateFromControls);
    $("workload-select").addEventListener("change", updateStateFromControls);
    $("multi-region-toggle").addEventListener("change", updateStateFromControls);
    $("requirement-input").addEventListener("input", () => {
      saveDraft();
    });
    $("requirement-input").addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") generateDesign();
    });
    document.querySelectorAll("[data-prompt]").forEach((button) => {
      button.addEventListener("click", () => {
        $("requirement-input").value = button.dataset.prompt;
        $("requirement-input").focus();
        saveDraft();
      });
    });
    $("generate-button").addEventListener("click", generateDesign);
    $("generate-button-secondary").addEventListener("click", generateDesign);
    document.querySelectorAll(".view-tab").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
    $("rationale-toggle").addEventListener("click", () => {
      state.showAllRationale = !state.showAllRationale;
      renderRationale();
    });
    document.querySelectorAll(".section-collapse-button").forEach((button) => {
      button.addEventListener("click", () => {
        const content = $(button.dataset.collapseTarget);
        const expanded = button.getAttribute("aria-expanded") === "true";
        content.hidden = expanded;
        button.setAttribute("aria-expanded", String(!expanded));
        button.setAttribute("aria-label", `${expanded ? "Expand" : "Collapse"} ${button.dataset.collapseTarget === "rationale-content" ? "architecture rationale" : "estimated monthly cost breakdown"}`);
        button.querySelector("span").textContent = expanded ? "⌄" : "⌃";
      });
    });
    $("cost-details-button").addEventListener("click", () => $("cost-breakdown-panel").scrollIntoView({ behavior: "smooth", block: "center" }));
    $("assumptions-button").addEventListener("click", showAssumptions);
    $("edit-assumptions").addEventListener("click", showAssumptions);
    $("tech-view-button").addEventListener("click", () => setView("components"));
    $("export-menu-button").addEventListener("click", exportMenu);
    $("resources-menu-button").addEventListener("click", toggleResourcesMenu);
    document.addEventListener("click", (event) => {
      const item = event.target.closest("[data-resource-topic]");
      if (item) openResourceTopic(item.dataset.resourceTopic);
    });
    document.querySelectorAll("[data-close-resources]").forEach((button) => {
      button.addEventListener("click", () => {
        $("resources-dialog").close();
        $("resources-menu-button").focus();
      });
    });
    $("resources-dialog-close").addEventListener("click", () => {
      $("resources-dialog").close();
      $("resources-menu-button").focus();
    });
    $("resources-dialog").addEventListener("click", (event) => {
      if (event.target === $("resources-dialog")) {
        $("resources-dialog").close();
        $("resources-menu-button").focus();
      }
    });
    const exportActions = {
      "export-svg-button": exportSvg,
      "export-markdown-button": exportMarkdown,
      "export-pdf-button": exportPdf,
      "export-png-button": () => exportRaster("png"),
      "export-jpg-button": () => exportRaster("jpeg"),
      "export-drawio-button": exportDrawio,
      "export-json-button": exportJson
    };
    Object.entries(exportActions).forEach(([buttonId, action]) => {
      $(buttonId).addEventListener("click", () => {
        $("export-menu").classList.add("hidden");
        $("export-menu-button").setAttribute("aria-expanded", "false");
        try {
          action();
        } catch (error) {
          showToast(`Could not complete the export (${error.message || error.name}).`);
        }
      });
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".export-menu-wrap")) {
        $("export-menu").classList.add("hidden");
        $("export-menu-button").setAttribute("aria-expanded", "false");
      }
      if (!event.target.closest(".resources-menu-wrap")) {
        $("resources-menu").classList.add("hidden");
        $("resources-menu-button").setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !$("export-menu").classList.contains("hidden")) {
        $("export-menu").classList.add("hidden");
        $("export-menu-button").setAttribute("aria-expanded", "false");
        $("export-menu-button").focus();
      }
      if (event.key === "Escape" && !$("resources-menu").classList.contains("hidden")) {
        $("resources-menu").classList.add("hidden");
        $("resources-menu-button").setAttribute("aria-expanded", "false");
        $("resources-menu-button").focus();
      }
    });
    $("canvas-export-button").addEventListener("click", exportSvg);
    $("zoom-button").addEventListener("click", fitDiagram);
    $("new-design").addEventListener("click", resetDesign);
    $("share-button").addEventListener("click", async () => {
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        showToast("Clipboard access is unavailable here. Export the Markdown documentation to share this design.");
        return;
      }
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Studio link copied. This local design is not synced to a shared workspace.");
      } catch (error) {
        showToast("Could not copy the studio link. Export the Markdown documentation to share this design.");
      }
    });
  }

  function init() {
    $("app-version").textContent = `v${appVersion}`;
    restoreTheme();
    const config = readEntraConfig();
    if (config) {
      $("entra-tenant-id").value = config.tenantId || "";
      $("entra-client-id").value = config.clientId || "";
      $("entra-redirect-uri").value = config.redirectUri || "";
    }
    if (!$("entra-redirect-uri").value) $("entra-redirect-uri").value = getDefaultRedirectUri();
    setAuthEvents();
    restoreAuthentication();
  }

  init();
})();
