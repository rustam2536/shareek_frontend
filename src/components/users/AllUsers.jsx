import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../layout/layout";
import { useLoader } from "../../context/loaderContext";
import api from "../../services/apiService";
import { toast } from "react-toastify";

const USERS_PER_PAGE = 10;

const AllUsers = () => {
    const { showLoader, hideLoader, loading } = useLoader();

    const [dataList, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchInput, setSearchInput] = useState("");

    const totalPages = Math.ceil(totalCount / USERS_PER_PAGE);

    const getData = async (pageNum = 1) => {
        if (loading) return;
        try {
            showLoader();
            const res = await api.get(`/api/users/admin/all_users?page=${pageNum}&searchTerm=${searchTerm}`);
            if (res.data.success) {
                setData(res.data.data.data);
                setTotalCount(res.data.data.totalCount);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            hideLoader();
        }
    };

    useEffect(() => {
        getData(page);
    }, [page, searchTerm]);

    const handleSearch = () => {
        setPage(1);
        setSearchTerm(searchInput);
    };

    const handlePrev = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage((prev) => prev + 1);
    };

    // 🔥 Toggle Block Status
    const toggleBlockStatus = async (userId, currentStatus) => {
        try {
            showLoader();
            const res = await api.post(`/api/users/admin/block`, {
                userId: userId,
                block: !currentStatus,
            });

            if (res.data.success) {
                // Option 1: Refresh data from server
                getData(page);

                // Option 2 (faster): Optimistically update local list
                // setData((prev) =>
                //     prev.map((user) =>
                //         user.uniqueId === userId ? { ...user, blocked: !currentStatus } : user
                //     )
                // );
                hideLoader();

                toast.success(`User ${!currentStatus ? "blocked" : "unblocked"} successfully`);
            } else {
                toast.error("Failed to update block status.");
            }
        } catch (error) {
            console.error("Error updating block status:", error);
            toast.error("Something went wrong.");
        } finally {
            hideLoader();
        }
    };

    return (
        <Layout>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="card-title text-uppercase">All Users</h4>
                                <div className="d-flex">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by name, email, phone..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                    />
                                    <button className="btn btn-primary mx-2" type="button" onClick={handleSearch}>
                                        Search
                                    </button>
                                </div>
                            </div>

                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead className="table-light">
                                            <tr>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Status</th>
                                                <th>Verified</th>
                                                <th>Blocked</th>
                                                <th>Ad Id</th>
                                                <th>Ad Expiry</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataList?.length > 0 ? (
                                                dataList.map((user, index) => (
                                                    <tr key={user.uniqueId}>
                                                        <td>{(page - 1) * USERS_PER_PAGE + index + 1}</td>
                                                        <td>{user.name}</td>
                                                        <td>{user.email}</td>
                                                        <td>{user.countryCode} {user.phone}</td>
                                                        <td>
                                                            <span className={`badge ${user.status ? 'bg-success' : 'bg-secondary'}`}>
                                                                {user.status ? "Active" : "Inactive"}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${user.isVerified ? 'bg-success' : 'bg-warning'}`}>
                                                                {user.isVerified ? "Verified" : "Not Verified"}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <label className="switch-cus">
                                                                <input
                                                                    className="input-cus"
                                                                    type="checkbox"
                                                                    checked={user.blocked}
                                                                    onChange={() => toggleBlockStatus(user.uniqueId, user.blocked)}
                                                                    disabled={loading}
                                                                />
                                                                <span className="slider-cus"></span>
                                                            </label>
                                                            <div className="small text-muted mt-1 text-center">
                                                                {user.blocked ? "Blocked" : "UnBlocked"}
                                                            </div>
                                                        </td>
                                                        <td>{user.adId}</td>
                                                        <td>{user.expiryDate}</td>
                                                        <td>
                                                            <i className="fa fa-trash"></i>
                                                            {/* <Link to="/user-details" state={{ uniqueId: user.uniqueId }}>
                                                                <button className="btn btn-sm btn-info">View</button>
                                                            </Link> */}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={8} className="text-center text-muted">
                                                        No users found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

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

export default AllUsers;
