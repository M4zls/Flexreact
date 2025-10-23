const testimonios = [
  { id: 1, name: "Ana", text: "La mejor hamburguesa de la ciudad." },
  { id: 2, name: "Carlos", text: "Entrega rápida y excelente sabor." },
  { id: 3, name: "María", text: "Precios justos y porciones grandes." }
];

export default function Testimonials() {
  return (
    <div className="container testimonials">
      <h2>Clientes Felices</h2>
      <div className="testimonials-list">
        {testimonios.map(t => (
          <div key={t.id} className="testimonial-card">
            <p className="quote">“{t.text}”</p>
            <p className="author">— {t.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
