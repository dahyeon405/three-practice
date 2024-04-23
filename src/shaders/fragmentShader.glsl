precision mediump float;
varying vec3 v_color;

varying float v_index;
varying float v_fftFactor;

void main(){
    gl_FragColor = vec4(v_index, 0.6, v_fftFactor, 1.0);
}