import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { RadioButton } from "react-native-paper";
import {
  isIdAlreadyExists,
  isUserNameAlreadyExists,
  addUser,
} from "../../database/usersQueries";

const { width, height } = Dimensions.get("window");

const Add_deliver = ({ navigation }) => {
  const back_to_previous_page = () => {
    navigation.goBack();
  };

  const [Username, setUsername] = useState("");
  const UsernameTextChangeFunction = (newUsername) => {
    setUsername(newUsername);
  };

  const [phoneNumber, setPhoneNumber] = useState("");
  const phoneNumberChangeFunction = (newPhoneNumber) => {
    setPhoneNumber(newPhoneNumber);
  };

  const [address, setAddress] = useState("");
  const addressChangeFunction = (newAddress) => {
    setAddress(newAddress);
  };

  const [ID, setID] = useState("");
  const IDChangeFunction = (newID) => {
    setID(newID);
  };

  const [role, setRole] = useState("0");

  const save_changes_press = async () => {
    Alert.alert(
      `האם אתה בטוח שאתה רוצה לשמור את השליח במערכת?`,
      "",
      [
        { text: "לא", onPress: () => null },
        { text: "כן", onPress: () => check_if_filled_all_fields() },
      ],
      { cancelable: false }
    );
  };

  const cancel_changes_press = () => {
    Alert.alert(
      `האם אתה בטוח שאתה רוצה לבטל את ההוספה?`,
      "",
      [
        { text: "לא", onPress: () => null },
        { text: "כן", onPress: () => cancel_changes() },
      ],
      { cancelable: false }
    );
  };

  const check_if_filled_all_fields = async () => {
    if (Username == "" || phoneNumber == "" || ID == "" || address == "") {
      Alert.alert(`אנא מלאו את כל השדות`, "", [{ text: "הבנתי!" }]);
    } else {
      save_changes_in_DB();
    }
  };

  const is_valid_phone_number = () => {
    const valid_phone_number_regex = /^05\d{8}$/;
    if (valid_phone_number_regex.test(phoneNumber)) {
      return true;
    }
    return false;
  };

  // const validAddress = async () => {
  //   const response = await fetch(
  //     `http://${ip}:3000/letterValidation/${address}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );

  //   const data = await response.json();
  //   return data["Valid address"];
  // };

  const save_changes_in_DB = async () => {
    // const correct_address = await validAddress();
    const correct_address = true;
    if (await isIdAlreadyExists(ID)) {
      Alert.alert(
        `שגיאה - מספר התז כבר קיים במערכת`,
        "אנא בדקו שהמשתמש כבר לא קיים במערכת",
        [{ text: "הבנתי!" }]
      );
      return;
    } else if (await isUserNameAlreadyExists(Username)) {
      Alert.alert(`שגיאה - שם המשתמש כבר תפוס`, "אנא נסו להזין שם משתמש חדש", [
        { text: "הבנתי!" },
      ]);
      return;
    } else if (!correct_address) {
      Alert.alert(
        `שגיאה! כתובת השליח אינה קיימת`,
        `אנא מלא כתובת תקינה`,
        [{ text: "הבנתי", onPress: () => null }],
        { cancelable: false }
      );
      return;
    } else if (!is_valid_phone_number()) {
      Alert.alert(`שגיאה - מספר הטלפון לא תקין`, "אנא הזן מספר טלפון תקין", [
        { text: "הבנתי!" },
      ]);
      return;
    }

    const userDetails = {
      ID: ID,
      fullName: Username,
      address: address,
      phoneNumber: phoneNumber,
      isAdmin: role,
      password: "1234",
      isActiveUser: 1,
    };

    const addResult = await addUser(userDetails, ID);
    if (addResult !== true) {
      console.log("Error fetching letters:", addResult);
      Alert.alert(
        `אופס... משהו השתבש`,
        "אנא נסו שוב מאוחר יותר",
        [{ text: "הבנתי", onPress: () => null }],
        { cancelable: false }
      );
      return;
    }
    Alert.alert(
      `השליח ${Username} נוסף בהצלחה למערכת!`,
      "",
      [{ text: "תודה!", onPress: () => null }],
      { cancelable: false }
    );

    navigation.goBack();
  };

  const cancel_changes = () => {
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.title_style}>
          <TouchableOpacity onPress={back_to_previous_page}>
            <Image
              source={require("../../assets/back_icon.png")}
              style={styles.back_icon}
            />
          </TouchableOpacity>
          <Text style={styles.title_text}>הוספת שליח חדש</Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View>
              <Text style={styles.attribute_text}>שם השליח</Text>
              <TextInput
                style={styles.btn}
                onChangeText={UsernameTextChangeFunction}
                value={Username}
              />
              <Text style={styles.attribute_text}>טלפון</Text>
              <TextInput
                style={styles.btn}
                onChangeText={phoneNumberChangeFunction}
                keyboardType="numeric"
                value={phoneNumber}
              />
              <Text style={styles.attribute_text}>מספר תז</Text>
              <TextInput
                style={styles.btn}
                onChangeText={IDChangeFunction}
                value={ID}
                keyboardType="numeric"
              />
              <Text style={styles.attribute_text}>כתובת</Text>
              <TextInput
                style={styles.btn}
                onChangeText={addressChangeFunction}
                value={address}
              />

              <Text style={styles.attribute_text}>תפקיד</Text>
              <RadioButton.Group
                onValueChange={(value) => setRole(value)}
                value={role}
              >
                <RadioButton.Item
                  label="שליח"
                  value="0"
                  labelStyle={styles.radio_btns}
                />
                <RadioButton.Item
                  label="מנהל"
                  value="1"
                  labelStyle={styles.radio_btns}
                />
              </RadioButton.Group>
            </View>

            <View style={styles.btns_container}>
              <TouchableOpacity
                style={styles.save_btn}
                onPress={save_changes_press}
              >
                <Text style={styles.btn_text}>שמירה</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancel_btn}
                onPress={cancel_changes_press}
              >
                <Text style={styles.btn_text}>ביטול</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#C7F9CC",
  },
  scrollView: {
    width: width,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  title_text: {
    textAlign: "center",
    fontSize: height * 0.06,
    color: "#38A3A5",
  },
  btn: {
    backgroundColor: "white",
    width: width * 0.65,
    height: height * 0.065,
    borderRadius: width * 0.06,
    justifyContent: "center",
    alignItems: "center",
    color: "black",
    textAlign: "center",
    fontSize: width * 0.06,
  },
  back_icon: {
    width: width * 0.1,
    height: width * 0.1,
    marginLeft: width * 0.08,
  },
  title_style: {
    display: "flex",
    marginTop: height * 0.05,
    width: width,
  },
  attribute_text: {
    textAlign: "center",
    fontSize: width * 0.06,
    marginTop: width * 0.08,
  },
  save_btn: {
    backgroundColor: "#4FC132",
    width: width * 0.32,
    height: height * 0.065,
    borderRadius: width * 0.06,
    marginTop: height * 0.02,
    justifyContent: "center",
    alignItems: "center",
  },
  cancel_btn: {
    backgroundColor: "#FF0000",
    width: width * 0.32,
    height: height * 0.065,
    borderRadius: width * 0.06,
    marginTop: height * 0.01,
    justifyContent: "center",
    alignItems: "center",
  },
  btn_text: {
    color: "white",
    textAlign: "center",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  btns_container: {
    alignItems: "center",
  },
  radio_btns: {
    textAlign: "right",
    fontSize: width * 0.05,
  },
});

export default Add_deliver;
