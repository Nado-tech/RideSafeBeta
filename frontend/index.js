// Sample default data for testing
// Sample default data for testing
const defaultTokens = {
  "12345": { driverName: "John Doe", vehicle: "Toyota Camry", licensePlate: "ABJ-123-XY" },
  "67890": { driverName: "Jane Smith", vehicle: "Honda Accord", licensePlate: "LAG-456-ZZ" }
};

const defaultDrivers = [
  { name: "John Doe", phone: "08012345678", vehicle: "Toyota Camry", licensePlate: "ABJ-123-XY", token: "12345" },
  { name: "Jane Smith", phone: "08123456789", vehicle: "Honda Accord", licensePlate: "LAG-456-ZZ", token: "67890" }
];

const defaultPassengers = [
  { name: "Alice Green", phone: "07098765432", email: "alice.green@example.com" },
  { name: "Bob Brown", phone: "09087654321", email: "bob.brown@example.com" }
];

// Function to fetch default data (accessible but not displayed)
function getDefaultData() {
  return {
    drivers: defaultDrivers,
    passengers: defaultPassengers,
    tokens: defaultTokens
  };
}


// Redirect functions for registration and login pages
function navigateToDriverLogin() {
  window.location.href = "driver-login.html";
}

function navigateToDriverSignup() {
  window.location.href = "driver-signup.html";
}

function navigateToPassengerLogin() {
  window.location.href = "passenger-login.html";
}

function navigateToPassengerSignup() {
  window.location.href = "passenger-signup.html";
}

// Verify Token Function
async function verifyToken() {
  const token = document.getElementById("tokenInput").value.trim();
  const resultElement = document.getElementById("verificationResult");

  if (token.length !== 5 || isNaN(token)) {
    resultElement.innerText = "Please enter a valid 5-digit token.";
    return;
  }

  // Simulated token verification
  if (defaultTokens[token]) {
    const driver = defaultTokens[token];
    resultElement.innerHTML = `
      Driver Verified:<br>
      <strong>Name:</strong> ${driver.driverName}<br>
      <strong>Vehicle:</strong> ${driver.vehicle}<br>
      <strong>License Plate:</strong> ${driver.licensePlate}
    `;
    resultElement.style.color = "green";
  } else {
    resultElement.innerHTML = `
      Invalid token. Please check and try again.<br>
      <button onclick="startSecurityProtocol()">Report Suspicious Activity</button>
    `;
    resultElement.style.color = "red";
  }
}

// Function to initiate security protocol
function startSecurityProtocol() {
  openCameraAndCapture();
  shareLocationAndAlertAuthorities();
}

// Simulated camera function
function openCameraAndCapture() {
  console.log("Simulating camera access...");
  document.getElementById("verificationResult").innerText =
    "Simulating camera access. Photo captured successfully.";
}

// Simulated location sharing
function shareLocationAndAlertAuthorities() {
  console.log("Simulating location sharing...");
  document.getElementById("verificationResult").innerText =
    "Simulated: Location shared with authorities.";
}

// Simulated alert function
async function sendAlertToAuthorities(photo = null, latitude = null, longitude = null) {
  console.log("Simulating alert:", { photo, latitude, longitude });
  document.getElementById("verificationResult").innerText =
    "Simulated alert sent to authorities successfully.";
}

// Function to display default drivers and passengers (for testing purposes)
function displayDefaultData() {
  const driverSection = document.getElementById("drivers");
  const passengerSection = document.getElementById("passengers");

  // Populate drivers
  driverSection.innerHTML = "<h3>Default Drivers</h3>";
  defaultDrivers.forEach(driver => {
    driverSection.innerHTML += `
      <p>
        <strong>Name:</strong> ${driver.name}<br>
        <strong>Phone:</strong> ${driver.phone}<br>
        <strong>Vehicle:</strong> ${driver.vehicle}<br>
        <strong>License Plate:</strong> ${driver.licensePlate}<br>
        <strong>Token:</strong> ${driver.token}
      </p><hr>
    `;
  });

  // Populate passengers
  passengerSection.innerHTML = "<h3>Default Passengers</h3>";
  defaultPassengers.forEach(passenger => {
    passengerSection.innerHTML += `
      <p>
        <strong>Name:</strong> ${passenger.name}<br>
        <strong>Phone:</strong> ${passenger.phone}<br>
        <strong>Email:</strong> ${passenger.email}
      </p><hr>
    `;
  });
}
// Toggle between Driver and Passenger options
function toggleAuthOptions() {
  const authOptions = document.getElementById("auth-options");
  authOptions.style.display = authOptions.style.display === "none" ? "block" : "none";
}

// Show Report Form
function showReportForm() {
  document.getElementById("report-form").style.display = "block";
}

// Hide Report Form
function hideReportForm() {
  document.getElementById("report-form").style.display = "none";
}

// Call displayDefaultData on page load
window.onload = displayDefaultData;
