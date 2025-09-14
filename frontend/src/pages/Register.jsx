import Form from "../components/Form"
import { Link } from "react-router-dom"


function Register() {
    //Renders a registration form component. Tells form to send data to the specified route.
    return (
        <>
          <Form route="/api/user/register/" method="register" />
          <p style={{ marginTop: 12 }}>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </>
      )
}

export default Register