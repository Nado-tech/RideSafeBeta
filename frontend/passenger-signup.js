document.getElementById('passengerSignupForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent the default form submission
  
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const password = document.getElementById('password').value;
    const nin = document.getElementById('nin').value;
  
    // Validate the NIN via the NIN API
    try {
      const response = await fetch('/api/passenger/verify-nin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nin })
      });
  
      const data = await response.json();
  
      if (!data.isValid) {
        throw new Error('NIN is invalid');
      }
  
      // If NIN is valid, proceed with registration
      const signupResponse = await fetch('/api/passenger/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phoneNumber, password, nin })
      });
  
      const result = await signupResponse.json();
      if (result.message === 'Passenger registered successfully') {
        alert('Passenger registration successful!');
        window.location.href = '/login';  // Redirect to login page
      } else {
        document.getElementById('errorMessage').innerText = result.message;
      }
    } catch (error) {
      document.getElementById('errorMessage').innerText = error.message;
    }
  });
  