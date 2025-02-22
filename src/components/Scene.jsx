import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useMemo, useRef } from "react";
import TouchTexture from "../utils/TouchTexture";

const HEIGHT = 6;
const ASPECT_RATIO = 1808 / 2400;
const WIDTH = HEIGHT * ASPECT_RATIO;

function Plane() {
  const mesh = useRef(null);
  const shader = useRef(null);
  const touchTexture = useMemo(() => new TouchTexture({ debugCanvas: false, size: 128 }), []);

  // Load image texture
  const texture = useLoader(TextureLoader, "/image.jpeg"); // Đặt ảnh trong thư mục public

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTouch: { value: touchTexture.texture },
      uTexture: { value: texture },
    }),
    [texture]
  );

  useFrame((state, delta) => {
    touchTexture.update();
    if (mesh.current) {
      const t = state.clock.getElapsedTime();
      mesh.current.rotation.x = Math.cos(((t / 8) * 8) / 8) * 0.1;
      mesh.current.rotation.y = Math.cos(((t / 8) * 8) / 8) * 0.1;
    }
    if (shader.current) {
      shader.current.uniforms.uTime.value += delta;
    }
  });

  const handlePointerMove = (e) => {
    const normalizedX = e.point.x / WIDTH + 0.5;
    const normalizedY = e.point.y / HEIGHT + 0.5;
    touchTexture.addPoint({ x: normalizedX, y: normalizedY });
  };

  return (
    <mesh ref={mesh} onPointerMove={handlePointerMove}>
      <planeGeometry args={[WIDTH, HEIGHT, 64, 64]} />
      <shaderMaterial
        ref={shader}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform sampler2D uTouch;

          void main() {
            vUv = uv;
            float touch = texture2D(uTouch, vUv).x;
            vec3 newPosition = position;
            float elevation = sin(newPosition.x * 2. - uTime) * 0.05;
            elevation += sin(newPosition.y * 2. - uTime) * 0.05;
            newPosition += elevation;
            newPosition.z += touch;
            vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            gl_Position = projectedPosition;
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform sampler2D uTouch;
          uniform sampler2D uTexture;

          void main(){
            float touch = texture2D(uTouch, vUv).r;
            vec4 color = texture2D(uTexture, vUv); 
            color.rgb *= 2.;
            color.rgb *= touch + 0.5;
            gl_FragColor = color;
          }
        `}
      />
    </mesh>
  );
}

export function Scene() {
  return (
    <Canvas style={{ height: "100vh", width: "100vw" }}>
      <ambientLight intensity={0.5} />
      <Plane />
    </Canvas>
  );
}

export default Scene;