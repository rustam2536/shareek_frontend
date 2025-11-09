import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { imageUrl, PropertyStatus } from "../../enum/enum";
import Layout from "../layout/layout";
import { useLoader } from "../../context/loaderContext";
import api from "../../services/apiService";
import ImageSlider from "./imageSlider";
import { toast } from "react-toastify";

const PropertyDetails = () => {
    const { showLoader, hideLoader } = useLoader();

    const location = useLocation();
    const { uniqueId, statusFilterState } = location.state || {};

    console.log(location.state, "statusFilterStatestatusFilterState");
    
    const [dataList, setData] = useState({});
    const [activeTab, setActiveTab] = useState("overview"); // <== For tab switch
    const [showEditModal, setShowEditModal] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [titleArabic, setTitleArabic] = useState("");
    const [descriptionArabic, setDescriptionArabic] = useState("");
    const [isOn, setIsOn] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedId, setSelectedId] = useState('');

    async function getData() {
        try {
            showLoader();

            const res = await api.get('/api/property/property_details?uniqueId=' + uniqueId);

            if (res.data.success) {
                setData(res.data.data);
                console.log("res.data.data", res.data.data);


                setTitle(res.data.data.title || "");
                setDescription(res.data.data.description || "");
                setTitleArabic(res.data.data.titleArabic || "");
                setDescriptionArabic(res.data.data.descriptionArabic || "");
                setIsOn(res.data.data.isFeatured);
            } else {
                setData({});
            }

            hideLoader();
        } catch (error) {
            hideLoader();
        }
    }

    async function handleStatusChange(status, id) {
        try {
            showLoader();

            const obj = {
                status: status,
                uniqueId: id
            };
            const res = await api.patch('/api/property/admin/update_status', obj);

            if (res.data.success) {
                await getData();
            } else {
                toast.error(res.data.message || "Failed to update.");
            }

            hideLoader();
        } catch (error) {
            hideLoader();
        }
    }

    async function updateDetails(id, title, titleArabic, description, descriptionArabic) {
        try {
            showLoader();

            const obj = {
                uniqueId: id,
                title,
                titleArabic,
                description,
                descriptionArabic,
                isFeatured: isOn
            };
            const res = await api.patch('/api/property/admin/update_fields', obj);

            if (res.data.success) {
                getData();
            } else {
                toast.error(res.data.message || "Failed to update.");
            }

            hideLoader();
        } catch (error) {
            hideLoader();
        }
    }

    const translateText = async (text, from = "en", to = "ar") => {
        try {
            const response = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`
            );
            const data = await response.json();
            return data.responseData.translatedText;
        } catch (error) {
            console.error("Translation error:", error);
            return "";
        }
    };

    const handleTranslate = async () => {
        showLoader();
        const translatedTitle = await translateText(title);
        const translatedDescription = await translateText(description);

        setTitleArabic(translatedTitle);
        setDescriptionArabic(translatedDescription);
        hideLoader();

    };

    const toggleSwitch = () => {
        setIsOn(prev => !prev);
    }

    const handleApprove = async () => {
        try {
            showLoader();

            const obj = {
                uniqueId: dataList?.sellerId,
                isVerified: true
            };
            const res = await api.post('/api/users/approveUserAdId', obj);

            if (res.data.success) {
                getData();
            } else {
                toast.error(res.data.message || "Failed to update.");
            }

            hideLoader();
        } catch (error) {
            hideLoader();
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <Layout>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-header align-items-center d-flex">
                                <h4 className="card-title mb-0 flex-grow-1 text-uppercase">Property Details</h4>
                            </div>
                            <div className="card-body">
                                <div className="live-preview">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="position-relative">
                                                {/* <img
                                                    src={dataList?.images?.[0] ? (imageUrl + dataList?.images?.[0]) : "/assets/images/no-image.jpeg"}
                                                    className="img-fluid rounded"
                                                    style={{ maxHeight: "400px", width: "100%" }}
                                                    alt="property"
                                                /> */}
                                                {dataList && <ImageSlider images={dataList?.images} videos={dataList?.videos?.fileName ? [dataList?.videos] : []} />}
                                                <button className="btn btn-warning position-absolute top-0 start-0 m-2">FOR SALE</button>
                                                <span className="badge bg-info position-absolute top-0 end-0 m-2 pb-2">Apartment</span>
                                                {/* <div className="my-2">
                                                
                                                   <h5> Address:{" "}
                                                    <span style={{ fontSize: "12px", display: "inline-block", height: "40px", overflow: "hidden" }}> </span></h5>
                                                    {dataList?.location?.address}
                                                </div> */}

                                                <div className="my-2">
                                                    <h5>Address: {" "}
                                                        <span style={{ fontSize: "12px" }}>{dataList?.location?.address}</span> </h5>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row p-3">

                                            <div className="card col-md-8 mt-4" style={{ background: "#f9f9f9" }}>

                                                <div className="d-flex justify-content-end align-items-center my-3 my-md-2">
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => setShowEditModal(true)}
                                                    >
                                                        Edit
                                                    </button>
                                                </div>

                                                <p className="text-primary h5" style={{ marginTop: "-30px" }}>SAR {dataList?.price}</p>

                                                <div className="mb-3">
                                                    <label className="form-label"><strong>Title:</strong></label>
                                                    <p>{dataList?.title || "-"}</p>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label"><strong>Description:</strong></label>
                                                    <p>{dataList?.description || "-"}</p>
                                                </div>

                                                {/* Arabic Title */}
                                                <div className="mb-3">
                                                    <label className="form-label"><strong>Title (Arabic):</strong></label>
                                                    <p>{dataList?.titleArabic || "-"}</p>
                                                </div>

                                                {/* Arabic Description */}
                                                <div className="mb-3">
                                                    <label className="form-label"><strong>Description (Arabic):</strong></label>
                                                    <p>{dataList?.descriptionArabic || "-"}</p>
                                                </div>

                                            </div>
                                            {/* Ad Id */}
                                            <div className="card px-3 col-md-4">
                                                <div className="card mt-4 pt-3" style={{ background: "#f9f9f9" }}>
                                                    <div className="mb-3">
                                                        <div>
                                                            <label className="form-label"><strong>Ad Id:</strong></label>
                                                            <p>{dataList?.adId || "-"}</p>
                                                        </div>
                                                        <div>
                                                            <label className="form-label"><strong>Ad Expiry:</strong></label>
                                                            <p>{dataList?.adExpiry || "-"}</p>
                                                        </div>
                                                        {
                                                            dataList?.sellerIsVerified ? null : dataList?.adId ? (
                                                                <div>
                                                                    <button type="button" onClick={handleApprove} className="btn btn-success">
                                                                        Approve
                                                                    </button>
                                                                </div>
                                                            ) : null
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        {/* seller */}
                                        <Link class="nav-link menu-link" to={"/seller?u=" + dataList?.sellerId}>
                                            <div className="mt-3 seller-card d-flex align-items-center p-2 rounded shadow-sm mb-4" style={{ border: "1px solid #eee" }}>
                                                <img
                                                    src={dataList?.sellerProfile ? (imageUrl + dataList?.sellerProfile) : "/assets/images/no-image.jpeg"}
                                                    alt="Owner"
                                                    className="rounded-circle me-3"
                                                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                                />
                                                <div className="">
                                                    <div className="d-flex align-items-center">
                                                        <h6 className="mb-0 fw-bold">{dataList?.sellerName?.[0]?.toUpperCase() + dataList?.sellerName?.slice(1) || "N/A"}</h6>
                                                        {dataList?.sellerIsVerified && (
                                                            <img
                                                                src="/assets/images/verified.png" // use your checkmark icon
                                                                alt="Verified"
                                                                style={{ width: "16px", height: "16px", marginLeft: "8px" }}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="text-muted text-start" style={{ fontSize: "12px" }}>
                                                        Owner
                                                    </div>
                                                </div>
                                                <i className="bi bi-chevron-right text-muted ms-3"></i> {/* Bootstrap icon */}
                                            </div>
                                        </Link>

                                        {/* overview / features */}
                                        <div className="col-md-12">

                                            {/* Toggle buttons */}
                                            <div>
                                                {/* <div style={{display: "flex", justifyContent: "space-evenly"}}> */}
                                                <div className="btn-group my-3" role="group">
                                                    <button
                                                        type="button"
                                                        className={`btn ${activeTab === "overview" ? "btn-primary" : "btn-outline-primary"}`}
                                                        onClick={() => setActiveTab("overview")}
                                                    >
                                                        Overview
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`btn ${activeTab === "features" ? "btn-primary" : "btn-outline-primary"}`}
                                                        onClick={() => setActiveTab("features")}
                                                    >
                                                        Features
                                                    </button>
                                                </div>
                                                <div className="d-flex btn-group my-3 align-items-center" style={{ float: "right" }}>
                                                    <div className="fw-bold mx-2">Change Status:</div>
                                                    <div className="">
                                                        <select
                                                            value={dataList?.status}
                                                            className="form-select form-select-sm"
                                                            name="status"
                                                            onChange={(e) => {
                                                                setSelectedStatus(e.target.value);
                                                                setSelectedId(dataList?.uniqueId);
                                                                setShowModal(true);
                                                            }}
                                                        // onChange={(e) => handleStatusChange(e.target.value, dataList?.uniqueId)}
                                                        >
                                                            <option value="" disabled>Change Status</option>
                                                            {Object.values(PropertyStatus).map((st) => (
                                                                <option key={st} value={st}>{st}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>


                                            {/* Tab content */}
                                            {activeTab === "overview" && (
                                                <div className="row" style={{ textAlign: "start" }}>
                                                    <div className="col-6">
                                                        <div className="row mb-2">
                                                            <div className="col-5 fw-bold">Bedrooms:</div>
                                                            <div className="col-7">{dataList?.features?.bedRooms}</div>
                                                        </div>
                                                        <div className="row mb-2">
                                                            <div className="col-5 fw-bold">Baths:</div>
                                                            <div className="col-7">{dataList?.features?.bathRooms}</div>
                                                        </div>
                                                        <div className="row mb-2">
                                                            <div className="col-5 fw-bold">Area:</div>
                                                            <div className="col-7">{dataList?.propertyArea}</div>
                                                        </div>
                                                        <div className="row mb-2">
                                                            <div className="col-5 fw-bold">Width:</div>
                                                            <div className="col-7">{dataList?.propertyWidth}</div>
                                                        </div>
                                                        <div className="row mb-2">
                                                            <div className="col-5 fw-bold">Depth:</div>
                                                            <div className="col-7">{dataList?.propertyDepth}</div>
                                                        </div>
                                                        <div className="row mb-2">
                                                            <div className="col-5 fw-bold">Total Floors:</div>
                                                            <div className="col-7">{dataList?.features?.totalFloors}</div>
                                                        </div>
                                                        <div className="row mb-2">
                                                            <div className="col-5 fw-bold">Floor No.:</div>
                                                            <div className="col-7">{dataList?.features?.floorNo}</div>
                                                        </div>
                                                    </div>

                                                    <div className="col-6">
                                                        <div className="row mb-2 align-items-center">
                                                            <div className="col-5 fw-bold">Status:</div>
                                                            <div className="col-7">
                                                                {dataList?.status}
                                                            </div>
                                                        </div>
                                                        <div className="row mb-2">
                                                            <div className="col-5 fw-bold">Project Status:</div>
                                                            <div className="col-7">{dataList?.projectStatus}</div>
                                                        </div>
                                                        <div className="row mb-2">
                                                            <div className="col-5 fw-bold">Street Direction:</div>
                                                            <div className="col-7">{dataList?.streetDirection}</div>
                                                        </div>
                                                        <div className="row mb-2">
                                                            <div className="col-5 fw-bold">Street Width:</div>
                                                            <div className="col-7">{dataList?.streetWidth}</div>
                                                        </div>
                                                        <div className="row mb-2">
                                                            <div className="col-5 fw-bold">Furnishing:</div>
                                                            <div className="col-7">{dataList?.furnishing}</div>
                                                        </div>
                                                        <div className="row mb-2">
                                                            <div className="col-5 fw-bold">Listed By:</div>
                                                            <div className="col-7">{dataList?.listedBy}</div>
                                                        </div>
                                                        <div className="row mb-2">
                                                            <div className="col-5 fw-bold">Listed Date:</div>
                                                            <div className="col-7">{new Date(dataList?.createdAt).toLocaleString()}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {activeTab === "features" && (
                                                <div className="row" style={{ textAlign: "start" }}>
                                                    <div className="col-6">
                                                        <div className="row mb-2">
                                                            <div className="col-5 fw-bold">Kitchen:</div>
                                                            <div className="col-7">{dataList?.features?.kitchen ? "Yes" : "No"}</div>
                                                        </div>
                                                        <div className="row mb-2">
                                                            <div className="col-5 fw-bold">Pool:</div>
                                                            <div className="col-7">{dataList?.features?.pool ? "Yes" : "No"}</div>
                                                        </div>
                                                        <div className="row mb-2">
                                                            <div className="col-5 fw-bold">Maid Room:</div>
                                                            <div className="col-7">{dataList?.features?.maidRoom ? "Yes" : "No"}</div>
                                                        </div>
                                                        <div className="row mb-2">
                                                            <div className="col-5 fw-bold">Driver Room:</div>
                                                            <div className="col-7">{dataList?.features?.driverRoom ? "Yes" : "No"}</div>
                                                        </div>
                                                        <div className="row mb-2">
                                                            <div className="col-5 fw-bold">Basement:</div>
                                                            <div className="col-7">{dataList?.features?.basement ? "Yes" : "No"}</div>
                                                        </div>
                                                        <div className="row mb-2">
                                                            <div className="col-5 fw-bold">Lift:</div>
                                                            <div className="col-7">{dataList?.features?.lift ? "Yes" : "No"}</div>
                                                        </div>
                                                    </div>

                                                    <div className="col-6">
                                                        <div className="row mb-2">
                                                            <div className="col-5 fw-bold">Internal Stair:</div>
                                                            <div className="col-7">{dataList?.features?.internalStair ? "Yes" : "No"}</div>
                                                        </div>
                                                        <div className="row mb-2">
                                                            <div className="col-5 fw-bold">Water Availability:</div>
                                                            <div className="col-7">{dataList?.features?.waterAvailability ? "Yes" : "No"}</div>
                                                        </div>
                                                        <div className="row mb-2">
                                                            <div className="col-5 fw-bold">Electrical Availability:</div>
                                                            <div className="col-7">{dataList?.features?.electricalAvailability ? "Yes" : "No"}</div>
                                                        </div>
                                                        <div className="row mb-2">
                                                            <div className="col-5 fw-bold">Drainage Availability:</div>
                                                            <div className="col-7">{dataList?.features?.drainageAvailability ? "Yes" : "No"}</div>
                                                        </div>
                                                        <div className="row mb-2">
                                                            <div className="col-5 fw-bold">Coverage:</div>
                                                            <div className="col-7 d-flex align-items-center">
                                                                {dataList?.features?.network4g && (
                                                                    <img src="/assets/images/4g.png" alt="4G" className="me-2" style={{ height: "20px" }} />
                                                                )}
                                                                {dataList?.features?.network5g && (
                                                                    <img src="/assets/images/5g.png" alt="5G" style={{ height: "20px" }} />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showEditModal && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Property Details</h5>
                                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-2">
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        rows="2"
                                        className="form-control"
                                        placeholder="Enter description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                                <div className="text-end">
                                    <button className="btn btn-sm text-secondary me-auto" onClick={handleTranslate}>
                                        Translate to Arabic
                                    </button>
                                </div>
                                <div className="mb-2">
                                    <label className="form-label">Title (Arabic)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter title(arabic)"
                                        value={titleArabic}
                                        onChange={(e) => setTitleArabic(e.target.value)}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label">Description (Arabic)</label>
                                    <textarea
                                        rows="2"
                                        className="form-control"
                                        placeholder="Enter description(arabic)"
                                        value={descriptionArabic}
                                        onChange={(e) => setDescriptionArabic(e.target.value)}
                                    />

                                </div>
                                {/* <div>
                                   <label>isFeatured</label>
                                <div  className={`toggle-switch ${isOn ? 'on' : 'off'}`} onClick={toggleSwitch}>
                                    
                                    <div className="toggle-knob" />
                                     
                                </div>
                                </div> */}

                                <div className="toggle-container">
                                    <label>IsFeatured</label>
                                    <div className={`toggle-switch ${isOn ? 'on' : 'off'}`} onClick={toggleSwitch}>
                                        <div className="toggle-knob" />
                                    </div>
                                </div>

                            </div>
                            <div className="modal-footer">

                                <button class="btn bg-unset border border-danger text-danger" onClick={() => setShowEditModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={() => {
                                    updateDetails(
                                        dataList?.uniqueId,
                                        title,
                                        titleArabic,
                                        description,
                                        descriptionArabic
                                    );
                                    setShowEditModal(false);
                                }}>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Status Change</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to change the status to <strong>{selectedStatus}</strong>?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={async () => {
                                    setShowModal(false);
                                    await handleStatusChange(selectedStatus, selectedId);
                                }}>
                                    Yes, Change
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default PropertyDetails;