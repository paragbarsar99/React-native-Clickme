import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Welcome from './Screens/Welcome';
import ClickMe from './Screens/ClickMe';

const Stack = createNativeStackNavigator();

const Route = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name={'Welcome'} component={Welcome} />
    <Stack.Screen name={'ClickMe'} component={ClickMe} />
  </Stack.Navigator>
);

export default Route;
