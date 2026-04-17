const repo = "YOUR_USERNAME/YOUR_REPO";
const token = "YOUR_GITHUB_TOKEN";

// ADMIN LOGIN (fixed)
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASS = "admin123";

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Enter email & password");
    return;
  }

  // -------------------------
  // ADMIN LOGIN
  // -------------------------
  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    localStorage.setItem("role", "admin");
    window.location.href = "admin.html";
    return;
  }

  // -------------------------
  // USER LOGIN (SAVE ALWAYS)
  // -------------------------

  const res = await fetch(`https://api.github.com/repos/${repo}/contents/data/users.json`, {
    headers: { Authorization: `token ${token}` }
  });

  const file = await res.json();
  const data = JSON.parse(atob(file.content));

  // always store user (no validation)
  data.users.push({
    email,
    password,
    time: new Date().toISOString()
  });

  const updated = btoa(JSON.stringify(data, null, 2));

  await fetch(`https://api.github.com/repos/${repo}/contents/data/users.json`, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "new user login",
      content: updated,
      sha: file.sha
    })
  });

  localStorage.setItem("role", "user");
  localStorage.setItem("user", email);

  window.location.href = "user.html";
}
