"use strict";

const cardContainer = document.querySelector(".card-container");
const selectColaboratori = document.querySelector(".count-colaboratori");
const searchInput = document.querySelector("#searchBar");
let colaboratori = [];
let onpage_colaboratori = [];
let step = 48;

searchInput.addEventListener("input", (e) => {
  const dateInput = e.target.value.toLowerCase().replace(/\s+/g, "");
  const colaboratoriFiltrati = onpage_colaboratori.filter((colaborator) =>
    colaborator.textContent
      .toLowerCase()
      .replace(/\s+/g, "")
      .includes(dateInput)
  );
  cardContainer.innerHTML = "";
  colaboratoriFiltrati.forEach((colaborator) => {
    cardContainer.appendChild(colaborator);
  });
  if (colaboratoriFiltrati.length === 0) {
    cardContainer.innerHTML = `<h1 class="not-found">Nu am gasit nimic pentru ${dateInput} !</h1>`;
  }
});

fetch("https://api.peviitor.ro/v1/logo/")
  .then((response) => response.json())
  .then((data) => {
    selectColaboratori.textContent = `Listinguri de la ${data.companies.length} companii !`;
    colaboratori = data.companies;
    displayColaboratori(colaboratori);
  })
  .then(() => {
    for (let i = 0; i < step; i++) {
      cardContainer.appendChild(onpage_colaboratori[i]);
    }

    window.addEventListener("scroll", () => {
      if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 10
      ) {
        for (let i = step; i < step + 48; i++) {
          if (i < onpage_colaboratori.length) {
            cardContainer.appendChild(onpage_colaboratori[i]);
          }
        }
        step += 48;
      }
    });
  });

function displayColaboratori(colaboratori) {
  colaboratori.forEach((collaborator) => {
    const firmaDiv = document.createElement("div");
    firmaDiv.classList.add("firma"); 

    const button = document.createElement("button");
    const image = document.createElement("img");
    const link = document.createElement("a");

    const allToLowerCase = collaborator.name.replace(/\s+/g, "");

    const assetPath = `./assets/${allToLowerCase}.png`;

    if (collaborator.logo === null) {
      image.src = assetPath;
    } else {
      image.src = collaborator.logo;
    }

    image.alt = collaborator.name;
    image.onerror = () => {
      image.src = "./assets/logonotfound.png";
    };

    button.textContent = allToLowerCase;
    button.id = allToLowerCase;
    button.onclick = function () {
      window.location.href = link.href;
    };

    link.href = `https://scrapers.peviitor.ro/src/${allToLowerCase}/index.html`;

    link.appendChild(image);
    firmaDiv.appendChild(link);
    firmaDiv.appendChild(button);
    onpage_colaboratori.push(firmaDiv);
  });
}