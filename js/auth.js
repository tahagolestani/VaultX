/* =========================================
   VaultX — Authentication
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("masterPassword");
  const passwordToggle = document.getElementById("passwordToggle");
  const rememberMe = document.getElementById("rememberMe");
  const forgotButton = document.getElementById("forgotButton");

  /* =========================================
       SAFETY CHECK
    ========================================= */

  if (!loginForm || !usernameInput || !passwordInput) {
    console.error("VaultX: Login elements not found.");

    return;
  }

  /* =========================================
       SHOW / HIDE PASSWORD
    ========================================= */

  if (passwordToggle) {
    passwordToggle.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";

      passwordInput.type = isPassword ? "text" : "password";

      passwordToggle.innerHTML = isPassword
        ? '<i class="fa-regular fa-eye-slash"></i>'
        : '<i class="fa-regular fa-eye"></i>';

      passwordToggle.setAttribute(
        "aria-label",
        isPassword ? "Hide password" : "Show password",
      );
    });
  }

  /* =========================================
       REMEMBER ME
    ========================================= */

  if (rememberMe) {
    const savedRemember = localStorage.getItem("vaultx-remember");

    if (savedRemember === "true") {
      rememberMe.checked = true;
    }

    rememberMe.addEventListener("change", () => {
      localStorage.setItem("vaultx-remember", rememberMe.checked);
    });
  }

  /* =========================================
       LOGIN
    ========================================= */

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    /* Get user input */

    const username = usernameInput.value.trim();

    const password = passwordInput.value.trim();

    /* =========================================
           USERNAME VALIDATION
        ========================================= */

    if (!username) {
      showLoginMessage("Please enter your username.", "error");

      usernameInput.focus();

      return;
    }

    if (username.length < 3) {
      showLoginMessage("Username must contain at least 3 characters.", "error");

      usernameInput.focus();

      return;
    }

    /* =========================================
           PASSWORD VALIDATION
        ========================================= */

    if (!password) {
      showLoginMessage("Please enter your master password.", "error");

      passwordInput.focus();

      return;
    }

    if (password.length < 8) {
      showLoginMessage(
        "Master password must contain at least 8 characters.",
        "error",
      );

      passwordInput.focus();

      return;
    }

    /* =========================================
           SAVE USERNAME
        ========================================= */

    localStorage.setItem("vaultx-username", username);

    /* =========================================
           UNLOCK VAULT
        ========================================= */

    unlockVault();
  });

  /* =========================================
       FORGOT PASSWORD
    ========================================= */

  if (forgotButton) {
    forgotButton.addEventListener("click", () => {
      showLoginMessage(
        "If you forget your master password, your encrypted vault cannot be recovered.",
        "info",
      );
    });
  }

  /* =========================================
       LOGIN MESSAGE
    ========================================= */

  function showLoginMessage(message, type) {
    removeLoginMessage();

    const messageElement = document.createElement("div");

    messageElement.className = `login-message login-message-${type}`;

    messageElement.innerHTML = `
            <i class="fa-solid ${
              type === "error" ? "fa-circle-exclamation" : "fa-circle-info"
            }"></i>

            <span>${message}</span>
        `;

    loginForm.prepend(messageElement);
  }

  /* =========================================
       REMOVE LOGIN MESSAGE
    ========================================= */

  function removeLoginMessage() {
    const existingMessage = document.querySelector(".login-message");

    if (existingMessage) {
      existingMessage.remove();
    }
  }

  /* =========================================
       UNLOCK VAULT
    ========================================= */

  function unlockVault() {
    const loginButton = loginForm.querySelector(".login-button");

    if (!loginButton) {
      console.error("VaultX: Login button not found.");

      return;
    }

    const buttonText = loginButton.querySelector("span");

    const buttonIcon = loginButton.querySelector("i");

    /* Disable button */

    loginButton.disabled = true;

    /* Change button text */

    if (buttonText) {
      buttonText.textContent = "Unlocking...";
    }

    /* Change button icon */

    if (buttonIcon) {
      buttonIcon.className = "fa-solid fa-spinner fa-spin";
    }

    /* =========================================
           TEMPORARY SESSION
        ========================================= */

    /*
            Real encryption/authentication
            will be added later.
        */

    sessionStorage.setItem("vaultx-session", "active");

    /* =========================================
           GO TO DASHBOARD
        ========================================= */

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 700);
  }
});
