import { useState } from "react";

const initialItems = [
  { id: 1, name: "Hamburguesa Clásica", price: 5000, desc: "Carne, queso, lechuga, tomate" },
  { id: 2, name: "Completo Italiano", price: 4000, desc: "Salchicha, palta, tomate, mayonesa" },
  { id: 3, name: "Papas fritas", price: 2000, desc: "Crocantes" }
];

export default function Menu() {
  const [items] = useState(initialItems);

  return (
    <div className="container menu">
      <h2>Menú</h2>
      <div className="menu-grid">
        {items.map(item => (
          <div key={item.id} className="menu-card">
            <h3>{item.name}</h3>
            <p className="desc">{item.desc}</p>
            <div className="price">{item.price.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</div>
            <button className="btn">Pedir</button>
          </div>
        ))}
      </div>
    </div>
  );
}
