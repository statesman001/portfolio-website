/* ============================================================
   script.js  —  Portfolio Website
   Author : Nnamdi Ignatius Ignatius
   Course : Information Technology, Miva Open University
   ------------------------------------------------------------
   This single script file is linked to every page. Each feature
   is written as its own function and every function first checks
   that the element it needs exists on the current page, so no
   errors are thrown on pages that do not use that feature.

   FUNCTION INDEX
   F1  initThemeToggle()     - light / dark theme with localStorage
   F2  initMobileNav()       - hamburger menu open and close
   F3  highlightActiveNav()  - marks the current page in the menu
   F4  setFooterYear()       - prints the current year automatically
   F5  initTypingEffect()    - types the role text on the home page
   F6  initScrollReveal()    - fades sections in as they are scrolled to
   F7  initSkillBars()       - animates the skill progress bars
   F8  initBackToTop()       - shows a button and scrolls to the top
   F9  initProjectFilter()   - filters project cards by category
   F10 initContactForm()     - validates the contact form input
   ============================================================ */

"use strict";

/* ------------------------------------------------------------
   F1. THEME TOGGLE (light / dark) WITH localStorage
   Reads any theme the visitor chose on a previous visit, applies
   it, then switches the theme when the button is clicked and
   saves the new choice in the browser.
   ------------------------------------------------------------ */
function initThemeToggle() {
  var toggleBtn = document.getElementById("themeToggle");
  var savedTheme = localStorage.getItem("portfolio-theme") || "light";

  // Apply the stored theme to the <html> element
  document.documentElement.setAttribute("data-theme", savedTheme);
  if (toggleBtn) {
    // 2600 is the sun symbol, 263E is the crescent moon symbol
    toggleBtn.textContent = savedTheme === "dark" ? "\u2600" : "\u263E";
  }

  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", function () {
    var current = document.documentElement.getAttribute("data-theme");
    var next = current === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("portfolio-theme", next);   // remember the choice
    toggleBtn.textContent = next === "dark" ? "\u2600" : "\u263E";
  });
}

/* ------------------------------------------------------------
   F2. MOBILE NAVIGATION MENU
   On small screens the menu is collapsed by CSS. Clicking the
   hamburger button adds the class .open, which lets the CSS
   expand the menu.
   ------------------------------------------------------------ */
function initMobileNav() {
  var toggle = document.getElementById("menuToggle");
  var menu = document.getElementById("navMenu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", function () {
    menu.classList.toggle("open");

    // Update the accessibility state for screen readers
    var isOpen = menu.classList.contains("open");
    toggle.setAttribute("aria-expanded", isOpen);
  });

  // Close the menu again after a link inside it is clicked
  var links = menu.querySelectorAll("a");
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function () {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  }
}

/* ------------------------------------------------------------
   F3. HIGHLIGHT THE ACTIVE NAVIGATION LINK
   Compares the file name in the address bar with the href of
   each menu link and adds the class .active to the one that
   matches, so the visitor can see which page they are on.
   ------------------------------------------------------------ */
function highlightActiveNav() {
  var links = document.querySelectorAll(".nav-menu a");
  var path = window.location.pathname.split("/").pop() || "index.html";

  for (var i = 0; i < links.length; i++) {
    var target = links[i].getAttribute("href").split("/").pop();
    if (target === path) {
      links[i].classList.add("active");
      links[i].setAttribute("aria-current", "page");
    }
  }
}

/* ------------------------------------------------------------
   F4. AUTOMATIC FOOTER YEAR
   Uses the Date object so the copyright year never has to be
   edited by hand.
   ------------------------------------------------------------ */
function setFooterYear() {
  var span = document.getElementById("year");
  if (span) {
    span.textContent = new Date().getFullYear();
  }
}

/* ------------------------------------------------------------
   F5. TYPING EFFECT ON THE HOME PAGE
   Writes a list of roles one character at a time, deletes them,
   then moves to the next role. setTimeout is used to control the
   speed of typing and deleting.
   ------------------------------------------------------------ */
function initTypingEffect() {
  var target = document.getElementById("typedRole");
  if (!target) return;

  var roles = [
    "Information Technology Student",
    "Front-End Web Developer",
    "Data Analysis Enthusiast"
  ];
  var roleIndex = 0;     // which role is being shown
  var charIndex = 0;     // how many characters are shown
  var deleting = false;

  function type() {
    var word = roles[roleIndex];

    if (deleting) {
      charIndex--;                       // remove one character
    } else {
      charIndex++;                       // add one character
    }
    target.textContent = word.substring(0, charIndex);

    var speed = deleting ? 45 : 95;

    if (!deleting && charIndex === word.length) {
      speed = 1600;                      // pause on the full word
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;  // next role, loop back
      speed = 350;
    }
    setTimeout(type, speed);
  }
  type();
}

/* ------------------------------------------------------------
   F6. SCROLL REVEAL ANIMATION
   The IntersectionObserver API watches every element with the
   class .reveal and adds .visible the moment it enters the
   screen, which triggers the CSS fade-in.
   ------------------------------------------------------------ */
function initScrollReveal() {
  var items = document.querySelectorAll(".reveal");
  if (items.length === 0) return;

  // Fallback for very old browsers: show everything immediately
  if (!("IntersectionObserver" in window)) {
    for (var j = 0; j < items.length; j++) items[j].classList.add("visible");
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);   // animate once only
      }
    });
  }, { threshold: 0.15 });

  for (var i = 0; i < items.length; i++) {
    observer.observe(items[i]);
  }
}

/* ------------------------------------------------------------
   F7. ANIMATED SKILL BARS
   Each bar stores its percentage in a data-level attribute. When
   the bar scrolls into view the width is set, and the CSS
   transition animates it from 0% up to that value.
   ------------------------------------------------------------ */
function initSkillBars() {
  var bars = document.querySelectorAll(".bar-fill");
  if (bars.length === 0) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var level = entry.target.getAttribute("data-level");
        entry.target.style.width = level + "%";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  for (var i = 0; i < bars.length; i++) {
    observer.observe(bars[i]);
  }
}

/* ------------------------------------------------------------
   F8. BACK-TO-TOP BUTTON
   Listens to the scroll event. Once the page has been scrolled
   more than 350 pixels the button is shown, and clicking it
   scrolls smoothly back to the top.
   ------------------------------------------------------------ */
function initBackToTop() {
  var btn = document.getElementById("backToTop");
  if (!btn) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 350) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  });

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ------------------------------------------------------------
   F9. PROJECT FILTER
   Every project card carries a data-category attribute. Clicking
   a filter button hides the cards that do not belong to the
   chosen category by adding the class .is-hidden.
   ------------------------------------------------------------ */
function initProjectFilter() {
  var buttons = document.querySelectorAll(".filter-btn");
  var cards = document.querySelectorAll(".project-card");
  var counter = document.getElementById("resultCount");
  if (buttons.length === 0 || cards.length === 0) return;

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      var choice = this.getAttribute("data-filter");
      var shown = 0;

      // Move the .active highlight to the button just clicked
      for (var b = 0; b < buttons.length; b++) {
        buttons[b].classList.remove("active");
      }
      this.classList.add("active");

      // Show or hide each card
      for (var c = 0; c < cards.length; c++) {
        var category = cards[c].getAttribute("data-category");
        if (choice === "all" || category === choice) {
          cards[c].classList.remove("is-hidden");
          shown++;
        } else {
          cards[c].classList.add("is-hidden");
        }
      }

      if (counter) {
        counter.textContent = "Showing " + shown + " of " + cards.length + " projects";
      }
    });
  }
}

/* ------------------------------------------------------------
   F10. CONTACT FORM VALIDATION
   Stops the form from submitting, checks every field, and shows
   a message under any field that fails. A regular expression is
   used to confirm the email address has a valid shape.
   ------------------------------------------------------------ */
function initContactForm() {
  var form = document.getElementById("contactForm");
  if (!form) return;

  var feedback = document.getElementById("formMessage");
  var emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

  // Helper that displays one error message
  function showError(field, messageId, text) {
    document.getElementById(messageId).textContent = text;
    field.classList.add("input-error");
  }

  // Helper that clears one error message
  function clearError(field, messageId) {
    document.getElementById(messageId).textContent = "";
    field.classList.remove("input-error");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();          // stop the default page reload
    var valid = true;

    var name = document.getElementById("name");
    var email = document.getElementById("email");
    var subject = document.getElementById("subject");
    var message = document.getElementById("message");

    // Rule 1: the name must be at least three characters
    if (name.value.trim().length < 3) {
      showError(name, "nameError", "Please enter at least 3 characters.");
      valid = false;
    } else {
      clearError(name, "nameError");
    }

    // Rule 2: the email must match the pattern
    if (!emailPattern.test(email.value.trim())) {
      showError(email, "emailError", "Please enter a valid email address.");
      valid = false;
    } else {
      clearError(email, "emailError");
    }

    // Rule 3: the subject cannot be empty
    if (subject.value.trim() === "") {
      showError(subject, "subjectError", "Please enter a subject.");
      valid = false;
    } else {
      clearError(subject, "subjectError");
    }

    // Rule 4: the message must be at least ten characters
    if (message.value.trim().length < 10) {
      showError(message, "messageError", "Your message is too short.");
      valid = false;
    } else {
      clearError(message, "messageError");
    }

    // Only when every rule passes is the success note displayed
    if (valid) {
      feedback.textContent =
        "Thank you, " + name.value.trim() + ". Your message has been validated successfully.";
      feedback.classList.add("show");
      form.reset();
    } else {
      feedback.classList.remove("show");
    }
  });
}

/* ------------------------------------------------------------
   START-UP
   DOMContentLoaded fires once the HTML has been fully parsed, so
   every element the functions need is guaranteed to exist.
   ------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", function () {
  initThemeToggle();
  initMobileNav();
  highlightActiveNav();
  setFooterYear();
  initTypingEffect();
  initScrollReveal();
  initSkillBars();
  initBackToTop();
  initProjectFilter();
  initContactForm();
});
