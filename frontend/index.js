function verifyToken() {
  const token = document.getElementById("tokenInput").value;

  if (!token || token.length !== 5 || isNaN(token)) {
    alert("Please enter a valid 5-digit token.");
    return;
  }

  const mockData = {
    "10546": { driverName: "John Doe", vehicle: "Toyota Corolla", licensePlate: "ABC123" },
    "12345": { driverName: "Jane Smith", vehicle: "Honda Civic", licensePlate: "XYZ789" },
  };

  if (mockData[token]) {
    const driver = mockData[token];
    alert(`
      Driver Verified:
      Name: ${driver.driverName}
      Vehicle: ${driver.vehicle}
      License Plate: ${driver.licensePlate}
    `);
  } else {
    alert("Token not recognized. Report suspicious activity?");
  }
}

function toggleAuthOptions() {
  const authOptions = document.getElementById("auth-options");
  authOptions.style.display = authOptions.style.display === "none" ? "block" : "none";
}

function showReportForm() {
  document.getElementById("report-form").style.display = "block";
}

function hideReportForm() {
  document.getElementById("report-form").style.display = "none";
}
