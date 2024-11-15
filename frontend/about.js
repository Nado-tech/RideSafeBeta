// index.js

// Function to handle the navigation click event
const navLinks = document.querySelectorAll('nav ul li a');

navLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default navigation behavior
    const targetPage = event.target.getAttribute('href'); // Get the target page URL

    if (targetPage === 'index.html') {
      window.location.href = targetPage;
    } else if (targetPage === 'about.html') {
      window.location.href = targetPage;
    } else if (targetPage === 'contact.html') {
      window.location.href = targetPage;
    }
  });
});

// Function to display a greeting based on the time of day
const displayGreeting = () => {
  const greetingMessage = document.createElement('p');
  const currentHour = new Date().getHours(); // Get the current hour
  let greeting;

  // Determine the appropriate greeting based on the time of day
  if (currentHour >= 5 && currentHour < 12) {
    greeting = 'Good Morning!';
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = 'Good Afternoon!';
  } else {
    greeting = 'Good Evening!';
  }

  greetingMessage.textContent = greeting; // Set the greeting message
  document.body.insertBefore(greetingMessage, document.querySelector('main')); // Insert it before the main content
};

// Display greeting message on page load
window.addEventListener('load', displayGreeting);

// Smooth scroll to the top when the header is clicked
const header = document.querySelector('header');

header.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
