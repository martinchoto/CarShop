const button = document.querySelector(".buy-button");

button.addEventListener("click", async function () {
  const firstNameElement = document.getElementById("firstName");
  const lastNameElement = document.getElementById("lastName");
  const parElement = document.getElementById("ty");
  if (firstNameElement.value === "" || lastNameElement.value === "") {
    return;
  }

  parElement.textContent =
    firstNameElement.value +
    " " +
    lastNameElement.value +
    " Thank you for buying the car!";
  firstNameElement.value = "";
  lastNameElement.value = "";
});
const hideButton = document.querySelector(".hide-desc");

hideButton.addEventListener("click", async function () {
  hideButton.style = "display: none;";

  const secretDesc = document.querySelector(".secret-desc");
  secretDesc.style = "display: block;";
});
