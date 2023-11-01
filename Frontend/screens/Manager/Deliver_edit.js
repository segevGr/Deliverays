import React, { useState } from "react";
import { IP } from "../../constFiles";
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
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const Deliver_edit = ({ navigation, route }) => {
  const ip = IP();
  const { deliver_id, deliver_name } = route.params;

  const back_to_previous_page = () => {
    navigation.goBack();
  };

  const [editUsername, setUsernameOnPress] = useState(false);
  const [Username, setUsername] = useState();

  const editUsernameBtnPress = () => {
    setUsernameOnPress(true);
  };

  const UsernameTextChangeFunction = (newUsername) => {
    setUsername(newUsername);
  };

  const [editPhoneNumber, setPhoneNumberOnPress] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState();

  const editPhoneNumberBtnPress = () => {
    setPhoneNumberOnPress(true);
  };

  const phoneNumberChangeFunction = (newPhoneNumber) => {
    setPhoneNumber(newPhoneNumber);
  };

  const [editAddress, setAddressOnPress] = useState(false);
  const [address, setAddress] = useState();

  const editAddressBtnPress = () => {
    setAddressOnPress(true);
  };

  const addressChangeFunction = (newAddress) => {
    setAddress(newAddress);
  };

  const exitEditMode = () => {
    if (editUsername) {
      setUsernameOnPress(false);
      Keyboard.dismiss();
    } else if (editPhoneNumber) {
      setPhoneNumberOnPress(false);
      Keyboard.dismiss();
    } else if (editAddress) {
      setAddressOnPress(false);
      Keyboard.dismiss();
    }
  };

  const getUsersFromDB = async () => {
    try {
      const response = await fetch(`http://${ip}:3000/user/${deliver_id}`, {
        method: "GET",
      });
      const data = await response.json();
      setUsername(data["user"][0]["fullName"]);
      setAddress(data["user"][0]["address"]);
      setPhoneNumber(data["user"][0]["phoneNumber"]);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const save_changes_press = () => {
    Alert.alert(
      `האם אתה בטוח שאתה רוצה לשמור את השינויים?`,
      "",
      [
        { text: "לא", onPress: () => null },
        { text: "כן", onPress: () => save_changes_in_DB() },
      ],
      { cancelable: false }
    );
  };

  const cancel_changes_press = () => {
    Alert.alert(
      `האם אתה בטוח שאתה רוצה לבטל את השינויים?`,
      "",
      [
        { text: "לא", onPress: () => null },
        { text: "כן", onPress: () => cancel_changes() },
      ],
      { cancelable: false }
    );
  };

  const is_username_already_exists = async () => {
    if (deliver_name == Username) {
      return false;
    }
    try {
      const response = await fetch(`http://${ip}:3000/username/${Username}`, {
        method: "GET",
      });
      const data = await response.json();
      if (data.user.length == 1) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const is_valid_phone_number = () => {
    const valid_phone_number_regex = /^05\d{8}$/;
    if (valid_phone_number_regex.test(phoneNumber)) {
      return true;
    }
    return false;
  };

  const validAddress = async () => {
    const response = await fetch(
      `http://${ip}:3000/letterValidation/${address}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data["Valid address"];
  };

  const save_changes_in_DB = async () => {
    const correct_address = await validAddress();
    if (await is_username_already_exists()) {
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

    try {
      const requestBody = JSON.stringify({
        FullName: Username,
        address: correct_address,
        phoneNumber: phoneNumber,
      });

      const response = await fetch(`http://${ip}:3000/user/${deliver_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });
    } catch (error) {
      console.log("Error fetching users:", error);
      Alert.alert(
        `אופס... משהו השתבש`,
        "אנא נסו שוב מאוחר יותר",
        [{ text: "הבנתי", onPress: () => null }],
        { cancelable: false }
      );
    }

    navigation.goBack();
  };

  const cancel_changes = () => {
    navigation.goBack();
  };

  useFocusEffect(
    React.useCallback(() => {
      getUsersFromDB();
    }, [])
  );

  return (
    <TouchableWithoutFeedback onPress={exitEditMode}>
      <View style={styles.container}>
        <View style={styles.title_style}>
          <TouchableOpacity onPress={back_to_previous_page}>
            <Image
              source={require("../../assets/back_icon.png")}
              style={styles.back_icon}
            />
          </TouchableOpacity>
          <Text style={styles.title_text}>עריכת שליח</Text>
        </View>
        <View>
          <Text style={styles.attribute_text}>שם השליח</Text>
          <TouchableOpacity style={styles.btn} onPress={editUsernameBtnPress}>
            {editUsername ? (
              <TextInput
                style={styles.attribute_input_text}
                onChangeText={UsernameTextChangeFunction}
                value={Username}
                autoFocus={true}
                onBlur={() => setUsernameOnPress(false)}
              />
            ) : (
              <Text style={styles.attribute_input_text}>{Username}</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.attribute_text}>טלפון</Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={editPhoneNumberBtnPress}
          >
            {editPhoneNumber ? (
              <TextInput
                style={styles.attribute_input_text}
                onChangeText={phoneNumberChangeFunction}
                keyboardType="numeric"
                value={phoneNumber}
                autoFocus={true}
                onBlur={() => setPhoneNumberOnPress(false)}
              />
            ) : (
              <Text style={styles.attribute_input_text}>{phoneNumber}</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.attribute_text}>כתובת</Text>
          <TouchableOpacity style={styles.btn} onPress={editAddressBtnPress}>
            {editAddress ? (
              <TextInput
                style={styles.attribute_input_text}
                onChangeText={addressChangeFunction}
                value={address}
                autoFocus={true}
                onBlur={() => setAddressOnPress(false)}
              />
            ) : (
              <Text style={styles.attribute_input_text}>{address}</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.save_btn} onPress={save_changes_press}>
          <Text style={styles.btn_text}>שמירה</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancel_btn}
          onPress={cancel_changes_press}
        >
          <Text style={styles.btn_text}>ביטול</Text>
        </TouchableOpacity>
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
  },
  attribute_input_text: {
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
    marginTop: height * 0.05,
    justifyContent: "center",
    alignItems: "center",
  },
  cancel_btn: {
    backgroundColor: "#FF0000",
    width: width * 0.32,
    height: height * 0.065,
    borderRadius: width * 0.06,
    marginTop: height * 0.03,
    justifyContent: "center",
    alignItems: "center",
  },
  btn_text: {
    color: "white",
    textAlign: "center",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
});

export default Deliver_edit;
