const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const fs = require("fs");
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
  user: "HPadmin",
  host: "localhost",
  database: "postgres",
  password: "HPpassword",
  port: 5432,
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/upload", jsonParser, function (req, res) {
  const listOfLists = req.body;
  res.status(200).end();

  console.log("Trying to connect to db");
  pool.connect();
  console.log("Connected");

  buildQueries(listOfLists);
});

app.post("/download-files", jsonParser, function (req, res) {
  const listOfInsatsLists = req.body;
  res.status(200).end();
  let resultToHP = "";
  for (let i = 0; i < listOfInsatsLists.length; i++) {
    resultToHP += listOfInsatsLists[i][0].companyID + "\n";
    for (let j = 0; j < listOfInsatsLists[i].length; j++) {
      if (listOfInsatsLists[i][j].numberOfOns > 0) {
        resultToHP +=
          listOfInsatsLists[i][j].name +
          " " +
          listOfInsatsLists[i][j].subcategory +
          "\n";
      }
    }
    resultToHP += "\n";
  }
  console.log(resultToHP);
});

async function buildQueries(listOfLists) {
  //Queries for inserting into the database

  const companyQuery = `INSERT INTO Company (companyID, name)
                        VALUES ($1,$2);`;

  const departmentQuery = `INSERT INTO Department (departmentID, companyID, name)
                           VALUES ($1,$2,$3);`;

  const usersQuery = `INSERT INTO Users (userID, email, password) 
                      VALUES ($1, $1, $2);`;

  const employeeQuery = `INSERT INTO Employee (userID, departmentID)
                         VALUES ($1, $2);`;

  const healthScreeningQuery = `INSERT INTO HealthScreening (screeningID, userID, companyID) 
                                VALUES ($1, $2, $3);`;

  const healthSurveyQuery = `INSERT INTO HealthSurvey (surveyID, surveyMethod, date, screeningID)
                        VALUES ($1, $2, $3, $4);`;

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

  // following two queries are run once per survey

  //TODO: Change companyID and name to be dynamic or manually change it here for each survey
  let insert_list = [1, "companyName"]; // companyID, name
  await sendQuery(companyQuery, insert_list, "Company");

  //TODO: As above for departmentID, companyID and name (IMPORTANT: companyID must match the one above)
  insert_list = [1, 1, "departmentName"]; // departmentID, companyID, name
  await sendQuery(departmentQuery, insert_list, "Department");

  listOfLists.forEach(async (element) => {
    // following queries are run for all responses in the survey

    //TODO: users should have passwords, but is not implemented yet
    insert_list = [element[2], "NULL"]; // userID, password
    await sendQuery(usersQuery, insert_list, "Users");

    //TODO: departmentID should match the departmentID above
    insert_list = [element[2], 1]; // userID, departmentID
    await sendQuery(employeeQuery, insert_list, "Employees");

    //TODO: companyID should match the companyID above
    insert_list = [element[0], element[2], 1]; // screeningID, userID, companyID
    await sendQuery(healthScreeningQuery, insert_list, "Health Screening");

    let date = await formatDate(element[0]);
    //console.log("ELEMENT at index 0: " + element[0])

    insert_list = [element[0], 0, date, element[0]]; // surveyID, surveyMethod, date, screeningID
    console.log("HEALTH SURVEY INSERT: " + insert_list);
    //console.log("HEALTH SURVEY INSERT: "+ insert_list);

    await sendQuery(healthSurveyQuery, insert_list, "Health Survey");

    insert_list = [element[0], element[3], element[4]]; // surveyID, generalQ1, generalQ2
    sendQuery(generalQuery, insert_list, "General");

    insert_list = [element[0], element[5], element[6], element[7], element[8]]; // surveyID, fitnessQ1, fitnessQ2, fitnessQ3, fitnessQ4
    sendQuery(fitnessQuery, insert_list, "Fitness");

    insert_list = [
      element[0],
      element[9],
      element[10],
      element[11],
      element[12],
      element[13],
      element[14],
      element[15],
      element[16],
      element[17],
    ]; // surveyID, workEnvironmentQ1, workEnvironmentQ2, workEnvironmentQ3, workEnvironmentQ4, workEnvironmentQ5, workEnvironmentQ6, workEnvironmentQ7, workEnvironmentQ8, workEnvironmentQ9
    sendQuery(workEnvironmentQuery, insert_list, "Work Environment");

    insert_list = [
      element[0],
      element[18],
      element[19],
      element[20],
      element[21],
      element[22],
      element[23],
      element[24],
    ]; // surveyID, workEnvironmentQ1, workEnvironmentQ2, workEnvironmentQ3, workEnvironmentQ4, workEnvironmentQ5, workEnvironmentQ6, workEnvironmentQ7, workEnvironmentQ8, workEnvironmentQ9
    sendQuery(psychologicalHealthQuery, insert_list, "Psychological Health");

    insert_list = [
      element[0],
      element[25],
      element[26],
      element[27],
      element[28],
      element[29],
      element[30],
      element[31],
      element[32],
    ]; // surveyID, motivationQ1, motivationQ2, motivationQ3, motivationQ4, motivationQ5, motivationQ6, motivationQ7, motivationQ8, motivationQ9
    sendQuery(motivationQuery, insert_list, "Motivation");

    insert_list = [
      element[0],
      element[33],
      element[34],
      element[35],
      element[36],
      element[37],
    ]; // surveyID, eatingHabitsQ1, eatingHabitsQ2, eatingHabitsQ3, eatingHabitsQ4, eatingHabitsQ5
    sendQuery(eatingHabitsQuery, insert_list, "Eating Habits");

    insert_list = [
      element[0],
      element[38],
      element[39],
      element[40],
      element[41],
    ]; // surveyID, sleepQ1, sleepQ2, sleepQ3, sleepQ4
    sendQuery(otherQuery, insert_list, "Other");
  });
}

async function sendQuery(query, insert_list, category) {
  pool.query(query, insert_list, (res, err) => {
    if (err) {
      console.error("${category}\nDB result: ${res}\nDB error: ${err}");
    }
    console.log(category.toUpperCase() + " DB insert successful");
  });
}

async function formatDate(raw_date) {
  // date formatting for database insertion (YYYY-MM-DD)
  //console.log("RAW_DATE: " + raw_date);

  let split_raw_date = raw_date.split(" ");
  let split_date = split_raw_date[0].split("/");
  let day = split_date[0];
  if (split_date[0].length == 1) {
    day == "0" + split_date[0];
  }
  console.log("SPLIT DATE: " + split_date);
  let date = split_date[2] + "-" + split_date[1] + "-" + day;
  console.log("DATE: " + date);
  return date;
}

app.listen(httpPort, function () {
  console.log(`Listening on port ${httpPort}!`);
});
