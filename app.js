const ACCOUNT = "Naksh-IIITB";
const FEATURED = [
  {
    name: "InsightGraph",
    category: "AI / KNOWLEDGE SYSTEMS",
    description: "A local Python RAG project that uses a graph to organize and retrieve context.",
    language: "Python",
    role: "PROJECT",
    logo: "insight",
  },
  {
    name: "RaceCraft",
    category: "MOTORSPORT / SIMULATION",
    description: "A Python simulator for comparing Formula 1 race strategies.",
    language: "Python",
    role: "PROJECT",
    logo: "race",
  },
  {
    name: "Sonic-Key",
    category: "ACOUSTICS / PROTOTYPE",
    description: "A Java acoustics prototype.",
    language: "Java",
    role: "PROJECT",
    logo: "sonic",
  },
  {
    name: "FairSplit",
    aliases: ["aivancity_fairsplit"],
    category: "PROPERTY / COLLABORATION",
    description: "A team project from the Aivancity responsible AI workshop on property valuation.",
    role: "COLLABORATION",
    logo: "fair",
  },
  {
    name: "Agentic Prompt Guard",
    aliases: ["agentic-prompt-guard"],
    category: "AI / OPEN SOURCE",
    description: "An upstream guardrail for intent analysis, risk detection, and prompt rewriting. Contributor.",
    role: "CONTRIBUTOR",
    logo: "guard",
  },
  {
    name: "SML NLP News Classification",
    aliases: ["sml-nlp-project", "sml-nlp-news-classification", "news-classification"],
    category: "NLP / CLASSIFICATION",
    description: "A machine-learning project for classifying news articles with NLP.",
    role: "PROJECT",
    logo: "news",
  },
  {
    name: "F1 Strategy Predictor",
    aliases: ["f1-strategy-predictor", "hacknight"],
    category: "MOTORSPORT / PREDICTION",
    description: "A hacknight project for predicting Formula 1 race strategy.",
    role: "PROJECT",
    logo: "predict",
  },
  {
    name: "DBMS Faculty System",
    aliases: ["dbms-faculty-system"],
    category: "DATABASES / APPLICATION",
    description: "A database course project for managing faculty information.",
    role: "PROJECT",
    logo: "database",
  },
  {
    name: "Huffman Compressor",
    aliases: ["com-decomp", "huffman-compressor"],
    category: "ALGORITHMS / COMPRESSION",
    description: "A Python command-line utility for lossless file compression with Huffman coding.",
    role: "PROJECT",
    logo: "compress",
  },
  {
    name: "Astra CPP Project",
    aliases: ["astra_cpp_project", "minicluster"],
    category: "C++ / SYSTEMS",
    description: "A C++ project associated with MiniCluster.",
    language: "C++",
    role: "PROJECT",
    logo: "cluster",
  },
];

const featuredGrid = document.querySelector("#featured-grid");
const repoList = document.querySelector("#repo-list");
const repoCount = document.querySelector("#repo-count");
const repoMessage = document.querySelector("#repo-message");
const searchInput = document.querySelector("#repo-search");
const filterRow = document.querySelector("#filter-row");
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
    <div class="card-topline"><span>${escapeHtml(item.category)}</span><span>${String(index + 1).padStart(2, "0")} / 0${FEATURED.length}</span></div>
    <div class="project-emblem">${iconFor(item.logo)}<span class="emblem-orbit"></span></div>
    <div class="card-content">
      <div class="card-tags">${language ? `<span>${escapeHtml(language)}</span>` : ""}<span>${escapeHtml(item.role)}</span></div>
      <h3>${escapeHtml(item.name)}</h3>
      <p>${escapeHtml(description)}</p>
      <a class="card-link" href="${escapeHtml(href)}" target="_blank" rel="noreferrer" aria-label="View ${escapeHtml(item.name)} on GitHub">EXPLORE PROJECT <span aria-hidden="true">↗</span></a>
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

renderFeatured();
loadRepositories();
