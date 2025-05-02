import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/Home';
import NewsPage from '../pages/News';
import GigsPage from '../pages/Gigs';
import GalleryPage from '../pages/Gallery';
import AuthPage from '../pages/Auth';

const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <Home />,
        errorElement: <div>Error 404</div>,
      },
      {
        path: 'gigs',
        element: <GigsPage />
      },
      {
        path: 'news',
        element: <NewsPage />
      },
      {
        path: 'gallery',
        element: <GalleryPage />
      },
      {
        path: 'auth',
        element: <AuthPage />
      }
    ],
    { basename: '/dashboard' }
  );  

const JeimRoutes: React.FC = () => <RouterProvider router={router} />;

export default JeimRoutes;