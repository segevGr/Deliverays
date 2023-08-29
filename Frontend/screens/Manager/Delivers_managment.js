import React, { useState } from 'react';
import {IP, getLoginUserId, getLoginUserName} from '../../constsFiles';
import {
    View, Text, StyleSheet, TouchableOpacity,
    ScrollView, Dimensions, Image, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const Delivers_managment = ({ navigation }) => {
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
        const updateddelivers_list = delivers_list.filter(deliver => deliver.id !== deliver_id)
        setDelivers_list(updateddelivers_list)
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
                            style={styles.btn_container}
                            activeOpacity={1}
                            onPress={() => { }}>
                            <TouchableOpacity onPress={() => delete_alert(deliver.id, deliver.fullName)}>
                                <Image source={require('../../assets/cancel_icon.png')} style={styles.info_btn} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => info_screen(deliver.id, deliver.fullName)}>
                                <Image source={require('../../assets/edit_icon.png')} style={styles.info_btn} />
                            </TouchableOpacity>
                            <Text style={styles.deliver_name_lable}>{deliver.fullName}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <TouchableOpacity
                style={styles.add_user_btn}
                onPress={add_deliver}>
                <Text style={styles.add_user_lable}>הוספת שליח</Text>
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
        backgroundColor: "#22577A",
        width: width * 0.9,
        height: height * 0.068,
        borderRadius: width * 0.01,
        marginTop: height * 0.03,
        flexDirection: 'row',
        alignItems: 'center',
    },
    deliver_name_lable: {
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

export default Delivers_managment;