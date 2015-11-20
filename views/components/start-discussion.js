import React from "react-native";
import Colors from "../../colors.json";
import Loading from "./loading";
import StatusbarContainer from "./statusbar-container";
import AppbarSecondary from "./appbar-secondary";
import AppbarTouchable from "./appbar-touchable";
import AppbarIcon from "./appbar-icon";
import GrowingTextInput from "./growing-text-input";
import TouchFeedback from "./touch-feedback";
import Icon from "./icon";
import ImageUploadController from "../controllers/image-upload-controller";
import Banner from "./banner";
import ImageUploadDiscussion from "./image-upload-discussion";
import ImageChooser from "../../modules/image-chooser";
import routes from "../utils/routes";
import textUtils from "../../lib/text-utils";

const {
	StyleSheet,
	ScrollView,
	View,
	Text,
	TextInput
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	},
	threadTitle: {
		fontWeight: "bold",
		fontSize: 18,
		lineHeight: 27
	},
	threadSummary: {
		fontSize: 14,
		lineHeight: 21
	},
	icon: {
		color: Colors.fadedBlack
	},
	scene: {
		padding: 16,
		backgroundColor: Colors.white
	},
	button: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center"
	},
	buttonText: {
		color: Colors.primary,
		fontWeight: "bold",
		fontSize: 14,
		lineHeight: 21,
		marginRight: 16
	},
	buttonIcon: {
		color: Colors.primary,
		marginHorizontal: 12
	},
	loading: {
		height: 19,
		width: 19,
		margin: 18
	},
	uploadButton: {
		flexDirection: "row",
		alignSelf: "flex-start",
		alignItems: "center",
		marginVertical: 12
	},
	uploadButtonText: {
		fontWeight: "bold",
		fontSize: 12,
		paddingHorizontal: 4,
		marginRight: 8
	},
	uploadButtonIcon: {
		color: Colors.fadedBlack,
		margin: 8
	}
});

export default class StartDiscussionButton extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			title: "",
			text: "",
			imageData: null,
			uploadResult: null,
			status: null,
			error: null
		};
	}

	_onLoading() {
		this.setState({
			status: "loading"
		});
	}

	_onPosted(thread) {
		this.props.navigator.push(routes.chat({
			thread: thread.id,
			room: this.props.room
		}));
	}

	_onError(message) {
		this.setState({
			error: message,
			status: null
		});
	}

	async _postDiscussion() {
		const FAIL_MESSAGE = "Failed to start discussion";
		const NO_TITLE_MESSAGE = "No title given";
		const NO_SUMMARY_MESSAGE = "No summary given";

		if (!this.state.title) {
			this._onError(NO_TITLE_MESSAGE);
		}

		if (this.state.uploadResult) {
			const result = this.state.uploadResult;
			const { height, width, name } = this.state.imageData;
			const aspectRatio = height / width;

			try {
				this._onLoading();

				const thread = await this.props.postDiscussion(this.state.title, textUtils.getTextFromMetadata({
					type: "image",
					caption: name,
					height: 160 * aspectRatio,
					width: 160,
					thumbnailUrl: result.thumbnailUrl,
					originalUrl: result.originalUrl
				}), result.textId);

				this._onPosted(thread);
			} catch (e) {
				this._onError(FAIL_MESSAGE);
			}
		} else if (this.state.text) {
			try {
				this._onLoading();

				const thread = await this.props.postDiscussion(this.state.title, this.state.text);

				this._onPosted(thread);
			} catch (e) {
				this._onError(FAIL_MESSAGE);
			}
		} else {
			this._onError(NO_SUMMARY_MESSAGE);
		}
	}

	_onPress() {
		if (this.state.status === "loading") {
			return;
		}

		this._postDiscussion();
	}

	_onTitleChange(e) {
		this.setState({
			title: e.nativeEvent.text,
			error: null
		});
	}

	_onTextChange(e) {
		this.setState({
			text: e.nativeEvent.text,
			error: null
		});
	}

	async _uploadImage() {
		try {
			const imageData = await ImageChooser.pickImage();

			this.setState({
				imageData
			});
		} catch (e) {
			// Do nothing
		}
	}

	_onUploadFinish(result) {
		this.setState({
			uploadResult: result,
			error: null
		});
	}

	_onUploadClose() {
		this.setState({
			imageData: null,
			uploadResult: null,
			error: null
		});
	}

	render() {
		const isLoading = this.state.status === "loading";

		return (
			<StatusbarContainer style={styles.container}>
				<AppbarSecondary>
					<AppbarTouchable onPress={this.props.dismiss}>
						<AppbarIcon name="close" style={styles.icon} />
					</AppbarTouchable>

					<AppbarTouchable onPress={this._onPress.bind(this)}>
						{isLoading ?
							<Loading style={styles.loading} /> :
							(<View style={styles.button}>
								<AppbarIcon name="done" style={styles.buttonIcon} />
								<Text style={styles.buttonText}>POST</Text>
							</View>)
						}
					</AppbarTouchable>
				</AppbarSecondary>

				<Banner text={this.state.error} type="error" />

				<ScrollView style={styles.scene} keyboardShouldPersistTaps>
					<TextInput
						autoFocus
						value={this.state.title}
						onChange={this._onTitleChange.bind(this)}
						placeholder="Enter discussion title"
						autoCapitalize="sentences"
						style={styles.threadTitle}
					/>

					{this.state.imageData ?
						<ImageUploadController
							component={ImageUploadDiscussion}
							imageData={this.state.imageData}
							onUploadClose={this._onUploadClose.bind(this)}
							onUploadFinish={this._onUploadFinish.bind(this)}
							autoStart
						/> :
						<GrowingTextInput
							numberOfLines={5}
							value={this.state.text}
							onChange={this._onTextChange.bind(this)}
							placeholder="Enter discussion summary"
							autoCapitalize="sentences"
							inputStyle={styles.threadSummary}
						/>
					}

					{this.state.imageData ? null :
						<TouchFeedback onPress={this._uploadImage.bind(this)}>
							<View style={styles.uploadButton}>
								<Icon
									name="image"
									style={styles.uploadButtonIcon}
									size={24}
								/>
								<Text style={styles.uploadButtonText}>UPLOAD AN IMAGE</Text>
							</View>
						</TouchFeedback>
					}
				</ScrollView>
			</StatusbarContainer>
		);
	}
}

StartDiscussionButton.propTypes = {
	room: React.PropTypes.string.isRequired,
	dismiss: React.PropTypes.func.isRequired,
	postDiscussion: React.PropTypes.func.isRequired,
	navigator: React.PropTypes.object.isRequired
};
