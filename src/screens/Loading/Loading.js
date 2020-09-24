import React, { Component } from "react";
import { View } from "react-native";
import { Text } from "native-base";

class Loading extends Component {
	/**
	 * Let's check if user is logged in, or not
	 */
	componentDidMount() {
		const isLoggedIn = true;
		//this.props.navigation.navigate(isLoggedIn ? "App" : "Login");
		this.props.navigation.navigate("Login");
	}

	render() {
		return (
			<View>
				<Text>Loading screen</Text>
			</View>
		);
	}
}

export default Loading;