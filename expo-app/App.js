import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';


import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://klovia:3003');

const App = () => {
  const [data, setData] = useState("");

  useEffect(() => {


    console.log(socket.connected)

    socket.on('connect', () => {
      console.log('Connected to the server');
    });

    socket.on('message', (data) => {
      console.log('Received message:', data);
      setData(data);
    });
    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });
    // const socket = io('ws://127.0.0.1:3000');

    // socket.on('connect', () => {
    //   console.log('Connected to the server');
    // });

    // socket.on('message', (data) => {
    //   console.log('Received data:', data);
    // });

    // return () => {
    //   socket.disconnect();
    // };
  }, [data]);

  // useEffect(() => {
  //   const socket = new WebSocket('ws://127.0.0.1:3000');

  //   socket.onopen = () => {
  //     console.log('Connected to the server');
  //   };

  //   socket.onmessage = (event) => {
  //     console.log('Received data:', event.data);
  //     setData(event.data)
  //   };

  //   socket.onerror = (error) => {
  //     console.error('WebSocket error:', error);
  //   };

  //   socket.onclose = () => {
  //     console.log('Disconnected from the server');
  //   };

  //   return () => {
  //     socket.close();
  //   };
  // }, []);

  return (
    <View style={styles.container}>
      <Text>{data}</Text>
      <StatusBar style="auto" />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
