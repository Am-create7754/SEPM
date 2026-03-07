export function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

export function loginUser(email, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    (u) =>
      u.email === email &&
      u.password === password
  );

  if (!user) return false;

  localStorage.setItem("user", JSON.stringify(user));
  return true;
}


export function signupUser(name, email, password, role) {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const exists = users.find((u) => u.email === email);
  if (exists) return false;

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role, // 🔥 important
  };

  localStorage.setItem("users", JSON.stringify([...users, newUser]));
  return true;
}

export function logoutUser() {
  localStorage.removeItem("user");
}
