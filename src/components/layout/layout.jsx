import { useLocation } from "react-router-dom";
import Footer from "./footer";
import Header from "./header";
import { useEffect, useState } from "react";
import Sidebar from "./sidebar";

const Layout = ({ children }) => {
    const [sidebarShow, setSidebarShow] = useState(() => {
        return typeof window !== "undefined" && window.innerWidth > 768;
    });

    useEffect(() => {
        // Optional: Adjust if window is resized after initial load
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setSidebarShow(false);
            } else {
                setSidebarShow(true);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <>
            <div>
                <div id="layout-wrapper">

                    <Header setSidebarShow={setSidebarShow} sidebarShow={sidebarShow} />

                    <Sidebar setSidebarShow={setSidebarShow} sidebarShow={sidebarShow} />

                    <div class="vertical-overlay"></div>

                    <div class={sidebarShow ? "main-content" : ''}>

                        {children}

                        <Footer sidebarShow={sidebarShow} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Layout;