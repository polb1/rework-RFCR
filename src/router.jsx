import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Home from './pages/Home/Home.jsx';
import UIKit from './pages/UIKit/UIKit.jsx';
import Calendar from './pages/Calendar/Calendar.jsx';
import Results from './pages/Results/Results.jsx';
import Standings from './pages/Standings/Standings.jsx';
import News from './pages/News/News.jsx';
import NewsDetail from './pages/NewsDetail/NewsDetail.jsx';
import Team from './pages/Team/Team.jsx';
import PlayerDetail from './pages/PlayerDetail/PlayerDetail.jsx';
import Stadium from './pages/Stadium/Stadium.jsx';
import History from './pages/History/History.jsx';
import Board from './pages/Board/Board.jsx';
import Sponsors from './pages/Sponsors/Sponsors.jsx';
import Contact from './pages/Contact/Contact.jsx';
import Shop from './pages/Shop/Shop.jsx';
import ProductDetail from './pages/ProductDetail/ProductDetail.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/ui', element: <UIKit /> },
      { path: '/calendari', element: <Calendar /> },
      { path: '/resultats', element: <Results /> },
      { path: '/classificacio', element: <Standings /> },
      { path: '/actualitat', element: <News /> },
      { path: '/actualitat/:slug', element: <NewsDetail /> },
      { path: '/equip', element: <Team /> },
      { path: '/equip/:slug', element: <PlayerDetail /> },
      { path: '/estadi', element: <Stadium /> },
      { path: '/historia', element: <History /> },
      { path: '/directiva', element: <Board /> },
      { path: '/patrocinadors', element: <Sponsors /> },
      { path: '/contacte', element: <Contact /> },
      { path: '/botiga', element: <Shop /> },
      { path: '/botiga/:slug', element: <ProductDetail /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
