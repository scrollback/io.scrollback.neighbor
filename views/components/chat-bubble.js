import React from "react-native";
import Colors from "../../colors.json";
import RichText from "./rich-text";

const {
	StyleSheet,
	View,
	Text,
	Image
} = React;

const styles = StyleSheet.create({
	containerLeft: {
		alignItems: "flex-start"
	},
	containerRight: {
		alignItems: "flex-end"
	},
	bubble: {
		backgroundColor: Colors.white,
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 3
	},
	bubbleLeft: {
		marginLeft: 8
	},
	bubbleRight: {
		backgroundColor: "#ddd",
		marginRight: 8
	},
	text: {
		color: Colors.darkGrey,
		paddingHorizontal: 4
	},
	triangle: {
		position: "absolute",
		height: 12,
		width: 10
	},
	triangleLeft: {
		top: 0,
		left: 0
	},
	triangleRight: {
		right: 0,
		bottom: 0
	},
	author: {
		fontSize: 12,
		paddingBottom: 4,
		paddingHorizontal: 4,
		opacity: 0.5
	}
});

export default class ChatBubble extends React.Component {
	setNativeProps(nativeProps) {
		this._root.setNativeProps(nativeProps);
	}

	render() {
		const { text, type, showArrow } = this.props;

		const right = type === "right";

		return (
			<View style={[ right ? styles.containerRight : styles.containerLeft, this.props.style ]} ref={c => this._root = c}>
				{right || !showArrow ? null :
					<Image style={[ styles.triangle, styles.triangleLeft ]} source={require("../../assets/triangle_left.png")} />
				}

				<View style={[ styles.bubble, right ? styles.bubbleRight : styles.bubbleLeft ]}>
					{this.props.showAuthor ?
						<Text style={styles.author}>{text.from}</Text> :
						null
					}

					{this.props.children}

					{text.text ?
						<RichText text={text.text} style={styles.text} /> :
						null
					}
				</View>

				{right && showArrow ?
					<Image style={[ styles.triangle, styles.triangleRight ]} source={require("../../assets/triangle_right.png")} /> :
					null
				}
			</View>
		);
	}
}

ChatBubble.defaultProps = {
	showAuthor: false,
	showArrow: true
};

ChatBubble.propTypes = {
	text: React.PropTypes.shape({
		text: React.PropTypes.string,
		from: React.PropTypes.string.isRequired
	}).isRequired,
	type: React.PropTypes.oneOf([ "left", "right" ]),
	showAuthor: React.PropTypes.bool,
	showArrow: React.PropTypes.bool,
	onPress: React.PropTypes.func,
	children: React.PropTypes.node
};
