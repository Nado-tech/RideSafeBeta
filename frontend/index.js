// Sample default data for testing
const defaultTokens = {
  "12345": { driverName: "John Doe" },
  "67890": { driverName: "Jane Smith" }
};

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
    resultElement.innerText = `Driver Verified: ${defaultTokens[token].driverName}`;
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
