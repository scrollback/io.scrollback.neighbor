import React from "react-native";
import Colors from "../../colors.json";
import AppText from "./app-text";
import RoomItemContainer from "../containers/room-item-container";
import PageFailed from "./page-failed";
import PageLoading from "./page-loading";
import LoadingItem from "./loading-item";
import Geolocation from "../modules/geolocation";
import config from "../store/config";

const {
	StyleSheet,
	PixelRatio,
	ListView,
	View
} = React;

const styles = StyleSheet.create({
	header: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderColor: Colors.separator,
		borderBottomWidth: 1 / PixelRatio.get()
	},
	headerText: {
		color: Colors.fadedBlack,
		fontSize: 12,
		lineHeight: 18,
		fontWeight: "bold"
	}
});

export default class LocalitiesBase extends React.Component {
	constructor(props) {
		super(props);

		this._dataSource = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2,
			sectionHeaderHasChanged: (h1, h2) => h1 !== h2
		});

		this.state = {
			location: null
		};
	}

	componentDidMount() {
		this._mounted = true;

		this._setCurrentPosition();
		this._watchPosition();
	}

	componentWillUnmount() {
		this._mounted = false;

		this._clearWatch();
	}

	_watchPosition() {
		this._watchID = Geolocation.watchPosition(location => {
			if (this._mounted) {
				this.setState({ location });
			}
		});
	}

	_clearWatch() {
		if (this._watchID) {
			Geolocation.clearWatch(this._watchID);
		}
	}

	async _setCurrentPosition() {
		try {
			const location = await Geolocation.getCurrentPosition();

			if (this._mounted) {
				this.setState({
					location
				});
			}
		} catch (e) {
			// Ignore
		}
	}

	_getDataSource() {
		return this._dataSource.cloneWithRowsAndSections(this.props.data);
	}

	render() {
		return (
			<View {...this.props}>
				{(() => {
					const { data } = this.props;
					const keys = Object.keys(data);

					if (keys.length === 0 || keys.every(item => data[item].length === 0)) {
						return <PageFailed pageLabel={this.props.pageEmptyLabel} />;
					}

					if (keys.every(item => data[item].length === 0 || data[item][0] === "missing") && keys.some(item => data[item][0] === "missing")) {
						return <PageLoading />;
					}

					if (keys.every(item => data[item].length === 1 && data[item][0] === "failed")) {
						return <PageFailed pageLabel="Failed to load communities" onRetry={this.props.refreshData} />;
					}

					if (keys.some(item => data[item].length === 1 && data[item][0] === "unavailable")) {
						return <PageFailed pageLabel={config.app_name + " is not available in your neighborhood yet."} />;
					}

					return (
						<ListView
							keyboardShouldPersistTaps
							initialListSize={1}
							dataSource={this._getDataSource()}
							renderRow={room => {
								if (room === "missing") {
									return <LoadingItem />;
								}

								return (
									<RoomItemContainer
										key={room.id}
										room={room}
										showMenuButton={this.props.showMenuButton}
										showBadge={this.props.showBadge}
										location={this.state.location}
										navigator={this.props.navigator}
									/>
								);
							}}
							renderSectionHeader={(sectionData, sectionID) => {
								let header;

								switch (sectionID) {
								case "following":
									header = "My communities";
									break;
								case "nearby":
									header = "Communities nearby";
									break;
								case "results":
									const count = sectionData.length;

									header = count + " result" + (count > 1 ? "s" : "") + " found";
									break;
								}

								return (
									<View style={styles.header}>
										<AppText style={styles.headerText}>{header.toUpperCase()}</AppText>
									</View>
								);
							}}
						/>
					);
				})()}
			</View>
		);
	}
}

LocalitiesBase.propTypes = {
	data: React.PropTypes.objectOf(React.PropTypes.arrayOf(React.PropTypes.oneOfType([
		React.PropTypes.oneOf([ "missing", "failed" ]),
		React.PropTypes.shape({
			id: React.PropTypes.string
		})
	]))).isRequired,
	refreshData: React.PropTypes.func,
	showMenuButton: React.PropTypes.bool,
	showBadge: React.PropTypes.bool,
	pageEmptyLabel: React.PropTypes.string.isRequired,
	navigator: React.PropTypes.object.isRequired
};
