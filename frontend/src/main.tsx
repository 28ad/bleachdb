import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './assets/app.css'

import Home from './pages/Home.tsx';
import Characters from './pages/Characters.tsx';
import Error from './pages/ErrorPage.tsx';

import {createBrowserRouter, RouterProvider} from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/" ,
    element: <Home/>,
    errorElement: <Error/>
  },
  {
    path: "/characters",
    element: <Characters/>
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
