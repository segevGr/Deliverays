import { View, Text, TouchableOpacity, Alert } from "react-native";
import { getLoginUserName } from "../../constFiles";
import React, { useState } from "react";
import styles from "../Global_Files/Home_page_style";
import Change_password_dialog from "../Global_Files/Change_password_dialog";

const Home_page_deliver = ({ navigation, route }) => {
  const user_name = getLoginUserName();

  const [pass_dialog, set_change_pass_dialog] = useState(false);

  const show_change_pass_dialog = () => {
    set_change_pass_dialog(true);
  };

  const close_pass_dialog = () => {
    set_change_pass_dialog(false);
  };

  const delivers_management = () => {
    navigation.navigate("Delivers_management");
  };

  const deliver_search = () => {
    navigation.navigate("Delivery_search");
  };

  return (
    <View style={styles.container}>
      <Change_password_dialog
        visible={pass_dialog}
        onClose={close_pass_dialog}
      />
      <Text style={styles.title_text}>
        שלום {user_name},{"\n"}מה תרצה לעשות היום?
      </Text>
      <TouchableOpacity style={styles.btn} onPress={delivers_management}>
        <Text style={styles.btn_text}>לנהל שליחים</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={deliver_search}>
        <Text style={styles.btn_text}>לחפש משלוח</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={show_change_pass_dialog}>
        <Text style={styles.btn_text}>לשנות סיסמה</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home_page_deliver;
