const cors = require("cors");
const { Pool } = require("pg");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "CarShop",
  password: "marto",
  port: 5555,
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..", "/css")));
app.use(express.static(path.join(__dirname, "..", "/js")));

app.post("/details/add_review", async (req, res) => {
  try {
    const { review, username, text, carId } = req.body;
    if ((!review, !username, !text, !carId)) {
      throw new Error("Invalid Info!");
    }
    const client = await pool.connect();
    const queryText =
      "INSERT INTO reviews (writer, review_text, review_grade, car_id) VALUES ($1, $2, $3, $4)";
    await client.query(queryText, [username, text, review, carId]);
    client.release();

    res.redirect(`/details/${carId}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Invalid message!!!" });
  }
});
app.get("/details/:id", async (req, res) => {
  const carId = req.params.id;
  try {
    const client = await pool.connect();
    const carQuery = "SELECT * FROM cars WHERE id = $1";
    const resultCar = await client.query(carQuery, [carId]);
    const reviewQuery = "SELECT * FROM reviews WHERE car_id = $1";
    const resultReview = await client.query(reviewQuery, [carId]);
    client.release();
    const [firstHalf, lastHalf] = await splitTextInHalf(
      resultCar.rows[0].description
    );
    res.render("details", {
      car: resultCar.rows[0],
      reviews: resultReview.rows,
      desc: { firstHalf, lastHalf },
    });
  } catch (error) {
    console.error(error);
  }
  async function splitTextInHalf(text) {
    const midpoint = Math.ceil(text.length / 2);
    const firstHalf = text.substring(0, midpoint);
    const secondHalf = text.substring(midpoint);

    return [firstHalf, secondHalf];
  }
});

app.get("/cars", async (req, res) => {
  try {
    const client = await pool.connect();
    const queryText =
      "SELECT id, brand, model, price, imageurl FROM cars ORDER BY price DESC";
    const result = await client.query(queryText);
    client.release();

    res.render("index", { cars: result.rows });
  } catch (error) {
    console.error(error);
  }
});
app.get("/add_car", async (req, res) => {
  res.render("add");
});
app.post("/add_car", async (req, res) => {
  try {
    const { brand, model, price, imageurl, description } = req.body;

    if (!brand || !model || !price || !imageurl) {
      throw new Error("All fields required!");
    }

    if (price <= 0) {
      throw new Error("Price must be positive!!");
    }
    const client = await pool.connect();
    const queryText =
      "INSERT INTO cars (brand, model, price, imageurl, description) VALUES ($1, $2, $3, $4, $5)";
    const values = [brand, model, price, imageurl, description];

    await pool.query(queryText, values);
    client.release();

    res.redirect("/cars");
  } catch (error) {
    console.error(error);
  }
});
app.post("/buy", async (req, res) => {
  try {
    const { firstName, lastName, country, address, carId } = req.body;
    const client = await pool.connect();
    const queryText =
      "INSERT INTO buyers(firstname, lastname, country, address, car_id) VALUES ($1, $2, $3, $4, $5)";
    await client.query(queryText, [
      firstName,
      lastName,
      country,
      address,
      carId,
    ]);

    client.release();
    res.status(200).json({ message: "Buyer added successfully" });
  } catch (error) {
    console.error(error);
  }
});
app.get("/orders", async (req, res) => {
  try {
    const client = await pool.connect();
    const buyerQuery =
      "SELECT b.id, b.firstname, b.lastname, b.address, b.country, c.brand, c.model, c.price FROM buyers AS b JOIN cars AS c ON c.id = b.car_id ORDER BY b.id";
    const resultBuyer = await client.query(buyerQuery);
    const top3Query =
      "SELECT c.brand, c.model, COUNT(car_id) ,c.imageurl FROM cars AS c JOIN buyers AS b ON b.car_Id = c.id GROUP BY c.brand, c.model, c.imageurl ORDER BY COUNT(car_id) DESC LIMIT 3";
    const top3Result = await client.query(top3Query);
    client.release();
    res.render("orders", {
      data: resultBuyer.rows,
      bestCars: top3Result.rows,
    });
  } catch (error) {
    console.error(error);
  }
});
app.get("/edit/:id", async (req, res) => {
  const carId = req.params.id;
  try {
    const client = await pool.connect();
    const queryText = "SELECT * FROM cars WHERE id = $1";
    const result = await client.query(queryText, [carId]);
    client.release();

    const car = result.rows[0];
    res.render("edit", { car: car });
  } catch (error) {
    console.error(error);
  }
});
app.post("/edit/:id", async (req, res) => {
  try {
    const { carId, brand, model, price, imageurl, description } = req.body;

    if (!brand || !model || !price || !imageurl) {
      throw new Error("All fields required!");
    }

    if (price <= 0) {
      throw new Error("Price must be positive!!");
    }
    const client = await pool.connect();
    const queryText =
      "UPDATE cars SET brand = $1, model = $2, price = $3, imageurl = $4, description = $5 WHERE id = $6";
    const values = [brand, model, price, imageurl, description.trim(), carId];

    await pool.query(queryText, values);
    client.release();

    res.redirect("/cars");
  } catch (error) {
    console.error(error);
  }
});
app.post("/delete/:id", async (req, res) => {
  const carId = req.params.id;
  try {
    const client = await pool.connect();
    const queryText = "DELETE FROM cars WHERE id = $1";
    await client.query(queryText, [carId]);
    client.release();

    res.redirect("/cars");
  } catch (error) {
    console.error(error);
  }
});
app.post("/delete_buyer/:id", async (req, res) => {
  const carId = req.params.id;
  try {
    const client = await pool.connect();
    const queryText = "DELETE FROM buyers WHERE id = $1";
    await client.query(queryText, [carId]);
    client.release();

    res.redirect("/orders");
  } catch (error) {
    console.error(error);
  }
});
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}/cars`);
});
