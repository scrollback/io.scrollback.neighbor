import React from "react-native";
import Colors from "../../Colors.json";
import AppText from "./AppText";
import AppTextInput from "./AppTextInput";
import StatusbarContainer from "./StatusbarContainer";
import AppbarSecondary from "./AppbarSecondary";
import AppbarTitle from "./AppbarTitle";
import AppbarTouchable from "./AppbarTouchable";
import AppbarIcon from "./AppbarIcon";
import KeyboardSpacer from "./KeyboardSpacer";
import Banner from "./Banner";
import SignUpButton from "./SignUpButton";
import Validator from "../lib/validator";

const {
	StyleSheet,
	TouchableHighlight,
	Image,
	ScrollView,
	View
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	},
	icon: {
		color: Colors.fadedBlack
	},
	scene: {
		padding: 24
	},
	sceneContainer: {
		alignItems: "center",
		justifyContent: "center"
	},
	avatar: {
		height: 96,
		width: 96,
		borderRadius: 48,
		marginVertical: 12
	},
	heading: {
		color: Colors.darkGrey,
		fontSize: 24,
		lineHeight: 36,
		textAlign: "center",
		marginVertical: 8,
		paddingHorizontal: 4
	},
	paragraph: {
		color: Colors.darkGrey,
		fontSize: 16,
		lineHeight: 24,
		textAlign: "center",
		marginVertical: 8,
		paddingHorizontal: 4
	},
	hint: {
		color: Colors.grey,
		textAlign: "center",
		fontSize: 12,
		lineHeight: 18,
		marginTop: 8
	},
	error: {
		color: Colors.error
	},
	buttonContainer: {
		height: 56,
		width: 56,
		borderRadius: 28,
		marginVertical: 36
	}
});

export default class SignUp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: "",
			error: null,
			errorMessage: null,
			inProgress: false
		};
	}

	_signUp = async () => {
		if (this.state.error) {
			return;
		}

		if (!this.state.value) {
			this.setState({
				errorMessage: "Enter a name first"
			});

			return;
		}

		this.setState({
			inProgress: true
		});

		try {
			await this.props.signUp(this.state.value);
		} catch (err) {
			this.setState({
				errorMessage: err.message,
				inProgress: false
			});
		}
	};

	_onChange = e => {
		const value = e.nativeEvent.text.toLowerCase();

		let error;

		const validation = new Validator(value);

		if (!validation.isValid()) {
			error = { [validation.error]: true };
		}

		this.setState({
			value,
			error,
			errorMessage: null
		});
	};

	render() {
		const { user } = this.props;
		const { error } = this.state;

		return (
			<StatusbarContainer style={styles.container}>
				<AppbarSecondary>
					<AppbarTouchable type="secondary" onPress={this.props.cancelSignUp}>
						<AppbarIcon name="arrow-back" style={styles.icon} />
					</AppbarTouchable>

					<AppbarTitle>
						Let's create an account
					</AppbarTitle>
				</AppbarSecondary>

				<Banner text={this.state.errorMessage} type="error" />

				<ScrollView style={styles.scene}>
					<View style={styles.sceneContainer}>
						<AppText style={styles.heading}>Hey there!</AppText>

						<Image
							style={styles.avatar}
							source={{ uri: user.params.pictures[0] }}
						/>

						<AppText style={styles.paragraph}>New here? Tell us what to call you.</AppText>

						<AppText style={styles.hint}>
							<AppText style={error && error.ERR_VALIDATE_CHARS ? styles.error : null}>Letters, numbers and hyphens, no spaces. </AppText>
							<AppText style={error && error.ERR_VALIDATE_START ? styles.error : null}>Cannot start with a hyphen. </AppText>
							<AppText style={error && error.ERR_VALIDATE_NO_ONLY_NUMS ? styles.error : null}>Should have at least 1 letter. </AppText>
							<AppText style={error && (error.ERR_VALIDATE_LENGTH_SHORT || error.ERR_VALIDATE_LENGTH_LONG) ? styles.error : null}>(3-32 characters)</AppText>
						</AppText>

						<AppTextInput
							value={this.state.value}
							onChange={this._onChange}
							style={styles.input}
							autoCorrect={false}
							maxLength={32}
							placeholder="Choose your awesome nickname"
							textAlign="center"
							placeholderTextColor="#aaa"
							underlineColorAndroid={error ? "#f44336" : "#673ab7"}
						/>

						{this.state.inProgress ?
							<View style={styles.buttonContainer}>
								<SignUpButton loading={this.state.inProgress} />
							</View> :
							<TouchableHighlight style={styles.buttonContainer} onPress={this._signUp}>
								<View>
									<SignUpButton loading={this.state.inProgress} />
								</View>
							</TouchableHighlight>
						}
					</View>
				</ScrollView>

				<KeyboardSpacer />
			</StatusbarContainer>
		);
	}
}

SignUp.propTypes = {
	user: React.PropTypes.shape({
		params: React.PropTypes.shape({
			pictures: React.PropTypes.arrayOf(React.PropTypes.string)
		})
	}),
	signUp: React.PropTypes.func.isRequired,
	cancelSignUp: React.PropTypes.func.isRequired
};
