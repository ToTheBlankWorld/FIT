import { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const VERT = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uScroll;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vDisp;

  // cheap 3D value-noise based displacement
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    float t = uTime * 0.28;
    vec3 p = position;
    float n = snoise(p * 1.1 + vec3(t, t * 0.7, -t * 0.5));
    float n2 = snoise(p * 2.6 - vec3(t * 0.6));
    float pointerPush = length(uPointer) * 0.12;
    float disp = n * (0.22 + uScroll * 0.25 + pointerPush) + n2 * 0.07;
    vDisp = disp;
    p += normal * disp;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalMatrix * normal;
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uAccent;
  uniform vec2 uPointer;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vDisp;
  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vView);
    float fres = pow(1.0 - max(dot(N, V), 0.0), 2.2);
    vec3 base = mix(uColorA, uColorB, smoothstep(-0.25, 0.35, vDisp));
    vec3 col = mix(base, uAccent, fres * (0.55 + uPointer.y * 0.2));
    // faint latitude bands for a technical feel
    float bands = smoothstep(0.48, 0.5, abs(fract(N.y * 9.0) - 0.5));
    col += vec3(0.05) * bands;
    col += fres * vec3(0.35, 0.33, 0.3);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Core({ pointer, scroll, reduced }: { pointer: React.MutableRefObject<THREE.Vector2>; scroll: React.MutableRefObject<number>; reduced: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  // on narrow screens the composition centers so the form isn't cropped
  const cx = useMemo(
    () => (typeof window !== "undefined" && window.innerWidth < 768 ? 0 : 1.4),
    []
  );
  const cy = useMemo(
    () => (typeof window !== "undefined" && window.innerWidth < 768 ? 1.1 : 0.1),
    []
  );
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: {
          uTime: { value: 0 },
          uPointer: { value: new THREE.Vector2() },
          uScroll: { value: 0 },
          uColorA: { value: new THREE.Color("#1a1a1e") },
          uColorB: { value: new THREE.Color("#3d3a35") },
          uAccent: { value: new THREE.Color("#ff4d00") },
        },
      }),
    []
  );

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    if (!reduced) {
      mat.uniforms.uTime.value += d;
      if (mesh.current) {
        mesh.current.rotation.y += d * 0.08;
        mesh.current.rotation.x += d * 0.03;
      }
      if (wire.current) {
        wire.current.rotation.y -= d * 0.05;
        wire.current.rotation.z += d * 0.02;
      }
    }
    mat.uniforms.uPointer.value.lerp(pointer.current, 0.06);
    mat.uniforms.uScroll.value += (scroll.current - mat.uniforms.uScroll.value) * 0.06;
    // scroll tilts the whole form
    if (mesh.current && wire.current) {
      const target = scroll.current * 0.9;
      mesh.current.rotation.z += (target - mesh.current.rotation.z) * 0.04;
      wire.current.rotation.z = mesh.current.rotation.z * 1.2;
    }
    void state;
  });

  return (
    <group ref={group} position={[cx, cy, 0]}>
      <mesh ref={mesh} material={mat}>
        <icosahedronGeometry args={[1.55, 48]} />
      </mesh>
      <mesh ref={wire} scale={1.035}>
        <icosahedronGeometry args={[1.55, 12]} />
        <meshBasicMaterial wireframe color="#ece8df" transparent opacity={0.055} />
      </mesh>
    </group>
  );
}

function Shell({ pointer, reduced }: { pointer: React.MutableRefObject<THREE.Vector2>; reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const COUNT = 1100;
  const offX = useMemo(
    () => (typeof window !== "undefined" && window.innerWidth < 768 ? 0 : 1.2),
    []
  );

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const r = 2.7 + Math.random() * 2.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta) + offX;
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      seeds[i] = Math.random() * Math.PI * 2;
    }
    return { positions, seeds };
  }, [offX]);

  useFrame((state, delta) => {
    const pts = ref.current;
    if (!pts || reduced) return;
    const d = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    pts.rotation.y += d * 0.02;
    // pointer parallax on the whole shell
    pts.rotation.x += ((pointer.current.y * 0.25) - pts.rotation.x) * 0.03;
    pts.position.x += ((pointer.current.x * 0.4) - pts.position.x) * 0.03;
    const pos = (pts.geometry.getAttribute("position") as THREE.BufferAttribute);
    const arr = pos.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 1] += Math.sin(t * 0.6 + seeds[i]) * 0.0009;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#ece8df"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function HeroScene() {
  const pointer = useRef(new THREE.Vector2(0, 0));
  const scroll = useRef(0);
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
    };
    const onScroll = () => {
      scroll.current = Math.min(1, window.scrollY / window.innerHeight);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 7], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <Rig>
        <Core pointer={pointer} scroll={scroll} reduced={reduced} />
        <Shell pointer={pointer} reduced={reduced} />
      </Rig>
    </Canvas>
  );
}
