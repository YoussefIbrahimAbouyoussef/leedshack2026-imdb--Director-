//----- Upload button -----
document.addEventListener("DOMContentLoaded", () => {
  const plus = document.getElementById("plus");
  if (!plus) return;

  const menu = document.createElement("div");
  menu.style.position = "absolute";
  menu.style.background = "#fff";
  menu.style.border = "1px solid #ccc";
  menu.style.padding = "5px";
  menu.style.display = "none";
  menu.style.zIndex = "1000";

  const options = [
    { label: "PDF File", accept: "application/pdf" },
    { label: "Image", accept: "image/*" },
    { label: "Text Document", accept: ".txt,.doc,.docx" }
  ];

  document.body.appendChild(menu);

  plus.addEventListener("click", (e) => {
    menu.style.display = menu.style.display === "none" ? "block" : "none";
    menu.style.left = e.pageX + "px";
    menu.style.top = e.pageY + "px";
  });

  options.forEach(opt => {
    const item = document.createElement("div");
    item.textContent = opt.label;
    item.style.cursor = "pointer";
    item.style.padding = "4px";

    item.addEventListener("click", () => {
      menu.style.display = "none";

      const input = document.createElement("input");
      input.type = "file";
      input.accept = opt.accept;
      input.style.display = "none";
      document.body.appendChild(input);

      input.click();

      input.addEventListener("change", () => {
        const file = input.files[0];
        if (!file) return;
        console.log(`${opt.label} selected:`, file.name);
        input.remove();
      });
    });

    menu.appendChild(item);
  });
});


// ------  Explore button ------

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search input");
  const people = document.querySelectorAll(".person");
  const searchContainer = document.querySelector(".search");

  if (!searchInput || people.length === 0 || !searchContainer) return;

  // Show no results message
  const noResultsMessage = document.createElement("div");
  noResultsMessage.textContent = "No results found";
  noResultsMessage.style.display = "none";
  noResultsMessage.style.color = "#555";
  noResultsMessage.style.marginTop = "10px";
  noResultsMessage.style.fontSize = "14px";

  searchContainer.appendChild(noResultsMessage);

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    people.forEach(person => {
      const nameEl = person.querySelector(".name");
      if (!nameEl) return;

      const name = nameEl.textContent.toLowerCase();

      if (name.includes(query)) {
        person.style.display = "";
        visibleCount++;
      } else {
        person.style.display = "none";
      }
    });

    // Show / hide "no results"
    if (visibleCount === 0 && query !== "") {
      noResultsMessage.style.display = "block";
    } else {
      noResultsMessage.style.display = "none";
    }
  });
});
