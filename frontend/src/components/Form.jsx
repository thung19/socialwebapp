import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css"
import LoadingIndicator from "./LoadingIndicator";

//Form component for both login and registration
//Takes a route prop to determine where to send the form data
//Takes a method prop to determine if it's for login or registration
function Form({ route, method }) {
    //State for form inputs and loading status
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    //Navigation hook to redirect after successful login/registration
    const navigate = useNavigate();
    
    //Check to see if method is login. If yes --> Login. Else --> Register
    const name = method === "login" ? "Login" : "Register";
    

    //Handle form submission. Allows for awaiting the API response
    const handleSubmit = async (e) => {
        //Set loading to true to show the loading indicator
        setLoading(true);
        //Prevent default form submission behavior
        e.preventDefault();

        //
        try {
            //Send a POST request to the specified route with username and password
            const res = await api.post(route, { username, password })
            //If this is a login...
            if (method === "login") {
                //Store the access and refresh tokens in localStorage
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

                //Navigate to the home page after successful login
                navigate("/")
            } else {

                //If it wasn't a login, navigate to login page (register)
                navigate("/login")
            }
        } catch (error) {
            //Catch any errors
            alert(error)
        } finally {
            setLoading(false)
        }
    };

    return (
        //Make an html form
        //When form is submitted call handljue submit that was defined
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit">
                {name}
            </button>
        </form>
    );
}

export default Form