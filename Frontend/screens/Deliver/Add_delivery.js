import React, { useState } from "react";
import { IP, getLoginUserId } from "../../constFiles";
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

const { width, height } = Dimensions.get("window");

const Add_delivery = ({ navigation }) => {
  const ip = IP();
  const deliver_id = getLoginUserId();

  const back_to_previous_page = () => {
    navigation.goBack();
  };

  const [ID, setID] = useState();
  const IDTextChangeFunction = (newID) => {
    setID(newID);
  };

  const [street, setStreet] = useState("");
  const streetTextChangeFunction = (newStreet) => {
    setStreet(newStreet);
  };

  const [city, setCity] = useState("");
  const cityTextChangeFunction = (newCity) => {
    setCity(newCity);
  };

  const [client, setClient] = useState("");
  const clientTextChangeFunction = (newClient) => {
    setClient(newClient);
  };

  const [recipient, setRecipient] = useState("");
  const recipientChangeFunction = (newRecipient) => {
    setRecipient(newRecipient);
  };

  const [recipient_phoneNumber, setRecipient_phoneNumber] = useState("");
  const recipient_phoneNumberChangeFunction = (newRecipient_phoneNumber) => {
    setRecipient_phoneNumber(newRecipient_phoneNumber);
  };

  const [deliveryDate, setDeliveryDate] = useState("");
  const deliveryDateChangeFunction = (newDeliveryDate) => {
    setDeliveryDate(newDeliveryDate);
  };

  const save_changes_press = () => {
    Alert.alert(
      `האם אתה בטוח שאתה רוצה להוסיף את המשלוח?`,
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
    if (
      ID == "" ||
      street == "" ||
      city == "" ||
      client == "" ||
      recipient == "" ||
      recipient_phoneNumber == "" ||
      deliveryDate == ""
    ) {
      Alert.alert(`אנא מלאו את כל השדות`, "", [{ text: "הבנתי!" }]);
    } else {
      save_changes_in_DB();
    }
  };

  const convert_date_to_request_syntax = (date) => {
    return date.replace(/\./g, "-");
  };

  const is_valid_phone_number = () => {
    const valid_phone_number_regex = /^05\d{8}$/;
    if (valid_phone_number_regex.test(recipient_phoneNumber)) {
      return true;
    }
    return false;
  };

  const is_id_already_exists = async () => {
    try {
      const response = await fetch(`http://${ip}:3000/letter/${ID}`, {
        method: "GET",
      });
      const data = await response.json();
      if (data.result.length == 1) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("Error fetching letters:", error);
    }
  };

  const is_valid_date_format = () => {
    const dateRegex = /^(0[1-9]|[1-2]\d|3[0-1])\.(0[1-9]|1[0-2])\.\d{4}$/;
    if (!dateRegex.test(deliveryDate)) {
      Alert.alert(
        `שגיאה - תאריך לא תקין`,
        "אנא הזן תאריך תקין לפי הפורמט\nDD.MM.YYYY",
        [{ text: "הבנתי!" }]
      );
      return false;
    }

    const [day, month, year] = deliveryDate.split(".").map(Number);
    const providedDate = new Date(year, month - 1, day);

    const today = new Date();

    if (providedDate < today) {
      Alert.alert(
        `שגיאה - תאריך לא תקין`,
        "התאריך שהזנת כבר עבר\nאנא הכנס תאריך עתידי",
        [{ text: "הבנתי!" }]
      );
      return false;
    }
    return true;
  };

  const validAddress = async () => {
    let address = street + ", " + city;
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
    if (await is_id_already_exists()) {
      Alert.alert(
        `שגיאה - מספר המשלוח כבר קיים במערכת`,
        "אנא בדקו שהזנתם את מספר המשלוח כראוי",
        [{ text: "הבנתי!" }]
      );
      return;
    } else if (!correct_address) {
      Alert.alert(
        `שגיאה! כתובת המשלוח אינה קיימת`,
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
    } else if (!is_valid_date_format()) {
      return;
    }

    setStreet(correct_address.split(",")[0].trim());
    setCity(correct_address.split(",")[1].trim());

    const requestBody = JSON.stringify({
      letterNumber: ID,
      addressee: recipient,
      clientName: client,
      deliveryStreet: street,
      deliveryCity: city,
      deliveryDeadline: convert_date_to_request_syntax(deliveryDate),
      addresseePhoneNumber: recipient_phoneNumber,
      userID: deliver_id,
    });

    try {
      const response = await fetch(`http://${ip}:3000/letter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      Alert.alert(
        `המשלוח נוסף בהצלחה למערכת!`,
        "",
        [{ text: "תודה!", onPress: () => null }],
        { cancelable: false }
      );
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
          <Text style={styles.title_text}>הוספת משלוח חדש</Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View>
              <Text style={styles.attribute_text}>שם ומספר רחוב</Text>
                <TextInput
                  style={styles.btn}
                  onChangeText={streetTextChangeFunction}
                  value={street}
                />
              <Text style={styles.attribute_text}>עיר</Text>
                <TextInput
                  style={styles.btn}
                  onChangeText={cityTextChangeFunction}
                  value={city}
                />
              <Text style={styles.attribute_text}>מספר סידורי של המכתב</Text>
                <TextInput
                  style={styles.btn}
                  onChangeText={IDTextChangeFunction}
                  value={ID}
                  keyboardType="numeric"
                />
              <Text style={styles.attribute_text}>שולח</Text>
                <TextInput
                  style={styles.btn}
                  onChangeText={clientTextChangeFunction}
                  value={client}
                />
              <Text style={styles.attribute_text}>נמען</Text>
                <TextInput
                  style={styles.btn}
                  onChangeText={recipientChangeFunction}
                  value={recipient}
                />
              <Text style={styles.attribute_text}>מספר טלפון של הנמען</Text>
                <TextInput
                  style={styles.btn}
                  onChangeText={recipient_phoneNumberChangeFunction}
                  value={recipient_phoneNumber}
                  keyboardType="numeric"
                />
              <Text style={styles.attribute_text}>צריך להימסר עד</Text>
                <TextInput
                  style={styles.btn}
                  onChangeText={deliveryDateChangeFunction}
                  value={deliveryDate}
                  keyboardType="numeric"
                  placeholder="DD.MM.YYYY"
                />
            </View>

            <View style={styles.btns_container}>
              <TouchableOpacity
                style={styles.save_btn}
                onPress={save_changes_press}
              >
                <Text style={styles.btn_text}>הוספת משלוח</Text>
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
  title_text: {
    textAlign: "center",
    fontSize: height * 0.06,
    // fontWeight: 'bold',
    // marginTop: height * 0.08,
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
  btns_container: {
    alignItems: "center",
    marginBottom: width * 0.1,
  },
});

export default Add_delivery;
