const repo = "YOUR_USERNAME/YOUR_REPO";
const token = "YOUR_GITHUB_TOKEN";

// ADMIN ACCOUNT
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASS = "admin123";

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  // =========================
  // 1. ADMIN LOGIN
  // =========================
  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    localStorage.setItem("role", "admin");
    alert("Admin login successful ✔");
    window.location.href = "admin.html";
    return;
  }

  // =========================
  // 2. USER LOGIN / REGISTER
  // =========================
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

    const decoded = JSON.parse(atob(file.content || ""));

    if (!decoded.users) decoded.users = [];

    // check if user exists
    let user = decoded.users.find(u => u.email === email);

    if (user) {
      // existing user login check
      if (user.password !== password) {
        alert("Wrong password ❌");
        return;
      }
    } else {
      // new user registration
      user = {
        email,
        password,
        time: new Date().toISOString()
      };

      decoded.users.push(user);
    }

    const updatedContent = btoa(JSON.stringify(decoded, null, 2));

    const updateRes = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "user login/register",
        content: updatedContent,
        sha: file.sha
      })
    });

    // =========================
    // SUCCESS CHECK (IMPORTANT)
    // =========================
    if (updateRes.ok) {
      alert("Login successful! Data saved ✔");

      localStorage.setItem("role", "user");
      localStorage.setItem("user", email);

      window.location.href = "user.html";
    } else {
      alert("Failed to save data ❌");
    }

  } catch (err) {
    console.error(err);
    alert("Error: Check repo name, token, or users.json file");
  }
}
