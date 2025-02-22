precision mediump float;

varying vec2 vUv;
uniform float time;
uniform vec2 mouse;

void main() {
    vec2 uv = vUv;
    
    // Tạo hiệu ứng sóng bằng sin()
    float wave = sin(uv.x * 10.0 + time) * 0.5 + 0.5;

    // Tạo vùng sáng tối dựa trên vị trí chuột
    float dist = distance(uv, mouse);
    float glow = 1.0 - smoothstep(0.1, 0.3, dist);

    // Kết hợp hiệu ứng sóng và glow
    vec3 color = vec3(wave, glow, wave * glow);
    gl_FragColor = vec4(color, 1.0);
}