import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ sidebarShow, setSidebarShow }) => {
    const [isMobile, setIsMobile] = useState(() => {
        return typeof window !== "undefined" && window.innerWidth <= 768;
    });

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            setSidebarShow(!mobile); // open on desktop, closed on mobile
        };

        handleResize(); // Set initial
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            {/* Overlay */}
            {sidebarShow && isMobile && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarShow(false)}
                />
            )}
            {/* <!-- ========== App Menu ========== --> */}
            <div className={`app-menu navbar-menu sidebar ${sidebarShow ? 'visible' : 'hidden'}`}>
                {/* <div class="app-menu navbar-menu"> */}
                {/* <!-- LOGO --> */}
                <div class="navbar-brand-box">
                    {/* <!-- Dark Logo--> */}
                    <Link to="/dashboard" class="logo logo-dark">
                        <span class="logo-sm">
                            <img src="logo.png" alt="" height="22" />
                        </span>
                        <span class="logo-lg">
                            <img src="logo.png" alt="" height="55" />
                        </span>
                    </Link>
                    {/* <!-- Light Logo--> */}
                    <Link to="/dashboard" class="logo logo-light">
                        <span class="logo-sm">
                            <img src="assets/images/logo-sm.png" alt="" height="22" />
                        </span>
                        <span class="logo-lg">
                            <img src="assets/images/logo-light.png" alt="" height="17" />
                        </span>
                    </Link>
                    <button type="button" class="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover" id="vertical-hover">
                        <i class="ri-record-circle-line"></i>
                    </button>
                </div>

                <div id="scrollbar">
                    <div class="container-fluid">

                        <div id="two-column-menu">
                        </div>
                        <ul class="navbar-nav" id="navbar-nav">
                            <li class="menu-title"><span data-key="t-menu">Menu</span></li>
                            <li class="nav-item">
                                <Link class="nav-link menu-link" to="/dashboard">
                                    <i class="mdi mdi-speedometer"></i> <span data-key="t-dashboards">Dashboards</span>
                                </Link>
                                {/* <div class="collapse menu-dropdown" id="sidebarDashboards">
                                    <ul class="nav nav-sm flex-column">
                                        <li class="nav-item">
                                            <a href="dashboard-analytics.html" class="nav-link" data-key="t-analytics"> Analytics </a>
                                        </li>
                                        <li class="nav-item">
                                            <a href="dashboard-crm.html" class="nav-link" data-key="t-crm"> CRM </a>
                                        </li>
                                        <li class="nav-item">
                                            <a href="index.html" class="nav-link" data-key="t-ecommerce"> Ecommerce </a>
                                        </li>
                                        <li class="nav-item">
                                            <a href="dashboard-crypto.html" class="nav-link" data-key="t-crypto"> Crypto </a>
                                        </li>
                                        <li class="nav-item">
                                            <a href="dashboard-projects.html" class="nav-link" data-key="t-projects"> Projects </a>
                                        </li>
                                        <li class="nav-item">
                                            <a href="dashboard-nft.html" class="nav-link" data-key="t-nft"> NFT</a>
                                        </li>
                                        <li class="nav-item">
                                            <a href="dashboard-job.html" class="nav-link" data-key="t-job">Job</a>
                                        </li>
                                        <li class="nav-item">
                                            <a href="dashboard-blog.html" class="nav-link"><span data-key="t-blog">Blog</span> <span class="badge bg-success" data-key="t-new">New</span></a>
                                        </li>
                                    </ul>
                                </div> */}
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link menu-link" to="/property">
                                    <i className="mdi mdi-home-city-outline"></i> {/* 🏠 Property */}
                                    <span data-key="t-apps">Property</span>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link menu-link" to="/all_users">
                                    <i className="mdi mdi-account-group-outline"></i> {/* 👥 All Users */}
                                    <span data-key="t-apps">All Users</span>
                                </Link>
                            </li>

                            {/* <li className="nav-item">
                                <Link className="nav-link menu-link" to="/notification">
                                    <i className="mdi mdi-bell-outline"></i> 
                                    <span data-key="t-apps">Notification</span>
                                </Link>
                            </li> */}

                            <li className="nav-item">
                                <Link className="nav-link menu-link" to="/report_user">
                                    <i className="mdi mdi-account-alert-outline"></i> {/* ⚠️ Report User */}
                                    <span data-key="t-apps">Report User</span>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link menu-link" to="/report_ad">
                                    <i className="mdi mdi-file-alert-outline"></i> {/* 📝⚠️ Report Ad */}
                                    <span data-key="t-apps">Report Ad</span>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link menu-link" to="/countries">
                                    <i className="mdi mdi-earth"></i> {/* 📝⚠️ Report Ad */}
                                    <span data-key="t-apps">Countries</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    {/* <!-- Sidebar --> */}
                </div>

                <div class="sidebar-background"></div>
            </div>
            {/* <!-- Left Sidebar End --> */}
        </>
    )
}

export default Sidebar;