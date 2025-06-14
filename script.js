// Section toggling
function showSection(id) {
  const sections = document.querySelectorAll("section");
  sections.forEach(section => {
    section.classList.toggle("hidden", section.id !== id);
    section.classList.toggle("active-section", section.id === id);
  });
  
  document.querySelectorAll('.nav-icons li').forEach(li => li.classList.remove('active'));
const navItems = document.querySelectorAll('.nav-icons li');
[...navItems].find(li => li.innerText.toLowerCase().includes(id))?.classList.add('active');


  if (id === "dashboard") updateDashboard();
}

// Sidebar toggle
function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("active");
}

// Dark mode toggle
const toggle = document.getElementById("darkModeToggle");
const currentTheme = localStorage.getItem("darkMode");
if (currentTheme === "enabled") {
  document.body.classList.add("dark");
  toggle.checked = true;
}
toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark", toggle.checked);
  localStorage.setItem("darkMode", toggle.checked ? "enabled" : "disabled");
});

// Dashboard update (No task count)
function updateDashboard() {
  document.getElementById("quiz-count").textContent = localStorage.getItem("quizCount") || 0;
  document.getElementById("last-topic").textContent = localStorage.getItem("lastQuizTopic") || "N/A";
  document.getElementById("last-score").textContent = localStorage.getItem("lastQuizScore") || "N/A";
  document.getElementById("last-city").textContent = localStorage.getItem("lastCity") || "N/A";
}

// Weather API
function getWeather() {
  const city = document.getElementById("city").value.trim();
  const result = document.getElementById("weather-result");

  if (!city) {
    result.textContent = "Please enter a city name.";
    return;
  }

  fetch(`https://api.weatherapi.com/v1/current.json?key=c79abb18032c40f0a3d171514252205&q=${city}`)
    .then(res => res.json())
    .then(data => {
      result.innerHTML = `<strong style="font-size: 22px;">🌤️ ${data.location.name}: ${data.current.temp_c}°C - ${data.current.condition.text}</strong>`;
      localStorage.setItem("lastCity", data.location.name);
    })
    .catch(() => {
      result.textContent = "❌ Unable to fetch weather.";
    });
}

// Quiz questions
const quizzes = {
  html: [
    { q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"], answer: 0 },
    { q: "Choose the correct HTML element for the largest heading:", options: ["<heading>", "<h6>", "<h1>"], answer: 2 },
    { q: "Which HTML tag is used to create a hyperlink?", options: ["<a>", "<link>", "<href>"], answer: 0 },
    { q: "What is the correct HTML tag for inserting a line break?", options: ["<br>", "<lb>", "<break>"], answer: 0 },
    { q: "Which tag is used to define an unordered list?", options: ["<ul>", "<ol>", "<li>"], answer: 0 },
    { q: "What is the correct HTML tag for the largest title?", options: ["<title>", "<heading>", "<h1>"], answer: 2 },
    { q: "What attribute specifies an image source?", options: ["src", "href", "alt"], answer: 0 },
    { q: "How do you write a comment in HTML?", options: ["<!-- Comment -->", "// Comment", "# Comment"], answer: 0 },
    { q: "Which tag defines a table row?", options: ["<td>", "<th>", "<tr>"], answer: 2 },
    { q: "Which tag is used for a list item?", options: ["<item>", "<li>", "<ul>"], answer: 1 }
  ],
  js: [
    { q: "Who developed JavaScript?", options: ["Microsoft", "Netscape", "Sun"], answer: 1 },
    { q: "How to comment in JS?", options: ["<!-- -->", "//", "#"], answer: 1 },
    { q: "Which keyword declares a variable?", options: ["var", "let", "int"], answer: 0 },
    { q: "What does '===' mean?", options: ["equal", "strict equal", "assign"], answer: 1 },
    { q: "Which method logs to console?", options: ["console.log()", "log.console()", "print()"], answer: 0 },
    { q: "What is the type of NaN?", options: ["String", "Number", "Boolean"], answer: 1 },
    { q: "Which keyword makes a constant?", options: ["let", "var", "const"], answer: 2 },
    { q: "How do you write a function?", options: ["func myFunc()", "function myFunc(){}", "def myFunc()"], answer: 1 },
    { q: "What symbol is used for arrays?", options: ["[]", "{}", "<>"], answer: 0 },
    { q: "Which operator is used to assign a value?", options: ["=", "==", "==="], answer: 0 }
  ]
};

// Render quiz
function startQuiz() {
  const topic = document.getElementById("quiz-topic").value;
  const quizForm = document.getElementById("quiz-form");
  const quizResult = document.getElementById("quiz-result");

  if (!topic || !quizzes[topic]) {
    alert("Please select a valid topic.");
    return;
  }

  quizForm.innerHTML = "";
  quizForm.classList.remove("hidden");
  quizResult.innerHTML = "";

  quizzes[topic].forEach((item, i) => {
    const qBlock = document.createElement("div");
    const question = document.createElement("p");
    question.innerHTML = `<strong>Q${i + 1}. ${item.q}</strong>`;
    qBlock.appendChild(question);

    item.options.forEach((opt, j) => {
      const label = document.createElement("label");
      label.style.display = "block";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${i}`;
      input.value = j;
      label.appendChild(input);
      label.appendChild(document.createTextNode(" " + opt));
      qBlock.appendChild(label);
    });

    quizForm.appendChild(qBlock);
  });
}

// Submit quiz – only show score (no answers)
function submitQuiz() {
  const topic = document.getElementById("quiz-topic").value;
  const resultBox = document.getElementById("quiz-result");
  const questions = quizzes[topic];
  let score = 0;

  questions.forEach((item, i) => {
    const chosen = document.querySelector(`input[name='q${i}']:checked`);
    const value = chosen ? parseInt(chosen.value) : -1;
    if (value === item.answer) score++;
  });

  localStorage.setItem("lastQuizTopic", topic);
  localStorage.setItem("lastQuizScore", `${score}/${questions.length}`);
  const current = parseInt(localStorage.getItem("quizCount") || "0");
  localStorage.setItem("quizCount", (current + 1).toString());

  resultBox.innerHTML = `<h3>Your Score: ${score} / ${questions.length}</h3>
    <button onclick="showSection('dashboard')">⬅️ Back to Dashboard</button>`;

  updateDashboard();
}

// Toggle project section
window.onload = function () {
  updateDashboard();

  const toggleBtn = document.getElementById("toggle-projects");
  const projectContainer = document.getElementById("projects-container");

  if (toggleBtn && projectContainer) {
    toggleBtn.addEventListener("click", () => {
      const isShown = projectContainer.classList.contains("show");

      projectContainer.classList.toggle("show");
      toggleBtn.innerHTML = isShown ? "🔽 View Projects" : "🔼 Hide Projects";
    });
  }
};
