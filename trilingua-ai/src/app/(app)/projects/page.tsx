"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Play,
  Sparkles,
  ArrowLeft,
  Code2,
  FileCode,
  Layout,
  RefreshCw,
  AlertCircle,
  Eye,
  Settings,
  Languages,
  Maximize2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import ReactMarkdown from "react-markdown";

interface ProjectTemplate {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  domain: string;
  techStack: string;
  description: string;
  html: string;
  css: string;
  js: string;
}

const PROJECTS_MOCK: ProjectTemplate[] = [
  {
    id: "proj1",
    title: "Interactive Calculator",
    difficulty: "Easy",
    domain: "Web Dev",
    techStack: "HTML, CSS, JavaScript",
    description: "Build a sleek, modern glassmorphic calculator with animations and responsive layout.",
    html: `<!-- Sleek glassmorphic calculator -->
<div class="calculator">
  <div id="screen">0</div>
  <div class="keypad">
    <button onclick="clearScreen()" class="btn-alt">C</button>
    <button onclick="backspace()" class="btn-alt">⌫</button>
    <button onclick="press('%')" class="btn-alt">%</button>
    <button onclick="press('/')" class="btn-op">÷</button>
    
    <button onclick="press('7')">7</button>
    <button onclick="press('8')">8</button>
    <button onclick="press('9')">9</button>
    <button onclick="press('*')" class="btn-op">×</button>
    
    <button onclick="press('4')">4</button>
    <button onclick="press('5')">5</button>
    <button onclick="press('6')">6</button>
    <button onclick="press('-')" class="btn-op">−</button>
    
    <button onclick="press('1')">1</button>
    <button onclick="press('2')">2</button>
    <button onclick="press('3')">3</button>
    <button onclick="press('+')" class="btn-op">+</button>
    
    <button onclick="press('0')" class="btn-zero">0</button>
    <button onclick="press('.')">.</button>
    <button onclick="calculate()" class="btn-eq">=</button>
  </div>
</div>`,
    css: `/* Glassmorphism styling */
body {
  margin: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at top right, #1e1b4b, #090514);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.calculator {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 24px;
  width: 320px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}
#screen {
  font-size: 36px;
  color: #fff;
  text-align: right;
  padding: 16px 8px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  min-height: 50px;
  word-wrap: break-word;
  font-weight: 300;
}
.keypad {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
button {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  color: #e2e8f0;
  font-size: 20px;
  padding: 16px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}
button:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
}
button:active {
  transform: translateY(0);
}
.btn-op {
  background: rgba(99, 102, 241, 0.2);
  color: #818cf8;
  border: 1px solid rgba(99, 102, 241, 0.15);
}
.btn-op:hover {
  background: rgba(99, 102, 241, 0.3);
}
.btn-alt {
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
}
.btn-eq {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #fff;
  grid-column: span 1;
}
.btn-zero {
  grid-column: span 2;
  text-align: left;
  padding-left: 28px;
}`,
    js: `// Calculator logic
let expression = "";

function press(val) {
  if (expression === "0" && val !== ".") {
    expression = "";
  }
  expression += val;
  updateScreen();
}

function clearScreen() {
  expression = "0";
  updateScreen();
}

function backspace() {
  expression = expression.slice(0, -1);
  if (expression === "") expression = "0";
  updateScreen();
}

function calculate() {
  try {
    // Simple math evaluation
    let result = eval(expression);
    expression = String(result);
    updateScreen();
  } catch (err) {
    expression = "Error";
    updateScreen();
    setTimeout(() => { expression = "0"; updateScreen(); }, 1200);
  }
}

function updateScreen() {
  document.getElementById("screen").innerText = expression || "0";
}`
  },
  {
    id: "proj2",
    title: "Weather Forecast Dashboard",
    difficulty: "Medium",
    domain: "Web Dev",
    techStack: "HTML, CSS, JavaScript (Fetch)",
    description: "Build an elegant dashboard checking simulated weather, visual reports, and data lists.",
    html: `<div class="dashboard">
  <h2>🌤️ Weather AI Dashboard</h2>
  <div class="search-bar">
    <input type="text" id="cityInput" placeholder="Enter city name... (e.g. Chennai, Delhi)">
    <button onclick="getWeather()">Search</button>
  </div>
  
  <div id="weatherCard" class="weather-card hide">
    <h3 id="cityName">Chennai</h3>
    <div class="temp-container">
      <span id="temp">32°C</span>
      <span id="condition">Sunny</span>
    </div>
    <div class="details">
      <div>💧 Humidity: <span id="humidity">75%</span></div>
      <div>💨 Wind: <span id="wind">12 km/h</span></div>
    </div>
    <div class="ai-insight">
      <h4>💡 Tutor Recommendation:</h4>
      <p id="aiAdvice">Ideal weather for starting external ML programming tasks!</p>
    </div>
  </div>
</div>`,
    css: `body {
  margin: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle, #0f172a, #020617);
  font-family: system-ui, -apple-system, sans-serif;
  color: #fff;
}
.dashboard {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid #334155;
  border-radius: 20px;
  padding: 30px;
  width: 380px;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
}
h2 {
  margin-top: 0;
  text-align: center;
  color: #6366f1;
}
.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}
input {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #475569;
  background: #0f172a;
  color: white;
  outline: none;
}
button {
  padding: 12px 20px;
  background: #6366f1;
  border: none;
  color: white;
  font-weight: bold;
  border-radius: 10px;
  cursor: pointer;
  transition: opacity 0.2s;
}
button:hover { opacity: 0.9; }
.weather-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid #334155;
  border-radius: 15px;
  padding: 20px;
  animation: fadeIn 0.4s ease-out;
}
.hide { display: none; }
.temp-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
}
#temp { font-size: 40px; font-weight: bold; }
#condition { color: #38bdf8; font-weight: 500; }
.details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 20px;
}
.ai-insight {
  border-top: 1px solid #334155;
  padding-top: 15px;
  font-size: 13px;
}
.ai-insight h4 { margin: 0 0 5px 0; color: #a78bfa; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}`,
    js: `// Simulated Weather API Fetch
const WEATHER_DB = {
  chennai: { temp: "32°C", cond: "Sunny", hum: "78%", wind: "14 km/h", adv: "High humidity! Practice indoors. Try building a React project." },
  delhi: { temp: "18°C", cond: "Foggy", hum: "88%", wind: "6 km/h", adv: "Cool weather! Grab a tea and work on python algorithms." },
  mumbai: { temp: "29°C", cond: "Humid", hum: "82%", wind: "10 km/h", adv: "Optimal weather to learn API architectures." },
  bangalore: { temp: "24°C", cond: "Pleasant", hum: "50%", wind: "16 km/h", adv: "Fantastic day outside! Code a mobile application workflow." }
};

function getWeather() {
  const city = document.getElementById("cityInput").value.trim().toLowerCase();
  const card = document.getElementById("weatherCard");
  
  if (!city) return alert("Please enter a city!");
  
  const weather = WEATHER_DB[city] || {
    temp: "25°C",
    cond: "Partly Cloudy",
    hum: "60%",
    wind: "10 km/h",
    adv: "Default advice: Keep building awesome code blocks!"
  };
  
  document.getElementById("cityName").innerText = city.charAt(0).toUpperCase() + city.slice(1);
  document.getElementById("temp").innerText = weather.temp;
  document.getElementById("condition").innerText = weather.cond;
  document.getElementById("humidity").innerText = weather.hum;
  document.getElementById("wind").innerText = weather.wind;
  document.getElementById("aiAdvice").innerText = weather.adv;
  
  card.classList.remove("hide");
}`
  },
  {
    id: "proj3",
    title: "Data Visualization Plotter",
    difficulty: "Medium",
    domain: "Data Science",
    techStack: "HTML, CSS, Chart.js",
    description: "Draw custom graphs dynamically from user-input series using Chart.js inside a visual window.",
    html: `<!-- HTML layout with Chart.js link -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<div class="container">
  <h3>📊 Interactive Chart Plotter</h3>
  <div class="controls">
    <label>Data values (comma separated):</label>
    <input type="text" id="dataInput" value="12, 19, 3, 5, 2, 3">
    <button onclick="updateChart()">Plot Data</button>
  </div>
  
  <div class="canvas-container">
    <canvas id="myChart"></canvas>
  </div>
</div>`,
    css: `body {
  margin: 0;
  background: #111827;
  color: white;
  font-family: system-ui, sans-serif;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
}
.container {
  background: #1f2937;
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  border: 1px solid #374151;
}
h3 { margin-top: 0; text-align: center; color: #10b981; }
.controls {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
input {
  padding: 10px;
  background: #0f172a;
  border: 1px solid #4b5563;
  color: white;
  border-radius: 8px;
}
button {
  background: #10b981;
  color: white;
  border: none;
  font-weight: bold;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
}
button:hover { background: #059669; }
.canvas-container {
  background: white;
  padding: 12px;
  border-radius: 12px;
}
canvas {
  max-height: 250px;
}`,
    js: `// Chart.js implementation
let myChart;

function initChart(dataPoints) {
  const ctx = document.getElementById('myChart').getContext('2d');
  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: 'Votes / Values',
        data: dataPoints,
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function updateChart() {
  const input = document.getElementById("dataInput").value;
  const arr = input.split(",").map(val => Number(val.trim()));
  
  if (myChart) {
    myChart.data.datasets[0].data = arr;
    myChart.update();
  } else {
    initChart(arr);
  }
}

// Initial draw
initChart([12, 19, 3, 5, 2, 3]);`
  },
  {
    id: "proj4",
    title: "ML KNN Classifier Simulation",
    difficulty: "Hard",
    domain: "AI/ML",
    techStack: "HTML, CSS, Canvas JS",
    description: "Draw training data coordinates and visualize classification boundaries live using Canvas API.",
    html: `<div class="app">
  <h3>🤖 Visual KNN Classifier (2D)</h3>
  <p class="desc">Click on the canvas to place points. Predict category of new points based on K-Nearest Neighbors.</p>
  
  <div class="controls">
    <button onclick="setMode('A')" class="btn-A">Place Red (Class A)</button>
    <button onclick="setMode('B')" class="btn-B">Place Blue (Class B)</button>
    <button onclick="setMode('predict')" class="btn-pred">Predict new point</button>
    <button onclick="clearPoints()">Reset</button>
  </div>
  
  <canvas id="knnCanvas" width="360" height="260"></canvas>
</div>`,
    css: `body {
  margin: 0;
  background: #18181b;
  color: white;
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 95vh;
}
.app {
  background: #27272a;
  border: 1px solid #3f3f46;
  border-radius: 16px;
  padding: 20px;
  width: 400px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.6);
}
h3 { margin-top: 0; color: #a855f7; text-align: center; }
.desc { font-size: 11px; color: #a1a1aa; text-align: center; margin-top: -5px; }
.controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 15px;
}
button {
  background: #3f3f46;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  transition: filter 0.2s;
}
button:hover { filter: brightness(1.2); }
.btn-A { border: 1.5px solid #ef4444 !important; background: rgba(239,68,68,0.1); }
.btn-B { border: 1.5px solid #3b82f6 !important; background: rgba(59,130,246,0.1); }
.btn-pred { background: #a855f7; font-weight: bold; }
canvas {
  background: #09090b;
  border: 1px solid #3f3f46;
  border-radius: 10px;
  cursor: crosshair;
}`,
    js: `// KNN interactive plot
const canvas = document.getElementById("knnCanvas");
const ctx = canvas.getContext("2d");
let points = []; // [{x, y, label}]
let mode = 'A'; // 'A', 'B', 'predict'
const K = 3;

canvas.addEventListener("click", function(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  if (mode === 'predict') {
    const label = runKNN(x, y, K);
    points.push({x, y, label, isNew: true});
    draw();
  } else {
    points.push({x, y, label: mode});
    draw();
  }
});

function setMode(newMode) {
  mode = newMode;
}

function clearPoints() {
  points = [];
  draw();
}

function distance(p1, p2) {
  return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
}

function runKNN(x, y, k) {
  const trainingPoints = points.filter(p => !p.isNew);
  if (trainingPoints.length === 0) return 'A';
  
  // Calculate distances
  const distances = trainingPoints.map(p => ({
    dist: distance({x, y}, p),
    label: p.label
  }));
  
  // Sort
  distances.sort((a,b) => a.dist - b.dist);
  
  // Vote
  const votes = {A: 0, B: 0};
  for(let i=0; i < Math.min(k, distances.length); i++) {
    votes[distances[i].label]++;
  }
  
  return votes.A >= votes.B ? 'A' : 'B';
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw helper mesh
  ctx.strokeStyle = "rgba(255,255,255,0.03)";
  ctx.lineWidth = 1;
  for(let i=0; i<canvas.width; i+=20) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
  }
  for(let j=0; j<canvas.height; j+=20) {
    ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke();
  }
  
  // Draw points
  points.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.isNew ? 9 : 6, 0, 2*Math.PI);
    ctx.fillStyle = p.label === 'A' ? '#ef4444' : '#3b82f6';
    ctx.fill();
    if (p.isNew) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });
}

// Draw initial points
points = [
  {x: 100, y: 80, label: 'A'},
  {x: 120, y: 110, label: 'A'},
  {x: 80, y: 150, label: 'A'},
  {x: 240, y: 180, label: 'B'},
  {x: 260, y: 140, label: 'B'},
  {x: 280, y: 200, label: 'B'}
];
draw();`
  }
];

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<ProjectTemplate | null>(null);
  const [language, setLanguage] = useState<"English" | "Tamil" | "Hindi">("English");
  
  // Sandbox files
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  
  // Guide state
  const [guide, setGuide] = useState("");
  const [loadingGuide, setLoadingGuide] = useState(false);
  const [guideError, setGuideError] = useState<string | null>(null);
  
  // Tab states: "editor" vs "guide" on mobile, and "html" vs "css" vs "js" inside editor
  const [editorTab, setEditorTab] = useState<"html" | "css" | "js">("html");
  
  // Iframe compilation source document
  const [iframeSrcDoc, setIframeSrcDoc] = useState("");

  const handleSelectProject = (project: ProjectTemplate) => {
    setSelectedProject(project);
    setHtmlCode(project.html);
    setCssCode(project.css);
    setJsCode(project.js);
    setGuide("");
    setGuideError(null);
    setIframeSrcDoc("");
    // Trigger run code automatically for starter view
    compileAndRun(project.html, project.css, project.js);
    // Fetch guide automatically
    fetchGuide(project, language);
  };

  const fetchGuide = async (project: ProjectTemplate, lang: "English" | "Tamil" | "Hindi") => {
    setLoadingGuide(true);
    setGuideError(null);
    try {
      const res = await fetch("/api/ai/project-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: project.title,
          difficulty: project.difficulty,
          techStack: project.techStack,
          language: lang
        })
      });
      const data = await res.json();
      if (data.success && data.data?.guide) {
        setGuide(data.data.guide);
      } else {
        setGuideError(data.error || "Failed to load project guide. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setGuideError("Network error. Unable to fetch guide.");
    } finally {
      setLoadingGuide(false);
    }
  };

  const handleLanguageChange = (newLang: "English" | "Tamil" | "Hindi") => {
    setLanguage(newLang);
    if (selectedProject) {
      fetchGuide(selectedProject, newLang);
    }
  };

  const compileAndRun = (html: string, css: string, js: string) => {
    const combinedDoc = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script>
          // Wrap in try catch to report runtime errors
          try {
            ${js}
          } catch(err) {
            console.error(err);
            document.body.innerHTML += '<div style="color: #ef4444; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); padding: 12px; margin: 15px; border-radius: 8px; font-family: monospace; font-size: 12px;"><strong>Runtime Error:</strong> ' + err.message + '</div>';
          }
        </script>
      </body>
      </html>
    `;
    setIframeSrcDoc(combinedDoc);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto min-h-[calc(100vh-8rem)] flex flex-col">
      {!selectedProject ? (
        /* ================= PROJECTS DIRECTORY VIEW ================= */
        <div className="space-y-8 flex-1">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Briefcase className="text-primary-500" /> Hands-On AI Projects
            </h1>
            <p className="text-gray-400 mt-1">
              Select a project to build. Get step-by-step guidance from Gemini in your preferred language, write the code, and run it live in a sandboxed emulator.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROJECTS_MOCK.map(project => (
              <div
                key={project.id}
                className="glass-card p-6 flex flex-col justify-between hover:border-primary-500/30 hover:shadow-card-hover transition-all duration-300 group"
              >
                <div className="space-y-4">
                  {/* Meta stats */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                      project.difficulty === "Easy" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                      project.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                      "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}>
                      {project.difficulty}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">{project.domain}</span>
                  </div>

                  {/* Title & description */}
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.techStack.split(",").map(tech => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-dark-surface border border-dark-border rounded text-[10px] text-gray-400"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-6 pt-4 border-t border-dark-border/40">
                  <Button
                    onClick={() => handleSelectProject(project)}
                    className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5"
                    icon={<Sparkles size={14} />}
                  >
                    Build with AI Guide
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ================= INTERACTIVE WORKSPACE VIEW ================= */
        <div className="flex-1 flex flex-col gap-4">
          {/* Top Panel Actions */}
          <div className="flex items-center justify-between bg-dark-card/50 p-4 rounded-xl border border-dark-border">
            <button
              onClick={() => setSelectedProject(null)}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors font-medium"
            >
              <ArrowLeft size={16} /> Back to Projects
            </button>
            <h2 className="text-sm font-bold text-white hidden md:block">
              Building: <span className="text-primary-300">{selectedProject.title}</span>
            </h2>
            <div className="flex items-center gap-2 bg-dark-surface p-1 rounded-lg border border-dark-border">
              <span className="text-[10px] text-gray-500 px-1 flex items-center gap-1 font-semibold uppercase">
                <Languages size={12} /> Guide:
              </span>
              {(["English", "Tamil", "Hindi"] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded transition-colors ${
                    language === lang
                      ? "bg-primary-600/20 text-primary-300 border border-primary-500/20"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  {lang === "English" ? "EN" : lang === "Tamil" ? "TA" : "HI"}
                </button>
              ))}
            </div>
          </div>

          {/* Split Panel workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
            
            {/* LEFT PANEL: AI Walkthrough Guide */}
            <div className="glass-card flex flex-col h-[600px] overflow-hidden">
              <div className="px-4 py-3 bg-dark-surface/50 border-b border-dark-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Sparkles size={14} className="text-primary-400" />
                  <span>AI Tutor Walkthrough ({language})</span>
                </div>
                {loadingGuide && (
                  <div className="flex gap-1 items-center px-1">
                    <span className="w-1 h-1 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1 h-1 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1 h-1 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <AnimatePresence mode="wait">
                  {loadingGuide ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center space-y-3"
                    >
                      <RefreshCw size={24} className="animate-spin text-primary-500" />
                      <p className="text-xs text-gray-500">Gemini is compiling your walkthrough in {language}...</p>
                    </motion.div>
                  ) : guideError ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-4 bg-red-950/20 border border-red-500/25 rounded-lg flex items-start gap-2.5 text-xs text-red-200"
                    >
                      <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
                      <div className="flex-1 space-y-2">
                        <p>{guideError}</p>
                        <button
                          onClick={() => fetchGuide(selectedProject, language)}
                          className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded border border-red-500/30 text-[10px] font-bold transition-all flex items-center gap-1 w-max"
                        >
                          <RefreshCw size={10} /> Retry Loading
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="guide"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="prose prose-invert prose-sm max-w-none break-words leading-relaxed font-sans"
                    >
                      <ReactMarkdown>{guide}</ReactMarkdown>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT PANEL: Live Playground & Emulator Sandbox */}
            <div className="flex flex-col gap-4 h-[600px]">
              {/* Code Editors */}
              <div className="glass-card flex-1 flex flex-col overflow-hidden">
                {/* Editor Tab bar */}
                <div className="px-4 py-2 bg-dark-surface/50 border-b border-dark-border flex items-center justify-between">
                  <div className="flex gap-2">
                    {(["html", "css", "js"] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setEditorTab(tab)}
                        className={`px-3 py-1 text-xs font-bold rounded capitalize border transition-all ${
                          editorTab === tab
                            ? "bg-primary-600/20 border-primary-500 text-primary-300"
                            : "bg-dark-surface border-dark-border text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        {tab.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setHtmlCode(selectedProject.html);
                        setCssCode(selectedProject.css);
                        setJsCode(selectedProject.js);
                        compileAndRun(selectedProject.html, selectedProject.css, selectedProject.js);
                      }}
                      className="p-1.5 text-gray-500 hover:text-white rounded hover:bg-dark-hover transition-colors text-[10px] flex items-center gap-1 font-bold border border-dark-border"
                      title="Reset starter template"
                    >
                      <RefreshCw size={10} /> Reset Starter
                    </button>
                    <button
                      onClick={() => compileAndRun(htmlCode, cssCode, jsCode)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-colors shadow-glow"
                    >
                      <Play size={12} /> Run Code
                    </button>
                  </div>
                </div>

                {/* Editor Textarea */}
                <div className="flex-1 bg-dark-bg p-3 relative font-mono text-xs">
                  {editorTab === "html" && (
                    <textarea
                      value={htmlCode}
                      onChange={e => setHtmlCode(e.target.value)}
                      className="w-full h-full bg-transparent text-gray-200 outline-none resize-none font-mono text-xs leading-relaxed"
                      placeholder="Write HTML here..."
                    />
                  )}
                  {editorTab === "css" && (
                    <textarea
                      value={cssCode}
                      onChange={e => setCssCode(e.target.value)}
                      className="w-full h-full bg-transparent text-gray-200 outline-none resize-none font-mono text-xs leading-relaxed"
                      placeholder="Write CSS here..."
                    />
                  )}
                  {editorTab === "js" && (
                    <textarea
                      value={jsCode}
                      onChange={e => setJsCode(e.target.value)}
                      className="w-full h-full bg-transparent text-gray-200 outline-none resize-none font-mono text-xs leading-relaxed"
                      placeholder="Write JavaScript here..."
                    />
                  )}
                </div>
              </div>

              {/* Sandboxed Iframe Preview */}
              <div className="glass-card h-[260px] flex flex-col overflow-hidden">
                <div className="px-4 py-2 bg-dark-surface/50 border-b border-dark-border flex items-center justify-between text-xs font-bold text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Eye size={14} /> Live Interactive Sandbox
                  </span>
                  <span className="text-[10px] text-gray-500">Iframe Sandbox</span>
                </div>
                <div className="flex-1 bg-white relative">
                  {iframeSrcDoc ? (
                    <iframe
                      srcDoc={iframeSrcDoc}
                      title="Project Sandbox"
                      className="w-full h-full border-none"
                      sandbox="allow-scripts"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-dark-surface text-gray-500 text-xs font-medium">
                      Click &quot;Run Code&quot; to build and run the playground.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
