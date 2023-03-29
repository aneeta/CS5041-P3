import { signInAnonymously } from 'firebase/auth';
import { get, query, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useList, useKeys, useListVals } from 'react-firebase-hooks/database';
import { StyleSheet, View } from 'react-native';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { UserContext, DataContext, SettingsContext } from './Context';
import { auth, db } from './Firebase';
import Auth from './screens/Auth';
import Messages from './screens/Messages';
import Settings from './screens/Settings';
import Start from './screens/Start';

export default function App() {
  const [user, authLoading, authError] = useAuthState(auth)

  const [data, dataLoading, dataError] = useListVals(user ? ref(db, `/data`) : null);

  const [authList, dbLoading, dbError] = useListVals(user ? ref(db, `/auth/${user.uid}`) : null);

  const [settingsList, setLoading, setError] = useListVals((user && authList) ? ref(db, `/settings/${authList[0]}`) : null);

  const [sessionData, setSessionData] = useState({})
  const [msgData, setMsgData] = useState()
  const [settings, setSettings] = useState()

  useEffect(() => {

  }, [data, dataLoading, dataError])

  useEffect(() => {
    signInAnonymously(auth);

    let session = {
      firebaseUser: user?.uid,
      authLoading: authLoading,
      authError: authError,
      appAuth: false,
      userList: ['user1', 'user2']
    }
    // check if firebase user already associated with a user
    if (authList) {
      session.appAuth = true
      session.selectedUser = authList[0]
    } else if (authList > 1) {
      console.log("Unexpected authList", authList)
    }
    // const mostViewedPosts = query(ref(db, 'auth'))
    // console.log(mostViewedPosts.val())
    // .then((snapshot) => {
    //   console.log(snapshot)
    //   if (snapshot.exists() && snapshot.key === user) {
    //     session.selectedUser = snapshot.val()
    //   } else {
    //     console.log("No user data available");
    //   }
    // }).catch((error) => {
    //   console.error(error);
    // });


    // get users
    // get(ref(db, 'users')).then((snapshot) => {
    //   if (snapshot.exists()) {
    //     session.userList = Object.keys(snapshot.val())
    //   } else {
    //     console.log("No users on the list");
    //   }
    // }).catch((error) => {
    //   console.error(error);
    // });

    setSessionData(session)

  }, [user, authLoading, authError, authList, dbLoading, dbError])

  // data fetch
  useEffect(() => {
    data?.reverse()
    setMsgData(data)
  }, [data, dataLoading, dataError])

  useEffect(() => {
    setSettings(settingsList)
  }, [settingsList, setLoading, setError])

  return (
    <UserContext.Provider value={{ sessionData, setSessionData }}>
      <DataContext.Provider value={{ msgData, dataLoading }}>
        <SettingsContext.Provider value={{ settings, setSettings }}>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Start />} />
              <Route path='/messages' element={<Messages />} />
              <Route path='/settings' element={<Settings />} />
              <Route path='/auth' element={<Auth />} />
            </Routes>
          </BrowserRouter>
        </SettingsContext.Provider>
      </DataContext.Provider>
    </UserContext.Provider>

  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    overflow: 'hidden'
  },
  card: {
    marginTop: 10,
    marginBottom: 10
  }
});


