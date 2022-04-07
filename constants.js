import { Dimensions } from "react-native"

export const screen = {
	width: Dimensions.get("window").width,
	height: Dimensions.get("window").height,
}

export const bird = {
	radius: Math.trunc(Math.max(screen.width, screen.height) * 0.075) / 2,
	images: {
		up: {
			source: require("./assets/images/bird/bird-up.png"),
			width: 300,
			height: 190,
		},
		down: {
			source: require("./assets/images/bird/bird-down.png"),
			width: 300,
			height: 218,
		}
	}
}

export const wall = {
	thickness: Math.trunc(Math.max(screen.width, screen.height) * 0.12),
	hole: Math.trunc(Math.max(screen.width, screen.height) * 0.35),
}