import axios from "axios";
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { baseUrl, imageUrl, PropertyStatus } from "../../enum/enum";
import Layout from "../layout/layout";
import { useAuth } from "../../context/authContext";
import { useLoader } from "../../context/loaderContext";
import api from "../../services/apiService";
import { toast } from "react-toastify";

const PropertyDetails = () => {
    const { showLoader, hideLoader } = useLoader();

    const location = useLocation();
    const { uniqueId } = location.state || {};

    console.log("uniqueId", uniqueId);


    const [dataList, setData] = useState({});

    async function getData() {
        try {
            showLoader();

            const res = await api.get('/api/property/property_details?uniqueId=' + uniqueId);

            if (res.data.success) {
                console.log(res.data.data, "details from api");

                setData(res.data.data);
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
            }
            const res = await api.patch('/api/property/admin/update_status', obj);

            if (res.data.success) {
                getData();
            } else {
                toast.error(res.data.message || "Failed to update.")
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
            <div class="page-content">
                <div class="container-fluid">

                    <div class="col-xl-12">
                        <div class="card">
                            <div class="card-header align-items-center d-flex">
                                <h4 class="card-title mb-0 flex-grow-1 text-uppercase">Property Details</h4>
                            </div>
                            <div class="card-body">
                                <div class="live-preview">

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="position-relative">
                                                <img src={dataList?.images?.[0] ? (imageUrl + dataList?.images?.[0]) : "/assets/images/no-image.jpeg"} className="img-fluid rounded" style={{ maxHeight: "400px", width: "100%" }} alt="property" />
                                                <button className="btn btn-warning position-absolute top-0 start-0 m-2">FOR SALE</button>
                                                <span className="badge bg-info position-absolute top-0 end-0 m-2 pb-2">Apartment</span>
                                                {/* <button className="btn btn-light position-absolute top-0 end-0 mt-5 me-2 rounded-circle"><i className="bi bi-heart"></i></button> */}
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <h4>{dataList?.title}</h4>
                                            <p className="text-primary h5">SAR {dataList?.price}</p>

                                            {/* location */}

                                            <h5>Description</h5>
                                            <p>{dataList?.description}</p>

                                            <div className="btn-group mb-3" role="group">
                                                <button type="button" className="btn btn-primary">Overview</button>
                                                <button type="button" className="btn btn-outline-primary">Features</button>
                                            </div>

                                            <div className="row">
                                                <div className="col-6">
                                                    <p><strong>Bedrooms:</strong> {dataList?.features?.bedRooms}</p>
                                                    <p><strong>Baths:</strong> {dataList?.features?.bathRooms}</p>
                                                    <p><strong>Area:</strong> {dataList?.propertyArea}</p>
                                                    <p><strong>Width:</strong> {dataList?.propertyWidth}</p>
                                                    <p><strong>Depth:</strong> {dataList?.propertyDepth}</p>
                                                    <p><strong>totalFloors:</strong>{dataList?.features?.totalFloors}</p>
                                                    <p><strong>Floor No.:</strong> {dataList?.features?.floorNo}</p>
                                                    <p><strong>kitchen:</strong> {dataList?.features?.kitchen?"true":"false"}</p>
                                                    <p><strong>Pool:</strong> {dataList?.features?.pool?"true":"false"}</p>
                                                    <p><strong>Maid room:</strong> {dataList?.features?.maidRoom?"ture":"false"}</p>
                                                    <p><strong>Driver room:</strong> {dataList?.features?.driverRoom?"ture":"false"}</p>
                                                    <p><strong>Besment:</strong> {dataList?.features?.basement?"true":"false"}</p>
                                                    <p><strong>Lift:</strong> {dataList?.features?.lift?"true":"false"}</p>
                                                </div>

                                                <div className="col-6">

                                                    <div className="d-flex align-items-center justify-content-center mb-2">
                                                        <strong className="me-2">Status:</strong>
                                                        <select
                                                            value={dataList?.status}
                                                            className="form-select w-auto"
                                                            name="status"
                                                            onChange={(e) => handleStatusChange(e.target.value, dataList?.uniqueId)}
                                                        >
                                                            <option value="" disabled>Change Status</option>
                                                            {
                                                                Object.values(PropertyStatus).map((st) => (
                                                                    <option key={st} value={st}>{st}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>

                                                    <p><strong>Project Status:</strong> {dataList?.projectStatus}</p>
                                                    <p><strong>Street Direction:</strong> {dataList?.streetDirection}</p>
                                                    <p><strong>streetWidth:</strong> {dataList?.streetWidth}</p>
                                                    <p><strong>Furnishing:</strong> {dataList?.furnishing}</p>
                                                    <p><strong>listedBy:</strong> {dataList?.listedBy}</p>
                                                    <p><strong>Internalstair:</strong>{dataList?.features?.internalStair?"true":"false"}</p>
                                                    <p><strong>WaterAvailability:</strong>{dataList?.features?.waterAvailability?"true":"false"}</p>
                                                    <p><strong>ElectricalAvailability:</strong>{dataList?.features?.electricalAvailability?"true":"false"}</p>
                                                    <p><strong>DrainageAvailability:</strong>{dataList?.features?.drainageAvailability?"true":"false"}</p>
                                                    <p><strong>Network4g:</strong>{dataList?.features?.network4g?"true":"false"}</p>
                                                    <p><strong>Network5g:</strong>{dataList?.features?.network5g?"true":"false"}</p>
                                                    <p><strong>CreatedAt:</strong>{dataList?.createdAt}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default PropertyDetails