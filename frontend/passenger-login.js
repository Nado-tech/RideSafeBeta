async function passengerLogin() {
    const identifier = document.getElementById("identifier").value;
    const password = document.getElementById("password").value;
  
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
  }
  