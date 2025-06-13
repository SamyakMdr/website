// Function to update greeting based on the time of day
function updateGreeting() {
    const hours = new Date().getHours();
    let greeting;

    if (hours < 12) {
        greeting = "Good Morning!";
    } else if (hours < 18) {
        greeting = "Good Afternoon!";
    } else {
        greeting = "Good Evening!";
    }

    // Set the greeting text
    document.getElementById("greeting").textContent = greeting;
}

// Combined function to handle both tasks
window.onload = () => {
    updateGreeting();
    showDialog();
};

// Toggle the navbar and icons when clicking on the menu icon
function toggleNavbar(event) {
    // Stop event propagation if it's the X icon clicked, to prevent it triggering the document click handler
    if (event) event.stopPropagation();

    var navList = document.getElementById("nav").getElementsByClassName("nav-list")[0];
    var content = document.getElementById("content");
    var menuIcon = document.getElementById("menu-icon");
    var menuClose = document.getElementById("menu-close");
    
    // Toggle fullscreen menu visibility and content visibility
    navList.classList.toggle("fullscreen");
    content.classList.toggle("hidden");

    // Toggle active class to switch between hamburger and X icon
    menuIcon.classList.toggle("active");
}

// Close menu if clicked outside the navbar area (when in fullscreen mode)
document.addEventListener('click', function(event) {
    var navList = document.getElementById("nav").getElementsByClassName("nav-list")[0];
    var menuIcon = document.getElementById("menu-icon");
    
    // Close the menu if it's open and the user clicks anywhere outside the menu or the menu icon
    if (navList.classList.contains("fullscreen") && !menuIcon.contains(event.target)) {
        toggleNavbar();
    }
});




function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');

    // Update image src based on mode
    themeToggle.src = isDarkMode ? 'img/dark-2-01.png' : 'img/light-2-01.png';
}

// Function to adjust image opacity on scroll
window.addEventListener('scroll', () => {
    const image = document.getElementById('scroll-image');
    if (window.scrollY > 0) {
        image.style.opacity = '0.5'; // Make the image 50% transparent
    } else {
        image.style.opacity = '1'; // Restore full visibility
    }
});


 // Function to show a dialog box for 3 seconds
 function showDialog() {
    const dialog = document.getElementById('dialog-box');
    dialog.style.display = 'block'; // Show the dialog box
    setTimeout(() => {
        dialog.style.display = 'none'; // Hide it after 3 seconds
    }, 3000); // 3000 milliseconds = 3 seconds
}
