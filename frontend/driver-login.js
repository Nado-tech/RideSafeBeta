async function driverLogin() {
    const identifier = document.getElementById("identifier").value;
    const password = document.getElementById("password").value;
  
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
  }
  