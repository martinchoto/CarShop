const taskURL = "http://localhost:4444";

window.addEventListener("DOMContentLoaded", async () => {
  await fetchCars();
});
async function fetchCars() {
  const carDict = {
    1: "lambo_page.html",
    2: "bmw_page.html",
    3: "porsche_page.html",
    4: "audi_page.html",
    5: "opel_page.html",
  };

  const response = await fetch(`${taskURL}/cars`);
  const data = await response.json();

  const container = document.querySelector(".container");
  container.innerHTML = "";
  data.forEach((element) => {
    const divElement = document.createElement("div");
    divElement.className = "grid-item";

    const imgLink = document.createElement("a");
    imgLink.href = carDict[element.id] + `?id=${element.id}`;
    const imgElement = document.createElement("img");
    imgElement.src = element.imageurl;

    imgLink.appendChild(imgElement);

    divElement.appendChild(imgLink);
    const priceAndName = document.createElement("div");
    priceAndName.className = "price-name";

    const aEl = document.createElement("a");
    const nameEl = document.createElement("p");
    nameEl.className = "name";
    aEl.textContent = `${element.brand} ${element.model}`;
    aEl.href = carDict[element.id] + `?id=${element.id}`;
    nameEl.appendChild(aEl);

    const priceEl = document.createElement("p");
    priceEl.className = "price";
    priceEl.textContent = element.price + "$";

    priceAndName.appendChild(nameEl);
    priceAndName.appendChild(priceEl);
    divElement.appendChild(priceAndName);

    container.appendChild(divElement);
  });
}
