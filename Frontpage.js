// Frontpage.js

// ✅ remove duplicates by NAME (case-insensitive)
function removeDuplicateActors(actors) {
  const seen = new Set();

  return (actors || []).filter((actor) => {
    const name =
      actor?.name ??
      actor?.Name ??
      actor?.fullName ??
      actor?.actorName ??
      actor?.ActorName ??
      "";

    const key = String(name).trim().toLowerCase();
    if (!key) return false;

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const API_BASE = "http://localhost:3000";
const DEFAULT_COUNT = 12;

// =====================
// Upload button (plus)
// =====================
document.addEventListener("DOMContentLoaded", () => {
  const plus = document.querySelector(".plus");
  if (!plus) return;

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/pdf,image/*,.txt,.doc,.docx";
  input.style.display = "none";
  document.body.appendChild(input);

  plus.addEventListener("click", () => input.click());

  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Upload response:", data);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      input.value = "";
    }
  });
});

// =====================
// Random + Search
// =====================
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search input");
  const castRow = document.querySelector(".cast-row");
  const searchContainer = document.querySelector(".search");

  if (!searchInput || !castRow || !searchContainer) return;

  // No results message
  const noResultsMessage = document.createElement("div");
  noResultsMessage.className = "no-results";
  noResultsMessage.textContent = "No results found";
  noResultsMessage.style.display = "none";
  searchContainer.appendChild(noResultsMessage);

  let timeoutId = null;
  let cachedRandom = [];

  function getPhoto(actor) {
    return (
      actor?.pictures ||
      actor?.picture ||
      actor?.photo ||
      actor?.image ||
      actor?.img ||
      actor?.avatar ||
      actor?.profilePic ||
      actor?.profileUrl ||
      null
    );
  }

  function normalizePhotoUrl(photo) {
    if (!photo || typeof photo !== "string") return null;
    const p = photo.trim();

    // base64 data URL
    if (p.startsWith("data:image/")) return p;

    // full url
    if (p.startsWith("http://") || p.startsWith("https://")) return p;

    // local uploads (/uploads/... or uploads/...)
    if (p.startsWith("/uploads/") || p.startsWith("uploads/")) {
      const cleaned = p.startsWith("/") ? p.slice(1) : p;
      return `${API_BASE}/${cleaned}`;
    }

    return null;
  }

  function renderResults(results) {
    castRow.innerHTML = "";

    if (!results || results.length === 0) {
      noResultsMessage.style.display = "block";
      return;
    }

    noResultsMessage.style.display = "none";

    results.forEach((actor) => {
      const card = document.createElement("div");
      card.className = "actor";

      const name =
        actor?.name ??
        actor?.Name ??
        actor?.fullName ??
        actor?.actorName ??
        actor?.ActorName ??
        "Unknown";

      const age = actor?.age ?? actor?.Age ?? "N/A"; // ✅ keep age only

      const rawPhoto = getPhoto(actor);
      const photoUrl = normalizePhotoUrl(rawPhoto);

      const avatarHtml = photoUrl
        ? `<div class="avatar-wrap">
             <img class="avatar-img"
                  src="${photoUrl}"
                  alt="${String(name)}"
                  loading="lazy"
                  referrerpolicy="no-referrer"
                  onerror="this.remove(); this.parentElement.classList.add('avatar-fallback');">
           </div>`
        : `<div class="avatar-wrap avatar-fallback"></div>`;

      // ✅ Budget removed here
      card.innerHTML = `
        ${avatarHtml}
        <div class="name">${String(name)}</div>
        <div class="meta">Age: ${age}</div>
      `;

      castRow.appendChild(card);
    });
  }

  function pickRandom(arr, n) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, n);
  }

  async function loadRandomActors() {
    try {
      const res = await fetch(`${API_BASE}/people`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const all = Array.isArray(data.results) ? data.results : [];

      // ✅ DEDUPE FIRST
      const uniqueAll = removeDuplicateActors(all);

      cachedRandom = pickRandom(uniqueAll, DEFAULT_COUNT);
      renderResults(cachedRandom);
    } catch (err) {
      console.error("Random load failed:", err);
      noResultsMessage.style.display = "block";
      noResultsMessage.textContent = "Could not load actors (check server)";
    }
  }

  async function runSearch(query) {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const results = Array.isArray(data.results) ? data.results : [];

    // ✅ DEDUPE SEARCH RESULTS TOO
    return removeDuplicateActors(results);
  }

  // 1) random actors on load
  loadRandomActors();

  // 2) replace with search
  searchInput.addEventListener("input", () => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(async () => {
      const query = searchInput.value.trim();

      // cleared search → restore random
      if (!query) {
        noResultsMessage.style.display = "none";
        if (cachedRandom.length) renderResults(cachedRandom);
        else loadRandomActors();
        return;
      }

      try {
        const results = await runSearch(query);
        renderResults(results);
      } catch (err) {
        console.error("Search failed:", err);
        castRow.innerHTML = "";
        noResultsMessage.style.display = "block";
        noResultsMessage.textContent = "Search failed (check server)";
      }
    }, 250);
  });
});


