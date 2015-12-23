import React from "react-native";
import Geolocation from "../../modules/geolocation";
import userUtils from "../../lib/user-utils";

const GPS_ENABLE_MESSAGE = "Help us find the best communities for you by enabling your GPS.";
const GPS_ENABLE_OK = "Go to settings";
const GPS_ENABLE_CANCEL = "Not now";
const NUM_ROOMS_TO_LOAD = 7;

const {
	Alert
} = React;

module.exports = function(core) {
	function loadNearByRooms(position, memberOf) {
		const limit = memberOf.length ? NUM_ROOMS_TO_LOAD : null;

		core.emit("getRooms", {
			location: {
				lat: position.coords.latitude,
				lon: position.coords.longitude
			},
			limit
		}, (err, res) => {
			if (err) {
				core.emit("setstate", {
					app: {
						nearByRooms: []
					}
				});

				return;
			}

			if (res.results && res.results.length) {
				core.emit("setstate", {
					app: {
						nearByRooms: res.results
					}
				});
			} else {
				core.emit("getRooms", { ref: "open-house" }, (e, r) => {
					if (e) {
						core.emit("setstate", {
							app: {
								nearByRooms: [ "unavailable" ],
								isAvailable: false
							}
						});

						return;
					}

					if (r.results && r.results.length) {
						core.emit("setstate", {
							app: {
								nearByRooms: r.results,
								isAvailable: false
							}
						});
					}
				});
			}
		});
	}

	core.on("init-dn", async init => {
		if (userUtils.isGuest(init.user.id)) {
			return;
		}

		let memberOf;

		memberOf = init.memberOf.map(room => room.id);

		if (memberOf.length < 4) {
			core.emit("setstate", {
				app: {
					nearByRooms: [ "missing" ]
				}
			});

			try {
				// Get current position
				const position = await Geolocation.getCurrentPosition();

				loadNearByRooms(position, memberOf);
			} catch (e) {
				// Watch for position change
				const watchID = Geolocation.watchPosition(p => {
					if (p) {
						loadNearByRooms(p, memberOf);

						Geolocation.clearWatch(watchID);
					}
				});

				// Request to enable GPS
				const isEnabled = await Geolocation.isGPSEnabled();

				if (!isEnabled) {
					Alert.alert(
						null, GPS_ENABLE_MESSAGE,
						[
							{
								text: GPS_ENABLE_CANCEL,
								onPress: () => {
									core.emit("setstate", {
										app: {
											nearByRooms: []
										}
									});
								}
							},
							{
								text: GPS_ENABLE_OK,
								onPress: () => Geolocation.showGPSSettings()
							},
						]
					);
				}
			}
		}
	}, 1);
};
