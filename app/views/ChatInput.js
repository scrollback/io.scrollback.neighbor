import React from "react-native";
import Colors from "../../Colors.json";
import Icon from "./Icon";
import GrowingTextInput from "./GrowingTextInput";
import TouchFeedback from "./TouchFeedback";
import ChatSuggestionsContainer from "../containers/ChatSuggestionsContainer";
import ImageUploadContainer from "../containers/ImageUploadContainer";
import ImageUploadChat from "./ImageUploadChat";
import ImageChooser from "../modules/ImageChooser";
import textUtils from "../lib/text-utils";

const {
	StyleSheet,
	View,
	PixelRatio
} = React;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "stretch",
		backgroundColor: Colors.white,
		borderColor: Colors.underlay,
		borderTopWidth: 1 / PixelRatio.get(),
		elevation: 4
	},
	inputContainer: {
		flex: 1,
		paddingHorizontal: 16
	},
	input: {
		color: Colors.black,
		backgroundColor: "transparent",
		paddingVertical: 16,
		margin: 0
	},
	iconContainer: {
		alignItems: "center",
		justifyContent: "center"
	},
	icon: {
		color: Colors.fadedBlack,
		margin: 17
	}
});

export default class ChatInput extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			text: "",
			query: "",
			imageData: null
		};
	}

	set quotedText(text) {
		this._computedAndSetText({
			replyTo: text.from,
			quotedText: text.text
		});
	}

	set replyTo(text) {
		this._computedAndSetText({
			replyTo: text.from
		});
	}

	_sendMessage = () => {
		this.props.sendMessage(this.state.text);

		this.setState({
			text: ""
		});
	};

	_uploadImage = async () => {
		try {
			const imageData = await ImageChooser.pickImage();

			this.setState({
				imageData
			});
		} catch (e) {
			// Do nothing
		}
	};

	_onUploadFinish = result => {
		const { height, width, name } = this.state.imageData;

		const aspectRatio = height / width;

		this.props.sendMessage(textUtils.getTextFromMetadata({
			type: "photo",
			title: name,
			url: result.originalUrl,
			height,
			width,
			thumbnail_height: Math.min(480, width) * aspectRatio,
			thumbnail_width: Math.min(480, width),
			thumbnail_url: result.thumbnailUrl
		}), result.textId);

		setTimeout(() => this._onUploadClose(), 500);
	};

	_onUploadClose = () => {
		this.setState({
			imageData: ""
		});
	};

	_onSuggestionSelect = nick => {
		this.setState({
			text: "@" + nick + " ",
			query: ""
		});
	};

	_onChangeText = text => {
		const query = /^@[a-z0-9]*$/.test(text) ? text : "";

		this.setState({
			text,
			query
		});
	};

	_computedAndSetText = opts => {
		let newValue = this.state.text;

		if (opts.quotedText) {
			if (newValue) {
				newValue += "\n\n";
			}

			newValue += "> " + (opts.replyTo ? "@" + opts.replyTo + " - " : "") + opts.quotedText + "\n\n";
		} else if (opts.replyTo) {
			if (newValue) {
				newValue += " ";
			}

			newValue += `@${opts.replyTo} `;
		}

		this.setState({
			text: newValue
		}, () => this._input.focusKeyboard());
	};

	render() {
		return (
			<View {...this.props}>
				<ChatSuggestionsContainer
					room={this.props.room}
					thread={this.props.thread}
					user={this.props.user}
					text={this.state.query}
					style={styles.suggestions}
					onSelect={this._onSuggestionSelect}
				/>

				<View style={styles.container}>
					<GrowingTextInput
						ref={c => this._input = c}
						value={this.state.text}
						onChangeText={this._onChangeText}
						style={styles.inputContainer}
						inputStyle={styles.inputStyle}
						underlineColorAndroid="transparent"
						placeholder="Write a message…"
						autoCapitalize="sentences"
						numberOfLines={7}
					/>

				<TouchFeedback
					borderless
					onPress={this.state.text ? this._sendMessage : this._uploadImage}
				>
						<View style={styles.iconContainer}>
							<Icon
								name={this.state.text ? "send" : "image"}
								style={styles.icon}
								size={24}
							/>
						</View>
					</TouchFeedback>
				</View>

				{this.state.imageData ?
					<ImageUploadContainer
						component={ImageUploadChat}
						imageData={this.state.imageData}
						onUploadClose={this._onUploadClose}
						onUploadFinish={this._onUploadFinish}
					/> : null
				}
			</View>
		);
	}
}

ChatInput.propTypes = {
	room: React.PropTypes.string.isRequired,
	thread: React.PropTypes.string.isRequired,
	user: React.PropTypes.string.isRequired,
	sendMessage: React.PropTypes.func.isRequired
};
