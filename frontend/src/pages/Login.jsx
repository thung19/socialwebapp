import Form from "../components/Form"
import { Link } from "react-router-dom"



// Login page using the Form component with login-specific props
function Login() {
    //Renders the Form component with the appropriate route and method for login
    return (
        <>
            <Form route="/api/token/" method="login" />
            <p>
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </>
    )
}

export default Login