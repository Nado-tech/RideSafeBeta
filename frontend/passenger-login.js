// Default credentials for testing
const defaultPassengerCredentials = {
  identifier: "Olayemi Simon",
  password: "passenger123"
};

async function passengerLogin() {
  const identifier = document.getElementById("identifier").value.trim();
  const password = document.getElementById("password").value.trim();

  // Check for default credentials
  if (
    identifier === defaultPassengerCredentials.identifier &&
    password === defaultPassengerCredentials.password
  ) {
    // Simulate a successful login
    localStorage.setItem('passengerToken', 'defaultTestToken'); // Store a fake token for testing
    window.location.href = 'passenger-dashboard.html'; // Redirect to the passenger's dashboard
    return;
  }

  // Proceed with the API request if not using default credentials
  try {
    const response = await fetch('/api/passenger/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('passengerToken', data.token);
      window.location.href = 'passenger-dashboard.html'; // Redirect to the passenger's dashboard
    } else {
      document.getElementById("login-error").textContent = data.message;
    }
  } catch (error) {
    document.getElementById("login-error").textContent =
      "An error occurred while logging in. Please try again later.";
    console.error("Login error:", error);
  }
}
