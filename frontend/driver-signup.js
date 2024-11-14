document.getElementById('driverSignupForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent the default form submission
  
    // Get form values
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const password = document.getElementById('password').value;
    const plateNumber = document.getElementById('plateNumber').value;
  
    // Validate the plate number via the FRSC API
    try {
      const response = await fetch('/api/driver/verify-plate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plateNumber })
      });
  
      const data = await response.json();
  
      if (!data.isValid) {
        throw new Error('Plate number is invalid');
      }
  
      // If plate number is valid, proceed with registration
      const signupResponse = await fetch('/api/driver/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phoneNumber, password, plateNumber })
      });
  
      const result = await signupResponse.json();
      if (result.message === 'Driver registered successfully') {
        alert('Driver registration successful!');
        window.location.href = '/login';  // Redirect to login page
      } else {
        document.getElementById('errorMessage').innerText = result.message;
      }
    } catch (error) {
      document.getElementById('errorMessage').innerText = error.message;
    }
  });
  