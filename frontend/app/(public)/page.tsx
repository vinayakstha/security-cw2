import Navbar from "./_components/Navbar";
import Home from "./_components/Home";
import Services from "./_components/Services";
import Footer from "./_components/Footer";
import About from "./_components/About";

export default function Page() {
  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <div className="pt-16">
        <Home />
        <About />
        <Services />
        <Footer />
      </div>
    </div>
  );
}
