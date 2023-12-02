import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { getLoginUserName, getLoginUserId } from "../../constFiles";
import { checkUserLogin, changePassword } from "../../database/usersQueries";

const { width, height } = Dimensions.get("window");

const Change_password_dialog = ({ visible, onClose }) => {
  const username = getLoginUserName();
  const userID = getLoginUserId();

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [acceptNewPass, setAcceptNewPass] = useState("");

  const handle_change_password = async () => {
    if (currentPass == "" || newPass == "" || acceptNewPass == "") {
      Alert.alert("שגיאה!", "אנא מלאו את כל השדות על מנת לשנות סיסמה", [
        { text: "הבנתי" },
      ]);
      return;
    } else if (await checkUserLogin(username, currentPass) === "Doesn't exists") {
      Alert.alert(
        `שגיאה! הסיסמה הנוכחית שהזנת לא נכונה`,
        "אנא הזן סיסמה נוכחית תקינה",
        [{ text: "הבנתי" }]
      );
      return;
    } else if (newPass != acceptNewPass) {
      Alert.alert(
        `שגיאה! הסיסמאות החדשות לא מתאימות`,
        "אנא וודא שהסיסמה החדשה זהה לאימות הסיסמה שהזנת",
        [{ text: "הבנתי" }]
      );
      return;
    } else if (newPass == currentPass) {
      Alert.alert(`שגיאה!`, "הסיסמה החדשה לא יכולה להיות זהה לסיסמה הנוכחית", [
        { text: "הבנתי" },
      ]);
      return;
    } else {
      if (await changePassword(userID, newPass)) {
        Alert.alert(
          `הסיסמה עודכנה בהצלחה!`,
          "",
          [{ text: "תודה!", onPress: () => null }],
          { cancelable: false }
        );
        onClose();
      } else {
        Alert.alert(
          `אופס... משהו השתבש`,
          "אנא נסו שוב מאוחר יותר",
          [{ text: "הבנתי", onPress: () => null }],
          { cancelable: false }
        );
        return;
      }
    }
  };

  useEffect(() => {
    if (visible) {
      setCurrentPass("");
      setNewPass("");
      setAcceptNewPass("");
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <View style={styles.dialog}>
            <Text style={styles.title}>סיסמה נוכחית</Text>
            <TextInput
              style={styles.input_container}
              value={currentPass}
              placeholder="הכנס את הסיסמה הנוכחית"
              onChangeText={setCurrentPass}
              placeholderTextColor="white"
              secureTextEntry={true}
            />

            <Text style={styles.title}>סיסמה חדשה</Text>
            <TextInput
              style={styles.input_container}
              value={newPass}
              placeholder="הכנס את הסיסמה החדשה"
              onChangeText={setNewPass}
              placeholderTextColor="white"
              secureTextEntry={true}
            />

            <Text style={styles.title}>אימות סיסמה</Text>
            <TextInput
              style={styles.input_container}
              value={acceptNewPass}
              placeholder="אמת את הסיסמה החדשה"
              onChangeText={setAcceptNewPass}
              placeholderTextColor="white"
              secureTextEntry={true}
            />

            <View style={styles.btns_container}>
              <TouchableOpacity style={styles.btns} onPress={onClose}>
                <Text style={styles.btns_text}>ביטול</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btns}
                onPress={handle_change_password}
              >
                <Text style={styles.btns_text}>שנה סיסמה</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dialog: {
    width: "85%",
    height: "45%",
    backgroundColor: "white",
    padding: 25,
    borderRadius: 8,
    alignItems: "center",
  },
  option_container: {
    alignItems: "center",
    margin: width * 0.035,
  },
  title: {
    fontSize: width * 0.045,
    marginTop: width * 0.02,
  },
  btns_container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: width * 0.04,
  },
  btns: {
    width: width * 0.3,
    alignItems: "center",
    marginTop: width * 0.05,
  },
  btns_text: {
    color: "#38A3A5",
    fontWeight: "bold",
    fontSize: width * 0.055,
  },
  input_container: {
    width: width * 0.5,
    height: height * 0.06,
    backgroundColor: "#38A3A5",
    borderRadius: width * 0.06,
    textAlign: "center",
    color: "white",
    marginBottom: height * 0.01,
  },
});

export default Change_password_dialog;
