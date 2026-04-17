const repo = "YOUR_USERNAME/YOUR_REPO";
const token = "YOUR_GITHUB_TOKEN";

// protect admin
if (localStorage.getItem("role") !== "admin") {
  alert("Access denied");
  window.location.href = "index.html";
}

async function loadUsers() {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/data/users.json`, {
      headers: { Authorization: `token ${token}` }
    });

    const file = await res.json();

    // IMPORTANT FIX 👇
    const decoded = atob(file.content);
    const data = JSON.parse(decoded);

    const box = document.getElementById("users");
    box.innerHTML = "";

    if (!data.users || data.users.length === 0) {
      box.innerHTML = "<p>No users found</p>";
      return;
    }

    data.users.forEach(u => {
      const div = document.createElement("div");
      div.style.border = "1px solid #ddd";
      div.style.margin = "10px";
      div.style.padding = "10px";

      div.innerHTML = `
        <b>Email:</b> ${u.email}<br>
        <b>Password:</b> ${u.password}<br>
        <b>Time:</b> ${u.time}
      `;

      box.appendChild(div);
    });

  } catch (err) {
    console.log(err);
    alert("Failed to load data. Check token or repo.");
  }
}

loadUsers();
