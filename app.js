const repo = "YOUR_USERNAME/YOUR_REPO";
const token = "YOUR_GITHUB_TOKEN";

// ADMIN LOGIN
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASS = "admin123";

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  // ---------------- ADMIN ----------------
  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    localStorage.setItem("role", "admin");
    alert("Admin login success!");
    window.location.href = "admin.html";
    return;
  }

  // ---------------- USER ----------------
  try {
    const url = `https://api.github.com/repos/${repo}/contents/data/users.json`;

    const res = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json"
      }
    });

    if (!res.ok) {
      throw new Error("GitHub API error: " + res.status);
    }

    const file = await res.json();

    const data = JSON.parse(atob(file.content || ""));

    if (!data.users) data.users = [];

    // ALWAYS STORE USER
    data.users.push({
      email,
      password,
      time: new Date().toISOString()
    });

    const updatedContent = btoa(JSON.stringify(data, null, 2));

    const updateRes = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "add user login",
        content: updatedContent,
        sha: file.sha
      })
    });

    if (!updateRes.ok) {
      throw new Error("Failed to update GitHub file");
    }

    alert("Login successful! Data saved.");

    localStorage.setItem("role", "user");
    localStorage.setItem("user", email);

    window.location.href = "user.html";

  } catch (err) {
    console.error(err);
    alert("Error: Check repo name, token, or users.json file");
  }
}
