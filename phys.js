var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite;

var engine = Engine.create();

var render = Render.create({
  element: document.getElementById("physbox"),
  engine: engine,
  options: {
    width: 800,
    height: 400,
    background: "#000000",
    wireframes: false,
  },
});

boneVertices = [
  [
    { x: -30, y: 10 },
    { x: -15, y: 20 },
    { x: 15, y: 20 },
    { x: 30, y: 10 },
    { x: 30, y: -10 },
    { x: 15, y: -20 },
    { x: -15, y: -20 },
    { x: -30, y: -10 },
    { x: -30, y: 10 },
  ],
];

function createBone(x, y) {
  let b = Bodies.fromVertices(x, y-500, boneVertices, {
    inertia: 100000,
    render: {
      sprite: {
        texture: "./bone3.png",
        xScale: 0.29,
        yScale: 0.29, 
      }
    },
    friction: 10,
  })
  Matter.Body.rotate(b, Math.random() * 3.14*2);
  return b;
}

var ground = Bodies.rectangle(400, 420, 2000, 40, { isStatic: true });
var leftWall = Bodies.rectangle(-50, 20, 100, 1000 , {isStatic: true });
var rightWall = Bodies.rectangle(850, 20, 100, 1000 , {isStatic: true });

let boneCount = 200;
let boneArray = [];
for (let i=0; i<boneCount; i++) {
  boneArray.push(createBone(Math.random() * 760, (Math.random() * 1600) - 800))
}

let worldArray = []
worldArray.push(ground);
worldArray.push(leftWall);
worldArray.push(rightWall);

Composite.add(engine.world, boneArray);
Composite.add(engine.world, worldArray);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

function takeBone(boneCount) {
  for (let i=0; i<boneCount; i++) {
    let idx = Math.floor(Math.random()*boneArray.length);
    Matter.World.remove(engine.world, boneArray[idx])
    delete(boneArray[idx]);
    boneArray[idx] = createBone(Math.random() * 760, (Math.random() * 800) - 800);
    Composite.add(engine.world, [boneArray[idx]]); 
  }
}

