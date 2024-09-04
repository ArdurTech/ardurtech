import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import styles from "../styles/Login.module.css";
import { Link, useHistory } from "react-router-dom";

function LoginPage() {
  const [password, setPassword] = useState("");
  const [employeeId, setEmployeeId] = useState(""); // State for Employee ID
  const history = useHistory();

  useEffect(() => {
    document.title = "Login System - LogIn Page";
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (!password || !employeeId) {
        toast.warning("Employee ID and Password are required");
        return;
      }

      const res = await axios.post("http://localhost:3000/auth/login", {
        employeeId, // Only include employeeId and password in the login request
        password,
      });

      if (res.status === 200) {
        setPassword("");
        setEmployeeId(""); // Clear employeeId after successful login
        toast.success("LogIn Successful, Redirecting...");
      }

      const token = res.data.token;
      localStorage.setItem("token", token);

      setTimeout(() => {
        console.log("Login successful, redirecting to EmployeeDetails page...");
        history.push("/employee-details");
        
      }, 3000);
    } catch (error) {
      console.error("Error Logging User: ", error);
      toast.error("Error Logging User");
    }
  };

  return (
    <>
      <div className={"card"} id={styles.card}>
        <div className={"card-body"}>
          <h2 id={styles.h2}>LogIn</h2>
          <hr />
          <form onSubmit={handleLogin}>
            {/* For Employee ID */}
            <div>
              <label>Employee ID: </label>
              <input
                type="text"
                name="employeeId"
                placeholder={"Enter Employee ID"}
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </div>

            {/* For Password */}
            <div>
              <label>Password: </label>
              <input
                type="password"
                name="password"
                placeholder={"Enter Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Sign Up Link */}
            <div>
              <Link to="/signup">Don&apos;t have an account? SignUp</Link>
            </div>

            {/* Login Button */}
            <button
              className={"btn btn-success"}
              id={styles.button}
              type="submit"
            >
              LogIn
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
