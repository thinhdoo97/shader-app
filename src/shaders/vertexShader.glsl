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