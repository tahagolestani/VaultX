document.addEventListener("DOMContentLoaded", () => {
  /* =========================================
     STORAGE
  ========================================= */

  const STORAGE_KEY = "vaultx-items";

  /* =========================================
     ELEMENTS
  ========================================= */

  const searchInput = document.getElementById("vaultSearch");
  const passwordGrid = document.getElementById("passwordGrid");
  const emptySearch = document.getElementById("emptySearch");

  const sidebar = document.getElementById("sidebar");
  const sidebarClose = document.getElementById("sidebarClose");
  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  const logoutButton = document.getElementById("logoutButton");

  const vaultFilterButton = document.getElementById("vaultFilterButton");
  const vaultFilterBar = document.getElementById("vaultFilterBar");

  const addPasswordButton = document.getElementById("addPasswordButton");
  const vaultAddButton = document.getElementById("vaultAddButton");

  const passwordModal = document.getElementById("passwordModal");

  const closePasswordModal = document.getElementById("closePasswordModal");
  const cancelPasswordButton = document.getElementById("cancelPasswordButton");

  const passwordForm = document.getElementById("passwordForm");

  const passwordService = document.getElementById("passwordService");
  const passwordUsername = document.getElementById("passwordUsername");
  const passwordValue = document.getElementById("passwordValue");
  const passwordUrl = document.getElementById("passwordUrl");
  const passwordCategory = document.getElementById("passwordCategory");
  const passwordNotes = document.getElementById("passwordNotes");

  const togglePasswordValue = document.getElementById("togglePasswordValue");

  const passwordModalTitle = document.getElementById("passwordModalTitle");

  const passwordModalDescription = document.getElementById(
    "passwordModalDescription",
  );

  const savePasswordButtonText = document.getElementById(
    "savePasswordButtonText",
  );

  const totalItems = document.getElementById("totalItems");
  const totalFavorites = document.getElementById("totalFavorites");
  const weakPasswords = document.getElementById("weakPasswords");
  const protectedItems = document.getElementById("protectedItems");

  const navItemCount = document.getElementById("navItemCount");
  const navFavoriteCount = document.getElementById("navFavoriteCount");

  const loginCount = document.getElementById("loginCount");
  const cardCount = document.getElementById("cardCount");
  const secureNoteCount = document.getElementById("secureNoteCount");

  const favoritesLink = document.getElementById("favoritesLink");

  const improveSecurityButton = document.getElementById(
    "improveSecurityButton",
  );

  /* =========================================
     USERNAME ELEMENTS
  ========================================= */

  const profileName = document.getElementById("profileName");
  const profileAvatar = document.getElementById("profileAvatar");
  const welcomeUsername = document.getElementById("welcomeUsername");

  /* =========================================
     DEFAULT VAULT DATA
  ========================================= */

  const defaultItems = [
    {
      id: "github",
      name: "GitHub",
      username: "taha@example.com",
      password: "GitHub@VaultX2026!",
      url: "https://github.com",
      category: "login",
      notes: "",
      favorite: false,
      createdAt: Date.now(),
    },

    {
      id: "gmail",
      name: "Gmail",
      username: "taha@gmail.com",
      password: "GmailSecure2026!",
      url: "https://gmail.com",
      category: "login",
      notes: "",
      favorite: false,
      createdAt: Date.now(),
    },

    {
      id: "discord",
      name: "Discord",
      username: "taha#2026",
      password: "discord123",
      url: "https://discord.com",
      category: "login",
      notes: "",
      favorite: false,
      createdAt: Date.now(),
    },

    {
      id: "netflix",
      name: "Netflix",
      username: "taha@example.com",
      password: "Netflix2026",
      url: "https://netflix.com",
      category: "login",
      notes: "",
      favorite: false,
      createdAt: Date.now(),
    },

    {
      id: "personal-bank",
      name: "Personal Bank",
      username: "**** 4821",
      password: "BankSecure#2026",
      url: "",
      category: "card",
      notes: "",
      favorite: false,
      createdAt: Date.now(),
    },

    {
      id: "figma",
      name: "Figma",
      username: "taha@design.com",
      password: "FigmaDesign2026!",
      url: "https://figma.com",
      category: "login",
      notes: "",
      favorite: false,
      createdAt: Date.now(),
    },
  ];

  /* =========================================
     STATE
  ========================================= */

  let vaultItems = [];
  let currentFilter = "all";
  let currentSearch = "";

  let editingItemId = null;

  /* =========================================
     USERNAME
  ========================================= */

  function loadUsername() {
    const username = localStorage.getItem("vaultx-username") || "User";

    if (profileName) {
      profileName.textContent = username;
    }

    if (welcomeUsername) {
      welcomeUsername.textContent = username;
    }

    if (profileAvatar) {
      profileAvatar.textContent = username.charAt(0).toUpperCase();
    }
  }

  /* =========================================
     HTML ESCAPE
  ========================================= */

  function escapeHTML(value) {
    if (value === null || value === undefined) {
      return "";
    }

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* =========================================
     LOAD VAULT
  ========================================= */

  function loadVault() {
    try {
      const savedItems = localStorage.getItem(STORAGE_KEY);

      if (savedItems) {
        const parsedItems = JSON.parse(savedItems);

        if (Array.isArray(parsedItems)) {
          vaultItems = parsedItems;
        } else {
          vaultItems = [...defaultItems];
          saveVault();
        }
      } else {
        vaultItems = [...defaultItems];
        saveVault();
      }
    } catch (error) {
      console.error("VaultX: Failed to load vault.", error);

      vaultItems = [...defaultItems];
    }
  }

  /* =========================================
     SAVE VAULT
  ========================================= */

  function saveVault() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vaultItems));
    } catch (error) {
      console.error("VaultX: Failed to save vault.", error);
    }
  }

  /* =========================================
     PASSWORD STRENGTH
  ========================================= */

  function calculatePasswordStrength(password) {
    if (!password) {
      return {
        score: 0,
        label: "Weak",
      };
    }

    let score = 0;

    if (password.length >= 8) {
      score++;
    }

    if (password.length >= 12) {
      score++;
    }

    if (password.length >= 20) {
      score++;
    }

    if (/[A-Z]/.test(password)) {
      score++;
    }

    if (/[a-z]/.test(password)) {
      score++;
    }

    if (/[0-9]/.test(password)) {
      score++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score++;
    }

    if (score <= 2) {
      return {
        score,
        label: "Weak",
      };
    }

    if (score <= 4) {
      return {
        score,
        label: "Medium",
      };
    }

    return {
      score,
      label: "Strong",
    };
  }

  /* =========================================
     ICON
  ========================================= */

  function getItemIcon(item) {
    const name = String(item.name || "").toLowerCase();

    if (name.includes("github")) {
      return {
        icon: "fa-brands fa-github",
        className: "github",
      };
    }

    if (name.includes("gmail") || name.includes("google")) {
      return {
        icon: "fa-solid fa-envelope",
        className: "gmail",
      };
    }

    if (name.includes("discord")) {
      return {
        icon: "fa-brands fa-discord",
        className: "discord",
      };
    }

    if (name.includes("netflix")) {
      return {
        icon: "fa-solid fa-n",
        className: "netflix",
      };
    }

    if (
      name.includes("bank") ||
      name.includes("card") ||
      item.category === "card"
    ) {
      return {
        icon: "fa-solid fa-building-columns",
        className: "bank",
      };
    }

    if (name.includes("figma")) {
      return {
        icon: "fa-brands fa-figma",
        className: "figma",
      };
    }

    if (item.category === "secure-note") {
      return {
        icon: "fa-solid fa-note-sticky",
        className: "note",
      };
    }

    return {
      icon: "fa-solid fa-key",
      className: "default",
    };
  }

  /* =========================================
     DOMAIN
  ========================================= */

  function getDomain(url) {
    if (!url) {
      return "Secure Item";
    }

    try {
      const formattedURL = url.startsWith("http") ? url : `https://${url}`;

      return new URL(formattedURL).hostname.replace("www.", "");
    } catch (error) {
      return url;
    }
  }

  /* =========================================
     CATEGORY LABEL
  ========================================= */

  function getCategoryLabel(category) {
    if (category === "login") {
      return "Login";
    }

    if (category === "card") {
      return "Card";
    }

    if (category === "secure-note") {
      return "Secure Note";
    }

    return "Item";
  }

  /* =========================================
     RENDER VAULT
  ========================================= */

  function renderVault() {
    if (!passwordGrid) {
      return;
    }

    const query = currentSearch.trim().toLowerCase();

    const filteredItems = vaultItems.filter((item) => {
      const matchesFilter =
        currentFilter === "all" ||
        (currentFilter === "favorite" && item.favorite === true) ||
        item.category === currentFilter;

      const searchableText = [
        item.name,
        item.username,
        item.url,
        item.category,
        item.notes,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(query);

      return matchesFilter && matchesSearch;
    });

    if (filteredItems.length === 0) {
      passwordGrid.innerHTML = "";

      updateEmptyState(true);

      return;
    }

    updateEmptyState(false);

    passwordGrid.innerHTML = filteredItems
      .map((item) => createPasswordCard(item))
      .join("");

    attachCardEvents();
  }

  /* =========================================
     CREATE PASSWORD CARD
  ========================================= */

  function createPasswordCard(item) {
    const icon = getItemIcon(item);
    const domain = getDomain(item.url);
    const categoryLabel = getCategoryLabel(item.category);

    return `
      <article
        class="password-card"
        data-id="${escapeHTML(item.id)}"
        data-category="${escapeHTML(item.category)}"
        data-favorite="${item.favorite ? "true" : "false"}"
      >

        <div class="password-card-top">

          <div class="password-card-icon ${escapeHTML(icon.className)}">
            <i class="${escapeHTML(icon.icon)}"></i>
          </div>

          <div class="password-card-actions">

            <button
              type="button"
              class="favorite-button ${item.favorite ? "active" : ""}"
              data-favorite-id="${escapeHTML(item.id)}"
              aria-label="${
                item.favorite ? "Remove from favorites" : "Add to favorites"
              }"
              title="${
                item.favorite ? "Remove from favorites" : "Add to favorites"
              }"
            >
              <i
                class="${item.favorite ? "fa-solid" : "fa-regular"} fa-star"
              ></i>
            </button>

            <button
              type="button"
              class="card-menu-button"
              data-menu-id="${escapeHTML(item.id)}"
              aria-label="Open menu"
              title="More options"
            >
              <i class="fa-solid fa-ellipsis"></i>
            </button>

            <div
              class="card-action-menu"
              data-action-menu="${escapeHTML(item.id)}"
              hidden
            >

              <button
                type="button"
                class="edit-item"
                data-edit-id="${escapeHTML(item.id)}"
              >
                <i class="fa-solid fa-pen"></i>
                <span>Change Password</span>
              </button>

              <button
                type="button"
                class="delete-item"
                data-delete-id="${escapeHTML(item.id)}"
              >
                <i class="fa-solid fa-trash"></i>
                <span>Delete</span>
              </button>

            </div>

          </div>

        </div>

        <div class="password-card-content">

          <div class="password-card-title-row">

            <div>

              <h3>
                ${escapeHTML(item.name)}
              </h3>

              <span class="password-card-domain">
                ${escapeHTML(domain)}
              </span>

            </div>

          </div>

          <div class="password-card-info">

            <div class="password-card-field">

              <span class="password-card-label">
                Username
              </span>

              <div class="password-card-value">

                <span>
                  ${escapeHTML(item.username || "—")}
                </span>

                ${
                  item.username
                    ? `
                      <button
                        type="button"
                        class="copy-button"
                        data-copy-value="${escapeHTML(item.username)}"
                        aria-label="Copy username"
                        title="Copy username"
                      >
                        <i class="fa-regular fa-copy"></i>
                      </button>
                    `
                    : ""
                }

              </div>

            </div>

            <div class="password-card-field">

              <span class="password-card-label">
                Password
              </span>

              <div class="password-card-value">

                <span>
                  ••••••••
                </span>

                ${
                  item.password
                    ? `
                      <button
                        type="button"
                        class="copy-button password-copy-button"
                        data-copy-value="${escapeHTML(item.password)}"
                        aria-label="Copy password"
                        title="Copy password"
                      >
                        <i class="fa-regular fa-copy"></i>
                      </button>
                    `
                    : ""
                }

              </div>

            </div>

          </div>

          <div class="password-card-info">

            <div class="password-card-field">

              <span class="password-card-label">
                Category
              </span>

              <div class="password-card-category">
                <span class="category-dot"></span>

                ${escapeHTML(categoryLabel)}
              </div>

            </div>

          </div>

          ${
            item.notes
              ? `
                <div class="password-card-notes">
                  <i class="fa-regular fa-note-sticky"></i>

                  <span>
                    ${escapeHTML(item.notes)}
                  </span>
                </div>
              `
              : ""
          }

        </div>

      </article>
    `;
  }

  /* =========================================
     CARD EVENTS
  ========================================= */

  function attachCardEvents() {
    if (!passwordGrid) {
      return;
    }

    /* COPY */

    const copyButtons = passwordGrid.querySelectorAll(".copy-button");

    copyButtons.forEach((button) => {
      button.addEventListener("click", async (event) => {
        event.stopPropagation();

        const value = button.dataset.copyValue;

        if (!value) {
          return;
        }

        try {
          await navigator.clipboard.writeText(value);

          const originalHTML = button.innerHTML;

          button.innerHTML = '<i class="fa-solid fa-check"></i>';

          button.classList.add("copied");

          setTimeout(() => {
            button.innerHTML = originalHTML;

            button.classList.remove("copied");
          }, 1200);
        } catch (error) {
          console.error("VaultX: Copy failed.", error);
        }
      });
    });

    /* FAVORITE */

    const favoriteButtons = passwordGrid.querySelectorAll(".favorite-button");

    favoriteButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();

        const itemId = button.dataset.favoriteId;

        toggleFavorite(itemId);
      });
    });

    /* THREE DOT MENU */

    const menuButtons = passwordGrid.querySelectorAll(".card-menu-button");

    menuButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();

        const itemId = button.dataset.menuId;

        toggleCardMenu(itemId);
      });
    });

    /* EDIT */

    const editButtons = passwordGrid.querySelectorAll("[data-edit-id]");

    editButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();

        const itemId = button.dataset.editId;

        closeAllCardMenus();

        openEditPasswordModal(itemId);
      });
    });

    /* DELETE */

    const deleteButtons = passwordGrid.querySelectorAll("[data-delete-id]");

    deleteButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();

        const itemId = button.dataset.deleteId;

        closeAllCardMenus();

        deleteVaultItem(itemId);
      });
    });
  }

  /* =========================================
     CARD MENU
  ========================================= */

  function toggleCardMenu(itemId) {
    const targetMenu = passwordGrid.querySelector(
      `[data-action-menu="${CSS.escape(itemId)}"]`,
    );

    if (!targetMenu) {
      return;
    }

    const isOpen = !targetMenu.hidden;

    closeAllCardMenus();

    if (!isOpen) {
      targetMenu.hidden = false;
    }
  }

  function closeAllCardMenus() {
    if (!passwordGrid) {
      return;
    }

    const menus = passwordGrid.querySelectorAll(".card-action-menu");

    menus.forEach((menu) => {
      menu.hidden = true;
    });
  }

  /* =========================================
     FAVORITE
  ========================================= */

  function toggleFavorite(itemId) {
    const item = vaultItems.find((vaultItem) => vaultItem.id === itemId);

    if (!item) {
      return;
    }

    item.favorite = !item.favorite;

    saveVault();

    renderVault();
    updateDashboardStats();
  }

  /* =========================================
     DELETE
  ========================================= */

  function deleteVaultItem(itemId) {
    const item = vaultItems.find((vaultItem) => vaultItem.id === itemId);

    if (!item) {
      return;
    }

    const confirmed = window.confirm(`Delete "${item.name}" from your vault?`);

    if (!confirmed) {
      return;
    }

    vaultItems = vaultItems.filter((vaultItem) => vaultItem.id !== itemId);

    saveVault();

    renderVault();
    updateDashboardStats();
  }

  /* =========================================
     EMPTY STATE
  ========================================= */

  function updateEmptyState(isEmpty) {
    if (!emptySearch) {
      return;
    }

    emptySearch.hidden = !isEmpty;

    if (!isEmpty) {
      return;
    }

    if (currentSearch) {
      emptySearch.innerHTML = `
        <div class="empty-search-icon">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>

        <h3>
          No items found
        </h3>

        <p>
          No vault items match
          "${escapeHTML(currentSearch)}".
        </p>
      `;

      return;
    }

    if (currentFilter === "favorite") {
      emptySearch.innerHTML = `
        <div class="empty-search-icon">
          <i class="fa-regular fa-star"></i>
        </div>

        <h3>
          No favorites yet
        </h3>

        <p>
          Add items to your favorites to see them here.
        </p>
      `;

      return;
    }

    emptySearch.innerHTML = `
      <div class="empty-search-icon">
        <i class="fa-solid fa-vault"></i>
      </div>

      <h3>
        No items yet
      </h3>

      <p>
        Add your first password to your vault.
      </p>
    `;
  }

  /* =========================================
     DASHBOARD STATS
  ========================================= */

  function updateDashboardStats() {
    const total = vaultItems.length;

    const favorites = vaultItems.filter(
      (item) => item.favorite === true,
    ).length;

    const weak = vaultItems.filter((item) => {
      const result = calculatePasswordStrength(item.password || "");

      return result.label === "Weak";
    }).length;

    const protectedCount = Math.max(total - weak, 0);

    if (totalItems) {
      totalItems.textContent = total;
    }

    if (totalFavorites) {
      totalFavorites.textContent = favorites;
    }

    if (weakPasswords) {
      weakPasswords.textContent = weak;
    }

    if (protectedItems) {
      protectedItems.textContent = protectedCount;
    }

    if (navItemCount) {
      navItemCount.textContent = total;
    }

    if (navFavoriteCount) {
      navFavoriteCount.textContent = favorites;
    }

    const loginItems = vaultItems.filter(
      (item) => item.category === "login",
    ).length;

    const cardItems = vaultItems.filter(
      (item) => item.category === "card",
    ).length;

    const secureNoteItems = vaultItems.filter(
      (item) => item.category === "secure-note",
    ).length;

    if (loginCount) {
      loginCount.textContent = loginItems;
    }

    if (cardCount) {
      cardCount.textContent = cardItems;
    }

    if (secureNoteCount) {
      secureNoteCount.textContent = secureNoteItems;
    }

    updateSecurityOverview(weak, total);
  }

  /* =========================================
     SECURITY OVERVIEW
  ========================================= */

  function updateSecurityOverview(weak, total) {
    const securityScore = document.getElementById("securityScore");

    const securityScoreText = document.getElementById("securityScoreText");

    const securityProgress = document.getElementById("securityProgress");

    if (!securityScore && !securityScoreText && !securityProgress) {
      return;
    }

    let score = 100;

    if (total > 0) {
      score = Math.round(100 - (weak / total) * 30);
    }

    score = Math.max(0, Math.min(100, score));

    if (securityScore) {
      securityScore.textContent = `${score}%`;
    }

    if (securityScoreText) {
      securityScoreText.textContent = `${score} / 100`;
    }

    if (securityProgress) {
      securityProgress.style.width = `${score}%`;
    }
  }

  /* =========================================
     SEARCH
  ========================================= */

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      currentSearch = searchInput.value;

      renderVault();
    });
  }

  /* =========================================
     FILTER BUTTON
  ========================================= */

  if (vaultFilterButton && vaultFilterBar) {
    vaultFilterButton.addEventListener("click", () => {
      vaultFilterBar.classList.toggle("active");

      const isVisible = vaultFilterBar.classList.contains("active");

      vaultFilterBar.hidden = !isVisible;
    });
  }

  /* =========================================
     FILTER CHIPS
  ========================================= */

  const filterButtons = document.querySelectorAll("[data-filter]");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter || "all";

      filterButtons.forEach((filterButton) => {
        filterButton.classList.remove("active");
      });

      button.classList.add("active");

      renderVault();
    });
  });

  /* =========================================
     SIDEBAR CATEGORY FILTERS
  ========================================= */

  const categoryFilterButtons = document.querySelectorAll(
    "[data-category-filter]",
  );

  categoryFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.categoryFilter;

      if (!category) {
        return;
      }

      currentFilter = category;

      filterButtons.forEach((filterButton) => {
        filterButton.classList.toggle(
          "active",
          filterButton.dataset.filter === category,
        );
      });

      renderVault();
      closeSidebar();

      const vaultSection = document.getElementById("vault");

      if (vaultSection) {
        vaultSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  /* =========================================
     FAVORITES SIDEBAR
  ========================================= */

  if (favoritesLink) {
    favoritesLink.addEventListener("click", (event) => {
      event.preventDefault();

      currentFilter = "favorite";

      filterButtons.forEach((filterButton) => {
        filterButton.classList.toggle(
          "active",
          filterButton.dataset.filter === "favorite",
        );
      });

      renderVault();
      closeSidebar();

      const vaultSection = document.getElementById("vault");

      if (vaultSection) {
        vaultSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  }

  /* =========================================
     MODAL MODE
  ========================================= */

  function setModalMode(mode) {
    if (!passwordModal) {
      return;
    }

    if (mode === "edit") {
      if (passwordModalTitle) {
        passwordModalTitle.textContent = "Change Password";
      }

      if (passwordModalDescription) {
        passwordModalDescription.textContent =
          "Update the credentials stored in your vault.";
      }

      if (savePasswordButtonText) {
        savePasswordButtonText.textContent = "Save Changes";
      }

      return;
    }

    if (passwordModalTitle) {
      passwordModalTitle.textContent = "Add Password";
    }

    if (passwordModalDescription) {
      passwordModalDescription.textContent =
        "Save a new login securely in your vault.";
    }

    if (savePasswordButtonText) {
      savePasswordButtonText.textContent = "Save Password";
    }
  }

  /* =========================================
     OPEN ADD MODAL
  ========================================= */

  function openPasswordModal() {
    if (!passwordModal) {
      return;
    }

    editingItemId = null;

    setModalMode("add");

    if (passwordForm) {
      passwordForm.reset();
    }

    if (passwordValue) {
      passwordValue.type = "password";
    }

    if (togglePasswordValue) {
      togglePasswordValue.innerHTML = '<i class="fa-regular fa-eye"></i>';

      togglePasswordValue.setAttribute("aria-label", "Show password");
    }

    passwordModal.hidden = false;

    passwordModal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");

    if (passwordService) {
      setTimeout(() => {
        passwordService.focus();
      }, 100);
    }
  }

  /* =========================================
     OPEN EDIT MODAL
  ========================================= */

  function openEditPasswordModal(itemId) {
    const item = vaultItems.find((vaultItem) => vaultItem.id === itemId);

    if (!item || !passwordModal) {
      return;
    }

    editingItemId = itemId;

    setModalMode("edit");

    if (passwordService) {
      passwordService.value = item.name || "";
    }

    if (passwordUsername) {
      passwordUsername.value = item.username || "";
    }

    if (passwordValue) {
      passwordValue.value = item.password || "";

      passwordValue.type = "password";
    }

    if (passwordUrl) {
      passwordUrl.value = item.url || "";
    }

    if (passwordCategory) {
      passwordCategory.value = item.category || "login";
    }

    if (passwordNotes) {
      passwordNotes.value = item.notes || "";
    }

    if (togglePasswordValue) {
      togglePasswordValue.innerHTML = '<i class="fa-regular fa-eye"></i>';

      togglePasswordValue.setAttribute("aria-label", "Show password");
    }

    passwordModal.hidden = false;

    passwordModal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");

    if (passwordService) {
      setTimeout(() => {
        passwordService.focus();
      }, 100);
    }
  }

  /* =========================================
     CLOSE MODAL
  ========================================= */

  function closePasswordModalFunction() {
    if (!passwordModal) {
      return;
    }

    passwordModal.hidden = true;

    passwordModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");

    editingItemId = null;

    if (passwordForm) {
      passwordForm.reset();
    }

    if (passwordValue) {
      passwordValue.type = "password";
    }

    if (togglePasswordValue) {
      togglePasswordValue.innerHTML = '<i class="fa-regular fa-eye"></i>';

      togglePasswordValue.setAttribute("aria-label", "Show password");
    }

    setModalMode("add");
  }

  /* =========================================
     ADD BUTTONS
  ========================================= */

  if (addPasswordButton) {
    addPasswordButton.addEventListener("click", openPasswordModal);
  }

  if (vaultAddButton) {
    vaultAddButton.addEventListener("click", openPasswordModal);
  }

  /* =========================================
     CLOSE BUTTONS
  ========================================= */

  if (closePasswordModal) {
    closePasswordModal.addEventListener("click", closePasswordModalFunction);
  }

  if (cancelPasswordButton) {
    cancelPasswordButton.addEventListener("click", closePasswordModalFunction);
  }

  /* =========================================
     OUTSIDE MODAL CLICK
  ========================================= */

  if (passwordModal) {
    passwordModal.addEventListener("click", (event) => {
      if (event.target === passwordModal) {
        closePasswordModalFunction();
      }
    });
  }

  /* =========================================
     SHOW / HIDE MODAL PASSWORD
  ========================================= */

  if (togglePasswordValue) {
    togglePasswordValue.addEventListener("click", () => {
      if (!passwordValue) {
        return;
      }

      if (passwordValue.type === "password") {
        passwordValue.type = "text";

        togglePasswordValue.innerHTML =
          '<i class="fa-regular fa-eye-slash"></i>';

        togglePasswordValue.setAttribute("aria-label", "Hide password");
      } else {
        passwordValue.type = "password";

        togglePasswordValue.innerHTML = '<i class="fa-regular fa-eye"></i>';

        togglePasswordValue.setAttribute("aria-label", "Show password");
      }

      passwordValue.focus();
    });
  }

  /* =========================================
     SAVE / UPDATE PASSWORD
  ========================================= */

  if (passwordForm) {
    passwordForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const service = passwordService ? passwordService.value.trim() : "";

      const username = passwordUsername ? passwordUsername.value.trim() : "";

      const password = passwordValue ? passwordValue.value : "";

      const url = passwordUrl ? passwordUrl.value.trim() : "";

      const category = passwordCategory ? passwordCategory.value : "login";

      const notes = passwordNotes ? passwordNotes.value.trim() : "";

      if (!service || !username || !password) {
        return;
      }

      /* EDIT EXISTING */

      if (editingItemId) {
        const item = vaultItems.find(
          (vaultItem) => vaultItem.id === editingItemId,
        );

        if (!item) {
          return;
        }

        item.name = service;
        item.username = username;
        item.password = password;
        item.url = url;
        item.category = category;
        item.notes = notes;

        saveVault();

        renderVault();
        updateDashboardStats();

        closePasswordModalFunction();

        return;
      }

      /* ADD NEW */

      const newItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,

        name: service,
        username,
        password,
        url,
        category,
        notes,
        favorite: false,
        createdAt: Date.now(),
      };

      vaultItems.unshift(newItem);

      saveVault();

      currentFilter = "all";
      currentSearch = "";

      if (searchInput) {
        searchInput.value = "";
      }

      filterButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.filter === "all");
      });

      renderVault();
      updateDashboardStats();

      closePasswordModalFunction();
    });
  }

  /* =========================================
     IMPROVE SECURITY
  ========================================= */

  if (improveSecurityButton) {
    improveSecurityButton.addEventListener("click", () => {
      const securitySection = document.getElementById("password-security");

      if (securitySection) {
        securitySection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  }

  /* =========================================
     MOBILE SIDEBAR
  ========================================= */

  function openSidebar() {
    if (!sidebar) {
      return;
    }

    sidebar.classList.add("open");

    if (sidebarOverlay) {
      sidebarOverlay.classList.add("active");
    }

    document.body.classList.add("sidebar-open");
  }

  function closeSidebar() {
    if (!sidebar) {
      return;
    }

    sidebar.classList.remove("open");

    if (sidebarOverlay) {
      sidebarOverlay.classList.remove("active");
    }

    document.body.classList.remove("sidebar-open");
  }

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", openSidebar);
  }

  if (sidebarClose) {
    sidebarClose.addEventListener("click", closeSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebar);
  }

  /* =========================================
     LOCK VAULT
  ========================================= */

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      sessionStorage.removeItem("vaultx-session");

      window.location.href = "login.html";
    });
  }

  /* =========================================
     QUICK SEARCH
     Press "/" to focus search
  ========================================= */

  document.addEventListener("keydown", (event) => {
    const activeElement = document.activeElement;

    const isTyping =
      activeElement &&
      (activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.isContentEditable);

    if (event.key === "/" && !isTyping) {
      event.preventDefault();

      if (searchInput) {
        searchInput.focus();
      }
    }

    if (event.key === "Escape") {
      closeAllCardMenus();
      closeSidebar();

      if (
        passwordModal &&
        passwordModal.getAttribute("aria-hidden") === "false"
      ) {
        closePasswordModalFunction();
      }
    }
  });

  /* =========================================
     CLOSE CARD MENU WHEN CLICKING OUTSIDE
  ========================================= */

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".password-card-actions")) {
      closeAllCardMenus();
    }
  });

  /* =========================================
     PASSWORD SECURITY CENTER
  ========================================= */

  const securityPassword = document.getElementById("securityPassword");

  const toggleSecurityPassword = document.getElementById(
    "toggleSecurityPassword",
  );

  const copySecurityPassword = document.getElementById("copySecurityPassword");

  const securityStrengthText = document.getElementById("securityStrengthText");

  const securityStrengthProgress = document.getElementById(
    "securityStrengthProgress",
  );

  const securityResult = document.getElementById("securityResult");

  /* =========================================
     REQUIREMENTS
  ========================================= */

  const securityRequirementLength = document.getElementById(
    "securityRequirementLength",
  );

  const securityRequirementUppercase = document.getElementById(
    "securityRequirementUppercase",
  );

  const securityRequirementLowercase = document.getElementById(
    "securityRequirementLowercase",
  );

  const securityRequirementNumber = document.getElementById(
    "securityRequirementNumber",
  );

  const securityRequirementSymbol = document.getElementById(
    "securityRequirementSymbol",
  );

  /* =========================================
     REQUIREMENT UPDATE
  ========================================= */

  function updateSecurityRequirement(element, valid) {
    if (!element) {
      return;
    }

    const icon = element.querySelector(".security-requirement-icon i");

    if (valid) {
      element.classList.add("valid");

      element.classList.remove("invalid");

      if (icon) {
        icon.className = "fa-solid fa-check";
      }
    } else {
      element.classList.remove("valid");

      element.classList.add("invalid");

      if (icon) {
        icon.className = "fa-solid fa-xmark";
      }
    }
  }

  /* =========================================
     CHECK SECURITY PASSWORD
  ========================================= */

  function checkSecurityPassword() {
    if (!securityPassword) {
      return;
    }

    const password = securityPassword.value;

    if (!password) {
      if (securityStrengthText) {
        securityStrengthText.textContent = "—";
        securityStrengthText.style.color = "#71717a";
      }

      if (securityStrengthProgress) {
        securityStrengthProgress.style.width = "0%";
        securityStrengthProgress.style.background = "#27272a";
      }

      if (securityResult) {
        securityResult.textContent = "Enter a password to check its strength.";
      }

      updateSecurityRequirement(securityRequirementLength, false);

      updateSecurityRequirement(securityRequirementUppercase, false);

      updateSecurityRequirement(securityRequirementLowercase, false);

      updateSecurityRequirement(securityRequirementNumber, false);

      updateSecurityRequirement(securityRequirementSymbol, false);

      return;
    }

    const hasLength = password.length >= 12;

    const hasUppercase = /[A-Z]/.test(password);

    const hasLowercase = /[a-z]/.test(password);

    const hasNumber = /[0-9]/.test(password);

    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    updateSecurityRequirement(securityRequirementLength, hasLength);

    updateSecurityRequirement(securityRequirementUppercase, hasUppercase);

    updateSecurityRequirement(securityRequirementLowercase, hasLowercase);

    updateSecurityRequirement(securityRequirementNumber, hasNumber);

    updateSecurityRequirement(securityRequirementSymbol, hasSymbol);

    const result = calculatePasswordStrength(password);

    let percentage = 30;
    let color = "#ef4444";

    if (result.label === "Medium") {
      percentage = 65;
      color = "#f59e0b";
    }

    if (result.label === "Strong") {
      percentage = 100;
      color = "#22c55e";
    }

    if (securityStrengthText) {
      securityStrengthText.textContent = result.label;
      securityStrengthText.style.color = color;
    }

    if (securityStrengthProgress) {
      securityStrengthProgress.style.width = `${percentage}%`;
      securityStrengthProgress.style.background = color;
    }

    if (securityResult) {
      if (result.label === "Weak") {
        securityResult.textContent =
          "This password is easy to guess. Try adding more characters and different character types.";
      } else if (result.label === "Medium") {
        securityResult.textContent =
          "This password has some protection, but it can be made stronger.";
      } else {
        securityResult.textContent =
          "This password meets the recommended strength requirements.";
      }
    }
  }

  /* =========================================
     SECURITY PASSWORD INPUT
  ========================================= */

  if (securityPassword) {
    securityPassword.disabled = false;
    securityPassword.readOnly = false;

    securityPassword.addEventListener("input", checkSecurityPassword);
  }

  /* =========================================
     SHOW / HIDE SECURITY PASSWORD
  ========================================= */

  if (toggleSecurityPassword) {
    toggleSecurityPassword.addEventListener("click", () => {
      if (!securityPassword) {
        return;
      }

      if (securityPassword.type === "password") {
        securityPassword.type = "text";

        toggleSecurityPassword.innerHTML =
          '<i class="fa-regular fa-eye-slash"></i>';

        toggleSecurityPassword.setAttribute("aria-label", "Hide password");
      } else {
        securityPassword.type = "password";

        toggleSecurityPassword.innerHTML = '<i class="fa-regular fa-eye"></i>';

        toggleSecurityPassword.setAttribute("aria-label", "Show password");
      }

      securityPassword.focus();
    });
  }

  /* =========================================
     COPY SECURITY PASSWORD
  ========================================= */

  if (copySecurityPassword) {
    copySecurityPassword.addEventListener("click", async () => {
      if (!securityPassword) {
        return;
      }

      const password = securityPassword.value.trim();

      if (!password) {
        return;
      }

      try {
        await navigator.clipboard.writeText(password);

        const originalHTML = copySecurityPassword.innerHTML;

        copySecurityPassword.innerHTML = '<i class="fa-solid fa-check"></i>';

        copySecurityPassword.classList.add("copied");

        setTimeout(() => {
          copySecurityPassword.innerHTML = originalHTML;

          copySecurityPassword.classList.remove("copied");
        }, 1200);
      } catch (error) {
        console.error("VaultX: Security password copy failed.", error);
      }
    });
  }

  /* =========================================
     INITIALIZE
  ========================================= */

  loadUsername();

  loadVault();

  updateDashboardStats();

  renderVault();

  checkSecurityPassword();

  console.log("VaultX: Dashboard initialized successfully.");
});
