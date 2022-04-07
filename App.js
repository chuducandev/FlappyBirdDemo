import React from "react";
import { StatusBar, Dimensions } from "react-native";
import { GameEngine } from "react-native-game-engine";
import { Physics, CleanBoxes, BirdFlying, ControlBirdVelocity, MoveWalls, CreateWall, CheckCollisions, StartGame, RestartGame } from "./systems";
import { Bird, Box, Score } from "./renderers";
import Matter from "matter-js";
import { bird, wall } from "./constants";

Matter.Common.isElement = () => false; //-- Overriding this function because the original references HTMLElement

const App = () => {
  const { width, height } = Dimensions.get("window");

  const engine = Matter.Engine.create({
    enableSleeping: false,
    gravity: {
      scale: 0.0015,
    }
  });
  const world = engine.world;
  const birdBody = Matter.Bodies.circle(
    width / 3,
    height / 3,
    bird.radius,
    {
      frictionAir: 0,
      isStatic: true,
      density: 50,
      collisionFilter: {
        category: 1,
        mask: -1,
      }
    },
  );
  const floorBody = Matter.Bodies.rectangle(
    width / 2,
    height + bird.radius,
    width,
    bird.radius * 2,
    {
      isStatic: true,
      collisionFilter: {
        category: 2,
      }
    },
  );
  const ceilBody = Matter.Bodies.rectangle(
    width / 2,
    -bird.radius,
    width,
    bird.radius * 2,
    {
      isStatic: true,
      collisionFilter: {
        category: 2,
      }
    }
  )
  const constraint = Matter.Constraint.create({
    label: "Drag Constraint",
    pointA: { x: 0, y: 0 },
    pointB: { x: 0, y: 0 },
    length: 0.01,
    stiffness: 0.1,
    angularStiffness: 1,
  });

  Matter.World.add(world, [birdBody, floorBody, ceilBody]);
  Matter.World.addConstraint(world, constraint);

  return (
    <GameEngine
      systems={[
        Physics,
        StartGame,
        RestartGame,
        CreateWall,
        CleanBoxes,
        BirdFlying,
        ControlBirdVelocity,
        MoveWalls,
        CheckCollisions,
      ]}
      entities={{
        physics: {
          engine: engine,
          world: world,
          constraint: constraint,
        },
        bird: {
          body: birdBody,
          radius: bird.radius,
          renderer: Bird,
        },
        floor: {
          body: floorBody,
          size: [width, bird.radius * 2],
          color: "#86E9BE",
          renderer: Box,
        },
        ceil: {
          body: ceilBody,
          size: [width, bird.radius * 2],
          color: "#86E9BE",
          renderer: Box,
        },
        global: {
          velocity: 0.0008 * width,
          startingTime: null,
          endingTime: null,
          numOfWalls: 1,
        },
        score: {
          value: 0,
          renderer: Score,
        }
      }}
      style={{
        backgroundColor: "#E6F4F1",
      }}
    >
      <StatusBar hidden={true} />
    </GameEngine>
  );
};

export default App;