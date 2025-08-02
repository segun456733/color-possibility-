document.addEventListener("DOMContentLoaded", () => {
  const animationContainer = document.getElementById("animationContainer");
  const paletteContainer = document.getElementById("paletteContainer");
  const generateBtn = document.getElementById("generateBtn");
  const alertDiv = document.querySelector(".alert-div");
  const alertText = alertDiv.querySelector("p");
  const copySound = document.getElementById("copySound");
  const colorBlocks = document.querySelectorAll(".color");

  function showAnimationThenPalette() {
    animationContainer.style.display = "flex";
    paletteContainer.style.display = "none";

    setTimeout(() => {
      animationContainer.style.display = "none";
      paletteContainer.style.display = "block";
      generatePalette();
    }, 3500);
  }

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
      const block = e.target.closest(".color");
      const color = block.querySelector(".color-text").textContent;

      navigator.clipboard.writeText(color).then(() => {
        e.target.textContent = "Copied";
        alertText.textContent = `${color} copied to your clipboard`;
        alertDiv.style.display = "block";

        if (copySound) {
          copySound.currentTime = 0;
          copySound.play().catch(() => {});
        }

        setTimeout(() => {
          alertDiv.style.display = "none";
          e.target.textContent = "Copy";
        }, 1500);
      }).catch(() => {
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

  showAnimationThenPalette(); // Run on page load
});
