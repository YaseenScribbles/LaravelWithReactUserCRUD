import { useEffect, useState } from "react";
import axiosClient from "../src/axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../src/contexts/ContextProvider";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();
    const [meta, setMeta] = useState({});

    useEffect(() => {
        getUsers(1);
    }, []);

    const getUsers = ( pageNo = 1) => {
        setLoading(true);
        axiosClient
            .get("/users?page=" + pageNo)
            .then(({ data }) => {
                setLoading(false);
                setUsers(data.data);
                setMeta(data.meta);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    };

    const deleteUser = (user) => {
        if (!window.confirm("Are you sure?")) {
            return;
        }

        axiosClient.delete("/users/" + user.id).then(() => {
            getUsers();
            setNotification("User deleted");
        });
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1>Users</h1>
                <Link to={"/users/new"} className="btn-add">
                    {" "}
                    Add new
                </Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Created Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading ? (
                        <tbody>
                            <tr>
                                <td colSpan="5" className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            {users.map((user) => {
                                return (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.created_at}</td>
                                        <td>
                                            <Link
                                                to={"/users/" + user.id}
                                                className="btn-edit"
                                            >
                                                Edit{" "}
                                            </Link>
                                            &nbsp;
                                            <button
                                                onClick={() => deleteUser(user)}
                                                className="btn-delete"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    )}
                </table>
                {meta.links && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <p>{`Total Rows : ${meta.total}`}</p>
                        <div>
                            {meta.links.map((link) => {
                                return (
                                    <button
                                        key={link.label}
                                        onClick={() => getUsers(+link.label)}
                                    >
                                        {link.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
