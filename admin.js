const repo = "YOUR_USERNAME/YOUR_REPO";
const token = "YOUR_GITHUB_TOKEN";

// protect admin page
if (localStorage.getItem("role") !== "admin") {
  alert("Access denied!");
  window.location.href = "index.html";
}

async function loadUsers() {
  const res = await fetch(`https://api.github.com/repos/${repo}/contents/data/users.json`, {
    headers: { Authorization: `token ${token}` }
  });

  const file = await res.json();
  const data = JSON.parse(atob(file.content));

  const container = document.getElementById("users");
  container.innerHTML = "";

  data.users.forEach(u => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <b>Email:</b> ${u.email}<br>
      <b>Password:</b> ${u.password}<br>
      <b>Time:</b> ${u.time}
    `;

    container.appendChild(div);
  });
}

loadUsers();
