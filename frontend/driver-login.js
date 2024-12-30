const defaultDriverCredentials = {
  identifier: "Usman Dauda",
  password: "driver123"
};

async function driverLogin() {
  const identifier = document.getElementById("identifier").value.trim();
  const password = document.getElementById("password").value.trim();

  // Check for default credentials
  if (
    identifier === defaultDriverCredentials.identifier &&
    password === defaultDriverCredentials.password
  ) {
    // Simulate a successful login
    localStorage.setItem('driverToken', 'defaultDriverTestToken'); // Store a fake token for testing
    window.location.href = 'driver-dashboard.html'; // Redirect to the driver's dashboard
    return;
  }

  // Proceed with the API request if not using default credentials
  try {
    const response = await fetch('/api/driver/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('driverToken', data.token);
      window.location.href = 'driver-dashboard.html'; // Redirect to the driver's dashboard
    } else {
      document.getElementById("login-error").textContent = data.message;
    }
  } catch (error) {
    document.getElementById("login-error").textContent =
      "An error occurred while logging in. Please try again later.";
    console.error("Login error:", error);
  }
}
