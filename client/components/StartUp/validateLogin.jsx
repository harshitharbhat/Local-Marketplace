export default function validateLogin(name, email, password) {
  let error = {};
  if (!name) {
  } else if (name.length < 4) {
    error.name = "Needs to be more than 4 characters";
  }
  if (!email) {
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    error.email = "Email address is invalid";
  }
  if (!password) {
    error.password = "Password is required";
  } else if (password.length < 5) {
    error.password = "Password needs to be more than 5 characters";
  }
  return error;
}