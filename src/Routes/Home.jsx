import Hero from "../Components/Hero.jsx";
import Menu from "../Components/Menu.jsx";
import Testimonials from "../Components/Testimonials.jsx";
import ContactForm from "../Components/ContactForm.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <section id="menu">
        <Menu />
      </section>
      <section id="testimonios">
        <Testimonials />
      </section>
      <section id="contacto">
        <ContactForm />
      </section>
    </>
  );
}
