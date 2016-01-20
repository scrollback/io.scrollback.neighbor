/* @flow */

import React from "react-native";
import AppText from "../views/AppText";
import AppbarTouchable from "../views/AppbarTouchable";
import AppbarIcon from "../views/AppbarIcon";
import Colors from "../../Colors.json";

const {
	NavigationReducer,
	NavigationState,
	NavigationContainer,
	StyleSheet,
	Platform,
	PixelRatio,
	View
} = React;

const APPBAR_HEIGHT = Platform.OS === "ios" ? 44 : 56;

const styles = StyleSheet.create({
	appbar: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		backgroundColor: Colors.primary,
		borderBottomWidth: Platform.OS === "ios" ? 1 / PixelRatio.get() : 0,
		borderBottomColor: Colors.separator,
		height: APPBAR_HEIGHT,
		marginBottom: 10,
		elevation: 4,
	},

	title: {
		flex: 1,
		marginHorizontal: 8
	},

	titleText: {
		flex: 1,
		lineHeight: 27,
		fontSize: 18,
		fontWeight: "bold",
		color: Colors.white
	},

	button: {
		alignItems: "center",
		justifyContent: "center",
		height: APPBAR_HEIGHT,
		width: APPBAR_HEIGHT
	}
});

class Appbar extends React.Component {
	_renderLeftComponent = (): ?ReactElement => {
		if (this.props.leftComponent) {
			return <this.props.leftComponent onNavigation={this.props.onNavigation} {...this.props.passProps} />;
		}

		if (this.props.navigationState.index !== 0) {
			return (
				<AppbarTouchable style={styles.button} onPress={this._handleBackPress}>
					<AppbarIcon name="arrow-back" />
				</AppbarTouchable>
			);
		}

		return null;
	};

	_renderRightComponent = (): ?ReactElement => {
		if (this.props.rightComponent) {
			return <this.props.rightComponent onNavigation={this.props.onNavigation} {...this.props.passProps} />;
		}

		return null;
	};

	_renderTitle = (): ReactElement => {
		return (
			<View style={styles.title}>
				{this.props.titleComponent ?
					<this.props.titleComponent onNavigation={this.props.onNavigation} {...this.props.passProps} /> :
					<AppText numberOfLines={1} style={styles.titleText}>{this.props.title}</AppText>
				}
			</View>
		);
	};

	_handleBackPress = () => {
		this.props.onNavigation(new NavigationReducer.Actions.Pop());
	};

	render() {
		return (
			<View style={styles.appbar}>
				{this._renderLeftComponent()}
				{this._renderTitle()}
				{this._renderRightComponent()}
			</View>
		);
	}
}

Appbar.propTypes = {
	navigationState: React.PropTypes.instanceOf(NavigationState),
	onNavigation: React.PropTypes.func.isRequired,
	title: React.PropTypes.string,
	titleComponent: React.PropTypes.func,
	leftComponent: React.PropTypes.func,
	rightComponent: React.PropTypes.func,
	passProps: React.PropTypes.object,
	position: React.PropTypes.object.isRequired
};

export default NavigationContainer.create(Appbar);
