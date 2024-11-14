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
  const token = document.getElementById("tokenInput").value;
  
  if (token.length !== 5 || isNaN(token)) {
    document.getElementById("verificationResult").innerText = "Please enter a valid 5-digit token.";
    return;
  }

  try {
    const response = await fetch('/verify-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });

    const result = await response.json();

    if (result.success) {
      document.getElementById("verificationResult").innerText = "Driver Verified";
    } else {
      document.getElementById("verificationResult").innerHTML = `
        Invalid token. Please check and try again.<br>
        <button onclick="startSecurityProtocol()">Report Suspicious Activity</button>
      `;
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    document.getElementById("verificationResult").innerText = "Verification failed. Please try again later.";
  }
}

// Function to initiate security protocol
function startSecurityProtocol() {
openCameraAndCapture();
shareLocationAndAlertAuthorities();
}

// Function to open the device camera and capture a photo
function openCameraAndCapture() {
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    const video = document.createElement("video");
    video.srcObject = stream;
    video.autoplay = true;
    document.getElementById("verificationResult").appendChild(video);

    // Capture a snapshot after a short delay
    setTimeout(() => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);

      const photo = canvas.toDataURL("image/png"); // Convert snapshot to base64 format
      
      // Send photo to the server
      sendAlertToAuthorities(photo);

      // Stop camera stream and remove video element
      stream.getTracks().forEach(track => track.stop());
      document.getElementById("verificationResult").removeChild(video);
    }, 3000); // Capture after 3 seconds for user focus
  })
  .catch(error => {
    document.getElementById("verificationResult").innerText = "Unable to access camera: " + error.message;
  });
}

// Function to share live location and alert authorities
function shareLocationAndAlertAuthorities() {
if (navigator.geolocation) {
  const watchId = navigator.geolocation.watchPosition(
    position => {
      const { latitude, longitude } = position.coords;
      document.getElementById("verificationResult").innerText = 
        `Sharing location... Latitude: ${latitude}, Longitude: ${longitude}`;
      
      // Send location to the server along with the photo
      sendAlertToAuthorities(null, latitude, longitude);
    },
    error => {
      document.getElementById("verificationResult").innerText = "Unable to access location: " + error.message;
    }
  );

  setTimeout(() => {
    navigator.geolocation.clearWatch(watchId);
    document.getElementById("verificationResult").innerText = "Location sharing stopped.";
  }, 15 * 60 * 1000); // 15 minutes
} else {
  document.getElementById("verificationResult").innerText = "Geolocation is not supported by this browser.";
}
}

// Function to send alert (photo and/or location) to authorities via the server
async function sendAlertToAuthorities(photo = null, latitude = null, longitude = null) {
try {
  const response = await fetch('/alert-authorities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ photo, latitude, longitude })
  });

  if (response.ok) {
    document.getElementById("verificationResult").innerText = "Alert sent to authorities successfully.";
  } else {
    document.getElementById("verificationResult").innerText = "Failed to send alert to authorities.";
  }
} catch (error) {
  console.error("Error sending alert:", error);
  document.getElementById("verificationResult").innerText = "An error occurred while sending the alert.";
}
}
