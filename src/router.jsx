import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import UIKit from './pages/UIKit/UIKit.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/ui', element: <UIKit /> },
  { path: '*', element: <NotFound /> },
]);
