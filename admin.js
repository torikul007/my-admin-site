const repo = "YOUR_USERNAME/YOUR_REPO";
const token = "YOUR_NEW_TOKEN";

if (localStorage.getItem("role") !== "admin") {
  alert("Access denied");
  window.location.href = "index.html";
}

async function loadUsers() {
  const url = `https://api.github.com/repos/${repo}/contents/data/users.json`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json"
    }
  });

  const file = await res.json();
  const data = JSON.parse(atob(file.content || ""));

  const box = document.getElementById("users");
  box.innerHTML = "";

  data.users.forEach(u => {
    const div = document.createElement("div");
    div.style.border = "1px solid #ddd";
    div.style.padding = "10px";
    div.style.margin = "10px";

    div.innerHTML = `
      <b>Email:</b> ${u.email}<br>
      <b>Password:</b> ${u.password}<br>
      <b>Time:</b> ${u.time}
    `;

    box.appendChild(div);
  });
}

loadUsers();
