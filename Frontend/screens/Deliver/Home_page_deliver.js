import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { getLoginUserName } from '../../constsFiles';
import React, { useState } from 'react';
import styles from '../Global_Files/Home_page_style'
import Change_password_dialog from '../Global_Files/Change_password_dialog';

const Home_page_deliver = ({ navigation }) => {
    const user_name = getLoginUserName();

    const [pass_dialog, set_change_pass_dialog] = useState(false);

    const show_change_pass_dialog = () => {
        set_change_pass_dialog(true)
    }

    const close_pass_dialog = () => {
        set_change_pass_dialog(false);
    };

    const create_route = () => {
        navigation.navigate('Route_creation');
    }

    const Delivery_management = () => {
        navigation.navigate('Delivery_management');
    }

    return (
        <View style={styles.container}>
            <Change_password_dialog visible={pass_dialog} onClose={close_pass_dialog} />
            <Text style={styles.title_text}>שלום {user_name},{'\n'}מה תרצה לעשות היום?</Text>
            <TouchableOpacity
                style={styles.btn}
                onPress={create_route}
            >
                <Text style={styles.btn_text}>לבנות מסלול</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.btn}
                onPress={Delivery_management}
            >
                <Text style={styles.btn_text}>לנהל משלוחים</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.btn}
                onPress={show_change_pass_dialog}
            >
                <Text style={styles.btn_text}>לשנות סיסמא</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Home_page_deliver;