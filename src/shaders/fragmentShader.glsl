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