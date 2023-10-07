import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { IP } from '../../constsFiles';

const { width, height } = Dimensions.get('window');

const Route = ({ navigation, route }) => {
    const { routeList } = route.params
    const ip = IP();

    const [acceptedDeliveries, setAcceptedDeliveries] = useState([]);

    const accept_alert = (delivery_id, delivery_name) => {
        Alert.alert(
            `האם אתה בטוח שאתה רוצה לאשר את ${delivery_name}?`,
            'המשלוח יוסר מרשימת המשלוחים שיש לבצע כעת',
            [
                { text: 'לא', onPress: () => null },
                { text: 'כן', onPress: () => accept_delivery(delivery_id) },
            ],
            { cancelable: false }
        );

    }

    const cancel_alert = (delivery_id, delivery_name) => {
        Alert.alert(
            `האם אתה בטוח שאתה רוצה להסיר את ${delivery_name} מרשימת המשלוחים שיש לבצע במסלול זה?`,
            'המשלוח לא ימחק מהמערכת אלא רק מעמוד זה',
            [
                { text: 'לא', onPress: () => null },
                { text: 'כן', onPress: () => delete_delivery(delivery_id) },
            ],
            { cancelable: false }
        );

    }

    const delete_delivery = (delivery_id) => {
        const updated_delivery_list = delivery_list.filter(delivery => delivery.letterNumber !== delivery_id);
        setDeliveryList(updated_delivery_list);
    };

    const accept_delivery = async (delivery_id) => {
        const requestBody = JSON.stringify({
            "isDelivered": 1,
        });

        try {
            const response = await fetch(`http://${ip}:3000/letter/${delivery_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody,
            });

            Alert.alert(
                `המשלוח עודכן כנמסר!`,
                '',
                [
                    { text: 'תודה!', onPress: () => null },
                ],
                { cancelable: false }
            );
            delete_delivery(delivery_id);

        } catch (error) {
            console.log('Error fetching users:', error);
            Alert.alert(
                `אופס... משהו השתבש`,
                'אנא נסו שוב מאוחר יותר',
                [
                    { text: 'הבנתי', onPress: () => null },
                ],
                { cancelable: false }
            );
        }
    }

    const back_to_previous_page = () => {
        navigation.goBack();
    };

    const [delivery_list, setDeliveryList] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            setDeliveryList(routeList.map(result => ({ letterNumber: result.letterNumber, deliveryAddress: result.deliveryStreet + ", " + result.deliveryCity })));
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
                    {delivery_list.map(item => (
                        <TouchableOpacity
                            key={item.letterNumber}
                            style={styles.btn_container}
                            activeOpacity={1}
                            onPress={() => { }}>
                            <TouchableOpacity onPress={() => cancel_alert(item.letterNumber, item.deliveryAddress)}>
                                <Image source={require('../../assets/cancel_icon.png')} style={styles.accept_btn} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => accept_alert(item.letterNumber, item.deliveryAddress)}>
                                <Image source={require('../../assets/accept_icon.png')} style={styles.accept_btn} />
                            </TouchableOpacity>
                            <Text style={styles.delivery_name_lable}>{item.deliveryAddress}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
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
        backgroundColor: "#22577A",
        width: width * 0.9,
        height: height * 0.068,
        borderRadius: width * 0.01,
        marginTop: height * 0.03,
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
    },
    delivery_name_lable: {
        color: 'white',
        flex: 1,
        textAlign: 'right',
        marginRight: width * 0.03,
        fontSize: width * 0.055,
    },
    accept_btn: {
        width: width * 0.07,
        height: width * 0.07,
        marginLeft: width * 0.03,
    },
});

export default Route;