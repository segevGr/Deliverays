import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import Home_page_deliver from "./screens/Deliver/Home_page_deliver";
import Home_page_manager from "./screens/Manager/Home_page_manager";
import Delivers_management from "./screens/Manager/Delivers_management";
import Delivery_management from "./screens/Deliver/Delivery_management";
import Deliver_edit from "./screens/Manager/Deliver_edit";
import Delivery_search from "./screens/Manager/Delivery_search";
import Add_deliver from "./screens/Manager/Add_deliver";
import Add_delivery from "./screens/Deliver/Add_delivery";
import Delivery_edit from "./screens/Deliver/Delivery_edit";
import Route_creation from "./screens/Deliver/Route_creation";
import Route from "./screens/Deliver/Route";

const Stack = createNativeStackNavigator();
// for another screen we have to import the screen and add a <Stack.Screen> with that details

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="Home_page_deliver" component={Home_page_deliver} />
        <Stack.Screen name="Home_page_manager" component={Home_page_manager} />
        <Stack.Screen
          name="Delivers_management"
          component={Delivers_management}
        />
        <Stack.Screen
          name="Delivery_management"
          component={Delivery_management}
        />
        <Stack.Screen name="Deliver_edit" component={Deliver_edit} />
        <Stack.Screen name="Delivery_search" component={Delivery_search} />
        <Stack.Screen name="Add_deliver" component={Add_deliver} />
        <Stack.Screen name="Add_delivery" component={Add_delivery} />
        <Stack.Screen name="Delivery_edit" component={Delivery_edit} />
        <Stack.Screen name="Route_creation" component={Route_creation} />
        <Stack.Screen name="Route" component={Route} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;
