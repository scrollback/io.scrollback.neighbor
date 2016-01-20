/* @flow */

import React from "react-native";
import DiscussionDetails from "../views/DiscussionDetails";
import Container from "./Container";
import store from "../store/store";

class DiscussionDetailsContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			thread: "missing"
		};
	}

	componentDidMount() {
		this.runAfterInteractions(this._updateData);

		this.handle("statechange", changes => {
			if (changes.indexes && changes.indexes.threadsById && changes.indexes.threadsById[this.props.thread]) {
				this._updateData();
			}
		});
	}

	_updateData = () => {
		this.setState({
			thread: store.getThreadById(this.props.thread) || "failed"
		});
	};

	render() {
		return <DiscussionDetails {...this.props} {...this.state} />;
	}
}

DiscussionDetailsContainer.propTypes = {
	thread: React.PropTypes.string.isRequired
};

export default Container(DiscussionDetailsContainer);
