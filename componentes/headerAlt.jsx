export default function HeaderAlt() {
    return (
        <div className="container-xxl position-relative p-0 bg-dark ">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 px-lg-5 py-3 py-lg-0">
                <a href="/" className="navbar-brand p-0">
                    <h1 className="text-primary m-0">
                        <i className="fa fa-utensils me-3"></i>
                        <span style={{ fontWeight: 'bold' }}>
                            <span style={{ color: 'black' }}>Totos</span>
                            <span style={{ color: 'white' }}> Wings</span>
                        </span>
                    </h1>
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarCollapse"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
            </nav>
        </div>
    );
}
