import React from "react-native";
import Icon from "./icon";
import CardAuthor from "./card-author";
import timeUtils from "../../lib/time-utils";

const {
	StyleSheet,
	Text,
	View
} = React;

const styles = StyleSheet.create({
	footer: {
		flexDirection: "row",
		marginTop: 6
	},
	left: {
		flex: 1
	},
	right: {
		flexDirection: "row",
		justifyContent: "flex-end"
	},
	info: {
		flexDirection: "row",
		alignItems: "center"
	},
	label: {
		color: "#000",
		fontSize: 12,
		marginLeft: 8,
		marginRight: 16,
		paddingHorizontal: 4
	},
	action: {
		fontWeight: "bold"
	},
	loved: {
		color: "#E91E63"
	},
	icon: {
		color: "#000"
	},
	faded: {
		opacity: 0.3
	}
});

export default class DiscussionFooter extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (
			this.props.thread.updateTime !== nextProps.thread.updateTime ||
			this.props.thread.length !== nextProps.thread.length
		);
	}

	render() {
		return (
			<View {...this.props} style={[ styles.footer, this.props.style ]}>
				<CardAuthor nick={this.props.thread.from} style={styles.left} />

				<View style={styles.right}>
					<View style={[ styles.info, styles.faded ]}>
						<Icon
							name="access-time"
							style={styles.icon}
							size={24}
						/>
						<Text style={styles.label}>{timeUtils.short(this.props.thread.updateTime)}</Text>
					</View>
					<View style={[ styles.info, styles.faded ]}>
						<Icon
							name="forum"
							style={styles.icon}
							size={24}
						/>
						<Text style={styles.label}>{this.props.thread.length || 1}</Text>
					</View>
				</View>
			</View>
		);
	}
}

DiscussionFooter.propTypes = {
	thread: React.PropTypes.shape({
		updateTime: React.PropTypes.number.isRequired,
		length: React.PropTypes.number.isRequired,
		from: React.PropTypes.string.isRequired
	}).isRequired
};
