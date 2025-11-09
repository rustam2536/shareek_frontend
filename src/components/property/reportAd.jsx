import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../layout/layout";
import { useLoader } from "../../context/loaderContext";
import api from "../../services/apiService";
import { toast } from "react-toastify";

const USERS_PER_PAGE = 10;

const ReportAd = () => {
    const { showLoader, hideLoader, loading } = useLoader();

    const [dataList, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    const totalPages = Math.ceil(totalCount / USERS_PER_PAGE);

    const getData = async (pageNum = 1) => {
        if (loading) return;
        try {
            showLoader();
            const res = await api.get(`/api/report/admin/list?page=${pageNum}&searchTerm=${searchTerm}`);
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

    return (
        <Layout>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="card-title text-uppercase">Report Ad</h4>
                                <div className="d-flex">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by user Id, property Id..."
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
                                                <th>Id</th>
                                                <th>Reported By</th>
                                                <th>Reported By (Id)</th>
                                                <th>Property Id</th>
                                                <th>Remarks</th>
                                                <th>Report Type</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataList?.length > 0 ? (
                                                dataList.map((user, index) => (
                                                    <tr key={user.uniqueId}>
                                                        <td>{(page - 1) * USERS_PER_PAGE + index + 1}</td>
                                                        <td>{user.uniqueId}</td>
                                                        <td>{user.userName}</td>
                                                        <td>{user.userId}</td>
                                                        <td>
                                                            <div>
                                                                <Link to={"/property_details"} state={{ uniqueId: user.propertyId }}>
                                                                    {user.propertyId}
                                                                </Link>
                                                            </div>
                                                            <div>
                                                                <Link to={"/property_details"} state={{ uniqueId: user.propertyId }}>
                                                                    <i className="mdi mdi-link"></i>
                                                                </Link>
                                                            </div>

                                                        </td>
                                                        <td>{user.remark}</td>
                                                        <td>{user.option}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={8} className="text-center text-muted">
                                                        No data found.
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
                {modalMessage && (
                    <div className="modal fade show" aria-setsize={"lg"} style={{ display: 'block' }} tabIndex="-1">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content" style={{ maxWidth: "unset" }}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Chats</h5>
                                    <button type="button" className="btn-close" onClick={() => setModalMessage("")}></button>
                                </div>
                                <div className="modal-body">
                                    <p style={{ overflow: "auto", maxHeight: "400px" }}>{modalMessage}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ReportAd;
