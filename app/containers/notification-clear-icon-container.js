import React from "react-native";
import NotificationClearIcon from "../views/notification-clear-icon";
import Container from "./container";

class NotificationClearIconContainer extends React.Component {
	_clearAll() {
		this.dispatch("note", { dismissTime: Date.now() });
	}

	render() {
		return <NotificationClearIcon {...this.props} clearAll={this._clearAll.bind(this)} />;
	}
}

export default Container(NotificationClearIconContainer);
