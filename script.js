const accessKey = "wpxfOiH7Wip9ULmTxg4g0-NrgWFSUl-0JusRBh3sZnc";

const form = document.getElementById("form");
const searcBox = document.getElementById("search-box");
const searchResult = document.getElementById("search-result");
const showMoreBtn = document.getElementById("show-more-btn");

let keyword = "";
let page = 1;

async function searchImages() {
  keyword = searcBox.value.trim();

  if (!keyword) {
    alert("Please type something to search.");
    return;
  }

  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${encodeURIComponent(keyword)}&client_id=${accessKey}&per_page=12`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("API call failed configuration check");

    const data = await response.json();

    // Reset container if it's page 1
    if (page === 1) {
      searchResult.innerHTML = "";
    }

    const results = data.results;

    if (results.length === 0) {
      searchResult.innerHTML = `<p style="color: white; text-align: center; grid-column: 1/-1;">No results found for "${keyword}". Try another search!</p>`;
      showMoreBtn.style.display = "none";
      return;
    }

    results.forEach((result) => {

      // Create structural thumbnail wrapper item
      const imageCard = document.createElement("div");
      imageCard.classList.add("image-card");


      const imageLink = document.createElement("a");
      imageLink.href = result.links.html;
      imageLink.target = "_blank";

      const image = document.createElement("img");
      image.src = result.urls.small;
      image.alt = result.alt_description || "Unsplash Image";

      imageLink.appendChild(image);

      // for download button overlay
      const downloadBtn = document.createElement("button");
      downloadBtn.classList.add("download-btn");
      downloadBtn.title = "Download High Quality Image";
      downloadBtn.innerHTML = `
        <svg xmlns="http://w3.org" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      `;

      downloadBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        downloadImage(result.urls.regular, `unsplash-${result.id}.jpg`);
      });

      imageCard.appendChild(imageLink);
      imageCard.appendChild(downloadBtn);
      searchResult.appendChild(imageCard);
    });

    if (results.length >= 12) {
      showMoreBtn.style.display = "block";
    } else {
      showMoreBtn.style.display = "none";
    }
  } catch (error) {
    console.error("Error fetching images:", error);
    alert("Something went wrong while loading data. Please try again.");
  }
}

async function downloadImage(imageSrc, filename) {
  try {
    const response = await fetch(imageSrc);
    const blobData = await response.blob();
    const blobUrl = URL.createObjectURL(blobData);

    const tempLink = document.createElement("a");
    tempLink.href = blobUrl;
    tempLink.download = filename;
    document.body.appendChild(tempLink);
    tempLink.click();

    document.body.removeChild(tempLink);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    alert(
      "Secure download blocked. Try opening the image preview link to right-click and save!",
    );
    console.error("Download pipeline error context:", error);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  page = 1;
  searchImages();
});

showMoreBtn.addEventListener("click", () => {
  page++;
  searchImages();
});
