const ACCOUNT = "Naksh-IIITB";
const FEATURED = [
  {
    name: "InsightGraph",
    category: "AI / KNOWLEDGE SYSTEMS",
    description: "A local Python RAG project that uses a graph to organize and retrieve context.",
    language: "Python",
    role: "PROJECT",
    logo: "insight",
    monogram: "IG",
    technologies: ["Python", "RAG", "Knowledge graphs"],
    presentation: ["Retrieve relevant passages", "Connect related entities", "Explore linked context"],
    demo: "graph",
  },
  {
    name: "RaceCraft",
    category: "MOTORSPORT / SIMULATION",
    description: "A Python simulator for comparing Formula 1 race strategies.",
    language: "Python",
    role: "PROJECT",
    logo: "race",
    monogram: "RC",
    technologies: ["Python", "Simulation", "F1 strategy"],
    presentation: ["Set race conditions", "Compare tyre strategies", "Review the trade-offs"],
    demo: "strategy",
  },
  {
    name: "Sonic-Key",
    category: "ACOUSTICS / PROTOTYPE",
    description: "A Java acoustics prototype.",
    language: "Java",
    role: "PROJECT",
    logo: "sonic",
    monogram: "SK",
    technologies: ["Java", "Acoustics"],
    presentation: ["Press a key", "Generate a tone", "Hear the pitch change"],
    demo: "sound",
  },
  {
    name: "FairSplit",
    aliases: ["aivancity_fairsplit"],
    category: "PROPERTY / COLLABORATION",
    description: "A team project from the Aivancity responsible AI workshop on property valuation.",
    role: "COLLABORATION",
    logo: "fair",
    monogram: "FS",
    technologies: ["Responsible AI workshop", "Property valuation"],
    presentation: ["Enter a shared amount", "Choose the number of people", "View an equal split"],
    demo: "split",
  },
  {
    name: "Agentic Prompt Guard",
    aliases: ["agentic-prompt-guard"],
    category: "AI / OPEN SOURCE",
    description: "An upstream guardrail for intent analysis, risk detection, and prompt rewriting. Contributor.",
    role: "CONTRIBUTOR",
    logo: "guard",
    monogram: "PG",
    technologies: ["Open source", "Prompt guardrails"],
    presentation: ["Review an instruction", "Check for override language", "Flag text for a closer look"],
    demo: "guard",
  },
  {
    name: "SML NLP News Classification",
    aliases: ["sml-nlp-project", "sml-nlp-news-classification", "news-classification"],
    category: "NLP / CLASSIFICATION",
    description: "A machine-learning project for classifying news articles with NLP.",
    role: "PROJECT",
    logo: "news",
    monogram: "NLP",
    technologies: ["Python", "NLP", "Classification"],
    presentation: ["Start with an article", "Extract text features", "Assign a news category"],
    demo: "news",
  },
  {
    name: "F1 Strategy Predictor",
    aliases: ["f1-strategy-predictor", "hacknight"],
    category: "MOTORSPORT / PREDICTION",
    description: "A hacknight project for predicting Formula 1 race strategy.",
    role: "PROJECT",
    logo: "predict",
    monogram: "FP",
    technologies: ["Python", "Formula 1", "Hacknight"],
    presentation: ["Provide race context", "Evaluate strategy options", "Review a prediction"],
    demo: "strategy",
  },
  {
    name: "DBMS Faculty System",
    aliases: ["dbms-faculty-system"],
    category: "DATABASES / APPLICATION",
    description: "A database course project for managing faculty information.",
    role: "PROJECT",
    logo: "database",
    monogram: "DB",
    technologies: ["Python", "Databases"],
    presentation: ["Add faculty records", "Query the database", "Review matching results"],
    demo: "records",
  },
  {
    name: "Huffman Compressor",
    aliases: ["com-decomp", "huffman-compressor"],
    category: "ALGORITHMS / COMPRESSION",
    description: "A Python command-line utility for lossless file compression with Huffman coding.",
    role: "PROJECT",
    logo: "compress",
    monogram: "HC",
    technologies: ["Python", "Huffman coding"],
    presentation: ["Count character frequency", "Build a coding tree", "Encode the input"],
    demo: "compress",
  },
  {
    name: "Astra CPP Project",
    aliases: ["astra_cpp_project", "minicluster"],
    category: "C++ / SYSTEMS",
    description: "A C++ project associated with MiniCluster.",
    language: "C++",
    role: "PROJECT",
    logo: "cluster",
    monogram: "AST",
    technologies: ["C++", "MiniCluster"],
    presentation: ["Create cluster nodes", "Connect the components", "Inspect the structure"],
    demo: "cluster",
  },
];

const featuredGrid = document.querySelector("#featured-grid");
const repoList = document.querySelector("#repo-list");
const repoCount = document.querySelector("#repo-count");
const repoMessage = document.querySelector("#repo-message");
const searchInput = document.querySelector("#repo-search");
const filterRow = document.querySelector("#filter-row");
const projectDialog = document.querySelector("#project-dialog");
const projectDetail = document.querySelector("#project-detail");
const featuredByName = new Map(FEATURED.flatMap((item) => [item.name, ...(item.aliases || [])].map((name) => [normalize(name), item])));

let repositories = [];
let selectedLanguage = "all";

function normalize(value = "") {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function iconFor(kind) {
  const marks = {
    insight: '<circle cx="24" cy="24" r="4"/><circle cx="12" cy="13" r="2.5"/><circle cx="37" cy="12" r="2.5"/><circle cx="39" cy="36" r="2.5"/><path d="m14 14 7 7m6 0 8-7m-9 13 11 7M15 15l7 7"/>',
    race: '<path d="M9 34h30M12 30l4-13h16l5 13M18 17l3-6h8l4 6M16 34a4 4 0 1 0 8 0m8 0a4 4 0 1 0 8 0"/><path d="M8 16h6m-8 7h5"/>',
    sonic: '<path d="M9 24h5l5-12 8 24 6-16 4 4h3"/><circle cx="24" cy="24" r="19"/>',
    fair: '<path d="M24 7 40 16v16l-16 9-16-9V16z"/><path d="m8 16 16 9 16-9M24 25v16m-8-27 16 10"/><circle cx="24" cy="24" r="3"/>',
    guard: '<path d="M24 6 39 12v11c0 10-6 16-15 19-9-3-15-9-15-19V12z"/><path d="m17 24 5 5 10-11"/>',
    news: '<path d="M12 10h24v27H12zM17 16h14M17 21h14M17 27h5m5 0h4m-14 5h14"/><path d="M8 14v20a4 4 0 0 0 4 4h20"/>',
    predict: '<path d="m8 34 10-11 7 5 13-16"/><path d="M28 12h10v10"/><circle cx="18" cy="23" r="2"/><circle cx="25" cy="28" r="2"/>',
    database: '<ellipse cx="24" cy="12" rx="14" ry="6"/><path d="M10 12v24c0 3 6 6 14 6s14-3 14-6V12M10 24c0 3 6 6 14 6s14-3 14-6"/>',
    compress: '<path d="M12 12h24v24H12z"/><path d="M17 18h14m-14 6h9m-9 6h5"/><path d="m30 27 3 3-3 3"/>',
    cluster: '<circle cx="24" cy="24" r="5"/><circle cx="10" cy="13" r="3"/><circle cx="38" cy="13" r="3"/><circle cx="10" cy="35" r="3"/><circle cx="38" cy="35" r="3"/><path d="m14 16 6 5m8 0 6-5m-14 10-6 5m14-5 6 5"/>',
    default: '<rect x="10" y="10" width="28" height="28" rx="8"/><path d="m17 24 5 5 10-11"/>',
  };
  return `<svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${marks[kind] || marks.default}</svg>`;
}

function metadataFor(repo) {
  return featuredByName.get(normalize(repo.name));
}

function repoUrl(repo) {
  return repo.html_url || `https://github.com/${ACCOUNT}/${encodeURIComponent(repo.name)}`;
}

function featuredCard(item, repo, index) {
  const href = repo ? repoUrl(repo) : `https://github.com/${ACCOUNT}?tab=repositories`;
  const language = item.language || repo?.language || "";
  const description = repo?.description && !item.description ? repo.description : item.description;
  return `<article class="project-card tone-${item.logo}" style="--card-order:${index}">
    <div class="card-topline"><span>${escapeHtml(item.category)}</span><span>${String(index + 1).padStart(2, "0")} / ${String(FEATURED.length).padStart(2, "0")}</span></div>
    <div class="project-brand" aria-hidden="true"><span class="project-emblem">${iconFor(item.logo)}</span><span class="brand-monogram">${escapeHtml(item.monogram)}</span></div>
    <div class="card-content">
      <div class="card-tags">${language ? `<span>${escapeHtml(language)}</span>` : ""}<span>${escapeHtml(item.role)}</span></div>
      <h3>${escapeHtml(item.name)}</h3>
      <p>${escapeHtml(description)}</p>
      <div class="card-actions">
        <button class="card-link card-present" type="button" data-project="${escapeHtml(normalize(item.name))}">SEE HOW IT WORKS <span aria-hidden="true">↗</span></button>
        <a class="card-link card-source" href="${escapeHtml(href)}" target="_blank" rel="noreferrer" aria-label="View ${escapeHtml(item.name)} on GitHub">SOURCE <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  </article>`;
}

function renderFeatured() {
  const knownRepos = new Map(repositories.map((repo) => [normalize(repo.name), repo]));
  featuredGrid.innerHTML = FEATURED.map((item, index) => {
    const repo = [item.name, ...(item.aliases || [])].map((name) => knownRepos.get(normalize(name))).find(Boolean);
    return featuredCard(item, repo, index);
  }).join("");
}

function repositoryRow(repo) {
  const curated = metadataFor(repo);
  const title = curated?.name || repo.name;
  const description = curated?.description || repo.description || "A public repository on GitHub.";
  const language = repo.language || curated?.language || "Other";
  const badge = curated?.role || (repo.fork ? "FORK" : "REPOSITORY");
  return `<article class="repo-row">
    <div class="repo-icon">${iconFor(curated?.logo || "default")}</div>
    <div class="repo-main">
      <div class="repo-title-line"><a href="${escapeHtml(repoUrl(repo))}" target="_blank" rel="noreferrer">${escapeHtml(title)} <span aria-hidden="true">↗</span></a><span class="repo-badge">${escapeHtml(badge)}</span></div>
      <p>${escapeHtml(description)}</p>
    </div>
    <div class="repo-language"><i class="${languageClass(language)}"></i>${escapeHtml(language)}</div>
    <div class="repo-updated">${repo.updated_at ? `UPDATED ${escapeHtml(formatDate(repo.updated_at))}` : ""}</div>
  </article>`;
}

function workflowMarkup(item) {
  return `<div class="workflow-strip" aria-label="Project workflow">${item.presentation.map((step, index) => `<div class="workflow-step"><span>0${index + 1}</span><strong>${escapeHtml(step)}</strong>${index < item.presentation.length - 1 ? '<i aria-hidden="true">→</i>' : ""}</div>`).join("")}</div>`;
}

function demoMarkup(item) {
  if (item.demo === "graph") {
    return `<section class="demo-panel demo-graph" aria-labelledby="demo-title">
      <div class="demo-heading"><div><span class="demo-kicker">INTERACTIVE CONCEPT</span><h3 id="demo-title">Follow a connection</h3></div><span class="demo-pill">GRAPH VIEW</span></div>
      <p class="demo-copy">Select a node to see how related context can be explored as a graph.</p>
      <div class="graph-playground">
        <svg class="graph-lines" viewBox="0 0 560 200" role="img" aria-label="A connected graph of people, documents, and concepts">
          <path d="M92 101 207 54M92 101l116 65M207 54l154 35M207 54l154-30M208 166l153-77m0 0 116 49m-116-49 118-54"/>
          <circle class="graph-node node-person" cx="92" cy="101" r="22"/><circle class="graph-node node-document" cx="207" cy="54" r="22"/><circle class="graph-node node-topic" cx="208" cy="166" r="22"/><circle class="graph-node node-topic" cx="361" cy="89" r="22"/><circle class="graph-node node-document" cx="361" cy="24" r="17"/><circle class="graph-node node-person" cx="479" cy="138" r="22"/><circle class="graph-node node-topic" cx="479" cy="35" r="17"/>
          <text x="92" y="106" text-anchor="middle">A</text><text x="207" y="59" text-anchor="middle">DOC</text><text x="208" y="171" text-anchor="middle">B</text><text x="361" y="94" text-anchor="middle">TOPIC</text><text x="361" y="29" text-anchor="middle">DOC</text><text x="479" y="143" text-anchor="middle">C</text><text x="479" y="40" text-anchor="middle">IDEA</text>
        </svg>
        <div class="graph-legend"><span><i class="legend-person"></i>Entity</span><span><i class="legend-document"></i>Source</span><span><i class="legend-topic"></i>Concept</span></div>
      </div>
      <label class="demo-select-label" for="graph-source">Explore from</label>
      <select class="demo-select" id="graph-source"><option value="A">Entity A</option><option value="DOC">Source document</option><option value="TOPIC">Topic</option></select>
      <p class="demo-result" id="graph-result" aria-live="polite">Entity A connects to a source document, which links to a topic and related concepts.</p>
      <p class="demo-disclaimer">Concept illustration of graph-based retrieval, not a live run of the Python project.</p>
    </section>`;
  }
  if (item.demo === "strategy") {
    return `<section class="demo-panel demo-strategy" aria-labelledby="demo-title">
      <div class="demo-heading"><div><span class="demo-kicker">INTERACTIVE CONCEPT</span><h3 id="demo-title">Strategy trade-offs</h3></div><span class="demo-pill">${item.name === "RaceCraft" ? "RACECRAFT" : "F1 PREDICTOR"}</span></div>
      <p class="demo-copy">Adjust the example race settings to compare how a lower-stop plan trades fresh tyres for fewer pit stops.</p>
      <div class="strategy-controls">
        <label>Race distance <strong><output id="race-laps-value">50</output> laps</strong><input id="race-laps" type="range" min="20" max="75" value="50"></label>
        <label>Tyre wear <strong><output id="race-wear-value">Medium</output></strong><input id="race-wear" type="range" min="1" max="3" value="2"></label>
      </div>
      <div class="strategy-comparison" id="strategy-comparison" aria-live="polite"></div>
      <p class="demo-disclaimer">Illustrative comparison only. This preview does not run RaceCraft or model real race telemetry.</p>
    </section>`;
  }
  if (item.demo === "sound") {
    return `<section class="demo-panel demo-sound" aria-labelledby="demo-title">
      <div class="demo-heading"><div><span class="demo-kicker">PLAYABLE PREVIEW</span><h3 id="demo-title">A tiny sound keyboard</h3></div><span class="demo-pill">SONIC-KEY</span></div>
      <p class="demo-copy">Tap a key or use your keyboard's A–H keys to hear a short tone.</p>
      <div class="sound-keys" role="group" aria-label="Play notes"><button type="button" data-note="261.63">C</button><button type="button" data-note="293.66">D</button><button type="button" data-note="329.63">E</button><button type="button" data-note="349.23">F</button><button type="button" data-note="392">G</button><button type="button" data-note="440">A</button><button type="button" data-note="493.88">B</button><button type="button" data-note="523.25">C</button></div>
      <p class="demo-result" id="sound-result" aria-live="polite">Audio starts only when you play a key.</p>
      <p class="demo-disclaimer">A small browser-based acoustics preview, separate from the Java prototype.</p>
    </section>`;
  }
  if (item.demo === "split") {
    return `<section class="demo-panel demo-split" aria-labelledby="demo-title">
      <div class="demo-heading"><div><span class="demo-kicker">INTERACTIVE CONCEPT</span><h3 id="demo-title">Split a shared amount</h3></div><span class="demo-pill">FAIRSPLIT</span></div>
      <p class="demo-copy">A simple equal-share calculator to illustrate one part of a shared property-cost workflow.</p>
      <div class="split-controls"><label>Shared amount <span><input id="split-amount" type="number" min="0" step="1000" value="120000" inputmode="decimal"> <b>₹</b></span></label><label>People<select id="split-people" class="demo-select"><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option></select></label></div>
      <div class="split-result" id="split-result" aria-live="polite"></div>
      <p class="demo-disclaimer">Illustrative equal split; this is not the project's property valuation model.</p>
    </section>`;
  }
  if (item.demo === "guard") {
    return `<section class="demo-panel demo-guard" aria-labelledby="demo-title">
      <div class="demo-heading"><div><span class="demo-kicker">INTERACTIVE CONCEPT</span><h3 id="demo-title">Prompt review</h3></div><span class="demo-pill">PROMPT GUARD</span></div>
      <p class="demo-copy">Try an instruction to see a small client-side heuristic flag common override wording.</p>
      <label class="sr-only" for="guard-input">Text to review</label><textarea class="guard-input" id="guard-input" rows="3" placeholder="Type a short instruction…"></textarea>
      <button class="demo-action" id="guard-review" type="button">Review text <span aria-hidden="true">→</span></button>
      <p class="demo-result" id="guard-result" aria-live="polite">Text stays in this browser; nothing is sent to a server.</p>
      <p class="demo-disclaimer">A simple phrase check for demonstration, not the contributor project's guardrail system.</p>
    </section>`;
  }
  if (item.demo === "news") {
    return `<section class="demo-panel demo-news" aria-labelledby="demo-title">
      <div class="demo-heading"><div><span class="demo-kicker">SAMPLE WALKTHROUGH</span><h3 id="demo-title">From headline to category</h3></div><span class="demo-pill">NEWS NLP</span></div>
      <p class="demo-copy">Select a sample headline to follow the classification workflow.</p>
      <div class="headline-list"><button type="button" data-headline="A new battery design could extend the range of electric cars" data-category="Technology">A new battery design could extend the range of electric cars</button><button type="button" data-headline="The underdogs win the national championship final" data-category="Sports">The underdogs win the national championship final</button><button type="button" data-headline="Central bank announces a change to interest rates" data-category="Business">Central bank announces a change to interest rates</button></div>
      <div class="news-output" id="news-output" aria-live="polite">Choose a headline to see its sample category.</div>
      <p class="demo-disclaimer">Example labels only; the original NLP model is not running in this page.</p>
    </section>`;
  }
  if (item.demo === "compress") {
    return `<section class="demo-panel demo-compress" aria-labelledby="demo-title">
      <div class="demo-heading"><div><span class="demo-kicker">LIVE ALGORITHM PREVIEW</span><h3 id="demo-title">Huffman coding</h3></div><span class="demo-pill">HUFFMAN</span></div>
      <p class="demo-copy">Enter text to see its character frequencies and a Huffman code table generated in your browser.</p>
      <label class="sr-only" for="compress-input">Text to encode</label><input id="compress-input" class="compress-input" value="banana bandana" maxlength="80">
      <div class="compression-output" id="compression-output" aria-live="polite"></div>
      <p class="demo-disclaimer">The preview shows the coding table; it does not create a downloadable compressed file.</p>
    </section>`;
  }
  return `<section class="demo-panel demo-flow" aria-labelledby="demo-title">
    <div class="demo-heading"><div><span class="demo-kicker">PROJECT WALKTHROUGH</span><h3 id="demo-title">${escapeHtml(item.name)} at a glance</h3></div><span class="demo-pill">${escapeHtml(item.role)}</span></div>
    <p class="demo-copy">${escapeHtml(item.description)}</p>
    <div class="flow-visual">${item.presentation.map((step, index) => `<div class="flow-visual-step"><span>0${index + 1}</span>${iconFor(item.logo)}<strong>${escapeHtml(step)}</strong></div>`).join('<span class="flow-arrow" aria-hidden="true">→</span>')}</div>
    <p class="demo-disclaimer">A visual summary of the project workflow.</p>
  </section>`;
}

function showProject(item) {
  const repo = repositories.find((entry) => [item.name, ...(item.aliases || [])].some((name) => normalize(name) === normalize(entry.name)));
  const href = repo ? repoUrl(repo) : `https://github.com/${ACCOUNT}?tab=repositories`;
  projectDetail.innerHTML = `<div class="presentation-hero tone-${item.logo}">
      <div class="presentation-brand"><span class="project-emblem">${iconFor(item.logo)}</span><span class="brand-monogram">${escapeHtml(item.monogram)}</span></div>
      <div class="presentation-title"><p class="eyebrow">${escapeHtml(item.category)}</p><h2 id="dialog-title">${escapeHtml(item.name)}</h2><p>${escapeHtml(item.description)}</p><div class="presentation-tags">${[...(item.language ? [item.language] : []), item.role].map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div></div>
    </div>
    <div class="presentation-body"><div class="presentation-section"><p class="eyebrow">HOW IT WORKS</p>${workflowMarkup(item)}<div class="technology-list">${item.technologies.map((technology) => `<span>${escapeHtml(technology)}</span>`).join("")}</div></div>${demoMarkup(item)}<div class="presentation-footer"><span>${item.role === "CONTRIBUTOR" ? "Open-source contribution" : item.role === "COLLABORATION" ? "Team project" : "Project presentation"}</span><a class="text-link" href="${escapeHtml(href)}" target="_blank" rel="noreferrer">View source on GitHub <span aria-hidden="true">↗</span></a></div></div>`;
  projectDialog.showModal();
  projectDialog.querySelector(".dialog-close").focus();
  initialiseDemo(item.demo);
}

function renderStrategy() {
  const laps = Number(projectDetail.querySelector("#race-laps")?.value || 50);
  const wear = Number(projectDetail.querySelector("#race-wear")?.value || 2);
  const wearLabels = ["Low", "Medium", "High"];
  const oneStop = Math.max(12, 100 - laps * wear * 0.55);
  const twoStop = Math.max(12, 75 - laps * wear * 0.25);
  const winner = twoStop > oneStop ? "Two-stop plan" : "One-stop plan";
  projectDetail.querySelector("#race-laps-value").textContent = laps;
  projectDetail.querySelector("#race-wear-value").textContent = wearLabels[wear - 1];
  projectDetail.querySelector("#strategy-comparison").innerHTML = [
    ["One stop", oneStop, "#f5a65b"],
    ["Two stops", twoStop, "#72d3c6"],
  ].map(([label, score, color]) => `<div class="strategy-row"><span>${label}</span><div class="strategy-track"><i style="--score:${score}%;--bar-color:${color}"></i></div><strong>${Math.round(score)}</strong></div>`).join("") + `<p class="strategy-verdict">Illustrative preference: <strong>${winner}</strong> <span>· higher trade-off score</span></p>`;
}

function renderSplit() {
  const amount = Math.max(0, Number(projectDetail.querySelector("#split-amount")?.value || 0));
  const people = Number(projectDetail.querySelector("#split-people")?.value || 2);
  projectDetail.querySelector("#split-result").innerHTML = `<span>Equal share per person</span><strong>₹${(amount / people).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong><small>₹${amount.toLocaleString("en-IN")} total ÷ ${people} people</small>`;
}

function buildHuffmanTable(text) {
  const frequencies = new Map();
  for (const character of text) frequencies.set(character, (frequencies.get(character) || 0) + 1);
  let queue = [...frequencies].map(([character, frequency], index) => ({ character, frequency, order: index, left: null, right: null }));
  while (queue.length > 1) {
    queue.sort((a, b) => a.frequency - b.frequency || a.order - b.order);
    const left = queue.shift();
    const right = queue.shift();
    queue.push({ character: null, frequency: left.frequency + right.frequency, order: Math.min(left.order, right.order), left, right });
  }
  const codes = new Map();
  function walk(node, code) {
    if (node.character !== null) {
      codes.set(node.character, code || "0");
      return;
    }
    walk(node.left, `${code}0`);
    walk(node.right, `${code}1`);
  }
  if (queue[0]) walk(queue[0], "");
  return [...frequencies].map(([character, frequency]) => ({ character, frequency, code: codes.get(character) }));
}

function renderCompression() {
  const text = projectDetail.querySelector("#compress-input")?.value || "";
  const output = projectDetail.querySelector("#compression-output");
  if (!text) {
    output.innerHTML = '<p class="demo-result">Enter at least one character to build the table.</p>';
    return;
  }
  const table = buildHuffmanTable(text);
  const fixedBits = text.length * 8;
  const codedBits = table.reduce((sum, item) => sum + item.frequency * item.code.length, 0);
  output.innerHTML = `<div class="compression-summary"><span>${text.length} characters</span><strong>${codedBits} encoded bits</strong><small>${fixedBits} bits at 8 bits per character before metadata</small></div><div class="code-table"><span>CHARACTER</span><span>COUNT</span><span>CODE</span>${table.map((item) => `<span>${escapeHtml(item.character === " " ? "space" : item.character)}</span><span>${item.frequency}</span><code>${item.code}</code>`).join("")}</div>`;
}

function initialiseDemo(demo) {
  if (demo === "strategy") {
    renderStrategy();
    projectDetail.querySelector("#race-laps").addEventListener("input", renderStrategy);
    projectDetail.querySelector("#race-wear").addEventListener("input", renderStrategy);
  } else if (demo === "split") {
    renderSplit();
    projectDetail.querySelector("#split-amount").addEventListener("input", renderSplit);
    projectDetail.querySelector("#split-people").addEventListener("change", renderSplit);
  } else if (demo === "graph") {
    projectDetail.querySelector("#graph-source").addEventListener("change", (event) => {
      const notes = {
        A: "Entity A connects to a source document, which links to a topic and related concepts.",
        DOC: "The document is linked to two entities and a topic, making its context easier to trace.",
        TOPIC: "The topic brings together a source, two entities, and a related idea.",
      };
      projectDetail.querySelector("#graph-result").textContent = notes[event.target.value];
      projectDetail.querySelectorAll(".graph-node").forEach((node) => node.classList.remove("is-active"));
      const activeClass = { A: ".node-person", DOC: ".node-document", TOPIC: ".node-topic" }[event.target.value];
      projectDetail.querySelector(activeClass)?.classList.add("is-active");
    });
    projectDetail.querySelector("#graph-source").dispatchEvent(new Event("change", { bubbles: true }));
  } else if (demo === "sound") {
    let audioContext;
    projectDetail.querySelectorAll("[data-note]").forEach((key) => {
      key.addEventListener("click", async () => {
        try {
          audioContext ||= new AudioContext();
          await audioContext.resume();
          const oscillator = audioContext.createOscillator();
          const gain = audioContext.createGain();
          oscillator.type = "sine";
          oscillator.frequency.value = Number(key.dataset.note);
          gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.17, audioContext.currentTime + 0.025);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.45);
          oscillator.connect(gain).connect(audioContext.destination);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.46);
          key.classList.add("is-playing");
          window.setTimeout(() => key.classList.remove("is-playing"), 220);
          projectDetail.querySelector("#sound-result").textContent = `Playing note ${key.textContent} · ${Math.round(Number(key.dataset.note))} Hz`;
        } catch {
          projectDetail.querySelector("#sound-result").textContent = "Audio playback is unavailable in this browser.";
        }
      });
    });
  } else if (demo === "guard") {
    projectDetail.querySelector("#guard-review").addEventListener("click", () => {
      const text = projectDetail.querySelector("#guard-input").value;
      const cues = ["ignore previous instructions", "disregard prior instructions", "reveal hidden instructions", "bypass the rules"];
      const flagged = cues.some((cue) => text.toLowerCase().includes(cue));
      projectDetail.querySelector("#guard-result").textContent = text.trim()
        ? flagged ? "Review suggested: this text includes common instruction-override wording." : "No common override phrases detected by this simple check."
        : "Enter some text to review.";
    });
  } else if (demo === "news") {
    projectDetail.querySelectorAll("[data-headline]").forEach((button) => {
      button.addEventListener("click", () => {
        projectDetail.querySelector("#news-output").innerHTML = `<span>SELECTED SAMPLE</span><strong>${escapeHtml(button.dataset.headline)}</strong><small>Example category: ${escapeHtml(button.dataset.category)}</small>`;
      });
    });
  } else if (demo === "compress") {
    renderCompression();
    projectDetail.querySelector("#compress-input").addEventListener("input", renderCompression);
  }
}

function languageClass(language) {
  return `language-dot lang-${normalize(language) || "other"}`;
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(date).toUpperCase();
}

function setFilters() {
  const languages = [...new Set(repositories.map((repo) => repo.language).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  filterRow.innerHTML = `<button class="filter-chip${selectedLanguage === "all" ? " is-active" : ""}" data-filter="all" type="button">All work</button>${languages.map((language) => `<button class="filter-chip${selectedLanguage === language ? " is-active" : ""}" data-filter="${escapeHtml(language)}" type="button">${escapeHtml(language)}</button>`).join("")}`;
}

function renderRepositories() {
  const query = searchInput.value.trim().toLowerCase();
  const visible = repositories
    .filter((repo) => selectedLanguage === "all" || repo.language === selectedLanguage)
    .filter((repo) => `${repo.name} ${repo.description || ""} ${repo.language || ""}`.toLowerCase().includes(query));
  repoList.innerHTML = visible.map(repositoryRow).join("");
  repoCount.textContent = `${visible.length} ${visible.length === 1 ? "REPOSITORY" : "REPOSITORIES"}`;
  repoMessage.hidden = visible.length > 0;
  if (!visible.length) {
    repoMessage.textContent = repositories.length ? "No repositories match that search. Try another name or language." : "No public repositories were returned.";
  }
}

async function fetchAllRepositories() {
  const all = [];
  let url = `https://api.github.com/users/${ACCOUNT}/repos?per_page=100&sort=updated&type=owner`;
  while (url) {
    const response = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
    if (!response.ok) {
      if (response.status === 403 || response.status === 429) throw new Error("GitHub's public API limit was reached. Please try again in a little while.");
      if (response.status === 404) throw new Error("The GitHub account could not be found.");
      throw new Error(`GitHub returned an error (${response.status}). Please try again later.`);
    }
    const page = await response.json();
    if (!Array.isArray(page)) throw new Error("GitHub returned an unexpected repository list.");
    all.push(...page.filter((repo) => !repo.private));
    const nextLink = response.headers.get("Link")?.split(",").find((part) => part.includes('rel="next"'));
    url = nextLink?.match(/<([^>]+)>/)?.[1] || "";
  }
  return all.sort((a, b) => Number(Boolean(metadataFor(b))) - Number(Boolean(metadataFor(a))) || (b.updated_at || "").localeCompare(a.updated_at || ""));
}

function showRepositoryError(error) {
  repoList.innerHTML = "";
  repoList.setAttribute("aria-busy", "false");
  repoCount.textContent = "GITHUB CONNECTION UNAVAILABLE";
  repoMessage.textContent = `${error.message} The selected projects above remain available.`;
  repoMessage.hidden = false;
  repoMessage.classList.add("is-error");
}

async function loadRepositories() {
  try {
    repositories = await fetchAllRepositories();
    renderFeatured();
    setFilters();
    renderRepositories();
    repoList.setAttribute("aria-busy", "false");
  } catch (error) {
    showRepositoryError(error instanceof Error ? error : new Error("Could not load repositories."));
  }
}

filterRow.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  selectedLanguage = button.dataset.filter;
  setFilters();
  renderRepositories();
});

searchInput.addEventListener("input", renderRepositories);
featuredGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-project]");
  if (!button) return;
  const item = FEATURED.find((project) => normalize(project.name) === button.dataset.project);
  if (item) showProject(item);
});

projectDialog.querySelector(".dialog-close").addEventListener("click", () => projectDialog.close());
projectDialog.addEventListener("click", (event) => {
  if (event.target === projectDialog) projectDialog.close();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !projectDialog.open && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape" && document.activeElement === searchInput) {
    searchInput.value = "";
    searchInput.blur();
    renderRepositories();
  }
  if (projectDialog.open && /^[a-h]$/i.test(event.key) && projectDetail.querySelector(".sound-keys")) {
    const key = projectDetail.querySelectorAll("[data-note]")[event.key.toLowerCase().charCodeAt(0) - 97];
    key?.click();
  }
});

renderFeatured();
loadRepositories();
