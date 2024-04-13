uniform float u_frequencyData[64];
uniform int u_radius;
varying vec3 v_color;

void main() {
    float unit = float(u_radius * 2) / float(64);

    int index = int( float(position.x + float(u_radius)) / float(unit) );

    float frequencyValue = u_frequencyData[index] / float(500);

    vec3 new_position = vec3(position.x, position.y + (position.y * frequencyValue), position.z + (position.z * frequencyValue));
    
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(new_position, 1.0);

    v_color = vec3(0.5 + frequencyValue, position.x, 0.5 + frequencyValue);
}