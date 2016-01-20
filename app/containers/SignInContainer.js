/* @flow */

import React from "react-native";
import SignIn from "../views/SignIn";
import SignUp from "../views/SignUp";
import Container from "./Container";
import userUtils from "../lib/user-utils";

class SignInContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: null
		};
	}

	_signIn = async (provider, token) => {
		const init = await this.dispatch("init", {
			auth: {
				[provider]: { token }
			}
		});

		const user = init.user;

		if (userUtils.isGuest(user.id) && user.identities.some(ident => ident.indexOf("mailto:") === 0)) {
			if (this._mounted) {
				this.setState({
					user
				});
			}
		}
	};

	_signUp = async nick => {
		const { user } = this.state;

		let results;

		try {
			results = await this.query("getEntities", { ref: nick });
		} catch (e) {
			throw new Error("An error occured!");
		}

		if (results && results.length) {
			throw new Error(nick + " is already taken.");
		} else {
			return await this.dispatch("user", {
				from: nick,
				to: nick,
				user: {
					id: nick,
					identities: user.identities,
					picture: user.params.pictures && user.params.pictures[0] || "",
					params: {
						pictures: user.params.pictures
					},
					guides: {}
				}
			});
		}
	};

	_cancelSignUp = () => {
		this.setState({
			user: null
		});
	};

	render() {
		if (this.state.user) {
			return (
				<SignUp
					user={this.state.user}
					signUp={this._signUp}
					cancelSignUp={this._cancelSignUp}
				/>
			);
		} else {
			return <SignIn {...this.props} signIn={this._signIn} />;
		}
	}
}

export default Container(SignInContainer);
