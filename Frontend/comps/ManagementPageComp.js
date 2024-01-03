import { Text, TouchableOpacity, View, StyleSheet, Image } from "react-native";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faTrashCan,
  faPen,
} from "@fortawesome/free-solid-svg-icons";

const PageHeader = ({ onPress, headerText }) => {
  return (
    <View style={styles.titleContainer}>
      <TouchableOpacity onPress={onPress}>
        <FontAwesomeIcon icon={faArrowLeft} size={50} style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.titleText}>{headerText}</Text>
    </View>
  );
};

const ItemInList = ({
  deleteOnClick,
  infoOnClick,
  itemText,
  backgroundColor,
}) => {
  return (
    <View style={{ ...styles.itemContainer, backgroundColor: backgroundColor }}>
      <Text style={styles.itemName}>{itemText}</Text>
      <View style={styles.btnsContainer}>
        <TouchableOpacity onPress={deleteOnClick}>
          <FontAwesomeIcon
            icon={faTrashCan}
            size={40}
            color="white"
            style={styles.iconItem}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={infoOnClick}>
          <FontAwesomeIcon
            icon={faPen}
            size={40}
            color="white"
            style={styles.iconItem}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const PageFooter = ({ addOnPress, addText, filterOnPress, FilterText }) => {
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        style={{ ...styles.itemBtnContainer, backgroundColor: "#4FC132" }}
        onPress={addOnPress}
      >
        <Text style={styles.itemBtnText}>{addText}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ ...styles.itemBtnContainer, backgroundColor: "#38A3A5" }}
        onPress={filterOnPress}
      >
        <Text style={styles.itemBtnText}>{FilterText}</Text>
      </TouchableOpacity>
    </View>
  );
};

PageHeader.prototype = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

ItemInList.prototype = {
  addOnPress: PropTypes.func.isRequired,
  addText: PropTypes.string.isRequired,
  filterOnPress: PropTypes.func.isRequired,
  FilterText: PropTypes.string.isRequired,
};

PageFooter.prototype = {
  addOnPress: PropTypes.func.isRequired,
  infoOnClick: PropTypes.func.isRequired,
  addText: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  titleContainer: {
    height: 100,
    width: "100%",
    marginBottom: 50,
  },
  titleText: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
    color: "#38A3A5",
  },
  backIcon: {
    width: 45,
    height: 48,
    marginLeft: 15,
  },
  itemContainer: {
    width: 370,
    height: 65,
    borderRadius: 20,
    marginTop: 20,
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  itemName: {
    color: "white",
    textAlign: "right",
    fontSize: 25,
    paddingRight: 20,
    width: "70%",
  },
  btnsContainer: {
    width: "30%",
    flexDirection: "row",
  },
  iconItem: {
    marginLeft: 10,
  },
  add_item_btn: {
    backgroundColor: "#4FC132",
    width: 20,
    height: 20,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  filter_btn: {
    backgroundColor: "#38A3A5",
    width: 20,
    height: 20,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  add_user_label: {
    fontSize: 20,
  },
  footerContainer: {
    height: 130,
  },
  itemBtnContainer: {
    width: 160,
    height: 60,
    borderRadius: 30,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  itemBtnText: {
    color: "white",
    fontSize: 23,
  },
});

export { PageHeader, ItemInList, PageFooter };
