document.addEventListener("DOMContentLoaded", init, false);
function init() {
  console.log("väntar på fil");
}

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
