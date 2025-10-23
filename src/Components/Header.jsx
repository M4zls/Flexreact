import "../css/header.css";

export default function Header() {
  return (
    <header className="mi-navbar text-white p-0">
      <nav className="navbar navbar-expand-lg navbar-dark container-fluid">
        <a className="navbar-brand fw-bold" href=".">
          FLEX
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="./index.html">
                INICIO
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#productos">
                CATEGORIAS
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="paginas/contacto.html">
                AYUDA
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                data-bs-toggle="offcanvas"
                href="#carrito"
                role="button"
                aria-controls="carrito"
              >
                <img
                  src="https://www.svgrepo.com/show/533044/cart-shopping-fast.svg"
                  alt="Carrito"
                  className="header-icon-24"
                />
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link user-header-link"
                href="#"
                title="Mi perfil o iniciar sesión"
              >
                <img
                  src="https://www.svgrepo.com/show/532363/user-alt-1.svg"
                  alt="Usuario"
                  className="header-icon-24"
                />
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container-fluid p-0" id="banner-rotativo-wrapper">
        <div
          id="banner-rotativo"
          className="carousel slide"
          data-bs-ride="carousel"
          data-bs-interval="2400"
        >
          <div className="carousel-inner">
            <div className="carousel-item active text-center py-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg"
                alt="Adidas"
                className="brand-logo"
              />
            </div>
            <div className="carousel-item text-center py-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg"
                alt="Nike"
                className="brand-logo"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
