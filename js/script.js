const buyButton = document.querySelector(".buy-button");

buyButton.addEventListener("click", async function () {
  const currentURL = window.location.href;

  const urlParts = currentURL.split("/");

  const numberInURL = urlParts[urlParts.length - 1];

  const firstNameElement = document.getElementById("firstName");
  const lastNameElement = document.getElementById("lastName");
  const countryElement = document.getElementById("country");
  const addressElement = document.getElementById("address");
  const parElement = document.getElementById("ty");

  if (
    !firstNameElement.value ||
    !lastNameElement.value ||
    !countryElement.value ||
    !addressElement.value
  ) {
    return;
  }

  const buyer = {
    firstName: firstNameElement.value,
    lastName: lastNameElement.value,
    country: countryElement.value,
    address: addressElement.value,
    carId: parseInt(numberInURL),
  };
  parElement.textContent =
    firstNameElement.value +
    " " +
    lastNameElement.value +
    " Thank you for buying the car!";
  await fetch("http://localhost:3000/buy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buyer),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Invalid");
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error);
    });

  firstNameElement.value = "";
  lastNameElement.value = "";
  countryElement.value = "";
  addressElement.value = "";
});

const hideButton = document.querySelector(".hide-desc");

hideButton.addEventListener("click", async function () {
  hideButton.style = "display: none;";

  const secretDesc = document.querySelector(".secret-desc");
  secretDesc.style = "display: block;";
});
