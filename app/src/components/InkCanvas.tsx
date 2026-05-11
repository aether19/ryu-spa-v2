import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const vertexShader = `
varying vec2 v_uv;

void main() {
  v_uv = uv * 0.5 + 0.5;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float u_time;
uniform float u_progress;
uniform vec2 u_resolution;
uniform float u_goldIntensity;

varying vec2 v_uv;

vec3 permute(vec3 x) {
  return mod(((x*34.0)+1.0)*x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 x) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
  for (int i = 0; i < 5; ++i) {
    v += a * snoise(x);
    x = rot * x * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = v_uv;

  vec2 flowUv = uv * 3.0;
  flowUv.x += sin(flowUv.y * 2.0 + u_time * 0.2) * 0.1;
  flowUv.y += cos(flowUv.x * 2.0 + u_time * 0.15) * 0.1;

  float noise1 = fbm(flowUv + u_time * 0.1);
  float noise2 = fbm(flowUv * 1.5 - u_time * 0.08);
  float combinedNoise = noise1 * 0.5 + noise2 * 0.5;

  float revealMask = smoothstep(u_progress, u_progress - 0.1, uv.x + combinedNoise * 0.2);

  vec3 voidBlack = vec3(0.05, 0.04, 0.02);
  vec3 inkColor = vec3(0.10, 0.07, 0.03);

  vec3 color = mix(voidBlack, inkColor, combinedNoise + 0.2);

  float goldShimmer = snoise(uv * 15.0 + u_time * 0.3);
  goldShimmer = smoothstep(0.6, 0.9, goldShimmer);
  color += vec3(0.78, 0.56, 0.22) * goldShimmer * 0.15 * u_goldIntensity;

  color *= revealMask;

  gl_FragColor = vec4(color, revealMask);
}
`;

export default function InkCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Geometry and material
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        u_time: { value: 0 },
        u_progress: { value: 1.0 },
        u_resolution: { value: new THREE.Vector2(container.offsetWidth, container.offsetHeight) },
        u_goldIntensity: { value: 1.0 },
      },
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animate progress from 1.0 to 0.0 on load
    gsap.to(material.uniforms.u_progress, {
      value: 0.0,
      duration: 2.5,
      ease: 'power2.out',
    });

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      material.uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Resize handler
    const onResize = () => {
      if (!container || !renderer) return;
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      renderer.setSize(w, h);
      material.uniforms.u_resolution.value.set(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
}
