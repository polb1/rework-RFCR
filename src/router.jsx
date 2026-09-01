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
      { path: '*', element: <NotFound /> },
    ],
  },
]);
