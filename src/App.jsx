import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header.jsx";
import Footer from "./Components/Footer.jsx";
import Home from "./Routes/Home.jsx";

function App() {
  return (
    <>
      <Header />
      <main className="content-container">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
