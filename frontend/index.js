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
          <button onclick="openCamera()">Open Camera</button>
          <button onclick="shareLocation()">Share Live Location</button>
        `;
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      document.getElementById("verificationResult").innerText = "Verification failed. Please try again later.";
    }
}

// Function to open the device camera
function openCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      const video = document.createElement("video");
      video.srcObject = stream;
      video.autoplay = true;
      document.getElementById("verificationResult").appendChild(video);

      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        document.getElementById("verificationResult").removeChild(video);
      }, 15000);
    })
    .catch(error => {
      document.getElementById("verificationResult").innerText = "Unable to access camera: " + error.message;
    });
}

// Function to share live location for 15 minutes
function shareLocation() {
  if (navigator.geolocation) {
    const watchId = navigator.geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;
        document.getElementById("verificationResult").innerText = 
          `Sharing location... Latitude: ${latitude}, Longitude: ${longitude}`;
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
