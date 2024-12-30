// Handle form submission
contactForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the values of the form inputs
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validate the inputs
    if (!name || !email || !message) {
        displayResponseMessage('Please fill out all fields.', 'error');
        return;
    }

    if (!validateEmail(email)) {
        displayResponseMessage('Please enter a valid email address.', 'error');
        return;
    }

    // Prepare the data to send to the backend
    const formData = {
        name: name,
        email: email,
        message: message
    };

    // Send the data to the backend (POST request)
    fetch('/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayResponseMessage('Thank you for reaching out! We will get back to you soon.', 'success');
            contactForm.reset(); // Reset the form
        } else {
            displayResponseMessage('There was an error processing your request. Please try again later.', 'error');
        }
    })
    .catch(error => {
        displayResponseMessage('There was an error. Please try again later.', 'error');
    });
});

