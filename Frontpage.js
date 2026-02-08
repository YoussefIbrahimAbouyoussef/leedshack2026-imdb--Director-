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
  console.log("Photos found:", photos.length);
  const testImages = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq86C4q7uZHouKaf4Y65QfSsZRJ7LxFd4pqq0UAOniIoIejyrAvVGkwOZY38SbPePONzO80Xz7xju_lzNB3t4ggZzpqRCHa_8Q9OsRTW463g&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX9wl8ysE_bFiR4tfe7u-80JjKwTzBxWElc7st5JAoGH1MeT24q7BT3ggV6fFGmQAOHCTSphZVEH4tnR5SoyR-qygRByPDAB-oLOLYu9DMNg&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEQVZss2Y6LQvmFIFxt5BrHFwOTYi0_GrB6x9G_tKahTCjHlA9GogM3EbxbiPuwW7hOoLd0iyDwUXhV7zbb28qAGKYZ4AKvuYFEdCh192Q&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb7xOzET9SF0gdYpRmezJC_sDtosUUOxrVj5hxBw6fnTmEV1fi8hDK835g_Eh3skST1f3EDqvVBSveU3M-KTLMOcfFsjzl5P1V0A-DSOjo&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRJIHpMMbpbi2uWqYGKhLXaFZmC4eXUg1tjg5GT7Mvf98cOVQB2MnrA8Sy0sPD0KNl4yRTf2czQBNYtgbZ0wMWwVbHSE6foHwjxg5h6yOE&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOe_t3kXPDz2iaZF9cEbMAWzCBympox_eB-93472iHct4S8b9zuLBVTSo05MBH-bLPqFgLEBN7QNLrwdGT1u175-t6t6EMPsbq1cGQ8cWX&s=10"
  ];

  photos.forEach((photo, index) => {
  if (!testImages[index]) return;
  photo.style.background = `url(${testImages[index]}) center / cover no-repeat`;
});
});


