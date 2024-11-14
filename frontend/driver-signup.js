document.getElementById('driverSignupForm').addEventListener('submit', async function (e) {
  e.preventDefault(); // Prevent the default form submission

  // Get form values
  const email = document.getElementById('email').value;
  const phoneNumber = document.getElementById('phoneNumber').value;
  const password = document.getElementById('password').value;
  const plateNumber = document.getElementById('plateNumber').value;
  const nin = document.getElementById('nin').value;

  // Basic validation for NIN
  if (!nin) {
    document.getElementById('errorMessage').innerText = 'National Identification Number (NIN) is required.';
    return;
  }

  try {
    // Validate the NIN via the NIN verification API
    const ninResponse = await fetch('/api/driver/verify-nin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nin })
    });

    const ninData = await ninResponse.json();

    if (!ninData.isValid) {
      throw new Error('NIN is invalid');
    }

    // Validate the plate number via the FRSC API
    const plateResponse = await fetch('/api/driver/verify-plate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plateNumber })
    });

    const plateData = await plateResponse.json();

    if (!plateData.isValid) {
      throw new Error('Plate number is invalid');
    }

    // If both NIN and plate number are valid, proceed with registration
    const signupResponse = await fetch('/api/driver/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phoneNumber, password, plateNumber, nin })
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
