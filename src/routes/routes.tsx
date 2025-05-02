import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/Home';
import NewsPage from '../pages/News';
import GigsPage from '../pages/Gigs';
import GalleryPage from '../pages/Gallery';
import AuthPage from '../pages/Auth';

const router = createBrowserRouter([
    {
        path: '/dashboard',
        element: <Home />,
        errorElement: <div>Error 404</div>,
    },
    {
        path: '/dashboard/gigs',
        element: <GigsPage />
    },
    {
        path: '/dashboard/news',
        element: <NewsPage />
    },
    {
        path: '/dashboard/gallery',
        element: <GalleryPage />
    },
    {
        path: '/dashboard/auth',
        element: <AuthPage />
    }
]);

const JeimRoutes: React.FC = () => <RouterProvider router={router} />;

export default JeimRoutes;