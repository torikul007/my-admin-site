const repo = "YOUR_USERNAME/YOUR_REPO";
const token = "YOUR_GITHUB_TOKEN";

// ADMIN ACCOUNT
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASS = "admin123";

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  // ---------------- ADMIN LOGIN ----------------
  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    localStorage.setItem("role", "admin");
    alert("Admin login successful!");
    window.location.href = "admin.html";
    return;
  }

  // ---------------- USER LOGIN ----------------
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/data/users.json`, {
      headers: {
        Authorization: `token ${token}`
      }
    });

    const file = await res.json();

    const decoded = JSON.parse(atob(file.content));

    if (!decoded.users) decoded.users = [];

    // ALWAYS STORE USER
    decoded.users.push({
      email,
      password,
      time: new Date().toISOString()
    });

    const updatedContent = btoa(JSON.stringify(decoded, null, 2));

    await fetch(`https://api.github.com/repos/${repo}/contents/data/users.json`, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "new user login",
        content: updatedContent,
        sha: file.sha
      })
    });

    // SUCCESS POPUP
    alert("Login successful! Data saved.");

    localStorage.setItem("role", "user");
    localStorage.setItem("user", email);

    window.location.href = "user.html";

  } catch (err) {
    console.log(err);
    alert("Error connecting to GitHub. Check token/repo.");
  }
}
