import { lazy, Suspense } from 'react';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ErrorBoundary from './ErrorBoundary';
// import { routes } from "../constants";

// NOTE: this is for the login pages, might have to move it to the libs folder
const router = createBrowserRouter([]);

export default function ProtectedRoutes(): React.ReactElement {
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}
