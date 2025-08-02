
  const toggleBtn = document.getElementById('darkModeToggle');
  const emojiSpan = document.getElementById('emoji');
  const modeText = document.getElementById('mode-text');
  const body = document.body;

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
    const link = 'https://kiru1711.github.io/dev-diary-blog/';
    navigator.clipboard.writeText(link).then(() => {
      document.getElementById("copy-msg").textContent = "Link copied to clipboard!";
      setTimeout(() => {
        document.getElementById("copy-msg").textContent = "";
      }, 3000);
    });
  }

  async function loadLCStats() {
    try {
      const res = await fetch("https://leetcode-stats-api.herokuapp.com/kiru1171");
      if (!res.ok) throw new Error("API is down");
      const data = await res.json();
      document.getElementById("leetcode-stats").innerHTML = `
        <ul class="space-y-1">
          <li>✅ <strong>Total Solved:</strong> ${data.totalSolved}</li>
          <li>🟢 Easy: ${data.easySolved} | 🟡 Medium: ${data.mediumSolved} | 🔴 Hard: ${data.hardSolved}</li>
          <li>🏆 Rank: #${data.ranking}</li>
        </ul>
      `;
    } catch (err) {
      document.getElementById("leetcode-stats").innerHTML = "<p>Unable to fetch stats 😓</p>";
    }
  }

  async function loadRecentLeetCode() {
    try {
      const res = await fetch('leetcode.json');
      const data = await res.json();

      const today = new Date();
      const recentDates = [];

      for (let i = 0; i < 3; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        recentDates.push(key);
      }

      const recentProblems = [];
      recentDates.forEach(date => {
        if (data[date]) {
          data[date].forEach(title => {
            recentProblems.push({ title, date });
          });
        }
      });

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
      const res = await fetch('leetcode.json');
      const data = await res.json();

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

  function copyLink() {
    const link = 'https://kiru1711.github.io/dev-diary-blog/';
    navigator.clipboard.writeText(link).then(() => {
      document.getElementById("copy-msg").textContent = "Link copied to clipboard!";
      setTimeout(() => {
        document.getElementById("copy-msg").textContent = "";
      }, 3000);
    });
  }



  function copyLink() {
    const link = 'https://kiru1711.github.io/dev-diary-blog/';
    navigator.clipboard.writeText(link).then(() => {
      document.getElementById("copy-msg").textContent = "Link copied to clipboard!";
      setTimeout(() => {
        document.getElementById("copy-msg").textContent = "";
      }, 3000);
    });
  }

