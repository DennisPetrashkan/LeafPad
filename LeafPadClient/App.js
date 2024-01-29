import 'react-native-gesture-handler';

// Navigation
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

// External Import
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

// Internal Imports
import WelcomeScreen from './screens/WelcomeScreen'
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import { FIREBASE_AUTH } from './services/Config';
import Home from './screens/HomeScreen';
import AddClient from './screens/AddClientScreen';
import EditClient from './screens/EditClientScreen';
import WriteEmail from './screens/WriteEmailScreen';
import WriteNote from './screens/WriteNoteScreen';


// Navigator Creation
const OutsideStack = createStackNavigator();
const Stack = createStackNavigator();
const InsideDrawer = createDrawerNavigator();

// Inside Drawer Navigator Creation
function InsideDrawerFunct(){
  return(
  <InsideDrawer.Navigator>
    <InsideDrawer.Screen name="Home" component={Home} />
    <InsideDrawer.Screen name="WriteEmail" component={WriteEmail} options={{title: 'Send Email'}}/>
    <InsideDrawer.Screen name="WriteNote" component={WriteNote} options={{title: 'Set Reminder'}}/>
    <InsideDrawer.Screen name="AddClient" component={AddClient} options={{drawerItemStyle: { display: 'none' }}}/>
    <InsideDrawer.Screen name="EditClient" component={EditClient} options={{drawerItemStyle: { display: 'none' }}}/>
  </InsideDrawer.Navigator>
  );
}

// Outside Stack Navigator Creation
function OutsideStackFunct(){
  return(
  <OutsideStack.Navigator initialRouteName="WelcomeScreen">
    <OutsideStack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{headerShown: false}} />
    <OutsideStack.Screen name="LoginScreen" component={LoginScreen} />
    <OutsideStack.Screen name="RegisterScreen" component={RegisterScreen} />
  </OutsideStack.Navigator>
  );
}

// Main Function
export default function App() {

  // User Login State
  const [user, setUser] = useState(null);

  // Sets User Once Logged In
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
  }, [])

  // Main JSX
  return(
    <NavigationContainer>
      {/* Outside Stack Navigator Initialized By Default */}
      <Stack.Navigator>
        {user ? (
          // Inside Drawer Navigator Initialized if User is Logged In
          <Stack.Screen name="InsideDrawer" component={InsideDrawerFunct} options={{headerShown: false}}/>
        ) : (
          <Stack.Screen name="Outside" component={OutsideStackFunct} options={{headerShown: false}}/>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


