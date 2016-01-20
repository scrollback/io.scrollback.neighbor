/* @flow */

import React from "react-native";
import UserIcon from "../views/UserIcon";
import Container from "./Container";
import store from "../store/store";

class UserIconContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			nick: ""
		};
	}

	componentDidMount() {
		this.runAfterInteractions(this._updateData);

		this.handle("statechange", changes => {
			if ("user" in changes) {
				this._updateData();
			}
		});
	}

	_updateData = () => {
		this.setState({
			nick: store.get("user")
		});
	};

	render() {
		return <UserIcon {...this.props} nick={this.state.nick} />;
	}
}

export default Container(UserIconContainer);
