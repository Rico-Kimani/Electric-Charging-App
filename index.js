document.addEventListener('DOMContentLoaded', function() {
  // Handle form toggle between Login and Signup
  function toggleForm(formType) {
      const loginSection = document.getElementById('login-section');
      const signupSection = document.getElementById('signup-section');

      if (formType === 'login') {
          loginSection.classList.add('active');
          signupSection.classList.remove('active');
      } else {
          signupSection.classList.add('active');
          loginSection.classList.remove('active');
      }
  }

  // Attach event listeners for the form toggle buttons
  document.querySelectorAll('.toggle-link button').forEach(button => {
      button.addEventListener('click', function() {
          const targetForm = this.textContent.includes('Signup') ? 'signup' : 'login';
          toggleForm(targetForm);
      });
  });

  // Login Form Submission
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const email = loginForm.email.value;
      const password = loginForm.password.value;

      // Send POST request to login API
      fetch('https://electric-charging-app.onrender.com/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              alert('Login successful!');
              // Handle success (e.g., redirect to the dashboard)
          } else {
              alert('Login failed: ' + data.message);
          }
      })
      .catch(error => {
          console.error('Error:', error);
          alert('An error occurred. Please try again later.');
      });
  });

  // Signup Form Submission
  const signupForm = document.getElementById('signup-form');
  signupForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const username = signupForm.username.value;
      const email = signupForm.email.value;
      const password = signupForm.password.value;
      const confirmPassword = signupForm.confirmPassword.value;

      if (password !== confirmPassword) {
          alert('Passwords do not match!');
          return;
      }

      // Send POST request to signup API
      fetch('https://electric-charging-app.onrender.com/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              alert('Signup successful!');
              // Handle success (e.g., redirect to login or dashboard)
          } else {
              alert('Signup failed: ' + data.message);
          }
      })
      .catch(error => {
          console.error('Error:', error);
          alert('An error occurred. Please try again later.');
      });
  });

  // Slideshow functionality
  let slideIndex = 0;
  function showSlides() {
      const slides = document.querySelectorAll('.mySlides');
      slides.forEach((slide, index) => {
          slide.style.display = (index === slideIndex) ? 'block' : 'none';
      });
      slideIndex = (slideIndex + 1) % slides.length;
  }
  showSlides();
  setInterval(showSlides, 3000); // Change slide every 3 seconds

  document.querySelector('.prev').addEventListener('click', function() {
      slideIndex = (slideIndex - 1 + document.querySelectorAll('.mySlides').length) % document.querySelectorAll('.mySlides').length;
      showSlides();
  });

  document.querySelector('.next').addEventListener('click', function() {
      slideIndex = (slideIndex + 1) % document.querySelectorAll('.mySlides').length;
      showSlides();
  });

  // Booking and Cost Estimation
  const bookingForm = document.getElementById('bookingCalculatorForm');
  bookingForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const location = document.getElementById('location').value;
      const date = document.getElementById('date').value;
      const startTime = document.getElementById('startTime').value;
      const durationHours = parseFloat(document.getElementById('durationHours').value);
      const durationMinutes = parseFloat(document.getElementById('durationMinutes').value);
      const batteryCapacity = parseFloat(document.getElementById('batteryCapacity').value);
      const chargerType = parseFloat(document.getElementById('chargerType').value);
      const initialCharge = parseFloat(document.getElementById('initialCharge').value);
      const desiredCharge = parseFloat(document.getElementById('desiredCharge').value);

      const chargeNeeded = ((desiredCharge - initialCharge) / 100) * batteryCapacity;
      const timeTaken = chargeNeeded / chargerType;
      const totalCost = calculateCost(chargerType, timeTaken);

      // Send POST request to booking API
      fetch('https://electric-charging-app.onrender.com/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              location,
              date,
              startTime,
              durationHours,
              durationMinutes,
              batteryCapacity,
              chargerType,
              initialCharge,
              desiredCharge,
              totalCost
          })
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              alert('Booking successful!');
              // Display calculated results
              document.getElementById('timeTaken').textContent = `Time Taken: ${timeTaken.toFixed(2)} hours`;
              document.getElementById('totalCost').textContent = `Total Cost: $${totalCost.toFixed(2)}`;
          } else {
              alert('Booking failed: ' + data.message);
          }
      })
      .catch(error => {
          console.error('Error:', error);
          alert('An error occurred. Please try again later.');
      });
  });

  function calculateCost(chargerType, timeTaken) {
      let costPerSession = 0;

      switch (chargerType) {
          case 10:
              costPerSession = 5; // Standard Charger cost
              break;
          case 50:
              costPerSession = 10; // Fast Charger cost
              break;
          case 150:
              costPerSession = 20; // Rapid Charger cost
              break;
      }

      return costPerSession * timeTaken;
  }

  // Ensure the date input has the current date as the minimum
  const dateInput = document.getElementById('date');
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);

  // Progress Bar Animation
  window.addEventListener('scroll', function() {
      const scrollProgress = document.querySelector('.progress-bar');
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      scrollProgress.style.width = `${progress}%`;
  });
});
