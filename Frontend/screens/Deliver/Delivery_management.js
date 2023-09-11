import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { IP, getLoginUserId } from '../../constsFiles';
import { useFocusEffect } from '@react-navigation/native';
import Delivery_filter_dialog from './Dialogs/Delivery_filter_dialog';
import styles from '../Global_Files/Managment_style';

const Delivery_management = ({ navigation }) => {
    const deliver_id = getLoginUserId();
    const ip = IP();

    const [filterDialogVisible, setDilterDialogVisible] = useState(false);

    const showFilterDialog = () => {
        setDilterDialogVisible(true);
    };

    const closeFilterDialog = () => {
        setDilterDialogVisible(false);
    };

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
            setOriginal_delivery_list(result)
            setdelivery_list(result);
        } catch (error) {
            console.log('Error fetching users:', error);
        }
    };

    const [delivery_list, setdelivery_list] = useState([]);

    const [original_delivery_list, setOriginal_delivery_list] = useState([]);

    const filterData = (filter_array) => {
        let filtered_delivery_list = original_delivery_list;
        if (filter_array['status'] != null){
            filtered_delivery_list = filtered_delivery_list.filter(delivery => delivery.isDelivered === filter_array['status']);
        }
        setdelivery_list(filtered_delivery_list);
    }

    useFocusEffect(
        React.useCallback(() => {
            getLettersrsFromDB();
        }, [])
    );

    return (
        <View style={styles.container} >
            <Delivery_filter_dialog visible={filterDialogVisible} onClose={closeFilterDialog} onSave={filterData} />
            <View style={styles.title_style}>
                <TouchableOpacity onPress={back_to_previous_page}>
                    <Image source={require('../../assets/back_icon.png')} style={styles.back_icon} />
                </TouchableOpacity>
                <Text style={styles.title_text}>יש לך {delivery_list.length} משלוחים ברשימה</Text>
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
                                <Text style={styles.item_name_lable}>{letter.deliveryAddress}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
            <TouchableOpacity
                style={styles.add_item_btn}
                onPress={add_delivery}>
                <Text style={styles.add_user_lable}>הוספת משלוח</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.filter_btn}
                onPress={showFilterDialog}>
                <Text style={styles.add_user_lable}>סינון תוצאות</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Delivery_management;