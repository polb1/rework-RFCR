import { Outlet, ScrollRestoration } from 'react-router-dom';
import Header from './Header/Header.jsx';
import Footer from './Footer/Footer.jsx';

export default function Layout() {
  return (
    <>
      <a href="#main" className="skip-link">Vés al contingut</a>
      <Header />
      <div id="main">
        <Outlet />
      </div>
      <Footer />
      <ScrollRestoration />
    </>
  );
}
