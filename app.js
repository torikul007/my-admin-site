const repo = "YOUR_USERNAME/YOUR_REPO";
const token = "YOUR_NEW_TOKEN"; // ⚠️ must be NEW token

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASS = "admin123";

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  // ================= ADMIN LOGIN =================
  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    localStorage.setItem("role", "admin");
    alert("Admin login success ✔");
    window.location.href = "admin.html";
    return;
  }

  const url = `https://api.github.com/repos/${repo}/contents/data/users.json`;

  try {
    // GET FILE
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json"
      }
    });

    if (!res.ok) {
      alert("GitHub error (GET): " + res.status);
      return;
    }

    const file = await res.json();
    const data = JSON.parse(atob(file.content || ""));

    if (!data.users) data.users = [];

    // check user
    let user = data.users.find(u => u.email === email);

    if (user) {
      if (user.password !== password) {
        alert("Wrong password ❌");
        return;
      }
    } else {
      data.users.push({
        email,
        password,
        time: new Date().toISOString()
      });
    }

    const updated = btoa(JSON.stringify(data, null, 2));

    // UPDATE FILE
    const updateRes = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "update users",
        content: updated,
        sha: file.sha
      })
    });

    if (!updateRes.ok) {
      alert("GitHub error (UPDATE): " + updateRes.status);
      return;
    }

    alert("Login successful ✔ Data saved");

    localStorage.setItem("role", "user");
    localStorage.setItem("user", email);

    window.location.href = "user.html";

  } catch (err) {
    console.error(err);
    alert("Network / Token error. Check repo + token + permissions.");
  }
}
