document.addEventListener("DOMContentLoaded", init, false);
function init() {
  console.log("väntar på fil");
}

// Event listener for fileDownload button
document.getElementById("resultButton").addEventListener("click", function () {
  var fileInput = document.getElementById("fileInput");
  var file = fileInput.files[0];
  if (file) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var contents = e.target.result;
      var rows = contents.split("\n"); // Split contents into rows

      var data = []; // The bigger list to store all rows
      var cells = []; // the inner list
      rows.forEach(function (row) {
        cells = row.split(","); // Split each row into cells
        // Trim each element in the cells array
        var trimmedCells = cells.map(function (cell) {
          return cell.trim();
        });
        data.push(trimmedCells); // Add the cells to the bigger list
      });

      // Removes the header row
      data.shift();

      // make list of Insats-list
      let listOfInsatsLists = [];
      for (var i = 0; i < data.length; i++) {
        listOfInsatsLists.push(makeInsatser(data[i][2]));
      }

      // Here begins the algorithm
      for (var i = 0; i < data.length; i++) {
        var currentInsatsList = listOfInsatsLists[i];
        var currentRow = data[i];
        currentInsatsList = target1(currentInsatsList, currentRow[6]);
        currentInsatsList = target2(
          currentInsatsList,
          currentRow[7],
          currentRow[8]
        );
        currentInsatsList = target3(currentInsatsList, currentRow[9]);
        currentInsatsList = target4(
          currentInsatsList,
          currentRow[11],
          currentRow[12],
          currentRow[13]
        );
        currentInsatsList = target5(
          currentInsatsList,
          currentRow[14],
          currentRow[15],
          currentRow[16],
          currentRow[17]
        );
        currentInsatsList = target6(currentInsatsList, currentRow[18]);
        currentInsatsList = target7(currentInsatsList);
        currentInsatsList = target8(
          currentInsatsList,
          currentRow[19],
          currentRow[20],
          currentRow[21],
          currentRow[22]
        );
        currentInsatsList = target9(currentInsatsList);
        currentInsatsList = target10(currentInsatsList, currentRow[35]);
        currentInsatsList = target11(currentInsatsList, currentRow[36]);
        currentInsatsList = target12(currentInsatsList, currentRow[37]);
        currentInsatsList = target13(currentInsatsList, currentRow[38]);
      }
      console.log("Algorithm done!");
      console.log(listOfInsatsLists);

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
      // Create a Blob object from the string
      const blob = new Blob([resultToHP], { type: "text/plain" });

      // Trigger the file download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "result.txt";
      link.click();
    };

    reader.readAsText(file);
  } else {
    alert("Choose a file first!");
  }
});

// Event listener for upload button
document.getElementById("uploadButton").addEventListener("click", function () {
  var fileInput = document.getElementById("fileInput");
  var file = fileInput.files[0];

  if (file) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var contents = e.target.result;
      var rows = contents.split("\n"); // Split contents into rows

      var data = []; // The bigger list to store all rows
      var cells = []; // the inner list
      rows.forEach(function (row) {
        cells = row.split(","); // Split each row into cells
        // Trim each element in the cells array
        var trimmedCells = cells.map(function (cell) {
          return cell.trim();
        });
        data.push(trimmedCells); // Add the cells to the bigger list
      });

      // Removes the header row
      data.shift();
      console.log(data);
      console.log(JSON.stringify(data));
      // Here, you can process the data as needed
      fetch("/upload", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
    };

    reader.readAsText(file);
  } else {
    alert("Choose a file first!");
  }
});

function makeInsatser(companyID = "") {
  const insats0 = new Insats("Träningsprogram", "Styrka", companyID);
  const insats1 = new Insats("Träningsprogram", "Kondition", companyID);
  const insats2 = new Insats("Träningsprogram", "Vardsgsmotion", companyID);
  const insats3 = new Insats("Rörelsepauser", "", companyID);
  const insats4 = new Insats(
    "Föreläsning inom stresshantering, återhämtning och sömn",
    "",
    companyID
  );
  const insats5 = new Insats("Individuell kostplan", "", companyID);
  const insats6 = new Insats("Meditation/andning", "", companyID);
  const insatser = [
    insats0,
    insats1,
    insats2,
    insats3,
    insats4,
    insats5,
    insats6,
  ];
  return insatser;
}

function target1(insatser, answer3) {
  if (
    [
      "0 minuter/Ingen tid",
      "Mindre än 30 minuter",
      "Upp till 60 minuter",
    ].includes(answer3)
  ) {
    insatser[0].turnOn();
  }
  return insatser;
}

function target2(insatser, answer4, answer5) {
  const numberSum =
    getNumberFromString(answer4) * 2 + getNumberFromString(answer5);
  if (numberSum < 150) {
    insatser[1].turnOn();
    insatser[2].turnOn();
    insatser[3].turnOn();
  }
  return insatser;
}

function target3(insatser, answer6) {
  if (getNumberFromString(answer6) > 7) {
    insatser[3].turnOn();
  }
  return insatser;
}

function target4(insatser, answer8, answer9, answer10) {
  const answerList = [answer8, answer9, answer10];
  answerList.forEach((answer) => {
    if (["Ofta", "Mycket ofta"].includes(answer)) {
      insatser[4].turnOn();
      insatser[6].turnOn();
      return insatser;
    }
  });
  return insatser;
}

function target5(insatser, answer11, answer12, answer13, answer14) {
  // 2 av 4, inte 2 eller fler, skiljer sig från target4, men följer instruktionerna
  let triggerCount = 0;
  const answers = [answer11, answer12, answer13, answer14];
  answers.forEach((answer) => {
    if (
      [
        "Flera gånger i månaden",
        "Flera gånger i veckan",
        "5 gånger eller mer i veckan",
      ].includes(answer)
    ) {
      triggerCount++;
    }
    if (triggerCount == 2) {
      insatser[4].turnOn();
      insatser[6].turnOn();
    }
  });
  return insatser;
}

function target6(insatser, answer15) {
  // Den här ska flagga och lyfta till högre rapport, det är just nu löst via att flagga på insatserna

  if (
    [
      "Jag blir trött under dagen och behöver långa pauser för att bli piggare.",
      "Jag känner mig trött hur mycket jag än vilar.",
    ].includes(answer15)
  ) {
    insatser[4].turnOn();
    insatser[4].flag();
    insatser[6].turnOn();
    insatser[6].flag();
  }
  return insatser;
}

function target7(insatser) {
  // denna ska använda target: 4, 5, 6.
  if (insatser[4].numberOfOns == insatser[6].numberOfOns >= 3) {
    console.log("Utmattningssyndrom!");
  }
  return insatser;
}

function target8(insatser, answer16, answer17, answer18, answer19) {
  const altList = ["Ibland", "Sällan", "Mycket sällan"];
  if (
    altList.includes(answer16) &&
    altList.includes(answer17) &&
    altList.includes(answer18) &&
    altList.includes(answer19)
  ) {
    insatser[4].turnOn();
    insatser[6].turnOn();
  }
  return insatser;
}

function target9(insatser) {
  // Inget händer, men saker ska lyftas till företaget
  console.log("Flagg till företaget");
  return insatser;
}

function target10(insatser, answer32) {
  if (
    [
      "Aldrig",
      "Några gånger i månaden",
      "En gång i veckan",
      "Några gånger i veckan",
    ].includes(answer32)
  ) {
    insatser[5].turnOn();
  }
  return insatser;
}

function target11(insatser, answer33) {
  if (
    [
      "Aldrig",
      "Några gånger i månaden",
      "En gång i veckan",
      "Några gånger i veckan",
    ].includes(answer33)
  ) {
    insatser[5].turnOn();
  }
  return insatser;
}

function target12(insatser, answer34) {
  if (
    [
      "Aldrig",
      "Några gånger i månaden",
      "En gång i veckan",
      "Några gånger i veckan",
    ].includes(answer34)
  ) {
    insatser[5].turnOn();
  }
  return insatser;
}

function target13(insatser, answer35) {
  if (
    [
      "Aldrig",
      "Några gånger i månaden",
      "En gång i veckan",
      "Några gånger i veckan",
    ].includes(answer35)
  ) {
    insatser[5].turnOn();
  }
  return insatser;
}

function getNumberFromString(string) {
  const potNum = string.match(/\d/);
  if (potNum) {
    return parseInt(potNum[0]);
  }
}

class Insats {
  constructor(name, subcategory = "", companyID = "") {
    this.name = name;
    this.subcategory = subcategory;
    this.companyID = companyID;
    this.rank = 0;
    this.numberOfOns = 0;
    this.hasFlag = false;
  }

  toString() {
    let returnString = this.name;
    if (this.subcategory) {
      returnString += ": " + this.subcategory;
    }
    if (this.hasFlag) {
      returnString += " - FLAGGAD!";
    }
    return returnString;
  }

  flag() {
    this.flag = true;
  }

  turnOn() {
    this.numberOfOns += 1;
  }
}
