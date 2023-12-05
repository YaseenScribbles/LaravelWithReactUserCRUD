import { createRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../src/axios-client";
import { useStateContext } from "../src/contexts/ContextProvider";

export default function Login() {
    const emailRef = createRef();
    const passwordRef = createRef();
    const { setUser, setToken } = useStateContext();
    const [errors, setErrors] = useState(null);

    const onSubmit = (e) => {
        e.preventDefault();
        setErrors(null);
        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        axiosClient
            .post("/login", payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch((e) => {
                const response = e.response;
                console.log(response);
                if (response && response.status === 422) {
                    if (response.data.errors) {
                        setErrors(response.data.errors);
                    } else {
                        setErrors({
                            email: [response.data.message],
                        });
                    }
                }
            });
    };

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">Log into your account</h1>
                    {errors && (
                        <div className="alert">
                            {Object.keys(errors).map((key) => (
                                <p key={key}> {errors[key][0]}</p>
                            ))}
                        </div>
                    )}
                    <input ref={emailRef} placeholder="Email" type="email" />
                    <input
                        ref={passwordRef}
                        placeholder="Password"
                        type="password"
                    />
                    <button className="btn btn-block">Login</button>
                    <p className="message">
                        Not registered ?{" "}
                        <Link to="/signup"> Create an account</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
