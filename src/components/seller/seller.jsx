import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { imageUrl } from "../../enum/enum";
import Layout from "../layout/layout";
import { useLoader } from "../../context/loaderContext";
import api from "../../services/apiService";

const Seller = () => {
    const { showLoader, hideLoader, loading } = useLoader();

    const [sellerInfo, setSellerInfo] = useState(null);
    const [properties, setProperties] = useState([]);

    // Fetch seller & property data
    const getSellerData = async (uniqueId) => {
        if (!uniqueId) return;

        try {
            showLoader();
            const res = await api.get(`/api/users/admin/owner_profile?uniqueId=${uniqueId}`);
            if (res.data.success) {
                const { profile, name, createdAt, isVerified, properties } = res.data.data;
                setSellerInfo({ profile, name, createdAt, isVerified });
                setProperties(properties || []);
            } else {
                setSellerInfo(null);
                setProperties([]);
            }
        } catch (error) {
            console.error("Error fetching seller:", error);
            setSellerInfo(null);
            setProperties([]);
        } finally {
            hideLoader();
        }
    };

    useEffect(() => {
        const uniqueId = new URLSearchParams(window.location.search).get("u");
        if (uniqueId) {
            getSellerData(uniqueId);
        }
    }, []);

    return (
        <Layout>
            <div className="page-content">
                <div className="container-fluid">

                    {/* Seller Info */}
                    {sellerInfo && (
                        <div className="card mb-4">
                            <div className="card-body d-flex align-items-center">
                                <img
                                    src={sellerInfo.profile ? imageUrl + sellerInfo.profile : "/assets/images/no-image.jpeg"}
                                    alt="Seller Profile"
                                    className="rounded-circle"
                                    style={{ width: "80px", height: "80px", objectFit: "cover", marginRight: "20px" }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/assets/images/no-image.jpeg";
                                    }}
                                />
                                <div>
                                    <h5 className="mb-1">{sellerInfo.name || "Unnamed Seller"}</h5>
                                    <p className="mb-0 text-muted">
                                        Joined on: {new Date(sellerInfo.createdAt).toLocaleDateString()}
                                    </p>
                                    <span className={`badge ${sellerInfo.isVerified ? 'bg-success' : 'bg-warning'}`}>
                                        {sellerInfo.isVerified ? "Verified" : "Not Verified"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Properties */}
                    <div className="card">
                        <div className="card-header d-flex-between">
                            <h4 className="card-title text-uppercase">Properties by User</h4>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                {properties.length > 0 ? (
                                    properties.map((data, i) => (
                                        <div className="col-md-3 mb-4" key={i}>
                                            <Link to="/property_details" state={{ uniqueId: data.uniqueId }}>
                                                <div className="card-style cursorPointer border-rad-cus position-relative">
                                                    <div
                                                        className="card-img-top border-rad-cus position-relative"
                                                        style={{ height: "230px", overflow: "hidden" }}
                                                    >
                                                        <div className={`ribbon ${data.for === 'rent' ? 'bg-primary' : 'bg-warning'}`}>
                                                            FOR {data.for}
                                                        </div>
                                                        <img
                                                            src={data.images ? imageUrl + data.images : "/assets/images/no-image.jpeg"}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = "/assets/images/no-image.jpeg";
                                                            }}
                                                            className="h-100 w-100"
                                                            alt={data.title}
                                                            style={{ objectFit: "cover" }}
                                                        />
                                                    </div>
                                                    <div className="position-absolute end-0 px-3" style={{ top: "210px" }}>
                                                        <span className="badge border bg-light border-primary text-primary px-2">
                                                            {data.category?.name || "House"}
                                                        </span>
                                                    </div>

                                                    <div className="card-body text-start p-0 pt-2">
                                                        <h5 className="card-title text-truncate">{data.title}</h5>
                                                        <p className="text-muted mb-1 address-truncate">
                                                            <i className="bx bx-map"></i> {data.address}
                                                        </p>
                                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                                            <div className="price-card">
                                                                <span className="text-primary font-13">SAR</span>
                                                                <span className="text-primary font-18"> {data.price}</span>
                                                            </div>
                                                            <span className="badge bg-light border text-muted">
                                                                {data.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    !loading && (
                                        <div className="text-center text-muted py-5">No properties found.</div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default Seller;
