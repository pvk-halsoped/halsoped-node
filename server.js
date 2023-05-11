const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
// create application/json parser
var jsonParser = bodyParser.json();

const httpPort = 80;

const app = express();

/* const pool = new Pool({
  user: 'testadmin',
  host: 'localhost',
  database: 'postgres',
  password: 'testpassword',
  port: 5432
}); */

const pool = new Pool({
  user: 'HPadmin',
  host: 'localhost',
  database: 'postgres',
  password: 'HPpassword',
  port: 5432
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/upload", jsonParser, function (req, res) {
  const listOfLists = req.body;
  res.status(200).end();
  console.log("trying to connect to db");
  pool.connect();
  console.log("connected");

  //var db_query = 'INSERT INTO test (timestamp, name, color, number) VALUES ($1, $2, $3, $4)'
  
  const usersQuery = `INSERT INTO Users (userID, email, password) 
                      VALUES ($1, $1, $2);`;
  const employeeQuery = `INSERT INTO Employee (userID, departmentID)
                         VALUES ($1, $2);`;
  const healthScreeningQuery = `INSERT INTO HealthScreening (screeningID, userID, companyID) 
                                VALUES ($1, $2, $3);`;                 
  const healthSurveyQuery = `INSERT INTO HealthSurvey (surveyID, surveyMethod, date, screeningID)
                        VALUES ($1, $2, $2, $1);`;
  const generalQuery = `INSERT INTO General (surveyID, generalQ1, generalQ2) 
                        VALUES ($1, $2, $3);`;
  const fitnessQuery = `INSERT INTO Fitness (surveyID, fitnessQ1, fitnessQ2, fitnessQ3, fitnessQ4) 
                        VALUES ($1, $2, $3, $4, $5);`;
  const psychologicalHealthQuery = `INSERT INTO PsychologicalHealth (surveyID, psychologyQ1, psychologyQ2, psychologyQ3, psychologyQ4, psychologyQ5, psychologyQ6, psychologyQ7, psychologyQ8, psychologyQ9) 
                                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`;
  const workEnvironmentQuery = `INSERT INTO WorkEnvironment (surveyID, environmentQ1, environmentQ2, environmentQ3, environmentQ4, environmentQ5, environmentQ6, environmentQ7) 
                                VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`;
  const motivationQuery = `INSERT INTO Motivation (surveyID, motivationQ1, motivationQ2, motivationQ3, motivationQ4, motivationQ5, motivationQ6, motivationQ7, motivationQ8) 
                          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`;
  const eatingHabitsQuery = `INSERT INTO EatingHabits (surveyID, eatingQ1, eatingQ2, eatingQ3, eatingQ4, eatingQ5) 
                            VALUES ($1, $2, $3, $4, $5, $6);`;
  const otherQuery = `INSERT INTO Other (surveyID, otherQ1, otherQ2, otherQ3, otherQ4) 
                      VALUES ($1, $2, $3, $4, $5);`;
  
  listOfLists.forEach((element) => {

    let insert_list = [element[2], "NULL"]
    pool.query(usersQuery, insert_list, (res, err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Insert successful');
    });

    insert_list = [element[2], 1]
    pool.query(employeeQuery, insert_list, (res, err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Insert successful');
    });

    insert_list = [element[0], element[2], 1]
    pool.query(healthScreeningQuery, insert_list, (res, err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Insert successful');
    });

    insert_list = [element[0], "NULL"]
    pool.query(healthSurveyQuery, insert_list, (res, err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Insert successful');
    });

    insert_list = [element[0], element[3], element[4]]
    pool.query(generalQuery, insert_list, (res, err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Insert successful');
    });

    insert_list = [element[0], element[6], element[7], element[8]]
    pool.query(fitnessQuery, insert_list, (res, err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Insert successful');
    });

    insert_list = [element[0], element[9], element[10], element[11], element[12], element[13], element[14], element[15], element[16], element[17]]
    pool.query(psychologicalHealthQuery, insert_list, (res, err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Insert successful');
    });

    insert_list = [element[0], element[18], element[19], element[20], element[21], element[22], element[23], element[24]]
    pool.query(workEnvironmentQuery, insert_list, (res, err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Insert successful');
    });

    insert_list = [element[0], element[25], element[26], element[27], element[28], element[29], element[30], element[31], element[32]]
    pool.query(motivationQuery, insert_list, (res, err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Insert successful');
    });

    insert_list = [element[0], element[33], element[34], element[35], element[36], element[37]]
    pool.query(eatingHabitsQuery, insert_list, (res, err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Insert successful');
    });

    insert_list = [element[0], element[38], element[39], element[40], element[41]]
    pool.query(otherQuery, insert_list, (res, err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Insert successful');
    });


    console.log(element);
  });
});

app.listen(httpPort, function () {
  console.log(`Listening on port ${httpPort}!`);
});
