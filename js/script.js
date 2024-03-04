const buyButton = document.querySelector(".buy-button");

buyButton.addEventListener("click", async function () {
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

  parElement.textContent =
    firstNameElement.value +
    " " +
    lastNameElement.value +
    " Thank you for buying the car!";

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
