const repo = "YOUR_USERNAME/YOUR_REPO";
const token = "YOUR_GITHUB_TOKEN";

// ADMIN LOGIN
const ADMIN = {
  email: "admin@gmail.com",
  password: "admin123"
};

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  // ADMIN CHECK
  if (email === ADMIN.email && password === ADMIN.password) {
    localStorage.setItem("role", "admin");
    alert("Admin login successful");
    window.location.href = "admin.html";
    return;
  }

  const url = `https://api.github.com/repos/${repo}/contents/data/users.json`;

  const res = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json"
    }
  });

  const file = await res.json();
  const data = JSON.parse(atob(file.content || ""));

  if (!data.users) data.users = [];

  // CHECK EXISTING USER
  let user = data.users.find(u => u.email === email);

  if (user) {
    if (user.password !== password) {
      alert("Wrong password");
      return;
    }
  } else {
    user = {
      email,
      password,
      time: new Date().toISOString()
    };
    data.users.push(user);
  }

  const updated = btoa(JSON.stringify(data, null, 2));

  await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "update users",
      content: updated,
      sha: file.sha
    })
  });

  alert("Login successful ✔");

  localStorage.setItem("role", "user");
  localStorage.setItem("user", email);

  window.location.href = "user.html";
}
