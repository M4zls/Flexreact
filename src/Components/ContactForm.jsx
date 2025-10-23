import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ nombre: "", telefono: "", mensaje: "" });
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    console.log("Enviando:", form);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="container contact">
      <h2>Contacto / Pedido</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <label>
          Nombre
          <input name="nombre" value={form.nombre} onChange={handleChange} required />
        </label>
        <label>
          Teléfono
          <input name="telefono" value={form.telefono} onChange={handleChange} required />
        </label>
        <label>
          Mensaje
          <textarea name="mensaje" value={form.mensaje} onChange={handleChange} />
        </label>
        <button className="btn" type="submit">Enviar Pedido</button>
        {sent && <p className="success">Pedido enviado (simulado).</p>}
      </form>
    </div>
  );
}
