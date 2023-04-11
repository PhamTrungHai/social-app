import { Grid, GridItem, Container, Box, VStack, Flex } from '@chakra-ui/react';
import NavBar from '../components/NavBar';
import { Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import { useState, useEffect } from 'react';
import HomeTab from '../layouts/HomeTab';
import ProfileTab from '../layouts/ProfileTab';
import ProtectedRoute from '../auth/ProtectedRoute';
import { useSelector } from 'react-redux';

function MainPage() {
  const [socket, setSocket] = useState(null);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    const sessionID = localStorage.getItem('sessionID');
    const newSocket = io(`http://${window.location.hostname}:5000`, {
      autoConnect: false,
    });
    if (sessionID) {
      newSocket.auth = { sessionID };
      newSocket.connect();
    } else {
      newSocket.auth = { userId: userInfo._id, userName: userInfo.name };
      newSocket.connect();
    }
    newSocket.on('session', ({ sessionID, userId }) => {
      // attach the session ID to the next reconnection attempts
      newSocket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem('sessionID', sessionID);
      // save the ID of the user
      newSocket.userId = userId;
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket, userInfo._id]);
  return (
    <Grid
      templateRows="80px 87vh"
      templateColumns="repeat(8, 1fr)"
      bg={'whatsapp.400'}
    >
      <GridItem colSpan={8} bg="white" borderBottom={'1px'}>
        {socket ? <NavBar socket={socket} /> : <div>Loading...</div>}
      </GridItem>
      <GridItem colSpan={8} overflow={'scroll'}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomeTab />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:id"
            element={
              <ProtectedRoute>
                <ProfileTab />
              </ProtectedRoute>
            }
          />
        </Routes>
      </GridItem>
    </Grid>
  );
}

export default MainPage;
