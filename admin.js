const repo = "YOUR_USERNAME/YOUR_REPO";
const token = "YOUR_GITHUB_TOKEN";

// admin protection
if (localStorage.getItem("role") !== "admin") {
  alert("Access denied");
  window.location.href = "index.html";
}

async function loadUsers() {
  const url = `https://api.github.com/repos/${repo}/contents/data/users.json`;

  const res = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json"
    }
  });

  const file = await res.json();
  const data = JSON.parse(atob(file.content || ""));

  const box = document.getElementById("users");
  box.innerHTML = "";

  data.users.forEach((u, index) => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <b>Email:</b> ${u.email}<br>
      <b>Password:</b> ${u.password}<br>
      <b>Time:</b> ${u.time}<br>
      <button onclick="deleteUser(${index})">Delete</button>
    `;

    box.appendChild(div);
  });
}

// DELETE USER (PRO FEATURE)
async function deleteUser(index) {
  const url = `https://api.github.com/repos/${repo}/contents/data/users.json`;

  const res = await fetch(url, {
    headers: {
      Authorization: `token ${token}`
    }
  });

  const file = await res.json();
  const data = JSON.parse(atob(file.content));

  data.users.splice(index, 1);

  const updated = btoa(JSON.stringify(data, null, 2));

  await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "delete user",
      content: updated,
      sha: file.sha
    })
  });

  loadUsers();
}

loadUsers();
