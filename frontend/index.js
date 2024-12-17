// // Function to verify token
// async function verifyToken() {
//   const token = prompt("Enter a 5-digit token:");

//   if (!token || token.length !== 5 || isNaN(token)) {
//     console.log("Please enter a valid 5-digit token.");
//     alert("Please enter a valid 5-digit token.");
//     return;
//   }

//   try {
//     const response = await fetch("http://localhost:4000/verify-token", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ token }),
//     });

//     if (response.ok) {
//       const data = await response.json();
//       console.log("Driver Verified:", data);
//       alert(`
//         Driver Verified:
//         Name: ${data.driverName}
//         Vehicle: ${data.vehicle}
//         License Plate: ${data.licensePlate}
//       `);
//     } else {
//       const error = await response.json();
//       console.error("Error:", error.message);
//       alert(`
//         ${error.message}
//         Report Suspicious Activity?
//       `);
//       startSecurityProtocol();
//     }
//   } catch (error) {
//     console.error("An error occurred during verification:", error);
//     alert("An error occurred during verification. Please try again.");
//   }
// }

// // Navigate to Login and Signup pages
// function navigateToDriverLogin() {
//   window.location.href = "driver-login.html";
// }

// function navigateToDriverSignup() {
//   window.location.href = "driver-signup.html";
// }

// function navigateToPassengerLogin() {
//   window.location.href = "passenger-login.html";
// }

// function navigateToPassengerSignup() {
//   window.location.href = "passenger-signup.html";
// }

// // Show or hide authentication options
// function toggleAuthOptions() {
//   const authOptions = document.getElementById("auth-options");
//   authOptions.style.display =
//     authOptions.style.display === "none" || authOptions.style.display === ""
//       ? "block"
//       : "none";
// }

// // Simulated security functions
// function startSecurityProtocol() {
//   openCameraAndCapture();
//   shareLocationAndAlertAuthorities();
// }

// function openCameraAndCapture() {
//   console.log("Simulating camera access...");
//   alert("Simulating camera access. Photo captured successfully.");
// }

// function shareLocationAndAlertAuthorities() {
//   console.log("Simulating location sharing...");
//   alert("Simulated: Location shared with authorities.");
// }

// // Report form functions
// function showReportForm() {
//   document.getElementById("report-form").style.display = "block";
// }

// function hideReportForm() {
//   document.getElementById("report-form").style.display = "none";
// }

// Function to verify token
function verifyToken() {
  const token = document.getElementById("tokenInput").value;

  if (!token || token.length !== 5 || isNaN(token)) {
    alert("Please enter a valid 5-digit token.");
    return;
  }

  // Mock Data (Hardcoded Token Details)
  const mockData = {
    "10546": { 
      driverName: "John Doe", 
      vehicle: "Toyota Corolla", 
      licensePlate: "ABC123" 
    },
    "12345": { 
      driverName: "Jane Smith", 
      vehicle: "Honda Civic", 
      licensePlate: "XYZ789" 
    },
  };

  // Check if the token exists in the mock data
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
    startSecurityProtocol();
  }
}

// Navigate to Login and Signup pages
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

// Show or hide authentication options
function toggleAuthOptions() {
  const authOptions = document.getElementById("auth-options");
  authOptions.style.display =
    authOptions.style.display === "none" || authOptions.style.display === ""
      ? "block"
      : "none";
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

// Report form functions
function showReportForm() {
  document.getElementById("report-form").style.display = "block";
}

function hideReportForm() {
  document.getElementById("report-form").style.display = "none";
}
