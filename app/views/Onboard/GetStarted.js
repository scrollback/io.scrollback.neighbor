/* @flow */

import React from "react-native";
import NextButton from "./NextButton";
import StatusbarContainer from "../StatusbarContainer";
import OnboardTitle from "./OnboardTitle";
import OnboardParagraph from "./OnboardParagraph";
import Colors from "../../../Colors.json";

const {
	View,
	StyleSheet,
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	},

	inner: {
		padding: 15,
		alignItems: "center",
		justifyContent: "center"
	},

	text: {
		marginVertical: 8
	}
});

const UserDetails = () => (
	<StatusbarContainer style={styles.container}>
		<View style={[ styles.container, styles.inner ]}>
			<OnboardTitle style={styles.text}>We're all set!</OnboardTitle>
			<OnboardParagraph style={styles.text}>Enjoy Hey, Neighbor!</OnboardParagraph>
		</View>
		<NextButton label="Done" />
	</StatusbarContainer>
);

export default UserDetails;
