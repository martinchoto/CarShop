const taskURL = "http://localhost:4444";

window.addEventListener("DOMContentLoaded", async () => {
  await topThreeCars();
  await fetchBuyers();
});

async function topThreeCars() {
  const response = await fetch(`${taskURL}/top3`);
  const data = await response.json();
  const ulElement = document.querySelector(".bought-cars");
  data.forEach((element) => {
    const liElement = document.createElement("li");

    const imgElement = document.createElement("img");
    imgElement.src = element.imageurl;

    liElement.appendChild(imgElement);

    const nameElement = document.createElement("p");
    nameElement.textContent = `${element.brand} ${element.model}`;

    liElement.appendChild(nameElement);

    const countElement = document.createElement("p");
    countElement.textContent = `Bought: ${element.count}`;

    liElement.appendChild(countElement);

    ulElement.appendChild(liElement);
  });
}
async function fetchBuyers() {
  const response = await fetch(`${taskURL}/buyers`);
  const data = await response.json();

  const ulElement = document.querySelector(".buyers-list");
  ulElement.innerHTML = "";
  data.forEach((element) => {
    const liElement = document.createElement("li");
    liElement.className = "grid-item-list";
    liElement.setAttribute("id", `${element.id}`);

    const fullName = document.createElement("span");
    fullName.className = "fullName";
    fullName.textContent = `${element.firstname} ${element.lastname}`;

    liElement.appendChild(fullName);
    const addressElement = document.createElement("span");
    addressElement.className = "address";
    addressElement.textContent = element.address;
    liElement.appendChild(addressElement);

    const countryElement = document.createElement("span");
    countryElement.textContent = element.country;

    liElement.appendChild(countryElement);

    const carName = document.createElement("span");
    carName.textContent = `${element.brand} ${element.model}`;

    liElement.appendChild(carName);
    const priceEl = document.createElement("span");
    priceEl.textContent = `Price: ${element.price}$`;
    liElement.appendChild(priceEl);

    const delButton = document.createElement("button");
    delButton.className = "del-btn";
    delButton.textContent = "Delete";

    delButton.addEventListener("click", async () => {
      let id = liElement.getAttribute("id");
      await fetch(`${taskURL}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      }).then((response) => {
        if (!response.ok) {
          throw new Error("There is a mistake");
        }
        return response.json();
      });

      location.reload();
    });

    liElement.appendChild(delButton);

    ulElement.appendChild(liElement);
  });
}
async function deleteBuyer() {
  console.log("test");
}
