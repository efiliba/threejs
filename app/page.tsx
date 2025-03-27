"use client";

// https://www.youtube.com/watch?v=DPl34H2ISsk&t=329s

import { useRef, useEffect } from "react";
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera as ThreePerspectiveCamera,
  MeshStandardMaterial,
  Mesh,
  BoxGeometry,
  AmbientLight,
  PointLight,
  ACESFilmicToneMapping,
  SRGBColorSpace,
} from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

const createMesh = () => {
  const mesh = new Mesh();

  const geometry = new BoxGeometry();

  const material = new MeshStandardMaterial();

  mesh.geometry = geometry;
  mesh.material = material;

  return mesh;
};

class Cube extends Mesh {
  constructor() {
    super();

    const geometry = new BoxGeometry();
    const material = new MeshStandardMaterial({ color: "blue" });

    this.geometry = geometry;
    this.material = material;
  }

  update() {
    this.rotation.x += 0.01;
    this.rotation.y += 0.01;
  }

  dispose() {
    this.geometry.dispose(); // Done automatically in React version
  }
}

const CubeComponent = () => {
  const meshRef = useRef<Mesh>(null);

  // Equivalent to update - called every frame (requestAnimationFrame)
  useFrame(() => {
    meshRef.current!.rotation.x += 0.01;
    meshRef.current!.rotation.y += 0.01;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      {/* <meshStandardMaterial color="blue" /> */}
      <meshStandardMaterial>
        <color args={["blue"]} attach="color" />
      </meshStandardMaterial>
    </mesh>
  );
};

const vanillaScene = (width: number, height: number) => {
  const animate = () => {
    requestAnimationFrame(animate); // recursive
    renderer.render(scene, camera);

    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.01;
    mesh.update();
  };

  const scene = new Scene();

  // Set to R3F defaults
  const camera = new ThreePerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;

  const ambientLight = new AmbientLight();
  scene.add(ambientLight);

  const pointLight = new PointLight();
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);

  // const mesh = createMesh();
  const mesh = new Cube();
  scene.add(mesh);

  const renderer = new WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setSize(width, height);

  return { rendererDomElement: renderer.domElement, animate };
};

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);

  // const container = document.getElementById("__next");
  useEffect(() => {
    console.log("container", rootRef.current?.clientWidth);

    const { clientWidth, clientHeight } = rootRef.current!;
    const { rendererDomElement, animate } = vanillaScene(
      clientWidth,
      clientHeight
    );

    rootRef.current?.appendChild(rendererDomElement);
    animate();
  }, []);

  return (
    <div className="m-4 grid grid-cols-2 justify-items-center gap-2">
      <h1>Three.js</h1>
      <h1>React Three Fiber</h1>
      <div ref={rootRef} className="aspect-square border-1" />
      {/* <Canvas camera={{ position: [0, 0, 5] }} gl={{ toneMapping: ACESFilmicToneMapping}}> */}
      <Canvas className="aspect-square border-1">
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {/* <PerspectiveCamera makeDefault fov={75} position={[0, 0, 5]} /> */}
        {/* <mesh>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh> */}
        {/* <boxGeometry attach="geometry" /> */}
        {/* <boxGeometry args={[2, 2, 2]} /> // args added to constructor: i.e. new BoxGeometry(2, 2, 2) */}
        <CubeComponent />
      </Canvas>
    </div>
  );
}
