precision mediump float;

varying vec2 vUv;

void main() {
    vUv = position.xy * 0.5 + 0.5; // Dùng sẵn biến `position` từ Three.js
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}