import { StrictMode } from 'react'
import { createRoot, ReactDOM } from 'react-dom/client'
import './index.css'
import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { RouterProvider } from 'react-router'
import Layout from '../Layout'
import Home from './components/Home'
import SignUp from './components/SignUp'
import Login from './components/Login'
import DashBoard from './components/DashBoard'
import { AuthProvider } from './AuthContext'
import ChannelPage from './components/ChannelPage'
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />} >
      <Route path='' element={<Home />} />
      <Route path='signup' element={<SignUp/>} />
      <Route path='login' element={<Login />} />
      <Route path='dashboard' element={<DashBoard />} />
      <Route path='channel/:userid' element={<ChannelPage />} />
    </Route>
  ),
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} /> 
    </AuthProvider>
  </StrictMode>,
)
