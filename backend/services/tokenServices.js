// services/tokenService.js

// Utility function to generate a 5-digit token
function generateToken() {
  return Math.floor(10000 + Math.random() * 90000); // Generates a number between 10000 and 99999
}

// Function to check if token is unique
async function isTokenUnique(token, Driver) {
  const existingDriver = await Driver.findOne({ token });
  return existingDriver ? false : true;
}

// Generate a unique 5-digit token
async function generateUniqueToken(Driver) {
  let token = generateToken();

  // Check if the token is unique
  while (!(await isTokenUnique(token, Driver))) {
    token = generateToken();  // If not unique, regenerate token
  }

  return token.toString();  // Return the unique token as a string
}

module.exports = {
  generateUniqueToken,
};
