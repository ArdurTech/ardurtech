import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import styles from "../styles/Signup.module.css";
import { Link, useHistory } from "react-router-dom";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const history = useHistory();

  useEffect(() => {
    document.title = "Login System - SignUp Page";
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault(); // Disables the reload on submission

    try {
      if (!username || !email || !password || !confirmPassword) {
        toast.warning("All Fields are Required");
        return;
      }

      if (password !== confirmPassword) {
        toast.warning("Passwords do not match");
        return;
      }

      const res = await axios.post("http://localhost:3000/auth/signup", {
        username,
        email,
        password,
      });

      if (res.status === 201) {
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        toast.success("Registration successful! Redirecting...");
        setTimeout(() => {
          history.push("/login-page");
        }, 3000);
      }
    }
       catch (error) {
        if (error.response && error.response.status === 400) {
          // Handle user already exists error
          toast.error("User already exists with this email or username");
        } else {
          // Handle other errors
          console.error("Error Creating User: ", error);
          toast.error("Error Creating User");
    }
  }
  };
  return (
    <>
      <div className={"card"} id={styles.card}>
        <div className={"card-body"}>
          <h2 id={styles.h2}>SignUp</h2>
          <hr />
          <form onSubmit={handleSignup}>
            <div>
              <label>Username: </label>
              <input
                type="text"
                name="username"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label>Email: </label>
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label>Password: </label>
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label>Confirm Password: </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div>
              <Link to="/login-page">Have an account? Log In</Link>
            </div>

            <button className={"btn btn-success"} type="submit">
              SignUp
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignupPage;
