import React, { useState } from 'react';
import {IP} from '../../constsFiles';
import {
    View, TextInput, Text, StyleSheet, TouchableOpacity, Alert,
    Dimensions, Image, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const Delivery_search = ({ navigation }) => {
    const ip = IP();

    const back_to_previous_page = () => {
        navigation.goBack();
    };

    const [editSearch, setSearchOnPress] = useState(false);
    const [search, setSearch] = useState('');

    const editSearchBtnPress = () => {
        setSearchOnPress(true);
    };

    const SearchTextChangeFunction = (newSearch) => {
        setSearch(newSearch);
    };

    const exitEditMode = () => {
        if (editSearch) {
            setSearchOnPress(false);
            Keyboard.dismiss();
        }
    };

    const getUserNameFromDB = async (userID) => {
        try {
            const response = await fetch(`http://${ip}:3000/user/${userID}`, {
                method: 'GET',
            });
            const data = await response.json();
            return data["user"][0]['fullName']
        } catch (error) {
            console.log('Error fetching users:', error);
        }
    };

    const getDeliveryFromDB = async () => {
        try {
            const response = await fetch(`http://${ip}:3000/letter/${search}`, {
                method: 'GET',
            });
            const data = await response.json();
            if (data.result.length == 0) {
                return "notExists"
            }
            setAddressee(data["result"][0]['addressee']);
            setDeliver(await getUserNameFromDB(data["result"][0]['userID']))
            setAddress(data["result"][0]['deliveryAddress'])
            if (data["result"][0]['isDelivered'] == 1) {
                return "delivered"
            } else {
                return "undelivered"
            }
        } catch (error) {
            console.log('Error fetching users:', error);
        }
    };


    const search_delivery = async () => {
        if (search == '') {
            Alert.alert(
                'אנא מלאו את כתובת המשלוח',
                '',
                [{ text: 'OK', }]
            );
            setNotFoundDelivery(false);
            setDeliveryDetails(false);
            return;
        }

        const delivey_status = await getDeliveryFromDB();

        if (delivey_status == "notExists") {
            setDeliveryDetails(false);
            setNotFoundDelivery(true);
        } else if (delivey_status == "delivered") {
            setDeliveryStatus({ 'color': 'green', 'status': 'נמסר' })
            setNotFoundDelivery(false);
            setDeliveryDetails(true);
        } else {
            setDeliveryStatus({ 'color': 'red', 'status': 'לא נמסר' })
            setNotFoundDelivery(false);
            setDeliveryDetails(true);
        }
        Keyboard.dismiss();

    }

    const [showDeliveryDetails, setDeliveryDetails] = useState();
    const [showNotFoundDelivery, setNotFoundDelivery] = useState();

    const [deliver, setDeliver] = useState();
    const [addressee, setAddressee] = useState();
    const [address, setAddress] = useState();

    const [deliveryStatus, setDeliveryStatus] = useState();

    useFocusEffect(
        React.useCallback(() => {
            setDeliveryDetails(false);
            setNotFoundDelivery(false);
        }, [])
    );


    return (
        <TouchableWithoutFeedback onPress={exitEditMode}>

            <View style={styles.container}>
                <View style={styles.header_container}>
                    <TouchableOpacity onPress={back_to_previous_page}>
                        <Image source={require('../../assets/back_icon.png')} style={styles.back_icon} />
                    </TouchableOpacity>
                    <Text style={styles.title_text}>חיפוש משלוח</Text>
                </View>
                <View style={styles.search_bar_conainer}>
                    <TouchableOpacity style={styles.search_btn_container} onPress={editSearchBtnPress}>
                        <View style={styles.search_btn_icon_container}>
                            <TouchableOpacity onPress={search_delivery}>
                                <Image source={require('../../assets/Search_alt.png')} style={styles.search_btn} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.editText_container}>
                            {editSearch ? (
                                <TextInput
                                    style={styles.search_input_text}
                                    onChangeText={SearchTextChangeFunction}
                                    value={search}
                                    autoFocus={true}
                                    keyboardType="numeric"
                                    placeholder='אנא הכנס מזהה משלוח'
                                    onBlur={() => setSearchOnPress(false)}
                                />
                            ) : (
                                <Text style={styles.search_input_text}>{search}</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
                {showDeliveryDetails && (
                    <View style={styles.delivery_details_container}>
                        <Text style={styles.attribute_title}>נמצא אצל</Text>
                        <View style={styles.attribute_result_container}>
                            <Text style={styles.attribute_result_text}>{deliver}</Text>
                        </View>
                        <Text style={styles.attribute_title}>נמען</Text>
                        <View style={styles.attribute_result_container}>
                            <Text style={styles.attribute_result_text}>{addressee}</Text>
                        </View>
                        <Text style={styles.attribute_title}>כתובת</Text>
                        <View style={styles.attribute_result_container}>
                            <Text style={styles.attribute_result_text}>{address}</Text>
                        </View>
                        <Text style={styles.attribute_title}>סטטוס</Text>
                        <View style={[styles.attribute_result_container, { backgroundColor: deliveryStatus.color }]}>
                            <Text style={styles.attribute_result_text}>{deliveryStatus.status}</Text>
                        </View>
                    </View>
                )}
                {showNotFoundDelivery && (
                    <View style={styles.unfounded_container}>
                        <Text style={styles.attribute_result_text}>שגיאה!{'\n'}המשלוח לא נמצא במערכת,{'\n'}אנא וודאו שהזנתם{'\n'}את מזהה המשלוח כראוי</Text>
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#C7F9CC',
    },
    title_text: {
        textAlign: 'center',
        fontSize: height * 0.06,
        color: "#38A3A5",
    },
    search_btn_container: {
        flexDirection: 'row',
        backgroundColor: "white",
        width: width * 0.9,
        height: height * 0.07,
        borderRadius: width * 0.06,
        marginTop: height * 0.05,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    editText_container: {
        marginRight: width * 0.03,
        color: 'black',
        marginTop: width * 0.015,
    },
    search_input_text: {
        fontSize: width * 0.06,
        paddingVertical: 0,
        textAlignVertical: 'center',
    },
    back_icon: {
        width: width * 0.1,
        height: width * 0.1,
        marginLeft: width * 0.08
    },
    header_container: {
        display: "flex",
        marginTop: height * 0.05,
        width: width,
    },
    search_btn: {
        width: width * 0.1,
        height: height * 0.05,
    },
    search_btn_icon_container: {
        alignSelf: 'flex-start',
        marginLeft: width * 0.05,
        marginTop: width * 0.02
    },
    search_bar_conainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    delivery_details_container: {
    },
    attribute_title: {
        marginTop: height * 0.03,
        textAlign: 'center',
        fontSize: width * 0.08,
    },
    attribute_result_container: {
        height: height * 0.07,
        width: width * 0.5,
        backgroundColor: '#22577A',
        marginTop: height * 0.001,
        alignItems: 'center', // center horizontally
        justifyContent: 'center', // center vertically
    },
    attribute_result_text: {
        fontSize: width * 0.06,
        color: 'white',
        textAlign: 'center',
    },
    unfounded_container: {
        height: height * 0.18,
        width: width * 0.8,
        backgroundColor: 'red',
        marginTop: height * 0.12,
        alignItems: 'center', // center horizontally
        justifyContent: 'center', // center vertically
    },
});

export default Delivery_search;