//  LOGIN & SIGN-UP 
// Dummy data to store registered users
const users = [];

// Function to toggle between login and signup forms
function toggleForm(formType) {
    document.getElementById('login-section').classList.toggle('active', formType === 'login');
    document.getElementById('signup-section').classList.toggle('passive', formType === 'signup');
}

// Handle Login Form Submission
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form refresh
    const email = e.target.email.value;
    const password = e.target.password.value;

    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        alert('Login successful! Welcome, ' + user.username);
    } else {
        alert('Invalid email or password. Please try again.');
    }
});

// Handle Sign-Up Form Submission
document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    users.push({ username, email, password });
    alert('Signup successful! Please log in.');
    toggleForm('login'); // Switch to login form
});


//Image Slides

let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  slides[slideIndex-1].style.display = "block";  
  setTimeout(showSlides, 3000); // Change image every 3 seconds
}

function plusSlides(n) {
  slideIndex += n - 1;  // Adjust index for manual controls
  showSlides();
}

// BOOKING FORM & CALCULATOR
// Set minimum date to today for booking form
const dateInput = document.getElementById('date');
dateInput.min = new Date().toISOString().split('T')[0];


// Wait until DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("bookingCalculatorForm");
  const resultSection = document.getElementById("result");
  const timeTakenElement = document.getElementById("timeTaken");
  const totalCostElement = document.getElementById("totalCost");

  // Event listener for form submission
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Extract values from the form inputs
    const batteryCapacity = parseFloat(document.getElementById("batteryCapacity").value);
    const chargerType = parseFloat(document.getElementById("chargerType").value); // 10, 50, 150 kW
    const initialCharge = parseFloat(document.getElementById("initialCharge").value); // in percentage
    const desiredCharge = parseFloat(document.getElementById("desiredCharge").value); // in percentage
    const durationHours = parseInt(document.getElementById("durationHours").value);
    const durationMinutes = parseInt(document.getElementById("durationMinutes").value);

    // Validate input values
    if (desiredCharge <= initialCharge) {
      alert("Desired charge must be greater than the initial charge.");
      return;
    }

    // Calculate energy needed (in kWh)
    const chargeNeeded = (desiredCharge - initialCharge) / 100 * batteryCapacity;

    // Calculate charging time (in hours) based on charger type
    const chargingTime = chargeNeeded / chargerType; // Time in hours

    // Convert duration from form input to total hours
    const totalDuration = durationHours + durationMinutes / 60;

    // Calculate base cost based on charger type and energy consumed
    let costPerKWh;
    switch (chargerType) {
      case 10: // Standard Charger
        costPerKWh = 0.2; // $0.20 per kWh
        break;
      case 50: // Fast Charger
        costPerKWh = 0.4; // $0.40 per kWh
        break;
      case 150: // Rapid Charger
        costPerKWh = 0.6; // $0.60 per kWh
        break;
      default:
        alert("Invalid charger type selected.");
        return;
    }

    // Calculate the total cost based on energy consumed and charger type
    let totalCost = chargeNeeded * costPerKWh;

    // Add time-based surcharge for rapid chargers to reflect higher convenience
    if (chargerType === 150) {
      const timeSurcharge = Math.max(0, (chargingTime - totalDuration)) * 10; // $10 extra per hour undercut
      totalCost += timeSurcharge;
    }

    // Display results
    timeTakenElement.textContent = `Time Taken: ${chargingTime.toFixed(2)} hours`;
    totalCostElement.textContent = `Total Cost: $${totalCost.toFixed(2)}`;
  });
});
