const cors = require("cors");
const { Pool } = require("pg");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 4444;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "CarShop",
  password: "marto",
  port: 5555,
});

app.use(cors());
app.use(bodyParser.json());

app.post("/review", async (req, res) => {
  try {
    const { writer, reviewText, reviewGrade, carId } = req.body;
    const client = await pool.connect();
    const queryText =
      "INSERT INTO reviews (writer, review_text, review_grade, car_id) VALUES ($1, $2, $3, $4)";
    const values = [writer, reviewText, reviewGrade, carId];
    const result = await client.query(queryText, values);
    client.release();

    res.status(200).json({ message: "Review added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Invalid message!!!" });
  }
});
app.get("/car", async (req, res) => {
  const carId = req.query.id;
  try {
    const client = await pool.connect();
    const queryText = "SELECT * FROM cars WHERE id = $1";
    const result = await client.query(queryText, [carId]);

    res.json(result.rows[0]);
    client.release();
  } catch (error) {
    console.error(error);
  }
});
app.get("/reviews", async (req, res) => {
  try {
    const carId = req.query.id;
    const client = await pool.connect();
    const queryText = "SELECT * FROM reviews WHERE car_id = $1";
    const result = await client.query(queryText, [carId]);
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error(error);
  }
});

app.get("/cars", async (req, res) => {
  try {
    const client = await pool.connect();
    const queryText =
      "SELECT id, brand, model, price, imageurl FROM cars ORDER BY price DESC";
    const result = await client.query(queryText);
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error(error);
  }
});
app.post("/buyer", async (req, res) => {
  try {
    const { firstName, lastName, country, address, carId } = req.body;
    const client = await pool.connect();
    const queryText =
      "INSERT INTO buyers(firstname, lastname, country, address, car_id) VALUES ($1, $2, $3, $4, $5)";
    const result = await client.query(queryText, [
      firstName,
      lastName,
      country,
      address,
      carId,
    ]);
    client.release();

    res.status(200).json({ message: `Succesfully added buyer.` });
  } catch (error) {
    console.error(error);
  }
});
app.get("/top3", async (req, res) => {
  try {
    const client = await pool.connect();
    const queryText =
      "SELECT c.brand, c.model, COUNT(car_id) ,c.imageurl FROM cars AS c JOIN buyers AS b ON b.car_Id = c.id GROUP BY c.brand, c.model, c.imageurl ORDER BY COUNT(car_id) DESC LIMIT 3";
    const result = await client.query(queryText);
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error(error);
  }
});
app.get("/buyers", async (req, res) => {
  try {
    const client = await pool.connect();
    const queryText =
      "SELECT b.id, b.firstname, b.lastname, b.address, b.country, c.brand, c.model, c.price FROM buyers AS b JOIN cars AS c ON c.id = b.car_id ORDER BY b.id";
    const result = await client.query(queryText);
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error(error);
  }
});
app.delete("/delete", async (req, res) => {
  try {
    const buyerId = req.body.id;
    const client = await pool.connect();
    const queryText = "DELETE FROM buyers WHERE id = $1";
    const result = await client.query(queryText, [buyerId]);
    client.release();

    res
      .status(200)
      .json({ message: `Succesfully deleted buyer with id ${buyerId}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
