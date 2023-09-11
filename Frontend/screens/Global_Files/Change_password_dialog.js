import React, { useState, useEffect } from 'react';
import {
	Modal, View, Text, StyleSheet, TouchableOpacity,
	Dimensions, TextInput, Alert
} from 'react-native';
import { IP, getLoginUserName, getLoginUserId } from '../../constsFiles';

const { width, height } = Dimensions.get('window');

const Change_password_dialog = ({ visible, onClose }) => {
	const user_name = getLoginUserName();
	const user_id = getLoginUserId();
	const ip = IP();

	const [currentPass, setCurrentPass] = useState('');
	const [newPass, setNewPass] = useState('');
	const [acceptNewPass, setAcceptNewPass] = useState('');

	const check_current_pass = async () => {
		try {
			const response = await fetch(`http://${ip}:3000/user/${user_name}/${currentPass}`, {
				method: 'GET',
			});
			const data = await response.json();
			return data.users.length == 1;
		} catch (error) {
			console.log('Error fetching letters:', error);
		}
	}

	const change_password = async () => {
		const requestBody = JSON.stringify({
			"password": newPass,
		});

		try {
			const response = await fetch(`http://${ip}:3000/user/${user_id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: requestBody,
			});
			return true;
		} catch (error) {
			console.log('Error fetching users:', error);
			return false;
		}
	}

	const handle_change_password = async () => {
		if (currentPass == '' || newPass == '' || acceptNewPass == '') {
			Alert.alert(
				'שגיאה!',
				'אנא מלאו את כל השדות על מנת לשנות סיסמא',
				[{ text: 'הבנתי' }]
			);
			return;
		}
		else if (! await check_current_pass()) {
			Alert.alert(
				`שגיאה! הסיסמא הנוכחית שהזנת לא נכונה`,
				'אנא הזן סיסמא נוכחית תקינה',
				[{ text: 'הבנתי' }]
			);
			return;
		}
		else if (newPass != acceptNewPass) {
			Alert.alert(
				`שגיאה! הסיסמאות החדשות לא מתאימות`,
				'אנא וודא שהסיסמא החדשה זהה לאימות הסיסמא שהזנת',
				[{ text: 'הבנתי' }]
			);
			return;
		}
		else if (newPass == currentPass) {
			Alert.alert(
				`שגיאה!`,
				'הסיסמא החדשה לא יכולה להיות זהה לסיסמא הנוכחית',
				[{ text: 'הבנתי' }]
			);
			return;
		}
		else {
			if (await change_password()) {
				Alert.alert(
					`הסיסמא עודכנה בהצלחה!`,
					'',
					[
						{ text: 'תודה!', onPress: () => null },
					],
					{ cancelable: false }
				);
				onClose();
			}
			else {
				Alert.alert(
					`אופס... משהו השתבש`,
					'אנא נסו שוב מאוחר יותר',
					[
						{ text: 'הבנתי', onPress: () => null },
					],
					{ cancelable: false }
				);
				return;
			}
		}
	}

	useEffect(() => {
		if (visible) {
			setCurrentPass('');
			setNewPass('');
			setAcceptNewPass('');
		}
	}, [visible]);

	return (
		<Modal visible={visible} animationType="slide" transparent>
			<View style={styles.modalContainer}>
				<View style={styles.dialog}>

					<View style={styles.option_container}>
						<TextInput
							style={styles.input}
							placeholder="סיסמא נוכחית"
							value={currentPass}
							onChangeText={setCurrentPass}
							placeholderTextColor="white"
							secureTextEntry={true}
						/>
					</View>

					<View style={styles.option_container}>
						<TextInput
							style={styles.input}
							placeholder="סיסמא חדשה"
							value={newPass}
							onChangeText={setNewPass}
							placeholderTextColor="white"
							secureTextEntry={true}
						/>
					</View>

					<View style={styles.option_container}>
						<TextInput
							style={styles.input}
							placeholder="אימות סיסמא חדשה"
							value={acceptNewPass}
							onChangeText={setAcceptNewPass}
							placeholderTextColor="white"
							secureTextEntry={true}
						/>
					</View>

					<View style={styles.btns_container}>

						<TouchableOpacity
							style={styles.btns}
							onPress={onClose}>
							<Text style={styles.btns_text}>ביטול</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.btns}
							onPress={handle_change_password}>
							<Text style={styles.btns_text}>שנה סיסמא</Text>
						</TouchableOpacity>

					</View>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	dialog: {
		width: '80%',
		backgroundColor: 'white',
		padding: 25,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
	},
	btns_container: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	btns: {
		width: width * 0.25,
		marginTop: width * 0.06,
		alignItems: 'center',
	},
	btns_text: {
		color: '#38A3A5',
		fontWeight: 'bold',
		fontSize: width * 0.045,
	},
	input: {
		width: width * 0.5,
		height: height * 0.05,
		backgroundColor: '#38A3A5',
		marginBottom: height * 0.01,
		paddingHorizontal: width * 0.02,
		textAlign: 'center',
		borderRadius: width * 0.06,
		color: 'white',
	},
});

export default Change_password_dialog;
