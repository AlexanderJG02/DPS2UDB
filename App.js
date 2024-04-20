import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; 

import Tab1 from './screens/Tab1';
import Tab2 from './screens/Tab2';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Gastos') {
              iconName = focused ? 'money' : 'money';
            } else if (route.name === 'Tarjetas de Crédito') {
              iconName = focused ? 'credit-card' : 'credit-card';
            }

            return (
              <FontAwesome name={iconName} size={size} color={color} />
            );
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Gastos" component={Tab1} />
        <Tab.Screen name="Tarjetas de Crédito" component={Tab2} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
