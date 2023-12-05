import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../src/axios-client";
import { useEffect, useState } from "react";
import { useStateContext } from "../src/contexts/ContextProvider";

export default function UserForm() {
    const { id } = useParams();
    const [user, setUser] = useState({
        id: null,
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate();
    const { setNotification } = useStateContext();

    if (id) {
        useEffect(() => {
            setLoading(true);
            axiosClient
                .get("/users/" + id)
                .then(({ data }) => {
                    setLoading(false);
                    setUser(data);
                })
                .catch(() => {
                    setLoading(false);
                });
        }, []);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (id) {
            setLoading(true);
            axiosClient
                .put("/users/" + id, user)
                .then(() => {
                    setLoading(false);
                    navigate("/users");
                    setNotification("User updated");
                })
                .catch((e) => {
                    const res = e.response;
                    setErrors(res.data.errors);
                    setLoading(false);
                });
        } else {
            setLoading(true);
            axiosClient
                .post("/users", user)
                .then(() => {
                    setLoading(false);
                    navigate("/users");
                    setNotification("User created");
                })
                .catch((e) => {
                    setLoading(false);
                    const res = e.response;
                    setErrors(res.data.errors);
                });
        }
    };

    return (
        <>
            {!id ? (
                <div>
                    <h1>New User</h1>
                </div>
            ) : (
                <div>
                    <h1> Update User : {user.name} </h1>
                </div>
            )}
            <div className="card animated fadeInDown">
                {loading && <div className="text-center">Loading...</div>}
                {errors && (
                    <div className="alert">
                        {Object.keys(errors).map((key) => (
                            <p key={key}> {errors[key][0]} </p>
                        ))}
                    </div>
                )}
                {!loading && (
                    <div>
                        <form onSubmit={onSubmit}>
                            <input
                                value={user.name}
                                placeholder="Name"
                                onChange={(e) =>
                                    setUser({ ...user, name: e.target.value })
                                }
                            />
                            <input
                                value={user.email}
                                placeholder="Email"
                                onChange={(e) =>
                                    setUser({ ...user, email: e.target.value })
                                }
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                onChange={(e) =>
                                    setUser({
                                        ...user,
                                        password: e.target.value,
                                    })
                                }
                            />
                            <input
                                type="password"
                                placeholder="Password Confirmation"
                                onChange={(e) =>
                                    setUser({
                                        ...user,
                                        password_confirmation: e.target.value,
                                    })
                                }
                            />
                            <button className="btn">Save</button>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}
