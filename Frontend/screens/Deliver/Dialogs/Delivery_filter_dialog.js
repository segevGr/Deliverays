import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";

const { width, height } = Dimensions.get("window");

const Delivery_filter_dialog = ({
  visible,
  onClose,
  onSave,
  clientNameList,
  citiesList,
}) => {
  const delivered_dropdown = [
    { label: "נמסר", value: 1 },
    { label: "לא נמסר", value: 0 },
  ];

  const clients_dropdown = clientNameList.map((client) => ({
    label: client,
    value: client,
  }));

  const cities_dropdown = citiesList.map((client) => ({
    label: client,
    value: client,
  }));

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const handle_saved_filter = () => {
    let filter_array = { status: null, client: null, city: null };
    if (selectedStatus != null) {
      filter_array["status"] = selectedStatus;
    }
    if (selectedClient != null) {
      filter_array["client"] = selectedClient;
    }
    if (selectedCity != null) {
      filter_array["city"] = selectedCity;
    }
    onSave(filter_array);
    onClose();
  };

  const clear_filters = () => {
    setSelectedStatus(null);
    setSelectedClient(null);
    setSelectedCity(null);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.dialog}>
          <View style={styles.option_container}>
            <Text style={{ fontSize: 22 }}>סטטוס המשלוח</Text>
            <RNPickerSelect
              style={{
                inputIOS: {
                  color: "black",
                  fontSize: 18,
                  textAlign: "center",
                  borderColor: "black",
                  borderWidth: 1,
                },
                inputAndroid: {
                  color: "black",
                  fontSize: 18,
                  textAlign: "center",
                  borderColor: "black",
                  borderWidth: 1,
                },
              }}
              placeholder={{ label: "בחר סטטוס" }}
              items={delivered_dropdown}
              onValueChange={(value) => setSelectedStatus(value)}
              value={selectedStatus}
            />
          </View>

          <View style={styles.option_container}>
            <Text style={{ fontSize: 22 }}>עיר</Text>
            <RNPickerSelect
              style={{
                inputIOS: {
                  color: "black",
                  fontSize: 18,
                  textAlign: "center",
                  borderColor: "black",
                  borderWidth: 1,
                },
                inputAndroid: {
                  color: "black",
                  fontSize: 18,
                  textAlign: "center",
                  borderColor: "black",
                  borderWidth: 1,
                },
              }}
              placeholder={{ label: "בחר לקוח" }}
              items={clients_dropdown}
              onValueChange={(value) => setSelectedClient(value)}
              value={selectedClient}
            />
          </View>

          <View style={styles.option_container}>
            <Text style={{ fontSize: 22 }}>עיר המשלוח</Text>
            <RNPickerSelect
              style={{
                inputIOS: {
                  color: "black",
                  fontSize: 18,
                  textAlign: "center",
                  borderColor: "black",
                  borderWidth: 1,
                },
                inputAndroid: {
                  color: "black",
                  fontSize: 18,
                  textAlign: "center",
                  borderColor: "black",
                  borderWidth: 1,
                },
              }}
              placeholder={{ label: "בחר עיר" }}
              items={cities_dropdown}
              onValueChange={(value) => setSelectedCity(value)}
              value={selectedCity}
            />
          </View>

          <View style={styles.btns_container}>
            <TouchableOpacity style={styles.btns} onPress={onClose}>
              <Text style={styles.btns_text}>ביטול</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btns} onPress={clear_filters}>
              <Text style={styles.btns_text}>נקה</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btns} onPress={handle_saved_filter}>
              <Text style={styles.btns_text}>סנן</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    width: "80%",
    backgroundColor: "white",
    padding: 25,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  btns_container: {
    flexDirection: "row",
  },
  btns: {
    marginLeft: 5,
    width: width * 0.2,
    marginTop: width * 0.05,
    alignItems: "center",
  },
  btns_text: {
    color: "#38A3A5",
    fontWeight: "bold",
    fontSize: width * 0.06,
  },
  option_container: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: width * 0.05,
  },
});

export default Delivery_filter_dialog;
