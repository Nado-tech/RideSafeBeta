// Verify Token Function
async function verifyToken() {
  const token = prompt("Enter a 5-digit token:");

  if (!token || token.length !== 5 || isNaN(token)) {
    console.log("Please enter a valid 5-digit token.");
    alert("Please enter a valid 5-digit token.");
    return;
  }

  try {
    const response = await fetch("http://localhost:4000/verify-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Driver Verified:", data);
      alert(`
        Driver Verified:
        Name: ${data.driverName}
        Vehicle: ${data.vehicle}
        License Plate: ${data.licensePlate}
      `);
    } else {
      const error = await response.json();
      console.error("Error:", error.message);
      alert(`
        ${error.message}
        Report Suspicious Activity?
      `);
      startSecurityProtocol();
    }
  } catch (error) {
    console.error("An error occurred during verification:", error);
    alert("An error occurred during verification. Please try again.");
  }
}

// Simulated security functions
function startSecurityProtocol() {
  openCameraAndCapture();
  shareLocationAndAlertAuthorities();
}

function openCameraAndCapture() {
  console.log("Simulating camera access...");
  alert("Simulating camera access. Photo captured successfully.");
}

function shareLocationAndAlertAuthorities() {
  console.log("Simulating location sharing...");
  alert("Simulated: Location shared with authorities.");
}

verifyToken();
