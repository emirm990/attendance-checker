import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './views/Home';
import Statistics from './views/Statistics';
import NewUser from './views/NewUser';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Statistics" component={Statistics} />
        <Stack.Screen name="NewUser" component={NewUser} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;