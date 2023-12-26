import { SafeAreaView } from "react-native";
import { getLoginUserName } from "../../constFiles";
import React, { useState } from "react";
import ChangePasswordDialog from "../Global_Files/ChangePasswordDialog";
import { Option, Title } from "../../comps/MainPageComp";
import MainContainerStyle from "../../comps/MainContainerStyle";

const Home_page_deliver = ({ navigation }) => {
  const userName = getLoginUserName();

  const [passwordDialog, setChangePasswordDialog] = useState(false);

  const showChangePassDialog = () => {
    setChangePasswordDialog(true);
  };

  const closePasswordDialog = () => {
    setChangePasswordDialog(false);
  };

  const deliversManagement = () => {
    navigation.navigate("Delivers_management");
  };

  const deliverySearch = () => {
    navigation.navigate("Delivery_search");
  };

  return (
    <SafeAreaView
      style={{ ...MainContainerStyle.container, alignItems: "center" }}
    >
      <ChangePasswordDialog
        visible={passwordDialog}
        onClose={closePasswordDialog}
      />
      <Title userName={userName} />
      <Option onPress={deliversManagement} text={"לנהל שליחים"} />
      <Option onPress={deliverySearch} text={"לחפש משלוח"} />
      <Option onPress={showChangePassDialog} text={"לשנות סיסמה"} />
    </SafeAreaView>
  );
};

export default Home_page_deliver;
