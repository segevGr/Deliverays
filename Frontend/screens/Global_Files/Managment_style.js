import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

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
    item_name_lable: {
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
    add_item_btn: {
        backgroundColor: "#4FC132",
        width: width * 0.36,
        height: height * 0.06,
        borderRadius: width * 0.1,
        marginTop: height * 0.03,
        marginBottom: height * 0.02,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filter_btn: {
        backgroundColor: "#bbbbbb",
        width: width * 0.36,
        height: height * 0.06,
        borderRadius: width * 0.1,
        marginBottom: height * 0.05,
        alignItems: 'center',
        justifyContent: 'center',
    },
    add_user_lable: {
        color: 'white',
        fontSize: width * 0.05,
    },
});

export default styles;