import { SafeAreaView } from "react-native";
import { getLoginUserName } from "../../constFiles";
import React, { useState } from "react";
import { Option, Title } from "../../comps/MainPageComp";
import MainContainerStyle from "../../comps/MainContainerStyle";
import ChangePasswordDialog from "../../comps/ChangePasswordDialog";

const HomePageDeliver = ({ navigation }) => {
  const userName = getLoginUserName();

  const [passwordDialog, setChangePassDialog] = useState(false);

  const createRoute = () => {
    navigation.navigate("Route_creation");
  };

  const DeliveryManagement = () => {
    navigation.navigate("DeliveryManagement");
  };

  return (
    <SafeAreaView
      style={{ ...MainContainerStyle.container, alignItems: "center" }}
    >
      <ChangePasswordDialog
        visible={passwordDialog}
        onClose={() => setChangePassDialog(false)}
      />
      <Title userName={userName} />
      <Option onPress={createRoute} text={"לבנות מסלול"} />
      <Option onPress={DeliveryManagement} text={"לנהל משלוחים"} />
      <Option onPress={() => setChangePassDialog(true)} text={"לשנות סיסמה"} />
    </SafeAreaView>
  );
};

export default HomePageDeliver;
