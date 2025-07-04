import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";

const Layout = ({children}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout