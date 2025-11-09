import { useEffect, useState } from "react";
import { Link, useLocation, useNavigationType } from "react-router-dom";
import { imageUrl, PropertyStatus } from "../../enum/enum";
import Layout from "../layout/layout";
import { useLoader } from "../../context/loaderContext";
import api from "../../services/apiService";

const Property = () => {
    const { showLoader, hideLoader, loading } = useLoader();

    const navigationType = useNavigationType();

    const [dataList, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [statusFilter, setStatusFilter] = useState(PropertyStatus.INITIATED);

    // Main data fetcher
    async function getData(pageNum = 1, status = statusFilter, reset = false) {
        if (loading) return;

        try {
            showLoader();

            const res = await api.get(`/api/property/admin/get_list?page=${pageNum}&status=${status}`);
            if (res.data.success) {
                const newData = res.data.data.data;

                if (reset) {
                    setData(newData);
                } else {
                    setData((prev) => [...prev, ...newData]);
                }

                setHasMore(newData.length >= 10); // assuming 10 per page
            } else {
                if (reset) setData([]);
                setHasMore(false);
            }
        } catch (error) {
            if (reset) setData([]);
            setHasMore(false);
        } finally {
            hideLoader();
        }
    }

    // Initial load
    useEffect(() => {
        let saved = '';
        console.log(navigationType, "navigationType");
        
        if (navigationType === "POP") {
            saved = sessionStorage.getItem('propertyFilters');
            console.log(saved, "saved");
            
            if (saved) {
                setStatusFilter(saved == 'All' ? '' : saved);
            }
        }
        const s = new URLSearchParams(window.location.search).get('s');
        if (s) {
            setStatusFilter(s);
        }
        getData(1, saved == 'All' ? '' : (saved || s || statusFilter), true);
    }, [navigationType]);

    // Infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const fullHeight = document.documentElement.scrollHeight;

            if (scrollTop + windowHeight >= fullHeight - 100 && hasMore && !loading) {
                const nextPage = page + 1;
                setPage(nextPage);
                getData(nextPage, statusFilter);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [page, hasMore, loading, statusFilter]);

    // Filter change handler
    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setStatusFilter(newStatus);
        setPage(1);
        setHasMore(true);
        getData(1, newStatus, true); // reset = true
    };

    return (
        <Layout>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-header d-flex-between">
                                <h4 className="card-title text-uppercase">Property</h4>
                                <div className="d-flex">
                                    <div className="fw-bold mx-2 mt-1">Status:</div>
                                    <div>
                                        <select
                                            className="form-select form-select-sm"
                                            name="status"
                                            value={statusFilter}
                                            onChange={handleStatusChange}
                                        >
                                            <option value="">All</option>
                                            {Object.values(PropertyStatus).map((st) => (
                                                <option key={st} value={st}>{st}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="live-preview">
                                    <div className="row">
                                        {dataList?.map((data, i) => (
                                            <div className="col-md-3 mb-4" key={i}>
                                                <Link to={"/property_details"} onClick={() => sessionStorage.setItem('propertyFilters', statusFilter || "All")} state={{ uniqueId: data.uniqueId }}>
                                                    <div className="card-style cursorPointer border-rad-cus position-relative">
                                                        <div
                                                            className="card-img-top border-rad-cus position-relative"
                                                            style={{ height: "230px", objectFit: "cover", overflow: "hidden" }}
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
                                                                className="h-100"
                                                                alt={data.title}
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
                                        ))}
                                    </div>

                                    {!hasMore && dataList.length > 0 && (
                                        <div className="text-center text-muted py-2">No more properties to load.</div>
                                    )}

                                    {!loading && dataList.length === 0 && (
                                        <div className="text-center text-muted py-5">No properties found.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Property;
