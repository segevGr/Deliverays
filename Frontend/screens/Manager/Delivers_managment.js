import React, { useState } from 'react';
import { IP, getLoginUserId, getLoginUserName } from '../../constFiles';
import {
    View, Text, TouchableOpacity,
    ScrollView, Image, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../Global_Files/management_style';

const Delivers_management = ({ navigation }) => {
    const ip = IP();

    const delete_alert = (deliver_id, deliver_name) => {
        Alert.alert(
            `האם אתה בטוח שאתה רוצה למחוק את ${deliver_name} מרשימת השליחים?`,
            '',
            [
                { text: 'לא', onPress: () => null },
                { text: 'כן', onPress: () => delete_deliver(deliver_id) },
            ],
            { cancelable: false }
        );
    }

    const delete_deliver = async (deliver_id) => {
        try {
            const response = await fetch(`http://${ip}:3000/user/${deliver_id}`, {
                method: 'DELETE',
            });
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
        const updatedDelivers_list = delivers_list.filter(deliver => deliver.id !== deliver_id)
        setDelivers_list(updatedDelivers_list)
    }

    const info_screen = (deliver_id, deliver_name) => {
        navigation.navigate('Deliver_edit', { deliver_id: deliver_id, deliver_name: deliver_name });
    }


    const add_deliver = () => {
        navigation.navigate('Add_deliver');
    }

    const back_to_previous_page = () => {
        navigation.goBack();
    };

    const getUsersFromDB = async () => {
        try {
            const response = await fetch(`http://${ip}:3000/user`, {
                method: 'GET',
            });
            const data = await response.json();

            const users = data.users.map(user => ({ id: user.ID, fullName: user.fullName, isAdmin: user.isAdmin }))
                .filter(user => (user.isAdmin === 0));
            setDelivers_list(users);
        } catch (error) {
            console.log('Error fetching users:', error);
        }
    };

    const [delivers_list, setDelivers_list] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            getUsersFromDB();
        }, [])
    );

    return (
        <View style={styles.container} >
            <View style={styles.title_style}>
                <TouchableOpacity onPress={back_to_previous_page}>
                    <Image source={require('../../assets/back_icon.png')} style={styles.back_icon} />
                </TouchableOpacity>
                <Text style={styles.title_text}>רשימת השליחים</Text>
            </View>
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    {delivers_list.map(deliver => (
                        <TouchableOpacity
                            key={deliver.id}
                            style={[
                                styles.btn_container,
                                { backgroundColor: "#22577A" }
                            ]}
                            activeOpacity={1}
                            onPress={() => { }}>
                            <TouchableOpacity onPress={() => delete_alert(deliver.id, deliver.fullName)}>
                                <Image source={require('../../assets/cancel_icon.png')} style={styles.info_btn} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => info_screen(deliver.id, deliver.fullName)}>
                                <Image source={require('../../assets/edit_icon.png')} style={styles.info_btn} />
                            </TouchableOpacity>
                            <Text style={styles.item_name_label}>{deliver.fullName}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <TouchableOpacity
                style={styles.add_item_btn}
                onPress={add_deliver}>
                <Text style={styles.add_user_label}>הוספת שליח</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.filter_btn}
                onPress={null}>
                <Text style={styles.add_user_label}>סינון תוצאות</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Delivers_management;