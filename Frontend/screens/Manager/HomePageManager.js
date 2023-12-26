import { SafeAreaView } from "react-native";
import { getLoginUserName } from "../../constFiles";
import React, { useState } from "react";
import { Option, Title } from "../../comps/MainPageComp";
import MainContainerStyle from "../../comps/MainContainerStyle";
import ChangePasswordDialog from "../../comps/ChangePasswordDialog";

const HomePageDeliver = ({ navigation }) => {
  const userName = getLoginUserName();

  const [passwordDialog, setChangePasswordDialog] = useState(false);

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
        onClose={() => setChangePasswordDialog(false)}
      />
      <Title userName={userName} />
      <Option onPress={deliversManagement} text={"לנהל שליחים"} />
      <Option onPress={deliverySearch} text={"לחפש משלוח"} />
      <Option
        onPress={() => setChangePasswordDialog(true)}
        text={"לשנות סיסמה"}
      />
    </SafeAreaView>
  );
};

export default HomePageDeliver;
