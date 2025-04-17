import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Signup from './components/Signup';
import Login from './components/Login';
import MainLayout from './components/MainLayout';
import Home from './components/Home';
import '../src/App.css'
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import ChatPage from './components/ChatPage';
import { io } from 'socket.io-client'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/chatSlice';
import { setLikeNotification } from './redux/rtnSlice';
import ProtectedRoutes from './components/ProtectedRoutes';

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      { path: '/', element:<ProtectedRoutes><Home /></ProtectedRoutes> },
      { path: '/profile/:id', element:<ProtectedRoutes><Profile /></ProtectedRoutes>  },
      { path: '/account/edit', element:<ProtectedRoutes><EditProfile /></ProtectedRoutes>  },
      { path: '/chat', element: <ProtectedRoutes><ChatPage /></ProtectedRoutes> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
]);

function App() {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const {socket}=useSelector(store=>store.socketio)
  const socketURL = import.meta.env.VITE_SOCKET_URL;


  useEffect(() => {
    let socketio; 

    if (user) {
      socketio = io(socketURL, {
        query: {
          userId: user?._id,
        },
        transports: ['websocket'],
      });

      dispatch(setSocket(socketio));

      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on('notification',(notification)=>{
        dispatch(setLikeNotification(notification))
      })

      //Doing Cleanup if user leaves then it will turn off the sockrt
    return () => {
      if (socketio) {
        socketio.close();
        dispatch(setSocket(null));
      }
    };

    }else if(socket){
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return <RouterProvider router={browserRouter} />;
}

export default App;
