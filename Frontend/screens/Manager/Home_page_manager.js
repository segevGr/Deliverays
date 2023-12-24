import { View, Text, TouchableOpacity, Alert } from "react-native";
import { getLoginUserName } from "../../constFiles";
import React, { useState } from "react";
import styles from "../Global_Files/Home_page_style";
import ChangePasswordDialog from "../Global_Files/ChangePasswordDialog";
import { Option, Title } from "../../comps/MainPageOptions";

const Home_page_deliver = ({ navigation, route }) => {
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
    <View style={styles.container}>
      <ChangePasswordDialog
        visible={passwordDialog}
        onClose={closePasswordDialog}
      />
      <Title userName={userName} titleStyle={styles.titleText} />
      <Option
        btnStyle={styles.btn}
        onPress={deliversManagement}
        testStyle={styles.btnText}
        text={"לנהל שליחים"}
      />
      <Option
        btnStyle={styles.btn}
        onPress={deliverySearch}
        testStyle={styles.btnText}
        text={"לחפש משלוח"}
      />
      <Option
        btnStyle={styles.btn}
        onPress={showChangePassDialog}
        testStyle={styles.btnText}
        text={"לשנות סיסמה"}
      />
    </View>
  );
};

export default Home_page_deliver;
