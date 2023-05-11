const express = require("express");
const path = require("path");
const { Client } = require("pg");

const httpPort = 80;

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(httpPort, function () {
  console.log(`Listening on port ${httpPort}!`);
});

function uploadToDB(data) {
  console.log("gör server");
  const client = new Client({
    user: "your_username",
    host: "your_host",
    database: "your_database",
    password: "your_password",
    port: "your_port",
  });
  console.log("server gjord, kopplar");

  client
    .connect()
    .then(() => {
      console.log("Connected to the database");
      // Assuming you have a table named 'your_table' with columns matching the CSV file structure
      const query =
        "INSERT INTO your_table (col1, col2, col3) VALUES ($1, $2, $3)";

      data.forEach((row) => {
        // Execute the query for each row of data
        client.query(query, row, (err, res) => {
          if (err) {
            console.error("Error executing query:", err);
          } else {
            console.log("Data inserted successfully");
          }
        });
      });
    })
    .catch((err) => {
      console.error("Error connecting to the database:", err);
    })
    .finally(() => {
      client.end(); // Close the database connection
    });
}
