import { useEffect, useState } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { ref } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useListVals } from 'react-firebase-hooks/database';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { UserContext, DataContext } from './Context';
import { auth, db } from './Firebase';

import Auth from './screens/Auth';
import Messages from './screens/Messages';
import Settings from './screens/Settings';
import Start from './screens/Start';

const USER_OPTIONS = ['user1', 'user2']


export default function App() {
  const [user, authLoading, authError] = useAuthState(auth)

  const [data, dataLoading, dataError] = useListVals(user ? ref(db, `/data`) : null);
  const [authList, dbLoading, dbError] = useListVals(user ? ref(db, `/auth/${user.uid}`) : null);

  const [sessionData, setSessionData] = useState({})
  const [msgData, setMsgData] = useState()

  useEffect(() => {

  }, [data, dataLoading, dataError])

  useEffect(() => {
    signInAnonymously(auth);

    let session = {
      firebaseUser: user?.uid,
      authLoading: authLoading,
      authError: authError,
      appAuth: false,
      userList: USER_OPTIONS
    }

    // check if firebase user already associated with a user
    if (authList) {
      session.appAuth = true
      session.selectedUser = authList[authList.length - 1] // most recent assignment
      session.pairedUser = (session.selectedUser === 'user1') ? 'user2' : (session.selectedUser === 'user2') ? 'user1' : 'unknown'
    }
    if (authList > 1) {
      console.log("Unexpected authList", authList)
    }

    setSessionData(session)

  }, [user, authLoading, authError, authList, dbLoading, dbError])

  // data fetch
  useEffect(() => {
    data?.reverse()
    setMsgData(data)
  }, [data, dataLoading, dataError])

  return (
    <UserContext.Provider value={{ sessionData, setSessionData }}>
      <DataContext.Provider value={{ msgData, dataLoading }}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Auth />} />
            <Route path='/messages' element={<Messages />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/home' element={<Start />} />
          </Routes>
        </BrowserRouter>
      </DataContext.Provider>
    </UserContext.Provider>

  );
}
