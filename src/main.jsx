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
import ChannelPage from './components/channel/ChannelPage'
import VideosTab from './components/channel/VideosTab'
import PlaylistsTab from './components/channel/PlaylistsTab'
import TweetsTab from './components/channel/TweetsTab'
import SubscribedTab from './components/channel/SubscribedTab'
import VideoPage from './components/VideoPage'
import HistoryPage from './components/HistoryPage'
import LikedPage from './components/LikedPage'
import PlaylistPage from './components/PlaylistPage'
import Subscribers from './components/Subscribers'
import SearchPage from './components/SearchPage'
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />} >
      <Route path='' element={<Home />} />
      <Route path='signup' element={<SignUp/>} />
      <Route path='login' element={<Login />} />
      <Route path='dashboard' element={<DashBoard />} />
      <Route path='channel/:userid' element={<ChannelPage/>} >
        <Route index element={<VideosTab />} />
        <Route path="playlists" element={<PlaylistsTab />} />
        <Route path="tweets" element={<TweetsTab />} />
        <Route path="subscribed" element={<SubscribedTab />} />
      </Route>
      <Route path='watch/:videoId' element={<VideoPage />} />
      <Route path='history' element={<HistoryPage />} />
      <Route path='liked' element={<LikedPage />} />
      <Route path='playlist/:playlistId' element={<PlaylistPage />} />
      <Route path='subscribers' element={<Subscribers />} />
      <Route path='search/:query' element={<SearchPage />} />
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
