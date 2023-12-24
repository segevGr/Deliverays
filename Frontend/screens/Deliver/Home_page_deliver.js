import { View, Text, TouchableOpacity, Alert } from "react-native";
import { getLoginUserName } from "../../constFiles";
import React, { useState } from "react";
import styles from "../Global_Files/Home_page_style";
import ChangePasswordDialog from "../Global_Files/ChangePasswordDialog";
import { Option, Title } from "../../comps/MainPageOptions";

const Home_page_deliver = ({ navigation }) => {
  const userName = getLoginUserName();

  const [passDialog, setChangePassDialog] = useState(false);

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
    <View style={styles.container}>
      <ChangePasswordDialog visible={passDialog} onClose={closePassDialog} />
      <Title userName={userName} titleStyle={styles.titleText} />
      <Option
        btnStyle={styles.btn}
        onPress={createRoute}
        testStyle={styles.btnText}
        text={"לבנות מסלול"}
      />
      <Option
        btnStyle={styles.btn}
        onPress={DeliveryManagement}
        testStyle={styles.btnText}
        text={"לנהל משלוחים"}
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
