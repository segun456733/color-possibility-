document.addEventListener("DOMContentLoaded", () => {
  // Element references
  const loginContainer = document.getElementById("loginContainer");
  const signupContainer = document.getElementById("signupContainer");
  const paletteContainer = document.getElementById("paletteContainer");
  const animationContainer = document.getElementById("animationContainer");

  const loginBtn = document.querySelector(".mer");
  const signupBtn = document.querySelector(".mer2");

  const switchToSignup = document.querySelector(".rty a");
  const switchToLogin = document.querySelector(".rty2 a");

  const alertDiv = document.querySelector(".alert-div");
  const alertText = alertDiv.querySelector("p");
  const copySound = document.getElementById("copySound");

  const generateBtn = document.getElementById("generateBtn");
  const colorBlocks = document.querySelectorAll(".color");

  const nameInput = document.querySelector('input[name="name"]');
  const passwordInput = document.getElementById("passwordInput");
  const togglePassword = document.getElementById("togglePassword");
  const editToggle = document.getElementById("editToggle");
  const forgotPasswordLink = document.getElementById("forgotPassword");

  const loginError = document.getElementById("loginError");
  const signupError = document.getElementById("signupError");

  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Error display function
  function showError(element, message) {
    element.textContent = message;
    element.style.display = "block";
    setTimeout(() => {
      element.style.display = "none";
    }, 4000);
  }

  // Initial visibility
  loginContainer.style.display = "flex";
  signupContainer.style.display = "none";
  paletteContainer.style.display = "none";
  animationContainer.style.display = "none";

  function showAnimationThenPalette() {
    loginContainer.style.display = "none";
    signupContainer.style.display = "none";
    animationContainer.style.display = "flex";

    setTimeout(() => {
      animationContainer.style.display = "none";
      paletteContainer.style.display = "block";
      generatePalette();
    }, 3500);
  }

  switchToSignup.addEventListener("click", () => {
    loginContainer.style.display = "none";
    signupContainer.style.display = "flex";
  });

  switchToLogin.addEventListener("click", () => {
    signupContainer.style.display = "none";
    loginContainer.style.display = "flex";
  });

  togglePassword.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePassword.textContent = isHidden ? "🙈" : "👁";
  });

  editToggle.addEventListener("change", () => {
    passwordInput.readOnly = !editToggle.checked;
  });

  forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    const username = prompt("Enter your name to reset your password:")?.trim().toLowerCase();

    const userIndex = users.findIndex(u => u.name === username);
    if (userIndex === -1) {
      showError(loginError, "User not found.");
      return;
    }

    const newPass = prompt("Enter a new password:");
    const confirm = prompt("Confirm new password:");
    if (!newPass || newPass !== confirm) {
      showError(loginError, "Passwords do not match.");
      return;
    }

    users[userIndex].password = newPass;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Password reset successful. Please log in.");
  });

  loginBtn.addEventListener("click", () => {
    const name = nameInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    const user = users.find(u => u.name === name && u.password === password);
    if (user) {
      nameInput.value = "";
      passwordInput.value = "";
      passwordInput.readOnly = true;
      editToggle.checked = false;
      togglePassword.textContent = "👁";
      passwordInput.type = "password";
      showAnimationThenPalette();
    } else {
      showError(loginError, "Invalid name or password. Please try again.");
    }
  });

  signupBtn.addEventListener("click", () => {
    const firstName = document.querySelector('input[name="firstname"]').value.trim().toLowerCase();
    const lastName = document.querySelector('input[name="lastname"]').value.trim();
    const password = document.querySelector('input[name="password"]').value;
    const confirm = document.querySelector('input[name="confirm password"]').value;

    if (!firstName || !lastName || !password || password !== confirm) {
      showError(signupError, "All fields are required and passwords must match.");
      return;
    }

    if (users.some(u => u.name === firstName)) {
      showError(signupError, "User already exists. Please log in.");
      return;
    }

    users.push({ name: firstName, password });
    localStorage.setItem("users", JSON.stringify(users));
    showAnimationThenPalette();
  });

  function getRandomHex() {
    const hex = "0123456789ABCDEF";
    return "#" + Array.from({ length: 6 }, () => hex[Math.floor(Math.random() * 16)]).join("");
  }

  function generatePalette() {
    const colors = [];
    colorBlocks.forEach(block => {
      const color = getRandomHex();
      block.querySelector(".color-img").style.backgroundColor = color;
      block.querySelector(".color-text").textContent = color;
      block.querySelector('input[type="color"]').value = color;
      block.querySelector(".copy").textContent = "Copy";
      colors.push(color);
    });

    document.body.style.background = `linear-gradient(to right, ${colors.join(",")})`;
  }

  generateBtn.addEventListener("click", generatePalette);

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      generatePalette();
    }
  });

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("copy")) {
      const colorBlock = e.target.closest(".color");
      const colorCode = colorBlock.querySelector(".color-text").textContent;

      navigator.clipboard.writeText(colorCode)
        .then(() => {
          e.target.textContent = "Copied";
          if (copySound) {
            copySound.currentTime = 0;
            copySound.play().catch(() => {});
          }
          alertText.textContent = `${colorCode} copied to your clipboard`;
          alertDiv.style.display = "block";

          setTimeout(() => {
            alertDiv.style.display = "none";
            e.target.textContent = "Copy";
          }, 1500);
        })
        .catch(() => {
          alertText.textContent = "Failed to copy.";
          alertDiv.style.display = "block";
        });
    }
  });

  document.addEventListener("input", (e) => {
    if (e.target.type === "color") {
      const newColor = e.target.value;
      const block = e.target.closest(".color");
      block.querySelector(".color-img").style.backgroundColor = newColor;
      block.querySelector(".color-text").textContent = newColor;
    }
  });

  generatePalette();
});
