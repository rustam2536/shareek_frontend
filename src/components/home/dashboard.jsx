import Layout from "../layout/layout";
import { useAuth } from "../../context/authContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl, PropertyStatus } from "../../enum/enum";
import { useLoader } from "../../context/loaderContext";
import api from "../../services/apiService";
import { Link } from "react-router-dom";

const Dashboard = () => {

    const {
        name,
    } = useAuth();
    const {
        showLoader,
        hideLoader
    } = useLoader();

    const [dashData, setData] = useState([]);

    async function getData() {
        try {
            showLoader();

            const res = await api.get('/api/property/admin/dashboard');

            if (res.data.success) {
                setData(res.data.data);
            } else {
                setData([]);
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

                    <div class="row">
                        <div class="col">

                            <div class="h-100">
                                <div class="row mb-3 pb-1">
                                    <div class="col-12">
                                        <div class="d-flex align-items-lg-center flex-lg-row flex-column">
                                            <div class="flex-grow-1">
                                                <h4 class="fs-16 mb-1">Good Morning, {name}!</h4>
                                                <p class="text-muted mb-0">Here's what's happening with your store today.</p>
                                            </div>
                                        </div>
                                        {/* <!-- end card header --> */}
                                    </div>
                                    {/* <!--end col--> */}
                                </div>
                                {/* <!--end row--> */}

                                <div class="row">
                                    <div class="col-xl-3 col-md-6">
                                        {/* <!-- card --> */}
                                        <div class="card card-animate">
                                            <Link class="nav-link menu-link" to={"/property?s=" + PropertyStatus.ACTIVE}>
                                                <div class="card-body">
                                                    <div class="d-flex align-items-center">
                                                        <div class="flex-grow-1 overflow-hidden">
                                                            <p class="text-uppercase fw-medium text-muted text-truncate mb-0"> {PropertyStatus.ACTIVE} </p>
                                                        </div>
                                                        <div class="flex-shrink-0">
                                                            <h5 class="text-success fs-14 mb-0">
                                                                {/* <i class="ri-arrow-right-up-line fs-13 align-middle"></i> */}
                                                            </h5>
                                                        </div>
                                                    </div>
                                                    <div class="d-flex align-items-center justify-content-center mt-4">
                                                        <div>
                                                            <h4 class="fs-22 fw-semibold ff-secondary mb-4"><span>
                                                            </span></h4>
                                                            {/* <a href="#" class="text-decoration-underline">View net earnings</a> */}
                                                        </div>
                                                        <div class="avatar-sm flex-shrink-0">
                                                            <span class="avatar-title bg-success rounded fs-3">
                                                                {dashData?.property?.find(el => el._id == PropertyStatus.ACTIVE)?.count || 0}
                                                                {/* <i class="bx bx-dollar-circle"></i> */}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                            {/* <!-- end card body --> */}
                                        </div>
                                        {/* <!-- end card --> */}
                                    </div>
                                    {/* <!-- end col --> */}

                                    <div class="col-xl-3 col-md-6">
                                        {/* <!-- card --> */}
                                        <div class="card card-animate">
                                            <Link class="nav-link menu-link" to={"/property?s=" + PropertyStatus.INITIATED}>
                                                <div class="card-body">
                                                    <div class="d-flex align-items-center">
                                                        <div class="flex-grow-1 overflow-hidden">
                                                            <p class="text-uppercase fw-medium text-muted text-truncate mb-0">{PropertyStatus.INITIATED}</p>
                                                        </div>
                                                        <div class="flex-shrink-0">
                                                            <h5 class="text-danger fs-14 mb-0">
                                                                {/* <i class="ri-arrow-right-down-line fs-13 align-middle"></i> -3.57 % */}
                                                            </h5>
                                                        </div>
                                                    </div>
                                                    <div class="d-flex align-items-end justify-content-center mt-4">
                                                        <div>
                                                            {/* <h4 class="fs-22 fw-semibold ff-secondary mb-4"><span class="counter-value" data-target="36894">0</span></h4>
                                                        <a href="#" class="text-decoration-underline">View all orders</a> */}
                                                        </div>
                                                        <div class="avatar-sm flex-shrink-0">
                                                            <span class="avatar-title bg-info rounded fs-3">
                                                                {dashData?.property?.find(el => el._id == PropertyStatus.INITIATED)?.count || 0}
                                                                {/* <i class="bx bx-shopping-bag"></i> */}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                            {/* <!-- end card body --> */}
                                        </div>
                                        {/* <!-- end card --> */}
                                    </div>
                                    {/* <!-- end col --> */}

                                    <div class="col-xl-3 col-md-6">

                                        {/* <!-- card --> */}
                                        <div class="card card-animate">
                                            <Link class="nav-link menu-link" to={"/property?s=" + PropertyStatus.SOLD}>
                                                <div class="card-body">
                                                    <div class="d-flex align-items-center">
                                                        <div class="flex-grow-1 overflow-hidden">
                                                            <p class="text-uppercase fw-medium text-muted text-truncate mb-0">{PropertyStatus.SOLD}</p>
                                                        </div>
                                                        <div class="flex-shrink-0">
                                                            <h5 class="text-success fs-14 mb-0">
                                                                {/* <i class="ri-arrow-right-up-line fs-13 align-middle"></i> +29.08 % */}
                                                            </h5>
                                                        </div>
                                                    </div>
                                                    <div class="d-flex align-items-end justify-content-center mt-4">
                                                        <div>
                                                            {/* <h4 class="fs-22 fw-semibold ff-secondary mb-4"><span class="counter-value" data-target="183.35">0</span>M </h4>
                                                        <a href="#" class="text-decoration-underline">See details</a> */}
                                                        </div>
                                                        <div class="avatar-sm flex-shrink-0">
                                                            <span class="avatar-title bg-warning rounded fs-3">
                                                                {dashData?.property?.find(el => el._id == PropertyStatus.SOLD)?.count || 0}
                                                                {/* <i class="bx bx-user-circle"></i> */}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                            {/* <!-- end card body --> */}
                                        </div>
                                        {/* <!-- end card --> */}
                                    </div>
                                    {/* <!-- end col --> */}

                                    <div class="col-xl-3 col-md-6">

                                        {/* <!-- card --> */}
                                        <div class="card card-animate">
                                            <Link class="nav-link menu-link" to={"/property?s=" + PropertyStatus.SUSPENDED}>
                                                <div class="card-body">
                                                    <div class="d-flex align-items-center">
                                                        <div class="flex-grow-1 overflow-hidden">
                                                            <p class="text-uppercase fw-medium text-muted text-truncate mb-0"> {PropertyStatus.SUSPENDED}</p>
                                                        </div>
                                                        <div class="flex-shrink-0">
                                                            <h5 class="text-muted fs-14 mb-0">
                                                                {/* +0.00 % */}
                                                            </h5>
                                                        </div>
                                                    </div>
                                                    <div class="d-flex align-items-end justify-content-center mt-4">
                                                        <div>
                                                            {/* <h4 class="fs-22 fw-semibold ff-secondary mb-4">$<span class="counter-value" data-target="165.89">0</span>k </h4>
                                                        <a href="#" class="text-decoration-underline">Withdraw money</a> */}
                                                        </div>
                                                        <div class="avatar-sm flex-shrink-0">
                                                            <span class="avatar-title bg-danger rounded fs-3">
                                                                {dashData?.property?.find(el => el._id == PropertyStatus.SUSPENDED)?.count || 0}
                                                                {/* <i class="bx bx-wallet"></i> */}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                            {/* <!-- end card body --> */}
                                        </div>
                                        {/* <!-- end card --> */}
                                    </div>
                                    {/* <!-- end col --> */}

                                    <div class="col-xl-3 col-md-6">
                                        <div class="card card-animate">
                                            <div class="nav-link menu-link">
                                                <div class="card-body">
                                                    <div class="d-flex align-items-center">
                                                        <div class="flex-grow-1 overflow-hidden">
                                                            <p class="text-uppercase fw-medium text-muted text-truncate mb-0"> Active Sellers</p>
                                                        </div>
                                                        <div class="flex-shrink-0">
                                                            <h5 class="text-muted fs-14 mb-0">
                                                            </h5>
                                                        </div>
                                                    </div>
                                                    <div class="d-flex align-items-end justify-content-center mt-4">
                                                        <div>
                                                        </div>
                                                        <div class="avatar-sm flex-shrink-0">
                                                            <span class="avatar-title bg-warning rounded fs-3">
                                                                {dashData?.activeSellers?.[0]?.count || 0}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-xl-3 col-md-6">
                                        <div class="card card-animate">
                                            <div class="nav-link menu-link" >
                                                <div class="card-body">
                                                    <div class="d-flex align-items-center">
                                                        <div class="flex-grow-1 overflow-hidden">
                                                            <p class="text-uppercase fw-medium text-muted text-truncate mb-0">Total Sellers</p>
                                                        </div>
                                                        <div class="flex-shrink-0">
                                                            <h5 class="text-muted fs-14 mb-0">
                                                            </h5>
                                                        </div>
                                                    </div>
                                                    <div class="d-flex align-items-end justify-content-center mt-4">
                                                        <div>
                                                        </div>
                                                        <div class="avatar-sm flex-shrink-0">
                                                            <span class="avatar-title bg-dark rounded fs-3">
                                                                {dashData?.activeOrSoldSellers?.[0]?.count || 0}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-xl-3 col-md-6">
                                        <div class="card card-animate">
                                            <div class="nav-link menu-link">
                                                <div class="card-body">
                                                    <div class="d-flex align-items-center">
                                                        <div class="flex-grow-1 overflow-hidden">
                                                            <p class="text-uppercase fw-medium text-muted text-truncate mb-0"> Active Buyers</p>
                                                        </div>
                                                        <div class="flex-shrink-0">
                                                            <h5 class="text-muted fs-14 mb-0">
                                                            </h5>
                                                        </div>
                                                    </div>
                                                    <div class="d-flex align-items-end justify-content-center mt-4">
                                                        <div>
                                                        </div>
                                                        <div class="avatar-sm flex-shrink-0">
                                                            <span class="avatar-title bg-muted rounded fs-3">
                                                                {dashData?.currentBuyers?.[0]?.total || 0}
                                                            </span>
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

                </div>
                {/* <!-- container-fluid --> */}
            </div>
        </Layout >
    )
}

export default Dashboard