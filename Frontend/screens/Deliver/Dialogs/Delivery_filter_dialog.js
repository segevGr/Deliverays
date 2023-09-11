import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const { width, height } = Dimensions.get('window');

const Delivery_filter_dialog = ({ visible, onClose, onSave }) => {
	const dropdownItems1 = [
		{ label: 'נמסר', value: 1 },
		{ label: 'לא נמסר', value: 0 },
	];
	const dropdownItems2 = [
		{ label: 'Choice A', value: 'choiceA' },
		{ label: 'Choice B', value: 'choiceB' },
	];
	const dropdownItems3 = [
		{ label: 'Item X', value: 'itemX' },
		{ label: 'Item Y', value: 'itemY' },
	];

	const [selectedStatus, setSelectedStatus] = useState(null);
	const [selectedOption2, setSelectedOption2] = useState(null);
	const [selectedOption3, setSelectedOption3] = useState(null);

	const handle_saved_filter = () =>{
		let filter_array = {'status': null}
		if (selectedStatus != null){
			filter_array['status'] = selectedStatus;
		}
		onSave(filter_array);
		onClose();
	}

	return (
		<Modal visible={visible} animationType="slide" transparent>
			<View style={styles.modalContainer}>
				<View style={styles.dialog}>

					<View style={styles.option_container}>
						<Text style={{ fontSize: 22, }}>סטטוס המשלוח</Text>
						<RNPickerSelect
							style={{
								inputIOS: {
									color: 'black',
									fontSize: 18,
									textAlign: 'center',
									borderColor: 'black',
									borderWidth: 1,
								},
								inputAndroid: {
									color: 'black',
									fontSize: 18,
									textAlign: 'center',
									borderColor: 'black',
									borderWidth: 1,
								},
							}}
							placeholder={{ label: 'בחר סטטוס', }}
							items={dropdownItems1}
							onValueChange={(value) => setSelectedStatus(value)}
							value={selectedStatus}
						/>
					</View>

					<View style={styles.option_container}>
						<Text style={{ fontSize: 22, }}>עיר</Text>
						<RNPickerSelect
							style={{
								inputIOS: {
									color: 'black',
									fontSize: 18,
									textAlign: 'center',
									borderColor: 'black',
									borderWidth: 1,
								},
								inputAndroid: {
									color: 'black',
									fontSize: 18,
									textAlign: 'center',
									borderColor: 'black',
									borderWidth: 1,
								},
							}}
							placeholder={{ label: 'בחר סטטוס', }}
							items={dropdownItems1}
							onValueChange={(value) => setSelectedStatus(value)}
							value={selectedStatus}
						/>
					</View>

					<View style={styles.option_container}>
						<Text style={{ fontSize: 22, }}>סטטוס המשלוח</Text>
						<RNPickerSelect
							style={{
								inputIOS: {
									color: 'black',
									fontSize: 18,
									textAlign: 'center',
									borderColor: 'black',
									borderWidth: 1,
								},
								inputAndroid: {
									color: 'black',
									fontSize: 18,
									textAlign: 'center',
									borderColor: 'black',
									borderWidth: 1,
								},
							}}
							placeholder={{ label: 'בחר סטטוס', }}
							items={dropdownItems1}
							onValueChange={(value) => setSelectedStatus(value)}
							value={selectedStatus}
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
							onPress={handle_saved_filter}>
							<Text style={styles.btns_text}>סנן</Text>
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
	},
	btns: {
		marginLeft: 5,
		width: width * 0.2,
		marginTop: width * 0.05,
		alignItems: 'center',
	},
	btns_text: {
		color: '#38A3A5',
		fontWeight: 'bold',
		fontSize: width * 0.06,
	},
	option_container: {
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: width * 0.05,
	},
});

export default Delivery_filter_dialog;