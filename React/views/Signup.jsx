import { createRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../src/axios-client";
import { useStateContext } from "../src/contexts/ContextProvider";

export default function Signup() {
    const { setUser, setToken } = useStateContext();
    const [errors, setErrors] = useState(null);

    const onSubmit = (e) => {
        e.preventDefault();
        setErrors(null);
        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmationRef.current.value,
        };

        axiosClient
            .post("/signup", payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch((error) => {
                const res = error.response;
                console.log(res);
                if (res && res.status === 422) {
                    setErrors(res.data.errors);
                }
            });
    };

    const nameRef = createRef();
    const emailRef = createRef();
    const passwordRef = createRef();
    const passwordConfirmationRef = createRef();

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">Create your account</h1>
                    {errors && (
                        <div className="alert">
                            {Object.keys(errors).map((key) => (
                                <p key={key}> {errors[key][0]} </p>
                            ))}
                        </div>
                    )}
                    <input ref={nameRef} placeholder="Name" type="text" />
                    <input ref={emailRef} placeholder="Email" type="email" />
                    <input
                        ref={passwordRef}
                        placeholder="Password"
                        type="password"
                    />
                    <input
                        ref={passwordConfirmationRef}
                        placeholder="Confirm Password"
                        type="password"
                    />
                    <button className="btn btn-block">Register</button>
                    <p className="message">
                        Already registered ?
                        <Link to="/login"> Go to Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
