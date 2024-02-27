const taskURL = "http://localhost:4444";

window.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const carId = urlParams.get("id");
  await fetchCarData(carId);
  await fetchReviews(carId);
});
const button = document.querySelector(".buy-button");

button.addEventListener("click", async function () {
  const firstNameElement = document.getElementById("firstName");
  const lastNameElement = document.getElementById("lastName");
  const countryElement = document.getElementById("country");
  const addressElement = document.getElementById("address");
  const parElement = document.getElementById("ty");
  if (
    firstNameElement.value === "" ||
    lastNameElement.value === "" ||
    countryElement.value === "" ||
    addressElement.value === ""
  ) {
    return;
  }

  parElement.textContent =
    firstNameElement.value +
    " " +
    lastNameElement.value +
    " Thank you for buying the car!";

  const urlParams = new URLSearchParams(window.location.search);
  const carId = urlParams.get("id");

  const buyer = {
    firstName: firstNameElement.value,
    lastName: lastNameElement.value,
    country: countryElement.value,
    address: addressElement.value,
    carId: carId,
  };
  await fetch(`${taskURL}/buyer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buyer),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Invalid buyer!!");
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

const submitBtn = document.querySelector(".submit-button");

submitBtn.addEventListener("click", async function () {
  const nameElement = document.getElementById("username");
  const writer = nameElement.value;
  const textBoxElement = document.querySelector(".textbox");
  const reviewText = textBoxElement.value;
  const urlParams = new URLSearchParams(window.location.search);
  const carId = urlParams.get("id");

  const selectElement = document.querySelector(".cars");
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const reviewGrade = selectedOption.text;

  if (!carId || !writer || !reviewText) {
    return;
  }

  const review = {
    writer: writer,
    reviewText: reviewText,
    reviewGrade: reviewGrade,
    carId: carId,
  };
  await fetch(`${taskURL}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Invalid request!");
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error);
    });
  location.reload();
});
async function fetchCarData(carId) {
  const response = await fetch(`${taskURL}/car?id=${carId}`);
  const data = await response.json();

  document.querySelector(".big-pic").src = data.imageurl;
  document.querySelector(".name").textContent = data.brand + " " + data.model;
  document.querySelector(".price").textContent = data.price + "$";
  const [firstHalf, secondHalf] = await splitTextInHalf(data.description);
  document.querySelector(".main-desc").textContent = firstHalf;
  document.querySelector(".secret-desc").textContent = secondHalf;

  async function splitTextInHalf(text) {
    const midpoint = Math.ceil(text.length / 2);
    const firstHalf = text.substring(0, midpoint);
    const secondHalf = text.substring(midpoint);

    return [firstHalf, secondHalf];
  }
}
async function fetchReviews(carId) {
  const response = await fetch(`${taskURL}/reviews?id=${carId}`);
  const data = await response.json();

  const ulElement = document.querySelector(".reviews");
  ulElement.innerHTML = "";

  data.forEach((element) => {
    const liElement = document.createElement("li");
    liElement.className = "review-item";

    const parElement = document.createElement("p");
    parElement.className = "username";
    parElement.textContent = `User -> ${element.writer}`;

    const gradeElement = document.createElement("p");
    gradeElement.textContent = `Grade -> ${element.review_grade}`;
    const commentElement = document.createElement("p");
    commentElement.textContent = "Comment:";

    const textElement = document.createElement("p");
    textElement.className = "comment";
    textElement.textContent = `${element.review_text}`;

    liElement.appendChild(parElement);
    liElement.appendChild(gradeElement);
    liElement.appendChild(commentElement);
    liElement.appendChild(textElement);

    ulElement.appendChild(liElement);
  });
}
