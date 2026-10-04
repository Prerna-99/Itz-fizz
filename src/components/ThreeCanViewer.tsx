import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Sparkles, Rotate3d, Palette } from 'lucide-react';
import { audioEngine } from '../utils/audio';

export type FinishId = 'obsidian' | 'gold' | 'crimson' | 'frost';

interface FinishConfig {
  id: FinishId;
  name: string;
  bodyColor: string;
  rimColor: string;
  roughness: number;
  metalness: number;
  glowColor: string;
  flavorTitle: string;
  subTitle: string;
}

export const FINISHES: FinishConfig[] = [
  {
    id: 'obsidian',
    name: 'Obsidian Matte',
    bodyColor: '#12141c',
    rimColor: '#e2e8f0',
    roughness: 0.35,
    metalness: 0.75,
    glowColor: 'rgba(245, 158, 11, 0.25)',
    flavorTitle: 'ORIGINAL RESERVE',
    subTitle: 'Botanical Cold-Press'
  },
  {
    id: 'gold',
    name: 'Solar Yuzu',
    bodyColor: '#eab308',
    rimColor: '#fef08a',
    roughness: 0.25,
    metalness: 0.85,
    glowColor: 'rgba(234, 179, 8, 0.35)',
    flavorTitle: 'YUZU & SHISO',
    subTitle: 'Citrus Effervescence'
  },
  {
    id: 'crimson',
    name: 'Ruby Bramble',
    bodyColor: '#9f1239',
    rimColor: '#f43f5e',
    roughness: 0.3,
    metalness: 0.8,
    glowColor: 'rgba(244, 63, 94, 0.35)',
    flavorTitle: 'WILD BLACKBERRY',
    subTitle: 'Crushed Hibiscus'
  },
  {
    id: 'frost',
    name: 'Frost Titanium',
    bodyColor: '#cbd5e1',
    rimColor: '#f8fafc',
    roughness: 0.2,
    metalness: 0.95,
    glowColor: 'rgba(56, 189, 248, 0.3)',
    flavorTitle: 'ALPINE PINE',
    subTitle: 'Nordic Pear Spec'
  }
];

interface ThreeCanViewerProps {
  scrollProgress?: number;
  onCanClick?: () => void;
}

export const ThreeCanViewer: React.FC<ThreeCanViewerProps> = ({ scrollProgress = 0, onCanClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeFinish, setActiveFinish] = useState<FinishConfig>(FINISHES[0]);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const canGroupRef = useRef<THREE.Group | null>(null);
  const canBodyMeshRef = useRef<THREE.Mesh | null>(null);
  const canRimMeshesRef = useRef<THREE.Mesh[]>([]);
  const bubblesGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<{ mesh: THREE.Points; velocities: Float32Array; lifetimes: Float32Array } | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Mouse drag & parallax tracking
  const mouseStateRef = useRef({
    isDown: false,
    prevX: 0,
    prevY: 0,
    targetRotY: 0.3,
    targetRotX: 0.1,
    currentRotY: 0.3,
    currentRotX: 0.1,
    hoverX: 0,
    hoverY: 0
  });

  // Generates high-res dynamic texture for the can label
  const createCanTexture = useCallback((finish: FinishConfig) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Background gradient matching the selected finish
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, finish.bodyColor);
    grad.addColorStop(0.5, finish.bodyColor);
    grad.addColorStop(1, '#050608');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle metallic brushed vertical streaks
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < canvas.width; i += 4) {
      if (Math.random() > 0.5) {
        ctx.fillRect(i, 0, 2, canvas.height);
      }
    }

    // Micro condensation water droplets pattern
    for (let i = 0; i < 280; i++) {
      const dx = Math.random() * canvas.width;
      const dy = Math.random() * canvas.height;
      const dr = 1.5 + Math.random() * 4.5;
      
      // Shadow
      ctx.beginPath();
      ctx.arc(dx + 1, dy + 1, dr, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fill();

      // Droplet body
      ctx.beginPath();
      ctx.arc(dx, dy, dr, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.fill();

      // Droplet specular glint
      ctx.beginPath();
      ctx.arc(dx - dr * 0.3, dy - dr * 0.3, dr * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fill();
    }

    // Top hairline metallic stripes
    ctx.strokeStyle = finish.rimColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 90);
    ctx.lineTo(canvas.width, 90);
    ctx.stroke();

    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 105);
    ctx.lineTo(canvas.width, 105);
    ctx.stroke();

    // Top Brand Kicker
    ctx.fillStyle = finish.rimColor;
    ctx.font = 'bold 22px monospace';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '8px';
    ctx.fillText('CRYO-INFUSED 4°C RESERVE', canvas.width / 2, 170);

    // Large Bold Brand Wordmark: ITZ FIZZ
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 96px "Syne", sans-serif';
    ctx.letterSpacing = '14px';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 12;
    ctx.fillText('ITZ FIZZ', canvas.width / 2, 430);

    ctx.shadowBlur = 0;

    // Subtitle & Spec
    ctx.fillStyle = finish.rimColor;
    ctx.font = 'bold 28px "Syne", sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillText(finish.flavorTitle, canvas.width / 2, 510);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '20px monospace';
    ctx.letterSpacing = '4px';
    ctx.fillText(finish.subTitle.toUpperCase(), canvas.width / 2, 560);

    // Botanical Emblem Icon
    ctx.strokeStyle = finish.rimColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 670, 36, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(canvas.width / 2, 670, 26, 0, Math.PI * 2);
    ctx.stroke();

    // Micro specs
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.font = '16px monospace';
    ctx.fillText('330 ML · 11.2 FL OZ · 2.8 BAR MICRO-BEAD', canvas.width / 2, 830);
    ctx.fillText('ZERO REFINED SUGARS · NO STEVIA', canvas.width / 2, 865);

    // Bottom hairline stripes
    ctx.strokeStyle = finish.rimColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 930);
    ctx.lineTo(canvas.width, 930);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = 1;
    return texture;
  }, []);

  // Update can materials when finish changes
  const applyFinish = useCallback((finish: FinishConfig) => {
    setActiveFinish(finish);
    if (!canBodyMeshRef.current) return;

    const newTexture = createCanTexture(finish);
    const bodyMat = canBodyMeshRef.current.material as THREE.MeshStandardMaterial;
    bodyMat.map = newTexture;
    bodyMat.color = new THREE.Color(finish.bodyColor);
    bodyMat.roughness = finish.roughness;
    bodyMat.metalness = finish.metalness;
    bodyMat.needsUpdate = true;

    canRimMeshesRef.current.forEach((rim) => {
      const rimMat = rim.material as THREE.MeshStandardMaterial;
      rimMat.color = new THREE.Color(finish.rimColor);
      rimMat.needsUpdate = true;
    });
  }, [createCanTexture]);

  // Burst effervescent particle explosion
  const triggerBubbleBurst = useCallback(() => {
    audioEngine.playCanOpenSound();
    audioEngine.playBubblePop();
    setHasInteracted(true);
    if (onCanClick) onCanClick();

    if (!particlesRef.current) return;
    const { velocities, lifetimes, mesh } = particlesRef.current;
    const pos = mesh.geometry.attributes.position as THREE.BufferAttribute;
    const count = lifetimes.length;

    for (let i = 0; i < count; i++) {
      // Reset position to top rim of can
      pos.setXYZ(i, (Math.random() - 0.5) * 0.8, 2.2, (Math.random() - 0.5) * 0.8);
      // Upward burst velocities
      velocities[i * 3] = (Math.random() - 0.5) * 0.12;
      velocities[i * 3 + 1] = 0.15 + Math.random() * 0.22;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
      // Life timer
      lifetimes[i] = 1.0;
    }
    pos.needsUpdate = true;

    // Give can a tactile bounce
    if (canGroupRef.current) {
      canGroupRef.current.position.y = -0.15;
    }
  }, [onCanClick]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.3, 8.5);

    // 2. High-performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Three-Point Studio Lighting
    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.8);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    // Cool Rim Backlight (accentuates can contour)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 3.2);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    // Warm Amber Side Light
    const amberLight = new THREE.DirectionalLight(0xf59e0b, 2.4);
    amberLight.position.set(5, -3, 3);
    scene.add(amberLight);

    // Ambient Studio Fill
    const ambientLight = new THREE.AmbientLight(0x181e2b, 1.4);
    scene.add(ambientLight);

    // 4. Beverage Can Hierarchical Group
    const canGroup = new THREE.Group();
    scene.add(canGroup);
    canGroupRef.current = canGroup;

    // Geometry Dimensions
    const canRadius = 1.15;
    const canHeight = 3.6;

    // Main Cylindrical Body
    const bodyGeometry = new THREE.CylinderGeometry(canRadius, canRadius, canHeight, 48, 1, true);
    const bodyTexture = createCanTexture(activeFinish);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      map: bodyTexture,
      roughness: activeFinish.roughness,
      metalness: activeFinish.metalness,
      color: new THREE.Color(activeFinish.bodyColor)
    });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    canGroup.add(bodyMesh);
    canBodyMeshRef.current = bodyMesh;

    // Top Taper Cone (Shoulder)
    const shoulderGeometry = new THREE.CylinderGeometry(canRadius * 0.88, canRadius, 0.35, 48);
    const metalRimMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeFinish.rimColor),
      metalness: 0.95,
      roughness: 0.15
    });
    const shoulderMesh = new THREE.Mesh(shoulderGeometry, metalRimMaterial);
    shoulderMesh.position.y = canHeight / 2 + 0.175;
    canGroup.add(shoulderMesh);

    // Top Rim Bevel Ring
    const rimTorusGeometry = new THREE.TorusGeometry(canRadius * 0.88, 0.06, 24, 48);
    const rimMesh = new THREE.Mesh(rimTorusGeometry, metalRimMaterial);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = canHeight / 2 + 0.35;
    canGroup.add(rimMesh);

    // Top Recessed Lid Face
    const lidGeometry = new THREE.CircleGeometry(canRadius * 0.87, 48);
    const lidMesh = new THREE.Mesh(lidGeometry, metalRimMaterial);
    lidMesh.rotation.x = -Math.PI / 2;
    lidMesh.position.y = canHeight / 2 + 0.33;
    canGroup.add(lidMesh);

    // Pull Tab Geometry
    const tabShape = new THREE.Shape();
    tabShape.moveTo(-0.15, -0.35);
    tabShape.lineTo(0.15, -0.35);
    tabShape.lineTo(0.18, 0.35);
    tabShape.lineTo(-0.18, 0.35);
    tabShape.closePath();
    const tabGeometry = new THREE.ShapeGeometry(tabShape);
    const tabMesh = new THREE.Mesh(tabGeometry, metalRimMaterial);
    tabMesh.rotation.x = -Math.PI / 2;
    tabMesh.position.set(0, canHeight / 2 + 0.35, 0.15);
    canGroup.add(tabMesh);

    // Bottom Inward Curve (Base)
    const baseGeometry = new THREE.CylinderGeometry(canRadius, canRadius * 0.82, 0.3, 48);
    const baseMesh = new THREE.Mesh(baseGeometry, metalRimMaterial);
    baseMesh.position.y = -canHeight / 2 - 0.15;
    canGroup.add(baseMesh);

    canRimMeshesRef.current = [shoulderMesh, rimMesh, lidMesh, tabMesh, baseMesh];

    // 5. Orbiting 3D Floating Bubbles Group
    const bubblesGroup = new THREE.Group();
    scene.add(bubblesGroup);
    bubblesGroupRef.current = bubblesGroup;

    const bubbleSphereGeo = new THREE.SphereGeometry(1, 16, 16);
    const bubbleMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      transmission: 0.88,
      opacity: 0.7,
      transparent: true,
      roughness: 0.1,
      ior: 1.33,
      metalness: 0.1
    });

    interface BubbleData {
      mesh: THREE.Mesh;
      speedY: number;
      orbitSpeed: number;
      orbitRadius: number;
      angle: number;
      baseY: number;
    }

    const bubbleEntities: BubbleData[] = [];
    const bubbleCount = 38;

    for (let i = 0; i < bubbleCount; i++) {
      const scale = 0.04 + Math.random() * 0.14;
      const bMesh = new THREE.Mesh(bubbleSphereGeo, bubbleMat);
      bMesh.scale.set(scale, scale, scale);

      const orbitRadius = 1.6 + Math.random() * 2.2;
      const angle = Math.random() * Math.PI * 2;
      const baseY = (Math.random() - 0.5) * 4.5;

      bMesh.position.set(
        Math.cos(angle) * orbitRadius,
        baseY,
        Math.sin(angle) * orbitRadius
      );

      bubblesGroup.add(bMesh);
      bubbleEntities.push({
        mesh: bMesh,
        speedY: 0.01 + Math.random() * 0.025,
        orbitSpeed: (Math.random() - 0.5) * 0.015,
        orbitRadius,
        angle,
        baseY
      });
    }

    // 6. Burst Particles System (Triggered on click/crack)
    const particleCount = 75;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);
    const particleLifetimes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = 0;
      particlePositions[i * 3 + 1] = 999; // offscreen until burst
      particlePositions[i * 3 + 2] = 0;
      particleLifetimes[i] = 0;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 0.12,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeo, particleMaterial);
    scene.add(particleSystem);
    particlesRef.current = {
      mesh: particleSystem,
      velocities: particleVelocities,
      lifetimes: particleLifetimes
    };

    // 7. Animation Loop with Smooth Lerping & Scroll Damping
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      const m = mouseStateRef.current;

      // Smooth damp rotation to targets
      m.currentRotY += (m.targetRotY + m.hoverX * 0.5 - m.currentRotY) * 0.08;
      m.currentRotX += (m.targetRotX - m.hoverY * 0.4 - m.currentRotX) * 0.08;

      if (canGroup) {
        // Idle continuous gentle rotation if not dragging
        if (!m.isDown) {
          m.targetRotY += 0.005;
        }

        canGroup.rotation.y = m.currentRotY;
        canGroup.rotation.x = m.currentRotX;
        canGroup.rotation.z = Math.sin(elapsedTime * 1.2) * 0.04;

        // Smooth spring back from click pop
        canGroup.position.y += (0 - canGroup.position.y) * 0.1;
      }

      // Animate orbiting 3D bubbles
      bubbleEntities.forEach((b) => {
        b.angle += b.orbitSpeed;
        b.mesh.position.y += b.speedY;
        b.mesh.position.x = Math.cos(b.angle) * b.orbitRadius;
        b.mesh.position.z = Math.sin(b.angle) * b.orbitRadius;

        if (b.mesh.position.y > 2.8) {
          b.mesh.position.y = -2.8;
        }
      });

      // Animate burst particles
      if (particlesRef.current) {
        const { velocities, lifetimes, mesh } = particlesRef.current;
        const posAttr = mesh.geometry.attributes.position as THREE.BufferAttribute;
        let anyActive = false;

        for (let i = 0; i < particleCount; i++) {
          if (lifetimes[i] > 0) {
            anyActive = true;
            lifetimes[i] -= delta * 1.2;
            posAttr.setX(i, posAttr.getX(i) + velocities[i * 3]);
            posAttr.setY(i, posAttr.getY(i) + velocities[i * 3 + 1]);
            posAttr.setZ(i, posAttr.getZ(i) + velocities[i * 3 + 2]);
            velocities[i * 3 + 1] -= delta * 0.28; // gravity deceleration

            if (lifetimes[i] <= 0) {
              posAttr.setY(i, 999);
            }
          }
        }
        if (anyActive) {
          posAttr.needsUpdate = true;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      bodyGeometry.dispose();
      shoulderGeometry.dispose();
      rimTorusGeometry.dispose();
      lidGeometry.dispose();
      bubbleSphereGeo.dispose();
      particleGeo.dispose();
    };
  }, [createCanTexture, activeFinish]);

  // Handle Drag & Hover interaction for 3D Orbit
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setHasInteracted(true);
    const m = mouseStateRef.current;
    m.isDown = true;
    m.prevX = e.clientX;
    m.prevY = e.clientY;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = mountRef.current?.getBoundingClientRect();
    if (rect) {
      const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseStateRef.current.hoverX = normX;
      mouseStateRef.current.hoverY = normY;
    }

    const m = mouseStateRef.current;
    if (!m.isDown) return;

    const deltaX = e.clientX - m.prevX;
    const deltaY = e.clientY - m.prevY;
    m.prevX = e.clientX;
    m.prevY = e.clientY;

    m.targetRotY += deltaX * 0.012;
    m.targetRotX = Math.max(-0.6, Math.min(0.6, m.targetRotX + deltaY * 0.008));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    mouseStateRef.current.isDown = false;
  };

  return (
    <div className="relative w-full h-[380px] sm:h-[450px] md:h-[480px] flex flex-col items-center justify-center select-none">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onClick={triggerBubbleBurst}
        className={`w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-300 ${
          isDragging ? 'scale-[1.02]' : ''
        }`}
        style={{ touchAction: 'none' }}
        title="Drag to rotate 3D can · Click to release effervescence"
      />

      {/* Atmospheric Ambient Glow behind 3D object */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10 rounded-full blur-[100px] transition-all duration-700 opacity-60"
        style={{ background: activeFinish.glowColor }}
      />

      {/* Interactive Helper Overlay HUD */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
        <div className="px-3 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] uppercase font-mono tracking-widest text-neutral-300 flex items-center gap-1.5 shadow-lg">
          <Rotate3d className="w-3 h-3 text-amber-400" />
          <span>Interactive 3D Canvas · Drag 360° · Tap to Fizz</span>
        </div>
      </div>

      {/* Dynamic 3D Material / Finish Switcher */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 shadow-2xl z-20">
        <div className="flex items-center gap-1.5 px-2 text-[10px] font-mono uppercase text-neutral-400 border-r border-white/10 hidden sm:flex">
          <Palette className="w-3 h-3 text-amber-400" />
          <span>Vessel Finish:</span>
        </div>

        {FINISHES.map((finish) => {
          const isActive = activeFinish.id === finish.id;
          return (
            <button
              key={finish.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                applyFinish(finish);
                audioEngine.playBubblePop();
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-white/15 text-white border border-amber-400/50 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-white/20"
                style={{ backgroundColor: finish.bodyColor }}
              />
              <span className="text-[11px] whitespace-nowrap">{finish.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
