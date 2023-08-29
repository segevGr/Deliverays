import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { IP, getLoginUserName, getLoginUserId } from '../../constsFiles';
import DialogInput from 'react-native-dialog-input';
import React, { useState } from 'react';

const { width, height } = Dimensions.get('window');

const Home_page_deliver = ({ navigation, route }) => {
    const username = getLoginUserName();
    const user_id = getLoginUserId();
    const ip = IP();

    const [showCurrentDialog, setShowCurrentDialog] = useState(false);
    const [showChangeDialog, setShowChangeDialog] = useState(false);

    const delivers_management = () => {
        navigation.navigate('Delivers_managment');
    }

    const deliver_search = () => {
        navigation.navigate('Delivery_search');
    }

    const show_current_dialog = () => {
        setShowCurrentDialog(!showCurrentDialog)
    }

    const show_change_dialog = () => {
        setShowChangeDialog(!showChangeDialog)
    }

    const check_current_pass = async (current) => {
        if (current == "") {
            Alert.alert(
                `שגיאה!`,
                'אנא הכנס סיסמא!',
                [
                    { text: 'הבנתי', onPress: () => null },
                ],
                { cancelable: false }
            );
            return;
        }
        try {
            const response = await fetch(`http://${ip}:3000/user/${username}/${current}`, {
                method: 'GET',
            });
            const data = await response.json();
            if (data.users.length == 1) {
                show_current_dialog()
                show_change_dialog()
            } else {
                Alert.alert(
                    `שגיאה - הסיסמא הנוכחית שהזנת לא נכונה`,
                    'אנא הזן סיסמא נוכחית תקינה',
                    [
                        { text: 'הבנתי', onPress: () => null },
                    ],
                    { cancelable: false }
                );

            }
        } catch (error) {
            console.log('Error fetching letters:', error);
        }
    }

    const change_pass = async (input) => {
        const requestBody = JSON.stringify({
            "password": input,
        });

        try {
            const response = await fetch(`http://${ip}:3000/user/${user_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody,
            });
            show_change_dialog();
            Alert.alert(
                `הסיסמא עודכנה בהצלחה!`,
                '',
                [
                    { text: 'תודה!', onPress: () => null },
                ],
                { cancelable: false }
            );
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

    return (
        <View style={styles.container}>
            <Text style={styles.title_text}>שלום {username},{'\n'}מה תרצה לעשות היום?</Text>
            <TouchableOpacity
                style={styles.btn}
                onPress={delivers_management}
            >
                <Text style={styles.btn_text}>לנהל שליחים</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.btn}
                onPress={deliver_search}
            >
                <Text style={styles.btn_text}>לחפש משלוח</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.btn}
                onPress={(show_current_dialog)}
            >
                <Text style={styles.btn_text}>לשנות סיסמא</Text>
            </TouchableOpacity>
            <DialogInput isDialogVisible={showCurrentDialog}
                title={"שינוי סיסמא"}
                message={"הכנס את הסיסמא הנוכחית"}
                submitText={"המשך לשינוי"}
                cancelText={"ביטול"}
                textInputProps={{ autoCorrect: false }}
                submitInput={(inputText) => { check_current_pass(inputText) }}
                closeDialog={() => { show_current_dialog() }}>
            </DialogInput>
            <DialogInput isDialogVisible={showChangeDialog}
                title={"שינוי סיסמא"}
                message={"הכנס את הסיסמא החדשה"}
                submitText={"שנה סיסמא"}
                cancelText={"ביטול"}
                textInputProps={{ autoCorrect: false }}
                submitInput={(inputText) => { change_pass(inputText) }}
                closeDialog={() => { show_change_dialog() }}>
            </DialogInput>
        </View>
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
        fontSize: height * 0.035,
        fontWeight: 'bold',
        marginTop: height * 0.17,
        color: "#38A3A5",
    },
    btn: {
        backgroundColor: "#22577A",
        width: width * 0.65,
        height: height * 0.065,
        marginTop: height * 0.11,
        borderRadius: width * 0.06,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_text: {
        color: 'white',
        textAlign: 'center',
        fontSize: width * 0.06,
    }
});

export default Home_page_deliver;