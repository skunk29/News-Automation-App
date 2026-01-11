// ⚠️ DEMO ONLY — DO NOT USE FOR PRODUCTION
// For production, move API calls to a backend
const API_KEY = "86988f51a78c4a03a68061117923e801";

// Free CORS proxy
const PROXY = "https://api.allorigins.win/raw?url=";

const NEWS_API_URL = encodeURIComponent(
  `https://newsapi.org/v2/top-headlines?country=us&pageSize=9&apiKey=${API_KEY}`
);

let articlesData = [];

/***********************
  SKELETON LOADING
************************/
function showSkeletons() {
  const container = document.getElementById("articles");
  container.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const skel = document.createElement("div");
    skel.className = "skeleton";
    container.appendChild(skel);
  }
}

/***********************
  FETCH NEWS
************************/
async function fetchNews() {
  showSkeletons();
  try {
    const response = await fetch(PROXY + NEWS_API_URL);
    const data = await response.json();

    if (!data.articles) throw new Error("API limit or invalid response");

    articlesData = data.articles.map(article => ({
      title: article.title || "No title",
      description: article.description || "No description available",
      source: article.source?.name || "Unknown source",
      url: article.url,
      breaking:
        article.publishedAt &&
        Date.now() - new Date(article.publishedAt) < 3600000
    }));

    renderArticles(articlesData);
  } catch (error) {
    console.error(error);
    showError("Unable to load news. API limit or CORS issue.");
  }
}

/***********************
  ERROR UI
************************/
function showError(message) {
  document.getElementById("articles").innerHTML = `
    <div class="card">
      <h3>Error</h3>
      <p>${message}</p>
    </div>
  `;
}

/***********************
  RENDER
************************/
function renderArticles(data) {
  const container = document.getElementById("articles");
  container.innerHTML = "";

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    if (item.breaking) card.classList.add("breaking");

    card.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <small>${item.source}</small>
    `;

    card.onclick = () => window.open(item.url, "_blank");
    container.appendChild(card);
  });
}

/***********************
  SEARCH
************************/
document.getElementById("searchInput").addEventListener("input", e => {
  const value = e.target.value.toLowerCase();
  renderArticles(
    articlesData.filter(a => a.title.toLowerCase().includes(value))
  );
});

/***********************
  DARK MODE
************************/
document.getElementById("darkToggle").onclick = () => {
  document.body.classList.toggle("dark");
};

/***********************
  BANNER ROTATION
************************/
const banners = [
  "Breaking News Updates",
  "Auto-Refreshing Headlines",
  "Frontend Automation Demo"
];

let bannerIndex = 0;
setInterval(() => {
  document.getElementById("banner").textContent = banners[bannerIndex];
  bannerIndex = (bannerIndex + 1) % banners.length;
}, 3000);

/***********************
  AUTO REFRESH
************************/
fetchNews();
setInterval(fetchNews, 60000);
