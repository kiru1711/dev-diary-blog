
const emojiSpan = document.getElementById('emoji');
const modeText = document.getElementById('mode-text');
const body = document.body;
const toggleBtn = document.getElementById('darkModeToggle');
function setTheme(theme) {
  if (theme === 'dark') {
    body.classList.add('dark');
    emojiSpan.textContent = '🌞';
    modeText.textContent = 'Light Mode';
  } else {
    body.classList.remove('dark');
    emojiSpan.textContent = '🌙';
    modeText.textContent = 'Dark Mode';
  }
  localStorage.setItem('theme', theme);
}

toggleBtn.addEventListener('click', () => {
  const currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
  setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

function copyLink() {
  navigator.clipboard.writeText("https://kiru1711.github.io/dev-diary-blog/");
  document.getElementById("copy-msg").textContent = "Link copied!";
  setTimeout(() => document.getElementById("copy-msg").textContent = "", 2000);
}

async function loadLCStats() {
  try {
    const res = await fetch("https://leetcode-stats-api.herokuapp.com/kiru1171");
    if (!res.ok) throw new Error("API is down");
    const data = await res.json();

    document.getElementById("totalSolved").innerText = data.totalSolved;
    document.getElementById("easySolved").innerText = data.easySolved;
    document.getElementById("mediumSolved").innerText = data.mediumSolved;
    document.getElementById("hardSolved").innerText = data.hardSolved;
    document.getElementById("ranking").innerText = `#${data.ranking}`;
  } catch (err) {
    document.getElementById("totalSolved").innerText = "N/A";
    document.getElementById("easySolved").innerText = "-";
    document.getElementById("mediumSolved").innerText = "-";
    document.getElementById("hardSolved").innerText = "-";
    document.getElementById("ranking").innerText = "Unavailable";
    console.error("LeetCode API fetch failed:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadLCStats);


async function loadRecentLeetCode() {
  try {
    const res = await fetch('leetcode.json?cache=' + new Date().getTime());
    const data = await res.json();
    console.log("Recent LeetCode Data:", data);

    const allDates = Object.keys(data).sort((a, b) => new Date(b) - new Date(a));
    const recentProblems = [];

    for (const date of allDates) {
      if (data[date]) {
        for (const title of data[date]) {
          recentProblems.push({ title, date });
          if (recentProblems.length === 3) break;
        }
      }
      if (recentProblems.length === 3) break;
    }

    const listEl = document.getElementById('leetcode-recent');
    listEl.innerHTML = "";
    if (recentProblems.length === 0) {
      listEl.innerHTML = "<p>No recent problems found.</p>";
      return;
    }

    const ul = document.createElement('ul');
    recentProblems.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.title} (${item.date})`;
      ul.appendChild(li);
    });
    listEl.appendChild(ul);
  } catch (err) {
    console.error("Error loading recent problems:", err);
  }
}

async function loadWeeklyChart() {
  try {
const res = await fetch('https://raw.githubusercontent.com/kiru1711/dev-diary-blog/main/leetcode.json?' + new Date().getTime());
    const data = await res.json();
    console.log("Recent LeetCode Data:", data);

    const today = new Date();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      last7Days.push(key);
    }

    const dailyCounts = last7Days.map(date => ({
      date,
      count: data[date] ? data[date].length : 0
    }));

    const ctx = document.getElementById('weekly-leetcode-chart').getContext('2d');
    document.getElementById('weekly-leetcode-chart').style.display = 'block';

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dailyCounts.map(item => item.date),
        datasets: [{
          label: 'Problems Solved',
          data: dailyCounts.map(item => item.count),
          backgroundColor: '#38bdf8'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            precision: 0
          }
        }
      }
    });
  } catch (err) {
    console.error("Error loading chart:", err);
  }
}

loadLCStats();
loadRecentLeetCode();
loadWeeklyChart();
