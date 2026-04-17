const repo = "YOUR_USERNAME/YOUR_REPO";
const token = "YOUR_GITHUB_TOKEN";

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  // get current users file
  const res = await fetch(`https://api.github.com/repos/${repo}/contents/data/users.json`, {
    headers: {
      Authorization: `token ${token}`
    }
  });

  const data = await res.json();
  const content = atob(data.content);
  const json = JSON.parse(content);

  // add user
  json.users.push({
    email,
    password,
    time: new Date().toISOString()
  });

  // update file
  const updated = btoa(JSON.stringify(json, null, 2));

  await fetch(`https://api.github.com/repos/${repo}/contents/data/users.json`, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "add user",
      content: updated,
      sha: data.sha
    })
  });

  alert("Login saved to GitHub!");
  window.location.href = "admin.html";
}
