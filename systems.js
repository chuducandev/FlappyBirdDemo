import { Box } from "./renderers";
import Matter from "matter-js";
import { wall } from "./constants";

const distance = ([x1, y1], [x2, y2]) =>
	Math.sqrt(Math.abs(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));

export const Physics = (state, { touches, time }) => {
	let engine = state["physics"].engine;

	Matter.Engine.update(engine, time.delta);

	return state;
};

export const StartGame = (state, { touches, screen }) => {
	if (!state["global"].startingTime && touches.find(t => t.type === "press")) {
		state["global"].startingTime = (new Date()).getTime();
		Matter.Body.setStatic(state["bird"].body, false);
	}
	return state;
}

export const RestartGame = (state, { touches, screen }) => {
	const currentTime = (new Date()).getTime();
	if (state["global"].endingTime && currentTime > state["global"].endingTime + 2000 && touches.find(t => t.type === "press")) {
		state["global"].endingTime = null;
		state["global"].startingTime = null;
		Matter.Body.setStatic(state["bird"].body, true);
		Matter.Body.setPosition(state["bird"].body, {
			x: screen.width / 3,
			y: screen.height / 3,
		});
		Matter.Body.setVelocity(state["bird"].body, {
			x: 0,
			y: 0,
		});
		state["global"].numOfWalls = 1;
		Object.keys(state).filter(key => key.startsWith("wall")).forEach(key => {
			delete state[key];
		});
		state["score"].value = 0;
	}

	return state;
}

export const CreateWall = (state, { touches, screen }) => {
	if (!state["global"].startingTime) return state;

	const world = state["physics"].world;
	const startingTime = state["global"].startingTime;
	const currentTime = (new Date()).getTime();
	const velocity = state["global"].velocity;
	const timeBetweenWalls = screen.width / (1.3 * velocity);
	const numOfWalls = state["global"].numOfWalls;

	if ((currentTime - startingTime) / timeBetweenWalls > numOfWalls && !state["global"].endingTime) {
		const holePosition = Math.random() * (screen.height - wall.hole - screen.height * 0.2) + screen.height * 0.1;

		const wallBodyUp = Matter.Bodies.rectangle(
			screen.width + wall.thickness / 2,
			holePosition / 2,
			wall.thickness,
			holePosition,
			{
				isStatic: true,
				collisionFilter: {
					category: 4,
				}
			}
		)
		const wallBodyDown = Matter.Bodies.rectangle(
			screen.width + wall.thickness / 2,
			(holePosition + wall.hole + screen.height) / 2,
			wall.thickness,
			(screen.height - (holePosition + wall.hole)),
			{
				isStatic: true,
				collisionFilter: {
					category: 4,
				}
			}
		)

		Matter.World.add(world, [wallBodyUp, wallBodyDown]);

		state[`wall${numOfWalls}up`] = {
			body: wallBodyUp,
			size: [wall.thickness, holePosition],
			color: "#339288",
			renderer: Box,
			num: numOfWalls,
		};
		state[`wall${numOfWalls}down`] = {
			body: wallBodyDown,
			size: [wall.thickness, screen.height - holePosition - wall.hole],
			color: "#339288",
			renderer: Box,
			num: numOfWalls,
		}

		state["global"].numOfWalls++;
	}

	return state;
};

export const BirdFlying = (state, { touches, screen }) => {
	if (!state["global"].startingTime || state["global"].endingTime) return state;

	touches.filter(t => t.type == "press").forEach(t => {
		Matter.Body.applyForce(state["bird"].body, state["bird"].body.position, {
			x: 0,
			y: -20000,
		});
	});

	return state;
}

export const ControlBirdVelocity = (state, { touches, screen }) => {
	if (!state["global"].startingTime || state["global"].endingTime) return state;

	if (state["bird"]?.body.velocity.y < -10) {
		Matter.Body.setVelocity(state["bird"].body, {
			x: state["bird"].body.velocity.x,
			y: -10,
		});
	}

	if (state["bird"]?.body.position.x != screen.width / 3) {
		Matter.Body.setPosition(state["bird"].body, {
			x: screen.width / 3,
			y: state["bird"].body.position.y,
		});
	}

	return state;
}

export const MoveWalls = (state, { touches, screen, time }) => {
	Object.keys(state).filter(key => key.startsWith("wall")).forEach(key => {
		Matter.Body.setPosition(state[key].body, {
			x: state[key].body.position.x - state["global"].velocity * time.delta,
			y: state[key].body.position.y,
		})

		if (state[key].body.position.x < screen.width / 3 && !state["global"].endingTime) {
			state["score"].value = Math.max(state["score"].value, state[key].num);
		}
	})


	return state;
}

export const CheckCollisions = (state, { touches, screen }) => {
	if (!state["global"].startingTime || state["global"].endingTime) return state;

	const collisions = Matter.Query.collides(state["bird"].body, state["physics"].world.bodies);

	if (collisions.length > 1) {
		state["global"].endingTime = (new Date()).getTime();
		state["bird"].body.collisionFilter.mask = 3;
	}

	return state;
}

export const CleanBoxes = (state, { touches, screen }) => {
	let world = state["physics"].world;

	Object.keys(state)
		.filter(key => key != "bird" && state[key].body && (state[key].body.position.y > screen.height * 2 || state[key].body.position.x < -screen.width))
		.forEach(key => {
			Matter.Composite.remove(world, state[key].body);
			delete state[key];
		});

	return state;
};
