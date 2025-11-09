import { useEffect, useState } from "react";
import Layout from "../layout/layout";
import { useLoader } from "../../context/loaderContext";
import api from "../../services/apiService";
import { toast } from "react-toastify";

const USERS_PER_PAGE = 10;

const Notification = () => {
    const { showLoader, hideLoader } = useLoader();

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [topic, setTopic] = useState("");
    const [title, setTitle] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [body, setBody] = useState("");
    const [tab, setTab] = useState("topic");
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(totalCount / USERS_PER_PAGE);

    useEffect(() => {
        fetchUsers();
        fetchHistory();
    }, []);

    const fetchUsers = async () => {
        try {
            showLoader();
            const response = await api.get("/api/users/admin/users_phone");
            setUsers(response.data?.data || []);
        } catch (error) {
            toast.error("Failed to fetch users.");
        } finally {
            hideLoader();
        }
    };

    const fetchHistory = async (page = 1) => {
        try {
            const response = await api.get(`/api/notification/admin/list?page=${page}`);
            setHistory(response.data?.data?.data || []);
            setTotalCount(response.data.data.totalCount);
        } catch (error) {
            toast.error("Failed to fetch notification history.");
        }
    };

    const handlePrev = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage((prev) => prev + 1);
    };

    const handleSendNotification = async () => {
        try {
            if (!title.trim()) return toast.error("Title is required.");
            if (!body.trim()) return toast.error("Body is required.");

            showLoader();

            let payload;
            let endpoint = "";

            switch (tab) {
                case "single":
                    if (!selectedUser) return toast.error("Please select a user.");
                    payload = { receiverId: selectedUser, title, body };
                    endpoint = "/api/notification/send";
                    break;
                case "multiple":
                    if (!selectedUsers.length) return toast.error("Please select at least one user.");
                    payload = { receiverIds: selectedUsers, title, body };
                    endpoint = "/api/notification/send-multiple";
                    break;
                case "topic":
                    // if (!topic.trim()) return toast.error("Topic is required.");
                    payload = { title, body };
                    endpoint = "/api/notification/send-topic";
                    break;
                default:
                    return;
            }

            await api.post(endpoint, payload);

            toast.success("Notification sent successfully!");
            setTitle("");
            setBody("");
            setSelectedUser("");
            setSelectedUsers([]);
            setTopic("");
            fetchHistory();
        } catch (error) {
            console.error(error);
            toast.error("Failed to send notification.");
        } finally {
            hideLoader();
        }
    };

    useEffect(() => {
        fetchHistory(page);
    }, [page]);

    return (
        <Layout>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="col-xl-12">
                        {/* Notification Form */}
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="card-title text-uppercase">Notification</h4>
                            </div>

                            <div className="card-body">
                                {/* Tabs */}
                                <ul className="nav nav-tabs mb-3">
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${tab === "topic" ? "active" : ""}`}
                                            onClick={() => setTab("topic")}
                                        >
                                            Send To ALL
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${tab === "single" ? "active" : ""}`}
                                            onClick={() => setTab("single")}
                                        >
                                            Send Single
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${tab === "multiple" ? "active" : ""}`}
                                            onClick={() => setTab("multiple")}
                                        >
                                            Send Multiple
                                        </button>
                                    </li>
                                </ul>

                                {/* Tab Content */}
                                {tab === "single" && (
                                    <div>
                                        <label>Select User:</label>
                                        <select
                                            className="form-control mb-3"
                                            value={selectedUser}
                                            onChange={(e) => setSelectedUser(e.target.value)}
                                        >
                                            <option value="">-- Select User --</option>
                                            {users?.map((user) => (
                                                <option key={user?.phone} value={user?.uniqueId}>
                                                    {user?.phone}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {tab === "multiple" && (
                                    <div>
                                        <label>Select Users:</label>
                                        <select
                                            multiple
                                            className="form-control mb-3"
                                            value={selectedUsers}
                                            onChange={(e) => {
                                                const selected = Array.from(
                                                    e.target.selectedOptions,
                                                    (opt) => opt.value
                                                );
                                                setSelectedUsers(selected);
                                            }}
                                        >
                                            {users?.map((user) => (
                                                <option key={user?.phone} value={user?.uniqueId}>
                                                    {user?.phone}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* {tab === "topic" && (
                                    <div>
                                        <label>Enter Topic:</label>
                                        <input
                                            type="text"
                                            className="form-control mb-3"
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            placeholder="Enter topic name"
                                        />
                                    </div>
                                )} */}

                                {/* Title Input */}
                                <div className="mb-3">
                                    <label>Title:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter notification title"
                                    />
                                </div>

                                {/* Body Input */}
                                <div className="mb-3">
                                    <label>Body:</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                        placeholder="Type your message here"
                                    />
                                </div>

                                <button
                                    className="btn btn-primary"
                                    onClick={handleSendNotification}
                                >
                                    Send Notification
                                </button>
                            </div>
                        </div>

                        {/* Notification History */}
                        <div className="card mt-4">
                            <div className="card-header">
                                <h5>Notification History</h5>
                            </div>
                            <div className="card-body">
                                {history.length === 0 ? (
                                    <p>No notifications sent yet.</p>
                                ) : (
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Type</th>
                                                <th>Recipient(s)</th>
                                                <th>Title</th>
                                                <th>Body</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {history.map((item, index) => (
                                                <tr key={item.id || index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.type}</td>
                                                    <td>
                                                        {item.type === "topic"
                                                            ? item.topic
                                                            : Array.isArray(item.recipients)
                                                                ? item.recipients.join(", ")
                                                                : item.recipient}
                                                        {
                                                            item.userId}
                                                    </td>
                                                    <td>{item.title}</td>
                                                    <td>{item.body}</td>
                                                    <td>
                                                        {item.createdAt
                                                            ? new Date(item.createdAt).toLocaleString()
                                                            : new Date(item.date).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="d-flex justify-content-center align-items-center mt-3">
                                        <button
                                            className="btn btn-outline-primary mx-2 py-1"
                                            disabled={page === 1}
                                            onClick={handlePrev}
                                        >
                                            Previous
                                        </button>
                                        <span>Page {page} of {totalPages}</span>
                                        <button
                                            className="btn btn-outline-primary mx-2 py-1"
                                            disabled={page === totalPages}
                                            onClick={handleNext}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Notification;
