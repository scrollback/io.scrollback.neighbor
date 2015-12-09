import React from "react-native";
import Colors from "../../colors.json";
import AppText from "./app-text";
import NotificationBadgeController from "../controllers/notification-badge-controller";
import TouchFeedback from "./touch-feedback";
import Icon from "./icon";
import Modal from "./modal";
import Share from "../modules/share";
import Linking from "../modules/linking";
import routes from "../utils/routes";
import locationUtils from "../lib/location-utils";
import config from "../store/config";

const {
	StyleSheet,
	PixelRatio,
	TouchableOpacity,
	View
} = React;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: Colors.white,
		borderColor: Colors.separator,
		borderBottomWidth: 1 / PixelRatio.get(),
		height: 64
	},
	item: {
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: 16
	},
	title: {
		color: Colors.darkGrey,
		fontWeight: "bold"
	},
	distance: {
		color: Colors.grey,
		fontSize: 12,
		lineHeight: 18
	},
	expand: {
		margin: 20,
		color: Colors.fadedBlack
	}
});

export default class RoomItem extends React.Component {
	_showMenu() {
		const { room, role } = this.props;

		const options = [];
		const actions = [];

		options.push("Share community");
		actions.push(() => {
			const { protocol, host } = config.server;

			Share.shareItem("Share community", `${protocol}//${host}/${room.id}`);
		});

		if (room.location && room.location.lat && room.location.lon) {
			options.push("View in Google Maps");
			actions.push(() => {
				const { lat, lon } = room.location;

				Linking.openURL("http://maps.google.com/maps?q=loc:" + lat + "," + lon);
			});
		}

		switch (role) {
		case "none":
			options.push("Join community");
			actions.push(this.props.joinCommunity);
			break;
		case "follower":
			options.push("Leave community");
			actions.push(this.props.leaveCommunity);
			break;
		}

		Modal.showActionSheetWithOptions({ options }, index => actions[index]());
	}

	_onPress() {
		this.props.navigator.push(routes.room({ room: this.props.room.id }));
		this.props.autoJoin();
	}

	render() {
		const { room, location } = this.props;

		return (
			<View {...this.props}>
				<TouchFeedback onPress={this._onPress.bind(this)}>
					<View style={styles.container}>
						<View style={styles.item}>
							<AppText style={styles.title}>{room.guides && room.guides.displayName ? room.guides.displayName : room.id}</AppText>
							{location && location.coords && room.location && room.location.lat && room.location.lon ?
								<AppText style={styles.distance}>
									{locationUtils.getFormattedDistance(location.coords, {
										latitude: room.location.lat,
										longitude: room.location.lon
									})}
								</AppText> :
								null
							}
						</View>

						{this.props.showBadge ?
							<NotificationBadgeController room={this.props.room.id} /> :
							null
						}

						{this.props.showMenuButton ?
							<TouchableOpacity onPress={this._showMenu.bind(this)}>
								<Icon
									name="expand-more"
									style={styles.expand}
									size={20}
								/>
							</TouchableOpacity> :
							null
						}
					</View>
				</TouchFeedback>
			</View>
		);
	}
}

RoomItem.propTypes = {
	room: React.PropTypes.shape({
		id: React.PropTypes.string.isRequired,
		guides: React.PropTypes.shape({
			displayName: React.PropTypes.string
		}),
		location: React.PropTypes.shape({
			lat: React.PropTypes.number,
			lon: React.PropTypes.number
		})
	}),
	location: React.PropTypes.shape({
		coords: React.PropTypes.shape({
			latitude: React.PropTypes.number.isRequired,
			longitude: React.PropTypes.number.isRequired
		}).isRequired
	}),
	role: React.PropTypes.string.isRequired,
	showMenuButton: React.PropTypes.bool,
	showBadge: React.PropTypes.bool,
	joinCommunity: React.PropTypes.func.isRequired,
	leaveCommunity: React.PropTypes.func.isRequired,
	autoJoin: React.PropTypes.func.isRequired,
	navigator: React.PropTypes.object.isRequired
};

RoomItem.defaultProps = {
	showMenuButton: true,
	showBadge: true
};
