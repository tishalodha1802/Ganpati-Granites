import * as THREE from 'three';

export function initWebGL() {
  const container = document.getElementById('webgl-container');
  if (!container) return;

  // Scene setup
  const scene = new THREE.Scene();
  
  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.z = 7; // Moved back slightly to fit 3 slabs

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // Add some realistic tone mapping
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  container.appendChild(renderer.domElement);

  // Lighting - Enhanced for Rajasthan Heritage theme (Warmer glow)
  const ambientLight = new THREE.AmbientLight(0xffeedd, 0.5); // Warm ambient
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffeedd, 2.5); // Warm sunlight
  directionalLight.position.set(5, 5, 4);
  scene.add(directionalLight);

  const fillLight = new THREE.DirectionalLight(0xffeedd, 1.0);
  fillLight.position.set(-5, 0, 4);
  scene.add(fillLight);

  const pointLight = new THREE.PointLight(0xc0392b, 4, 15); // Regal red accent light
  pointLight.position.set(-2, -2, 2);
  scene.add(pointLight);

  // Load Textures
  const textureLoader = new THREE.TextureLoader();
  const blackTex = textureLoader.load('/black_granite.png');
  const whiteTex = textureLoader.load('/kashmir_white.png');
  const goldTex = textureLoader.load('/imperial_gold.png');
  const heritageTex = textureLoader.load('/rajasthan_heritage.png');
  
  [blackTex, whiteTex, goldTex, heritageTex].forEach(tex => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
  });

  // Geometry
  const geometry = new THREE.BoxGeometry(2.2, 3.2, 0.15);
  
  // Base material config for highly polished stone
  const materialConfig = {
    roughness: 0.1,
    metalness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    color: 0xffffff
  };

  // Create 4 Slabs
  const slabBlack = new THREE.Mesh(
    geometry, 
    new THREE.MeshPhysicalMaterial({ ...materialConfig, map: blackTex })
  );
  const slabWhite = new THREE.Mesh(
    geometry, 
    new THREE.MeshPhysicalMaterial({ ...materialConfig, map: whiteTex })
  );
  const slabGold = new THREE.Mesh(
    geometry, 
    new THREE.MeshPhysicalMaterial({ ...materialConfig, map: goldTex })
  );
  const slabHeritage = new THREE.Mesh(
    geometry, 
    new THREE.MeshPhysicalMaterial({ ...materialConfig, map: heritageTex })
  );

  // Initial Positions (Staggered)
  slabBlack.position.set(-0.5, 0.2, 1);
  slabWhite.position.set(-2.0, -0.5, -1);
  slabGold.position.set(1.5, 0.5, -0.5);
  slabHeritage.position.set(2.5, -0.8, -2); // 4th slab placed bottom right

  // Initial Rotations
  slabBlack.rotation.set(0.1, -0.2, 0);
  slabWhite.rotation.set(-0.2, 0.3, 0.1);
  slabGold.rotation.set(0.2, -0.4, -0.1);
  slabHeritage.rotation.set(-0.1, -0.3, 0.2);

  const slabs = [slabBlack, slabWhite, slabGold, slabHeritage];
  slabs.forEach(slab => scene.add(slab));

  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Mouse parallax effect
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    
    // Animate each slab independently
    slabs.forEach((slab, index) => {
      // Gentle floating
      const floatOffset = index * Math.PI * 0.6; // Stagger the floating
      slab.position.y += Math.sin(elapsedTime * 0.8 + floatOffset) * 0.002;
      
      // Gentle rotation
      slab.rotation.y += 0.001 * (index % 2 === 0 ? 1 : -1);
      
      // Mouse interaction
      slab.rotation.y += 0.05 * (targetX - slab.rotation.y) - 0.0005;
      slab.rotation.x += 0.05 * (targetY - slab.rotation.x + 0.1);
    });

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}
