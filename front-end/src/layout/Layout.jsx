import { useLocation } from 'react-router-dom';
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Routers from "../routes/Routers";

const Layout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/super-admin');

  return (
    <>
      {!isAdminRoute && <Header />}
      <main>
        <Routers />
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default Layout;
