//  LOGIN & SIGN-UP
const users = [];

// Variables for form and sections
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const signupSection = document.getElementById('signup-section');

// Event listener for Sign-up form submission
signupForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = signupForm.username.value;
    const email = signupForm.email.value;
    const password = signupForm.password.value;
    const confirmPassword = signupForm.confirmPassword.value;

    // Check if passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Create user data object
    const userData = {
        username,
        email,
        password
    };

    // Check if the email already exists
    fetch('https://electric-charging-app.onrender.com/users?email=' + email)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                alert('Email already exists. Please try logging in.');
            } else {
                // Create new user by sending a POST request
                fetch('https://electric-charging-app.onrender.com/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                })
                .then(response => response.json())
                .then(data => {
                    console.log('User signed up successfully:', data);
                    alert('Sign-up successful! Please log in.');
                    signupForm.reset();
                    toggleForm('login');
                })
                .catch(error => console.error('Error:', error));
            }
        });
});

// Event listener for Login form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    // Fetch the user by email
    fetch('https://electric-charging-app.onrender.com/users?email=' + email)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                alert('User not found. Please sign up.');
            } else {
                const user = data[0]; // Assuming unique emails
                if (user.password === password) {
                    alert('Login successful! Welcome, ' + user.username);
                    loginForm.reset();
                    // Here, redirect to another page or store the session
                } else {
                    alert('Incorrect password. Please try again.');
                }
            }
        })
        .catch(error => console.error('Error:', error));

// Function to toggle between login and signup forms
    function toggleForm(form) {
    if (form === 'signup') {
        loginSection.classList.remove('active');
        signupSection.classList.add('active');
    } else {
        signupSection.classList.remove('active');
        loginSection.classList.add('active');
    }
}

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
  setTimeout(showSlides, 5000); // Change image every 5 seconds
}

function plusSlides(n) {
  slideIndex += n - 1;  // Adjust index for manual controls
  showSlides();
}

// Elements for the calculator section
    const calculatorForm = document.getElementById("calculatorForm");
    const timeTakenElement = document.getElementById("timeTaken");
    const totalCostElement = document.getElementById("totalCost");

    // Elements for the booking form
    const bookingForm = document.getElementById("bookingForm");
    const locationInput = document.getElementById("location");
    const dateInput = document.getElementById("date");
    const startTimeInput = document.getElementById("startTime");
    const durationHoursInput = document.getElementById("durationHours");
    const durationMinutesInput = document.getElementById("durationMinutes");

    // Set the minimum date for the booking form (today's date)
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", today);

    // Event listener for calculator form submission
    calculatorForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Get values from calculator form
        const batteryCapacity = parseFloat(document.getElementById("batteryCapacity").value);
        const chargerType = parseFloat(document.getElementById("chargerType").value);
        const initialCharge = parseFloat(document.getElementById("initialCharge").value);
        const desiredCharge = parseFloat(document.getElementById("desiredCharge").value);

        // Validate the inputs
        if (initialCharge >= desiredCharge) {
            alert("Initial charge must be less than the desired charge.");
            return;
        }

        // Calculate the charging needed (percentage and kWh)
        const chargeNeededPercentage = desiredCharge - initialCharge;
        const chargeNeededKWh = (batteryCapacity * chargeNeededPercentage) / 100;

        // Calculate time taken in hours
        const chargingTime = chargeNeededKWh / chargerType;

        // Calculate cost
        const costPerKWh = 0.20; // Example rate of $0.20 per kWh
        const totalCost = chargeNeededKWh * costPerKWh;

        // Display results
        timeTakenElement.textContent = `Time Taken: ${chargingTime.toFixed(2)} hours`;
        totalCostElement.textContent = `Total Cost: $${totalCost.toFixed(2)}`;
    });

    // Event listener for booking form submission
    bookingForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Get values from booking form
        const location = locationInput.value;
        const date = dateInput.value;
        const startTime = startTimeInput.value;
        const durationHours = parseInt(durationHoursInput.value);
        const durationMinutes = parseInt(durationMinutesInput.value);

        // Validate the booking form inputs
        if (!location || !date || !startTime || (durationHours === 0 && durationMinutes === 0)) {
            alert("Please fill in all fields correctly.");
            return;
        }

        // Format the booking duration
        const totalDurationInMinutes = durationHours * 60 + durationMinutes;

        // Create the booking object
        const bookingData = {
            location,
            date,
            startTime,
            duration: `${durationHours} hour(s) ${durationMinutes} minute(s)`
        };

        // Foward booking data to the JSON server
    fetch('https://electric-charging-app.onrender.com/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Booking confirmed:", data);
        alert("Booking confirmed!");
        // Optionally clear form fields after successful booking
        bookingForm.reset();
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while booking.");
    });
});

// Progress Bar Animation
  window.addEventListener('scroll', function() {
      const scrollProgress = document.querySelector('.progress-bar');
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      scrollProgress.style.width = `${progress}%`;
  });
})