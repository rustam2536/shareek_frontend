import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const Header = ({ sidebarShow, setSidebarShow }) => {
    const {
        setUserId,
        setToken,
        setName,
        name
    } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Are you sure to Logout.')) {
            localStorage.setItem("userAuth", JSON.stringify(''));
            setUserId(null);
            setToken(null);
            setName(null);

            navigate('/');
        }
    }

    return (
        <>
            <header id="page-topbar" className={sidebarShow ? ' cus-side-show' : ''}>
                <div class="layout-width">
                    <div class="navbar-header">
                        <div class="d-flex">
                            {/* <div class="navbar-brand-box horizontal-logo">
                                <Link to="/dashboard" class="logo logo-dark">
                                    <span class="logo-sm">
                                        <img src="assets/images/logo-sm.png" alt="" height="22" />
                                    </span>
                                    <span class="logo-lg">
                                        <img src="assets/images/logo-dark.png" alt="" height="17" />
                                    </span>
                                </Link>

                                <Link to="/dashboard" class="logo logo-light">
                                    <span class="logo-sm">
                                        <img src="assets/images/logo-sm.png" alt="" height="22" />
                                    </span>
                                    <span class="logo-lg">
                                        <img src="assets/images/logo-light.png" alt="" height="17" />
                                    </span>
                                </Link>
                            </div> */}

                            <button onClick={() => setSidebarShow(!sidebarShow)} type="button" className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger shadow-none" id="topnav-hamburger-icon">
                                <span className="hamburger-icon">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </span>
                            </button>
                        </div>

                        <div class="d-flex align-items-center">

                            <div class="dropdown topbar-head-dropdown ms-1 header-item" id="notificationDropdown">
                                <Link to={'/notification'} >
                                    <button type="button" class="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle shadow-none" id="page-header-notifications-dropdown" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-haspopup="true" aria-expanded="false">
                                        <i class='bx bx-bell fs-22'></i>
                                        {/* <span class="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">3<span class="visually-hidden"></span></span> */}
                                    </button>
                                </Link>
                            </div>

                            <div class="dropdown topbar-head-dropdown ms-1 header-item" id="notificationDropdown">
                                <button onClick={handleLogout} title="Logout" type="button" class="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle shadow-none" id="page-header-notifications-dropdown" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-haspopup="true" aria-expanded="false">
                                    <i class='bx bx-log-out fs-22'></i>
                                </button>
                            </div>
                            <div class="dropdown ms-sm-3 header-item topbar-user">
                                <button type="button" class="btn shadow-none" id="page-header-user-dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span class="d-flex align-items-center">
                                        <img class="rounded-circle header-profile-user" src="assets/images/users/avatar-1.jpg" alt="Header Avatar" />
                                        <span class="text-start ms-xl-2">
                                            <span class="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{name}</span>
                                            <span class="d-none d-xl-block ms-1 fs-12 user-name-sub-text">Founder</span>
                                        </span>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;