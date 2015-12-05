import React from "react-native";
import AppController from "./app/controllers/app-controller";

const {
	AppRegistry
} = React;

export default class HeyNeighbor extends React.Component {
	render() {
		return <AppController />;
	}
}

AppRegistry.registerComponent("HeyNeighbor", () => HeyNeighbor);
