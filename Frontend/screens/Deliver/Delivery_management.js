import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, Alert } from 'react-native';
import { IP, getLoginUserId } from '../../constsFiles';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const Delivery_management = ({ navigation }) => {
    const deliver_id = getLoginUserId();
    const ip = IP();

    const delete_alert = (letterNumber, deliveryAddress) => {
        Alert.alert(
            `האם אתה בטוח שאתה רוצה למחוק את ${deliveryAddress} מרשימת המשלוחים?`,
            '',
            [
                { text: 'לא', onPress: () => null },
                { text: 'כן', onPress: () => delete_delivery(letterNumber) },
            ],
            { cancelable: false }
        );

    }

    const delete_delivery = async (letterNumber) => {
        try {
            const response = await fetch(`http://${ip}:3000/letter/${letterNumber}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.log('Error fetching letters:', error);
            Alert.alert(
                `אופס... משהו השתבש`,
                'אנא נסו שוב מאוחר יותר',
                [
                    { text: 'הבנתי', onPress: () => null },
                ],
                { cancelable: false }
            );
        }

        const updateddelivery_list = delivery_list.filter(delivery => delivery.letterNumber !== letterNumber)
        setdelivery_list(updateddelivery_list)
    }

    const add_delivery = () => {
        navigation.navigate('Add_delivery', { deliver_id: deliver_id });
    }

    const edit_delivery = (letterNumber) => {
        navigation.navigate('Delivery_edit', { letterNumber: letterNumber });
    }

    const back_to_previous_page = () => {
        navigation.goBack();
    };

    const getLettersrsFromDB = async () => {
        try {
            const response = await fetch(`http://${ip}:3000/letter/all/${deliver_id}`, {
                method: 'GET',
            });
            const data = await response.json();

            const result = data.result.map(result => ({
                letterNumber: result.letterNumber,
                deliveryAddress: result.deliveryAddress, isDelivered: result.isDelivered
            }))
            setdelivery_list(result);
        } catch (error) {
            console.log('Error fetching users:', error);
        }
    };

    const [delivery_list, setdelivery_list] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            getLettersrsFromDB();
        }, [])
    );

    return (
        <View style={styles.container} >
            <View style={styles.title_style}>
                <TouchableOpacity onPress={back_to_previous_page}>
                    <Image source={require('../../assets/back_icon.png')} style={styles.back_icon} />
                </TouchableOpacity>
                <Text style={styles.title_text}>יש לך {delivery_list.length} משלוחים להשלים</Text>
            </View>
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    {delivery_list.map(letter => {
                        let deliveryColor;

                        switch (letter.isDelivered) {
                            case 0:
                                deliveryColor = "#22577A";
                                break;
                            case 1:
                                deliveryColor = "green";
                                break;
                        }
                        return (
                            <TouchableOpacity
                                key={letter.letterNumber}
                                style={[
                                    styles.btn_container,
                                    { backgroundColor: deliveryColor }
                                ]}
                                activeOpacity={1}
                                onPress={() => { }}>
                                <TouchableOpacity onPress={() => delete_alert(letter.letterNumber, letter.deliveryAddress)}>
                                    <Image source={require('../../assets/cancel_icon.png')} style={styles.info_btn} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => edit_delivery(letter.letterNumber)}>
                                    <Image source={require('../../assets/edit_icon.png')} style={styles.info_btn} />
                                </TouchableOpacity>
                                <Text style={styles.delivery_name_lable}>{letter.deliveryAddress}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
            <TouchableOpacity
                style={styles.add_user_btn}
                onPress={add_delivery}>
                <Text style={styles.add_user_lable}>הוספת משלוח</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C7F9CC',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        alignItems: 'center',
        marginBottom: height * 0.05,
        borderColor: 'white',
    },
    title_style: {
        display: "flex",
        marginTop: height * 0.05,
        width: width,
    },
    title_text: {
        textAlign: 'center',
        fontSize: width * 0.085,
        fontWeight: 'bold',
        color: "#38A3A5",
    },
    back_icon: {
        width: width * 0.1,
        height: width * 0.1,
        marginLeft: width * 0.08
    },
    btn_container: {
        width: width * 0.9,
        height: height * 0.068,
        borderRadius: width * 0.01,
        marginTop: height * 0.03,
        flexDirection: 'row',
        alignItems: 'center',
    },
    delivery_name_lable: {
        color: 'white',
        flex: 1,
        textAlign: 'right',
        marginRight: width * 0.03,
        fontSize: width * 0.055,
    },
    info_btn: {
        width: width * 0.075,
        height: width * 0.075,
        marginLeft: width * 0.03,
    },
    add_user_btn: {
        backgroundColor: "#4FC132",
        width: width * 0.36,
        height: height * 0.06,
        borderRadius: width * 0.1,
        marginTop: height * 0.03,
        marginBottom: height * 0.05,
        alignItems: 'center',
        justifyContent: 'center',
    },
    add_user_lable: {
        color: 'white',
        fontSize: width * 0.05,
    },
});

export default Delivery_management;