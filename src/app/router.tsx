import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '../components/common';
import {
  AlumniPage,
  CommunityPage,
  ErrorPage,
  EventsPage,
  HomePage,
  JNVPage,
  LoginPage,
  RegisterPage,
  MentorshipPage,
  NotFoundPage,
  OpportunitiesPage,
  ProfilePage,
  ProfileEditPage,
} from '../pages';
import App from './App';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'alumni',
        element: <AlumniPage />,
      },
      {
        path: 'jnv',
        element: <JNVPage />,
      },
      {
        path: 'opportunities',
        element: <OpportunitiesPage />,
      },
      {
        path: 'mentorship',
        element: <MentorshipPage />,
      },
      {
        path: 'events',
        element: <EventsPage />,
      },
      {
        path: 'community',
        element: <CommunityPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile/edit',
        element: (
          <ProtectedRoute>
            <ProfileEditPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
