import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import Header from './Header/Header.jsx';
import Footer from './Footer/Footer.jsx';
import CookieBanner from '../ui/CookieBanner/CookieBanner.jsx';
import useTheme from '../../hooks/useTheme.js';

export default function Layout() {
  const { pathname } = useLocation();
  const hideChrome = pathname.startsWith('/admin');
  const { theme, toggle } = useTheme();
  return (
    <>
      <a href="#main" className="skip-link">Vés al contingut</a>
      <Header theme={theme} onToggleTheme={toggle} />
      <div id="main">
        <Outlet />
      </div>
      <Footer />
      <ScrollRestoration />
      {!hideChrome && <CookieBanner />}
    </>
  );
}
