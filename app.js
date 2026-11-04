const ACCOUNT = "Naksh-IIITB";

const REPOSITORY_NOTES = {
  "safecross": {
    name: "SafeCross",
    category: "EDGE AI / HACKATHON",
    description: "Offline pedestrian and vehicle counting prototype using an ExecuTorch SSDLite model, with per-frame proximity flags and CSV/summary outputs.",
  },
  "insightgraph": {
    name: "InsightGraph",
    category: "LOCAL AI / RAG",
    description: "Local graph-aware RAG over PDF, Markdown and text documents, combining entity relationships with vector retrieval and source-grounded answers.",
  },
  "racecraft": {
    name: "RaceCraft",
    category: "SIMULATION",
    description: "Counterfactual Formula 1 strategy simulator with a tested race-state engine, tyre and traffic effects, safety-car scenarios, and finish-position distributions.",
  },
  "smlnlpproject": {
    name: "NLP News Classifier",
    category: "MACHINE LEARNING",
    description: "AG News study comparing sparse features and classical models with contextual transformer embeddings.",
  },
  "agenticpromptguard": {
    name: "Agentic Prompt Guard",
    category: "OPEN-SOURCE CONTRIBUTION",
    role: "CONTRIBUTOR / FORK",
    description: "Upstream agent guardrail for risky and disguised prompts. Public commits add a Streamlit dashboard, dataset utilities and UI updates.",
    upstream: "https://github.com/hemishsrichandra/agentic-prompt-guard",
  },
  "aivancityfairsplit": {
    name: "FairSplit",
    category: "TEAM WORKSHOP PROJECT",
    description: "Aivancity workshop team project. The repository includes an end-to-end Kaggle House Prices regression workflow and responsible-AI/startup analysis.",
  },
  "hacknight": {
    name: "F1 Strategy Predictor",
    category: "HACKNIGHT PROJECT",
    description: "Hybrid F1 strategy-prediction project combining public race data, pace estimation, tyre and traffic heuristics, and a race-stint simulator.",
  },
  "dbmsfacultysystem": {
    name: "Faculty Information System",
    category: "DATABASES",
    description: "Python command-line application and MySQL schema for departments, faculty, subjects, teaching assignments and expertise.",
  },
  "comdecomp": {
    name: "Huffman File Compressor",
    category: "ALGORITHMS",
    description: "Dependency-free Python CLI that compresses and restores files using Huffman codes, a packed bitstream and stored byte-frequency metadata.",
  },
  "sonickey": {
    name: "Sonic-Key",
    category: "AUDIO / JAVA",
    description: "Java desktop prototype for transferring small text payloads as near-ultrasonic dual-tone audio between speakers and microphones.",
  },
  "astracppproject": {
    name: "MiniCluster",
    category: "C++ / MACHINE LEARNING",
    description: "Dependency-free C++17 2D K-Means clustering application with multiple distance metrics and CSV, SVG and PNG outputs.",
  },
  "projectfinguard": {
    name: "FinGuard",
    category: "FULL-STACK / MACHINE LEARNING",
    description: "Learning-focused expense-tracker project with a Spring Boot backend, separate AI anomaly-scoring service and web frontend.",
  },
  "battleshippart2": {
    name: "Battleship",
    category: "PYGAME",
    description: "Python and Pygame implementation with manual or automatic ship placement, saved games, and resumable play.",
  },
};

const REPOSITORY_ORDER = [
  "safecross",
  "InsightGraph",
  "RaceCraft",
  "sml-nlp-project",
  "agentic-prompt-guard",
  "aivancity_fairsplit",
  "hacknight",
  "sonic-key",
  "Astra_CPP_project",
  "com-decomp",
  "dbms-faculty-system",
].map(normalize);

const repoList = document.querySelector("#repo-list");
const repoCount = document.querySelector("#repo-count");
const repoSource = document.querySelector("#repo-source");
const repoMessage = document.querySelector("#repo-message");
const searchInput = document.querySelector("#repo-search");
const filterRow = document.querySelector("#filter-row");
const huffmanInput = document.querySelector("#huffman-input");
const huffmanOutput = document.querySelector("#huffman-output");

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

function repoUrl(repo) {
  return repo.html_url || `https://github.com/${ACCOUNT}/${encodeURIComponent(repo.name)}`;
}

function metadataFor(repo) {
  return REPOSITORY_NOTES[normalize(repo.name)] || null;
}

function languageFor(repo) {
  return repo.language || "Other";
}

function languageClass(language) {
  return `language-dot lang-${normalize(language) || "other"}`;
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(date);
}

function repositoryRow(repo) {
  const curated = metadataFor(repo);
  const upstream = repo.source?.html_url || repo.parent?.html_url || curated?.upstream;
  const title = curated?.name || repo.name;
  const description = curated?.description || repo.description || "No description has been added to this repository.";
  const badge = curated?.role || (repo.fork ? "FORK" : curated?.category || "REPOSITORY");
  return `<article class="repo-row">
    <div class="repo-language-icon"><i class="${languageClass(languageFor(repo))}" aria-hidden="true"></i><span>${escapeHtml(languageFor(repo))}</span></div>
    <div class="repo-main">
      <div class="repo-title-line"><a href="${escapeHtml(repoUrl(repo))}" target="_blank" rel="noopener noreferrer">${escapeHtml(title)} <span aria-hidden="true">↗</span></a><span class="repo-badge">${escapeHtml(badge)}</span></div>
      <p>${escapeHtml(description)}</p>
      ${repo.fork && upstream ? `<a class="repo-upstream" href="${escapeHtml(upstream)}" target="_blank" rel="noopener noreferrer">Upstream repository <span aria-hidden="true">↗</span></a>` : ""}
    </div>
    <div class="repo-category">${escapeHtml(curated?.category || (repo.fork ? "PUBLIC FORK" : "PUBLIC REPOSITORY"))}</div>
    <time class="repo-updated" datetime="${escapeHtml(repo.updated_at || "")}">${repo.updated_at ? `Updated ${escapeHtml(formatDate(repo.updated_at))}` : ""}</time>
  </article>`;
}

function setFilters() {
  const languages = [...new Set(repositories.map(languageFor))].sort((a, b) => a.localeCompare(b));
  const options = [["all", "All repositories"], ...languages.map((language) => [language, language])];
  filterRow.innerHTML = options.map(([value, label]) => `<button class="filter-chip${selectedLanguage === value ? " is-active" : ""}" data-filter="${escapeHtml(value)}" type="button" aria-pressed="${selectedLanguage === value}">${escapeHtml(label)}</button>`).join("");
}

function renderRepositories() {
  const query = searchInput.value.trim().toLowerCase();
  const visible = repositories
    .filter((repo) => selectedLanguage === "all" || languageFor(repo) === selectedLanguage)
    .filter((repo) => {
      const curated = metadataFor(repo);
      const searchable = [curated?.name, repo.name, curated?.description, repo.description, curated?.category, repo.language, repo.parent?.full_name, repo.source?.full_name].join(" ").toLowerCase();
      return searchable.includes(query);
    });
  repoList.innerHTML = visible.map(repositoryRow).join("");
  repoCount.textContent = `${visible.length} of ${repositories.length} repositories`;
  repoMessage.hidden = visible.length > 0;
  if (!visible.length) {
    repoMessage.textContent = repositories.length ? "No repositories match that search. Try another name or language." : "No public repositories were returned.";
  }
}

async function fetchSnapshot() {
  const response = await fetch("./repositories.json", { cache: "no-cache" });
  if (!response.ok) throw new Error("No deployment snapshot is available.");
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error("The deployment snapshot has an unexpected format.");
  return data.filter((repo) => repo && !repo.private && typeof repo.name === "string");
}

async function fetchAllRepositories() {
  const all = [];
  let url = `https://api.github.com/users/${ACCOUNT}/repos?per_page=100&sort=updated&type=owner`;
  while (url) {
    const response = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
    if (!response.ok) {
      if (response.status === 403 || response.status === 429) throw new Error("GitHub's public API limit was reached.");
      if (response.status === 404) throw new Error("The GitHub account could not be found.");
      throw new Error(`GitHub returned an error (${response.status}).`);
    }
    const page = await response.json();
    if (!Array.isArray(page)) throw new Error("GitHub returned an unexpected repository list.");
    all.push(...page.filter((repo) => !repo.private));
    const nextLink = response.headers.get("Link")?.split(",").find((part) => part.includes('rel="next"'));
    url = nextLink?.match(/<([^>]+)>/)?.[1] || "";
  }
  return all;
}

function sortRepositories(items) {
  return items.sort((a, b) => {
    const aOrder = REPOSITORY_ORDER.indexOf(normalize(a.name));
    const bOrder = REPOSITORY_ORDER.indexOf(normalize(b.name));
    const aRank = aOrder < 0 ? Number.MAX_SAFE_INTEGER : aOrder;
    const bRank = bOrder < 0 ? Number.MAX_SAFE_INTEGER : bOrder;
    return aRank - bRank || (b.updated_at || "").localeCompare(a.updated_at || "");
  });
}

function showRepositoryError(error) {
  repoList.innerHTML = "";
  repoList.setAttribute("aria-busy", "false");
  repoCount.textContent = "Repository list unavailable";
  repoSource.textContent = "GitHub unavailable";
  repoMessage.textContent = `${error.message} Featured project links remain available above.`;
  repoMessage.hidden = false;
  repoMessage.classList.add("is-error");
}

async function loadRepositories() {
  let source;
  try {
    repositories = await fetchSnapshot();
    source = "Deployment snapshot";
  } catch {
    try {
      repositories = await fetchAllRepositories();
      source = "Live GitHub API";
    } catch (error) {
      showRepositoryError(error instanceof Error ? error : new Error("Could not load repositories."));
      return;
    }
  }
  sortRepositories(repositories);
  repoSource.textContent = source;
  setFilters();
  renderRepositories();
  repoList.setAttribute("aria-busy", "false");
}

function buildHuffmanTable(bytes) {
  const frequencies = new Map();
  for (const byte of bytes) frequencies.set(byte, (frequencies.get(byte) || 0) + 1);
  let order = 0;
  const queue = [...frequencies].map(([byte, frequency]) => ({ byte, frequency, order: order++, left: null, right: null }));
  while (queue.length > 1) {
    queue.sort((a, b) => a.frequency - b.frequency || a.order - b.order);
    const left = queue.shift();
    const right = queue.shift();
    queue.push({ byte: null, frequency: left.frequency + right.frequency, order: order++, left, right });
  }
  if (!queue.length) return { frequencies, codes: new Map(), root: null };
  let root = queue[0];
  if (root.byte !== null) root = { byte: null, frequency: root.frequency, order: order++, left: root, right: null };
  const codes = new Map();
  function visit(node, code) {
    if (node.byte !== null) {
      codes.set(node.byte, code || "0");
      return;
    }
    if (node.left) visit(node.left, `${code}0`);
    if (node.right) visit(node.right, `${code}1`);
  }
  visit(root, "");
  return { frequencies, codes, root };
}

function decodeBits(bits, root) {
  const bytes = [];
  let node = root;
  for (const bit of bits) {
    node = bit === "0" ? node.left : node.right;
    if (!node) throw new Error("The encoded bits do not match the generated tree.");
    if (node.byte !== null) {
      bytes.push(node.byte);
      node = root;
    }
  }
  if (node !== root) throw new Error("The encoded bitstream ended before a complete byte was decoded.");
  return new TextDecoder().decode(new Uint8Array(bytes));
}

function byteLabel(byte) {
  if (byte === 0x20) return "space";
  if (byte >= 0x21 && byte <= 0x7e) return String.fromCharCode(byte);
  return `0x${byte.toString(16).padStart(2, "0")}`;
}

function renderHuffman() {
  const text = huffmanInput.value;
  if (!text) {
    huffmanOutput.innerHTML = '<p class="muted">Enter text to build the Huffman tree.</p>';
    huffmanOutput.setAttribute("aria-busy", "false");
    return;
  }
  try {
    const bytes = new TextEncoder().encode(text);
    const { frequencies, codes, root } = buildHuffmanTable(bytes);
    const bits = [...bytes].map((byte) => codes.get(byte)).join("");
    const decoded = decodeBits(bits, root);
    const rows = [...frequencies].map(([byte, count]) => `<tr><td><code>${escapeHtml(byteLabel(byte))}</code></td><td>${count}</td><td><code>${codes.get(byte)}</code></td></tr>`).join("");
    huffmanOutput.innerHTML = `<div class="huffman-stats"><span>${bytes.length} UTF-8 bytes</span><span>${bits.length} Huffman payload bits</span><span>${bytes.length * 8} uncompressed bits</span></div><div class="huffman-table-wrap"><table class="huffman-table"><thead><tr><th scope="col">BYTE</th><th scope="col">COUNT</th><th scope="col">CODE</th></tr></thead><tbody>${rows}</tbody></table></div><details class="encoded-details"><summary>Encoded bitstream (${bits.length} bits)</summary><code class="encoded-bits">${bits || "—"}</code></details><p class="decode-check">${decoded === text ? "Decoded output matches the input." : "Decoded output differs from input."}</p>`;
    huffmanOutput.setAttribute("aria-busy", "false");
  } catch (error) {
    huffmanOutput.innerHTML = `<p class="repo-message is-error">${escapeHtml(error instanceof Error ? error.message : "Could not encode the text.")}</p>`;
    huffmanOutput.setAttribute("aria-busy", "false");
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
huffmanInput.addEventListener("input", renderHuffman);

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape" && document.activeElement === searchInput) {
    searchInput.value = "";
    searchInput.blur();
    renderRepositories();
  }
});

renderHuffman();
loadRepositories();
