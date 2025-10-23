import heroImg from "../assets/images.jpg"; // agrega una imagen

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          <h1>Mordelon Express</h1>
          <p>Las mejores hamburguesas y completos — entrega rápida</p>
          <a href="#menu" className="btn">Ver Menú</a>
        </div>
        <div className="hero-image">
          <img src={heroImg} alt="Hamburguesa" />
        </div>
      </div>
    </section>
  );
}
