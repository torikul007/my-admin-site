const repo = "YOUR_USERNAME/YOUR_REPO";
const token = "YOUR_GITHUB_TOKEN";

// protect admin
if (localStorage.getItem("role") !== "admin") {
  alert("Access denied");
  window.location.href = "index.html";
}

async function loadUsers() {
  try {
    const url = `https://api.github.com/repos/${repo}/contents/data/users.json`;

    const res = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json"
      }
    });

    if (!res.ok) {
      throw new Error("GitHub API failed: " + res.status);
    }

    const file = await res.json();

    const data = JSON.parse(atob(file.content || ""));

    const box = document.getElementById("users");
    box.innerHTML = "";

    if (!data.users || data.users.length === 0) {
      box.innerHTML = "<p>No users found</p>";
      return;
    }

    data.users.forEach(u => {
      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <b>Email:</b> ${u.email}<br>
        <b>Password:</b> ${u.password}<br>
        <b>Time:</b> ${u.time}
      `;

      box.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    alert("Failed to load users. Check repo, token, or file path.");
  }
}

loadUsers();
