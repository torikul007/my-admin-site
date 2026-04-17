const repo = "YOUR_USERNAME/YOUR_REPO";
const token = "YOUR_GITHUB_TOKEN";

async function loadUsers() {
  const res = await fetch(`https://api.github.com/repos/${repo}/contents/data/users.json`, {
    headers: {
      Authorization: `token ${token}`
    }
  });

  const data = await res.json();
  const content = atob(data.content);
  const json = JSON.parse(content);

  const container = document.getElementById("users");
  container.innerHTML = "";

  json.users.forEach(u => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <b>Email:</b> ${u.email}<br>
      <b>Password:</b> ${u.password}<br>
      <b>Time:</b> ${u.time}
    `;
    container.appendChild(div);
  });
}
