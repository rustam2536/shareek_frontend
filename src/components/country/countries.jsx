import { useEffect, useState } from "react";
import Layout from "../layout/layout";
import { useLoader } from "../../context/loaderContext";
import api from "../../services/apiService";
import { toast } from "react-toastify";
import { imageUrl } from "../../enum/enum";

const Countries = () => {
    const { showLoader, hideLoader, loading } = useLoader();
    const [dataList, setData] = useState([]);

    const getData = async () => {
        if (loading) return;
        try {
            showLoader();
            const res = await api.get(`/api/countries/admin/list`);
            if (res.data.success) {
                setData(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching countries:", error);
            toast.error("Failed to fetch countries.");
        } finally {
            hideLoader();
        }
    };

    useEffect(() => {
        getData();
    }, []);

    // ✅ Toggle Country Availability
    const toggleAllowedStatus = async (uniqueId, currentStatus) => {
        try {
            showLoader();
            const res = await api.post(`/api/countries/admin/toggle`, {
                uniqueId: uniqueId,
                isAllowed: !currentStatus,
            });

            if (res.data.success) {
                toast.success("Country status updated successfully");
                getData();
            } else {
                toast.error("Failed to update status.");
            }
        } catch (error) {
            console.error("Error updating status:", error);
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
                                <h4 className="card-title text-uppercase">Countries</h4>
                            </div>

                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>#</th>
                                                <th>Icon</th>
                                                <th>Name</th>
                                                <th>Code</th>
                                                <th>ISO2 Code</th>
                                                <th>ISO Code</th>
                                                <th>Allowed</th>
                                                {/* <th>Actions</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataList?.length > 0 ? (
                                                dataList.map((country, index) => (
                                                    <tr key={country.uniqueId}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            {country.icon ? (
                                                                <img
                                                                    src={imageUrl + country.icon}
                                                                    alt={country.name}
                                                                    width="45"
                                                                    height="30"
                                                                    style={{ objectFit: "cover", borderRadius: "3px" }}
                                                                />
                                                            ) : (
                                                                <span className="text-muted">N/A</span>
                                                            )}
                                                        </td>
                                                        <td>{country.name}</td>
                                                        <td>{country.code}</td>
                                                        <td>{country.iso2code}</td>
                                                        <td>{country.isoCode}</td>
                                                        <td>
                                                            <label className="switch-cus">
                                                                <input
                                                                    className="input-cus"
                                                                    type="checkbox"
                                                                    checked={country.isAllowed}
                                                                    onChange={() => toggleAllowedStatus(country.uniqueId, country.isAllowed)}
                                                                    disabled={loading}
                                                                />
                                                                <span className="slider-cus"></span>
                                                            </label>
                                                            <div className="small text-muted mt-1 text-center">
                                                                {country.isAllowed ? "Allowed" : "Not Allowed"}
                                                            </div>
                                                        </td>
                                                        {/* <td> */}
                                                            {/* <button
                                                                className="btn btn-sm btn-danger"
                                                                title="Delete Country"
                                                                onClick={() => toast.info("Delete not implemented yet")}
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                            </button> */}
                                                        {/* </td> */}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={8} className="text-center text-muted">
                                                        No countries found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Countries;
