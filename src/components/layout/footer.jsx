const Footer = ({sidebarShow}) => {

    return (
        <>
            <footer class={"footer" + (sidebarShow ? ' cus-side-show' : ' footer-left')}>
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-sm-6">
                            <script>document.write(new Date().getFullYear())</script> © Shareek.
                        </div>
                        <div class="col-sm-6">
                            <div class="text-sm-end d-none d-sm-block">
                                Design & Develop by ❣️
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer;