import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from './store/authSlice';
import Layout from './components/Layout';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Resources from './pages/Resources';
import Giveaways from './pages/Giveaways';
import SearchPage from './pages/SearchPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ItemDetail from './pages/ItemDetail';
import CreateListing from './pages/CreateListing';
import Messages from './pages/Messages';
import ChatRoom from './pages/ChatRoom';
import Profile from './pages/Profile';

export default function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token) dispatch(fetchMe());
  }, [dispatch, token]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="resources" element={<Resources />} />
        <Route path="giveaways" element={<Giveaways />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="item/:id" element={<ItemDetail />} />
        <Route path="sell" element={<CreateListing />} />
        <Route path="messages" element={<Messages />} />
        <Route path="messages/:id" element={<ChatRoom />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
