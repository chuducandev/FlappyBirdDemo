import React from "react";
import { Text } from "react-native";
import {
	View,
	Image,
} from "react-native";
import { Animated } from "react-native";
import { bird, screen } from "./constants";

export const Box = (props) => {
	const width = props.size[0];
	const height = props.size[1];
	const x = props.body.position.x - width / 2;
	const y = props.body.position.y - height / 2;
	const angle = props.body.angle;

	return (
		<Animated.View
			style={{
				position: "absolute",
				left: x,
				top: y,
				width: width,
				height: height,
				transform: [{ rotate: angle + "rad" }],
				backgroundColor: props.color || "pink",
			}}
		/>
	);
};

export const Bird = ({
	radius,
	body,
}) => {
	const width = radius * 2;
	const height = radius * 2;
	const x = body.position.x - radius;
	const y = body.position.y - radius;
	const angle = body.velocity.y / (4 * Math.PI);

	const scaleUp = 1.5;
	const scaleDown = 1.4;

	return (
		<Animated.View
			style={{
				position: "absolute",
				left: x,
				top: y,
				width: width,
				height: height,
				transform: [{ rotate: angle + "rad" }],
			}}
		>
			{/* <View
				style={{
					position: "absolute",
					width: width,
					height: height,
					borderRadius: radius,
					overflow: "hidden",
					backgroundColor: "pink",
				}}
			/> */}
			{angle < -0.1 ? <Image
				source={bird.images.up.source}
				style={{
					width: scaleUp * width,
					height: scaleUp * width / bird.images.up.width * bird.images.up.height,
					marginLeft: -width / 2.3,
					marginTop: width * 0.1,
				}}
			/> : <Image
				source={bird.images.down.source}
				style={{
					width: scaleDown * width,
					height: scaleDown * width / bird.images.down.width * bird.images.down.height,
					marginLeft: -width / 3.5,
					// marginTop: -width * 0.1,
				}}
			/>}
		</Animated.View>
	);
}

export const Score = ({ value }) => {

	return (
		<Text
			style={{
				position: "absolute",
				top: screen.height * 0.1,
				alignSelf: "center",
				fontSize: screen.width / 3.5,
				color: "#0F2535",
				fontWeight: "bold",
			}}
		>{value}</Text>
	)
}