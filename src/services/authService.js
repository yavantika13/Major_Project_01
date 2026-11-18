
export const registerUser = (name, email, password) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const existingUser = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    return {
      success: false,
      message: "Email already registered!"
    };
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    photo: ""
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  return {
    success: true,
    message: "Registration successful!"
  };
};


export const loginUser = (email, password) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.password === password
  );

  if (!user) {
    return {
      success: false,
      message: "Invalid email or password!"
    };
  }

  const currentUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    photo: user.photo || ""
  };

  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  return {
    success: true,
    user: currentUser
  };
};


export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("currentUser"));
};


export const logoutUser = () => {
  localStorage.removeItem("currentUser");
};


export const updateUserPhoto = (userId, photo) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const updatedUsers = users.map((user) =>
    user.id === userId ? { ...user, photo } : user
  );

  localStorage.setItem("users", JSON.stringify(updatedUsers));

  const currentUser = getCurrentUser();

  if (currentUser && currentUser.id === userId) {
    const updatedCurrentUser = {
      ...currentUser,
      photo
    };

    localStorage.setItem(
      "currentUser",
      JSON.stringify(updatedCurrentUser)
    );

    return true;
  }

  return false;
};
