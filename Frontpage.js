//----- Upload button -----
document.addEventListener("DOMContentLoaded", () => {
  const plus = document.querySelector(".plus");
  if (!plus) return;

  // create hidden file input once
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/pdf,image/*,.txt,.doc,.docx";
  input.style.display = "none";
  document.body.appendChild(input);

  // clicking + opens file picker directly
  plus.addEventListener("click", () => {
    input.click();
  });

  // handle selected file
  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;

    console.log("File selected:", file.name);

    // reset input so same file can be selected again
    input.value = "";
  });
});


// ------ Explore button ------
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search input");
  const people = document.querySelectorAll(".person");
  const searchContainer = document.querySelector(".search");

  if (!searchInput || people.length === 0 || !searchContainer) return;

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

    if (visibleCount === 0 && query !== "") {
      noResultsMessage.style.display = "block";
    } else {
      noResultsMessage.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const photos = document.querySelectorAll(".photo");

  const testImages = [
    "https://via.placeholder.com/300x300?text=Actor+1",
    "https://via.placeholder.com/300x300?text=Actor+2",
    "https://via.placeholder.com/300x300?text=Actor+3",
    "https://via.placeholder.com/300x300?text=Actor+4",
    "https://via.placeholder.com/300x300?text=Actor+5",
    "https://m.media-amazon.com/images/M/MV5BOWUzNzIzMzQtNzMxYi00OWRiLTlhZjEtZTRjYWVkYzI4ZjMwXkEyXkFqcGc@._V1_.jpg"
  ];

  photos.forEach((photo, i) => {
    photo.style.backgroundImage = `url(${testImages[i]})`;
  });
});
