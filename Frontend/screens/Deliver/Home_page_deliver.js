import { SafeAreaView } from "react-native";
import { getLoginUserName } from "../../constFiles";
import React, { useState } from "react";
import ChangePasswordDialog from "../Global_Files/ChangePasswordDialog";
import { Option, Title } from "../../comps/MainPageComp";
import MainContainerStyle from "../../comps/MainContainerStyle";

const Home_page_deliver = ({ navigation }) => {
  const userName = getLoginUserName();

  const [passwordDialog, setChangePassDialog] = useState(false);

  const showChangePassDialog = () => {
    setChangePassDialog(true);
  };

  const closePassDialog = () => {
    setChangePassDialog(false);
  };

  const createRoute = () => {
    navigation.navigate("Route_creation");
  };

  const DeliveryManagement = () => {
    navigation.navigate("Delivery_management");
  };

  return (
    <SafeAreaView
      style={{ ...MainContainerStyle.container, alignItems: "center" }}
    >
      <ChangePasswordDialog
        visible={passwordDialog}
        onClose={closePassDialog}
      />
      <Title userName={userName} />
      <Option onPress={createRoute} text={"לבנות מסלול"} />
      <Option onPress={DeliveryManagement} text={"לנהל משלוחים"} />
      <Option onPress={showChangePassDialog} text={"לשנות סיסמה"} />
    </SafeAreaView>
  );
};

export default Home_page_deliver;
