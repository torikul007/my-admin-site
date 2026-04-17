const repo = "YOUR_USERNAME/YOUR_REPO";
const token = "YOUR_GITHUB_TOKEN";

// ADMIN ACCOUNT (you define this)
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASS = "admin123";

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  // -------------------------
  // 1. ADMIN LOGIN CHECK
  // -------------------------
  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    alert("Admin login success!");
    localStorage.setItem("role", "admin");
    window.location.href = "admin.html";
    return;
  }

  // -------------------------
  // 2. NORMAL USER FLOW
  // -------------------------
  const res = await fetch(`https://api.github.com/repos/${repo}/contents/data/users.json`, {
    headers: { Authorization: `token ${token}` }
  });

  const file = await res.json();
  const data = JSON.parse(atob(file.content));

  let users = data.users;

  // check user exists
  let existing = users.find(u => u.email === email);

  if (existing) {
    if (existing.password === password) {
      alert("User login success!");
    } else {
      alert("Wrong password!");
      return;
    }
  } else {
    users.push({
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
        message: "add user",
        content: updated,
        sha: file.sha
      })
    });

    alert("User registered & login success!");
  }

  localStorage.setItem("role", "user");
  localStorage.setItem("user", email);

  window.location.href = "user.html";
}
