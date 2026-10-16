import React, { useEffect, useMemo, useRef, useState } from "react";

const GENRES = {
  Rock: [
    "Cantante",
    "Batería",
    "Guitarra",
    "Bajo",
    "Piano/teclado",
    "Coristas",
    "Otros"
  ],

  Pop: [
    "Cantante",
    "Batería",
    "Guitarra",
    "Bajo",
    "Piano/teclado",
    "Coristas",
    "Violín",
    "Violonchelo",
    "Flauta",
    "Saxofón",
    "Otros"
  ],

  "Salsa / Tropical": [
    "Cantante",
    "Batería",
    "Piano/teclado",
    "Bajo",
    "Trompeta",
    "Trombón",
    "Congas",
    "Coristas",
    "Saxofón",
    "Flauta",
    "Acordeón",
    "Clarinete",
    "Otros"
  ]
};


// Biblioteca completa: independiente de los instrumentos
// seleccionados en el wizard.
const LIBRARY_GROUPS = [
  {
    title: "Instrumentos y roles",
    items: [
      "Cantante",
      "Coristas",
      "Batería",
      "Guitarra",
      "Bajo",
      "Piano/teclado",
      "Violín",
      "Violonchelo",
      "Flauta",
      "Saxofón",
      "Clarinete",
      "Trompeta",
      "Trombón",
      "Acordeón",
      "Congas",
      "Otros"
    ]
  },
  {
    title: "Monitoreo y audio",
    items: [
      "Monitor",
      "Micrófono",
      "Amplificador",
      "DI Box",
      "Altavoz",
      "Subwoofer",
      "Consola de audio"
    ]
  },
  {
    title: "Apoyo en escenario",
    items: [
      "Atril",
      "Soporte de micrófono",
      "Soporte de instrumento",
      "Mesa",
      "Silla"
    ]
  }
];

const ALL_LIBRARY = LIBRARY_GROUPS.flatMap(
  (group) => group.items
);


const emoji = {
  // Instrumentos y roles
  Cantante: "🎤",
  Coristas: "🎤",
  Batería: "🥁",
  Guitarra: "🎸",
  Bajo: "🎸",
  "Piano/teclado": "🎹",
  Violín: "🎻",
  Violonchelo: "🎻",
  Flauta: "🎶",
  Saxofón: "🎷",
  Clarinete: "🎶",
  Trompeta: "🎺",
  Trombón: "🎺",
  Acordeón: "🪗",
  Congas: "🪘",
  Otros: "➕",

  // Monitoreo y audio
  Monitor: "🔊",
  Micrófono: "🎙️",
  Amplificador: "📦",
  "DI Box": "◈",
  Altavoz: "🔊",
  Subwoofer: "🔊",
  "Consola de audio": "🎚️",

  // Apoyo en escenario
  Atril: "📖",
  "Soporte de micrófono": "🎙️",
  "Soporte de instrumento": "🎸",
  Mesa: "▰",
  Silla: "🪑"
};


const IMAGE_PATHS = {
  // Instrumentos y roles
  "Bajo": "/Instrumentos/Bajo.png",
  "Batería": "/Instrumentos/Bateria.png",
  "Cantante": "/Instrumentos/Cantante.png",
  "Congas": "/Instrumentos/Congos.png",
  "Coristas": "/Instrumentos/Coristas.png",
  "Guitarra": "/Instrumentos/Guitarra.png",
  "Violonchelo": "/Instrumentos/Violonchelo.png",
  "Otros": "/Instrumentos/Otros.png",
  "Piano/teclado": "/Instrumentos/Piano.png",
  "Saxofón": "/Instrumentos/Saxofon.png",
  "Trombón": "/Instrumentos/Trombon.png",
  "Trompeta": "/Instrumentos/Trompeta.png",
  "Violín": "/Instrumentos/Violin.png",
  "Flauta": "/Instrumentos/Flauta.png",
  "Clarinete": "/Instrumentos/Clarinete.png",
  "Acordeón": "/Instrumentos/Acordeon.png",

  // Monitoreo y audio
  "Altavoz": "/Monitoreo/Altavoz.png",
  "Amplificador": "/Monitoreo/Amplificador.png",
  "DI Box": "/Monitoreo/Caja.png",
  "Consola de audio": "/Monitoreo/Consola.png",
  "Micrófono": "/Monitoreo/Microfono.png",
  "Monitor": "/Monitoreo/Monitor.png",
  "Subwoofer": "/Monitoreo/Subwoofer.png",

  // Apoyo en escenario
  "Atril": "/Apoyo/Atril.png",
  "Mesa": "/Apoyo/Mesa.png",
  "Silla": "/Apoyo/Silla.png",
  "Soporte de instrumento": "/Apoyo/Soporte_Instrumento.png",
  "Soporte de micrófono": "/Apoyo/Soporte_Mic.png"
};


function ItemImage({ type, className = "" }) {
  const src = IMAGE_PATHS[type];

  if (!src) return null;

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={className}
      draggable={false}
      onError={(event) => {
        console.warn(`No se pudo cargar la imagen de ${type}: ${src}`);
        event.currentTarget.style.visibility = "hidden";
      }}
    />
  );
}



const OBJECT_DIMENSIONS = {
  "Batería": [1.8, 0.6, 1.8],
  "Piano/teclado": [1.5, 0.9, 0.6],
  "Consola de audio": [1.2, 0.9, 0.7],
  "Mesa": [1.2, 0.75, 0.7],
  "Micrófono": [0.3, 1.0, 0.3],
  "Cantante": [0.6, 1.7, 0.6],
  "Corista": [0.6, 1.7, 0.6],
  "Coristas": [0.6, 1.7, 0.6],
  "Silla": [0.5, 0.9, 0.5],
  "Monitor": [0.6, 0.4, 0.5],
  "Altavoz": [0.6, 1.0, 0.6],
  "Subwoofer": [0.8, 0.6, 0.7],
  "Amplificador": [0.6, 0.6, 0.4],
  "Caja": [0.8, 0.6, 0.7],
  "Guitarra": [0.8, 0.9, 0.3],
  "Bajo": [0.8, 0.9, 0.3],
  "Violín": [0.5, 0.8, 0.25],
  "Violonchelo": [0.6, 1.1, 0.35],
  "Flauta": [0.7, 0.2, 0.2],
  "Saxofón": [0.5, 0.8, 0.3],
  "Clarinete": [0.3, 0.8, 0.3],
  "Trompeta": [0.5, 0.4, 0.3],
  "Trombón": [0.8, 0.5, 0.3],
  "Acordeón": [0.6, 0.6, 0.35],
  "Congas": [0.8, 0.9, 0.8],
  "Otros": [0.8, 0.8, 0.6],
  "DI Box": [0.25, 0.15, 0.2],
  "Atril": [0.5, 1.0, 0.4],
  "Soporte de micrófono": [0.4, 1.0, 0.4],
  "Soporte de instrumento": [0.6, 0.9, 0.5]
};

function getObjectDimensions(type) {
  return OBJECT_DIMENSIONS[type] || [0.8, 0.8, 0.6];
}

function getFootprint(type, rotation = 0) {
  const [w, , d] = getObjectDimensions(type);
  const angle = ((rotation || 0) * Math.PI) / 180;

  // Huella aproximada del prisma cuando está girado.
  return {
    w: Math.abs(w * Math.cos(angle)) + Math.abs(d * Math.sin(angle)),
    d: Math.abs(d * Math.cos(angle)) + Math.abs(w * Math.sin(angle))
  };
}

function isPositionValid(
  type,
  x,
  y,
  items,
  width,
  depth,
  ignoreId = null,
  rotation = 0
) {
  const candidate = getFootprint(type, rotation);

  // x e y están expresados como porcentajes de la tarima.
  const px = (x / 100 - 0.5) * width;
  const pz = (y / 100 - 0.5) * depth;

  // El objeto completo debe permanecer dentro de la tarima.
  const halfW = candidate.w / 2;
  const halfD = candidate.d / 2;

  if (
    px - halfW < -width / 2 ||
    px + halfW > width / 2 ||
    pz - halfD < -depth / 2 ||
    pz + halfD > depth / 2
  ) {
    return false;
  }

  // Comprobar que no se cruce con otro objeto.
  return !items.some((other) => {
    if (other.id === ignoreId) return false;

    const otherFootprint = getFootprint(other.type, other.rotation || 0);
    const ox = (other.x / 100 - 0.5) * width;
    const oz = (other.y / 100 - 0.5) * depth;

    const overlapX =
      Math.abs(px - ox) < (candidate.w + otherFootprint.w) / 2;

    const overlapZ =
      Math.abs(pz - oz) < (candidate.d + otherFootprint.d) / 2;

    return overlapX && overlapZ;
  });
}

function clampPositionToStage(type, x, y, width, depth, rotation = 0) {
  const footprint = getFootprint(type, rotation);

  const minX = (footprint.w / (2 * width)) * 100;
  const maxX = 100 - minX;
  const minY = (footprint.d / (2 * depth)) * 100;
  const maxY = 100 - minY;

  return {
    x: Math.max(minX, Math.min(maxX, x)),
    y: Math.max(minY, Math.min(maxY, y))
  };
}



const DEFAULT_POSITIONS = {
  // Instrumentos y roles
  Batería: [50, 25],
  Cantante: [50, 70],
  Coristas: [38, 70],
  Guitarra: [28, 58],
  Bajo: [72, 58],
  "Piano/teclado": [20, 42],
  Violín: [76, 42],
  Violonchelo: [80, 42],
  Flauta: [65, 42],
  Saxofón: [62, 45],
  Clarinete: [68, 42],
  Trompeta: [68, 45],
  Trombón: [78, 45],
  Acordeón: [30, 45],
  Congas: [35, 45],
  Otros: [50, 48],

  // Monitoreo y audio
  Monitor: [40, 82],
  Micrófono: [50, 62],
  Amplificador: [30, 70],
  "DI Box": [30, 76],
  Altavoz: [12, 50],
  Subwoofer: [88, 50],
  "Consola de audio": [92, 20],

  // Apoyo en escenario
  Atril: [44, 55],
  "Soporte de micrófono": [55, 60],
  "Soporte de instrumento": [75, 60],
  Mesa: [25, 30],
  Silla: [35, 55]
};



function nextId(prefix = "item") {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getPosition(type, index = 0) {
  const base = DEFAULT_POSITIONS[type] || [50, 48];
  const offsets = [[0, 0], [-6, 4], [6, 4], [-6, -4], [6, -4]];
  const offset = offsets[index % offsets.length];
  return [Math.max(5, Math.min(95, base[0] + offset[0])), Math.max(10, Math.min(90, base[1] + offset[1]))];
}

function makeItem(type, existing = []) {
  const sameType = existing.filter((item) => item.type === type).length;
  const [x, y] = getPosition(type, sameType);
  return {
    id: nextId(),
    type,
    name: sameType === 0 ? type : `${type} ${sameType + 1}`,
    x,
    y,
    rotation: 0
  };
}

function Stage3D({ items, selectedId, onSelect, onMove, onDropLibrary, width = 10, depth = 8 }) {
  const hostRef = useRef(null);
  const sceneRef = useRef(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const [loadError, setLoadError] = useState(false);
  const [ready, setReady] = useState(false);
  const onSelectRef = useRef(onSelect);
  const onMoveRef = useRef(onMove);
  onSelectRef.current = onSelect;
  onMoveRef.current = onMove;

  useEffect(() => {
    let renderer, animation, observer, disposed = false;
    let THREE, controls;
    let dragState = null;
    const host = hostRef.current;
    if (!host) return;
    setReady(false);
    (async () => {
      try {
        THREE = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
        const { OrbitControls } = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js');
        if (disposed) return;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#111827');
        scene.fog = new THREE.Fog('#111827', 22, 48);
        
        
      
const maxDimension = Math.max(width, depth);

const camera = new THREE.PerspectiveCamera(
  42,
  host.clientWidth / Math.max(host.clientHeight, 1),
  0.1,
  maxDimension * 10
);

camera.position.set(
  maxDimension * 1.15,
  maxDimension * 1.05,
  maxDimension * 1.15
);

camera.updateProjectionMatrix();

        
        
      
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false,  preserveDrawingBuffer: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(host.clientWidth, host.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        host.innerHTML = '';
        host.appendChild(renderer.domElement);
        controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0.3, 0); controls.enableDamping = true; controls.maxPolarAngle = Math.PI * 0.48;
        scene.add(new THREE.HemisphereLight(0xe7f3ff, 0x25223b, 2.1));
        const keyLight = new THREE.DirectionalLight(0xffffff, 2.4); keyLight.position.set(-width, 15, depth); keyLight.castShadow = true; scene.add(keyLight);
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), new THREE.MeshStandardMaterial({ color: '#3b3850', roughness: .82, metalness: .08 }));
        floor.rotation.x = -Math.PI / 2; floor.position.y = 0.14; floor.receiveShadow = true; floor.name = 'stage-floor'; scene.add(floor);
        const side = new THREE.Mesh(new THREE.BoxGeometry(width, .28, depth), new THREE.MeshStandardMaterial({ color: '#667085', roughness: .75 }));
        side.position.y = 0; side.receiveShadow = true; side.castShadow = true; scene.add(side);
        const grid = new THREE.GridHelper(Math.max(width, depth), Math.max(8, Math.round(Math.max(width, depth))), '#9b8afb', '#6d6688');
        grid.position.y = .151; grid.scale.set(width / Math.max(width, depth), 1, depth / Math.max(width, depth)); scene.add(grid);
        const front = new THREE.Mesh(new THREE.BoxGeometry(width * .35, .03, .08), new THREE.MeshStandardMaterial({ color: '#f5a65b', emissive: '#4c2810' }));
        front.position.set(0, .18, depth / 2 - .12); front.name = 'front-audience-edge'; scene.add(front);

        // Etiqueta que indica dónde se encuentra el público
const labelCanvas = document.createElement('canvas');
labelCanvas.width = 512;
labelCanvas.height = 128;

const ctx = labelCanvas.getContext('2d');

ctx.font = 'bold 64px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillStyle = '#f5a65b';
ctx.fillText('PÚBLICO', 256, 64);

const labelTexture = new THREE.CanvasTexture(labelCanvas);
labelTexture.colorSpace = THREE.SRGBColorSpace;

const labelMaterial = new THREE.MeshBasicMaterial({
  map: labelTexture,
  transparent: true,
  side: THREE.DoubleSide,
  depthWrite: false
});

const label = new THREE.Mesh(
  new THREE.PlaneGeometry(1.8, 0.45),
  labelMaterial
);

// Situar el texto cerca del borde frontal del escenario
label.rotation.x = -Math.PI / 2;
label.position.set(0, 0.19, depth / 2 - 0.65);

scene.add(label);



        const objectGroup = new THREE.Group(); scene.add(objectGroup); sceneRef.current = { THREE, scene, objectGroup };
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.14);
        const intersection = new THREE.Vector3();
        const getPointer = (ev) => {
          const rect = renderer.domElement.getBoundingClientRect();
          pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
          pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
          raycaster.setFromCamera(pointer, camera);
        };
        sceneRef.current.screenToStage = (clientX, clientY) => {
          const rect = renderer.domElement.getBoundingClientRect();
          pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
          pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
          raycaster.setFromCamera(pointer, camera);
          if (!raycaster.ray.intersectPlane(dragPlane, intersection)) return null;
          return {
            x: THREE.MathUtils.clamp((intersection.x / width + 0.5) * 100, 0, 100),
            y: THREE.MathUtils.clamp((intersection.z / depth + 0.5) * 100, 0, 100)
          };
        };
        const onPointerDown = (ev) => {
          getPointer(ev);
          const hits = raycaster.intersectObjects(objectGroup.children, true);
          const hit = hits.find(h => {
            let node = h.object;
            while (node) { if (node.userData?.itemId) return true; node = node.parent; }
            return false;
          });
          if (!hit) return;
          let node = hit.object;
          while (node && !node.userData?.itemId) node = node.parent;
          if (!node) return;
          const itemId = node.userData.itemId;
          const group = objectGroup.children.find(child => child.userData.itemId === itemId) || node;
          onSelectRef.current?.(itemId);
          if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
            dragState = {
              id: itemId,
              group,
              offsetX: group.position.x - intersection.x,
              offsetZ: group.position.z - intersection.z,
              moved: false
            };
            controls.enabled = false;
            renderer.domElement.setPointerCapture?.(ev.pointerId);
            renderer.domElement.style.cursor = 'grabbing';
            ev.preventDefault();
          }
        };
        const onPointerMove = (ev) => {
          if (!dragState) {
            getPointer(ev);
            const hits = raycaster.intersectObjects(objectGroup.children, true);
            renderer.domElement.style.cursor = hits.some(h => {
              let node = h.object;
              while (node) { if (node.userData?.itemId) return true; node = node.parent; }
              return false;
            }) ? 'grab' : 'default';
            return;
          }
          getPointer(ev);
          if (!raycaster.ray.intersectPlane(dragPlane, intersection)) return;
          const halfW = width / 2;
          const halfD = depth / 2;
          
const draggedItem = itemsRef.current?.find(
  (item) => item.id === dragState.id
);

if (!draggedItem) return;

const percentX =
  ((intersection.x + dragState.offsetX) / width + 0.5) * 100;

const percentY =
  ((intersection.z + dragState.offsetZ) / depth + 0.5) * 100;

const bounded = clampPositionToStage(
  draggedItem.type,
  percentX,
  percentY,
  width,
  depth,
  draggedItem.rotation
);

const valid = isPositionValid(
  draggedItem.type,
  bounded.x,
  bounded.y,
  itemsRef.current,
  width,
  depth,
  draggedItem.id,
  draggedItem.rotation
);

if (!valid) return;

const x = (bounded.x / 100 - 0.5) * width;
const z = (bounded.y / 100 - 0.5) * depth;

dragState.group.position.set(x, 0.14, z);
dragState.moved = true;

        };
        const onPointerUp = (ev) => {
          if (!dragState) return;
          const finished = dragState;
          dragState = null;
          controls.enabled = true;
          renderer.domElement.style.cursor = 'grab';
          renderer.domElement.releasePointerCapture?.(ev.pointerId);
          if (finished.moved) {
            const x = THREE.MathUtils.clamp((finished.group.position.x / width + 0.5) * 100, 0, 100);
            const y = THREE.MathUtils.clamp((finished.group.position.z / depth + 0.5) * 100, 0, 100);
            onMoveRef.current?.(finished.id, x, y);
          }
        };
        renderer.domElement.addEventListener('pointerdown', onPointerDown);
        renderer.domElement.addEventListener('pointermove', onPointerMove);
        renderer.domElement.addEventListener('pointerup', onPointerUp);
        renderer.domElement.addEventListener('pointercancel', onPointerUp);
        observer = new ResizeObserver(() => {
          if (!host.clientWidth || !host.clientHeight) return;
          camera.aspect = host.clientWidth / host.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(host.clientWidth, host.clientHeight);
        }); observer.observe(host);
        const render = () => { if (disposed) return; controls.update(); renderer.render(scene, camera); animation = requestAnimationFrame(render); };
        render();
        sceneRef.current.cleanup = () => {
          renderer.domElement.removeEventListener('pointerdown', onPointerDown);
          renderer.domElement.removeEventListener('pointermove', onPointerMove);
          renderer.domElement.removeEventListener('pointerup', onPointerUp);
          renderer.domElement.removeEventListener('pointercancel', onPointerUp);
        };
        setReady(true);
      } catch (err) { console.error('No se pudo cargar la vista 3D', err); setLoadError(true); }
    })();
    return () => { disposed = true; cancelAnimationFrame(animation); observer?.disconnect(); sceneRef.current?.cleanup?.(); controls?.dispose(); renderer?.dispose(); if (host) host.innerHTML = ''; sceneRef.current = null; };
  }, [width, depth]);

  useEffect(() => {
    const ctx = sceneRef.current;
    if (!ctx) return;
    const { THREE, objectGroup } = ctx;
    while (objectGroup.children.length) {
      const child = objectGroup.children[0];
      child.traverse?.(o => { o.geometry?.dispose?.(); if (o.material) { if (Array.isArray(o.material)) o.material.forEach(m=>m.dispose()); else o.material.dispose(); } });
      objectGroup.remove(child);
    }
    const colors = { 'Instrumentos y roles': '#a78bfa', 'Monitoreo y audio': '#5eead4', 'Apoyo en escenario': '#f5a65b' };
    const category = (type) => LIBRARY_GROUPS.find(g => g.items.includes(type))?.title || 'Instrumentos y roles';
    
items.forEach((item) => {
  const group = new THREE.Group();
  group.userData.itemId = item.id;

  const color = colors[category(item.type)] || "#a78bfa";
  const size = getObjectDimensions(item.type);
  const geometry = new THREE.BoxGeometry(
    size[0],
    size[1],
    size[2]
  );

  const baseMaterial = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.5,
    metalness: 0.08,
    emissive: selectedId === item.id ? "#4338ca" : "#000000",
    emissiveIntensity: selectedId === item.id ? 0.45 : 0
  });

  // BoxGeometry: el índice 2 corresponde a la cara superior (+Y).
  const materials = [
    baseMaterial.clone(),
    baseMaterial.clone(),
    baseMaterial.clone(),
    baseMaterial.clone(),
    baseMaterial.clone(),
    baseMaterial.clone()
  ];

  const mesh = new THREE.Mesh(geometry, materials);
  mesh.position.y = size[1] / 2;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.itemId = item.id;
  group.add(mesh);

  // Posición horizontal del objeto en metros.
  group.position.set(
    (item.x / 100 - 0.5) * width,
    0.14,
    (item.y / 100 - 0.5) * depth
  );

  group.rotation.y = (item.rotation || 0) * Math.PI / 180;
  objectGroup.add(group);

  // Cargar la imagen y aplicarla solo a la cara superior.
  const imagePath = IMAGE_PATHS[item.type];

  if (imagePath) {
    const loader = new THREE.TextureLoader();

    loader.load(
      imagePath,
      (texture) => {
        // No actualizar una escena que ya fue desmontada.
        if (!sceneRef.current || !sceneRef.current.scene) {
          texture.dispose();
          return;
        }

        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;

        // Mantener la proporción de la imagen en la superficie.
        texture.center.set(0.5, 0.5);

        const topMaterial = materials[2];
        topMaterial.map = texture;
        topMaterial.color.set("#ffffff");
        topMaterial.needsUpdate = true;
      },
      undefined,
      (error) => {
        console.warn(
          `No se pudo cargar la imagen de ${item.type}: ${imagePath}`,
          error
        );
      }
    );
  }
});

  }, [items, selectedId, width, depth, ready]);

  function handleDrop(e) {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    if (!type || !onDropLibrary) return;
    // Convierte el punto real del cursor a coordenadas del plano 3D, no a
    // porcentajes de pantalla, para que el objeto aparezca donde se suelta.
    const stagePosition = sceneRef.current?.screenToStage?.(e.clientX, e.clientY);
    if (stagePosition) {
      onDropLibrary(type, stagePosition.x, stagePosition.y);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    onDropLibrary(type, Math.max(5, Math.min(95, (e.clientX - rect.left) / rect.width * 100)), Math.max(10, Math.min(90, (e.clientY - rect.top) / rect.height * 100)));
  }
  return <div className="stage3d-wrap" onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
    <div className="stage3d-canvas" ref={hostRef} aria-label="Escenario tridimensional interactivo" />
    {loadError && <div className="stage3d-error">No se pudo cargar el motor 3D. Comprueba tu conexión a internet y vuelve a cargar la página.</div>}
    {items.length === 0 && <div className="stage3d-empty">Añade instrumentos desde la biblioteca para comenzar.</div>}
    <div className="stage3d-caption"><span>{width} × {depth} m · LÍNEA AMARILLA: FRENTE</span>
   </div>
  </div>;
}

function Wizard({ onGenerate }) {
  const [step, setStep] = useState(1);
  const [width, setWidth] = useState("10");
  const [depth, setDepth] = useState("8");
  const [members, setMembers] = useState(5);
  const [genre, setGenre] = useState("Rock");
  const [selected, setSelected] = useState([]);

  const instruments = GENRES[genre];
  const instrumentsReady = selected.length === members;

  function changeMembers(value) {
    const count = Number(value);
    setMembers(count);
    setSelected((current) => current.slice(0, count));
  }

  function changeGenre(value) {
    setGenre(value);
    setSelected([]);
  }

  function toggleInstrument(type) {
    setSelected((current) => {
      if (current.includes(type)) return current.filter((x) => x !== type);
      if (current.length >= members) return current;
      return [...current, type];
    });
  }

  function generate() {
    if (!instrumentsReady) return;
    const created = selected.map((type, index) => {
      const [x, y] = getPosition(type, index);
      return { id: nextId("generated"), type, name: type, x, y, rotation: 0 };
    });
    onGenerate({ width: Number(width), depth: Number(depth), members, genre, items: created });
  }

  return (
    <section className="single-flow">
      <header className="flow-header">
        <div>
          <strong>1. Configuración guiada</strong>
          <span>Configura el espacio y la agrupación para generar una distribución inicial.</span>
        </div>
        <span className="tag">CONFIGURACIÓN</span>
      </header>

      <div className="flow-steps">
        {["Espacio", "Agrupación", "Instrumentos", "Generar"].map((label, index) => (
          <div key={label} className={step === index + 1 ? "active" : step > index + 1 ? "done" : ""}>
            <b>{index + 1}</b> {label}
          </div>
        ))}
      </div>

      <div className="wizard-card">
        {step === 1 && (
          <>
            <span className="eyebrow">PREGUNTA 1 DE 4</span>
            <h2>¿Qué dimensiones tiene el espacio?</h2>
            <p>Indica el ancho y el fondo disponibles para la presentación.</p>
            <div className="form-grid">
              <label>Ancho (m)<input type="number" min="1" value={width} onChange={(e) => setWidth(e.target.value)} /></label>
              <label>Fondo (m)<input type="number" min="1" value={depth} onChange={(e) => setDepth(e.target.value)} /></label>
            </div>
            <div className="mini-space"><span>{width} m</span><i></i><span>{depth} m</span></div>
            <div className="nav"><span></span><button className="primary" onClick={() => setStep(2)}>Continuar</button></div>
          </>
        )}

        {step === 2 && (
          <>
            <span className="eyebrow">PREGUNTA 2 DE 4</span>
            <h2>¿Cómo está conformada la agrupación?</h2>
            <p>Define cuántos integrantes participarán y el género musical.</p>
            <label>Número de integrantes (1–10)
              <input type="range" min="1" max="10" value={members} onChange={(e) => changeMembers(e.target.value)} />
              <strong className="range-value">{members} integrantes</strong>
            </label>
            <label>Género musical
              <select value={genre} onChange={(e) => changeGenre(e.target.value)}>
                {Object.keys(GENRES).map((g) => <option key={g}>{g}</option>)}
              </select>
            </label>
            <div className="nav"><button onClick={() => setStep(1)}>Atrás</button><button className="primary" onClick={() => setStep(3)}>Continuar</button></div>
          </>
        )}

        {step === 3 && (
          <>
            <span className="eyebrow">PREGUNTA 3 DE 4</span>
            <h2>¿Qué instrumentos o roles participan?</h2>
            <p>Selecciona un elemento por integrante. La selección inicial sirve para generar la primera distribución; los elementos adicionales podrán agregarse después desde la biblioteca completa.</p>
            <div className={`selection-count ${instrumentsReady ? "ready" : "warning"}`}>
              Seleccionados: <b>{selected.length}</b> de <b>{members}</b> integrantes
            </div>
            <div className="check-grid">
              {instruments.map((type) => (
                <label className="check" key={type}>
                  <input 
                  type="checkbox" 
                  checked={selected.includes(type)} 
                  onChange={() => toggleInstrument(type)} 
                  />
                <ItemImage
                 type={type}
                 className="instrument-option-image"
                />
                <span>{type}</span>
                </label>
                 ))}
                 </div>
            <div className="wizard-tip"><b>¿Olvidaste algún elemento?</b> No tienes que reiniciar: podrás añadir instrumentos, micrófonos, monitores, amplificadores y otros elementos desde la biblioteca completa en la siguiente etapa.</div>
            <div className="nav"><button onClick={() => setStep(2)}>Atrás</button><button className="primary" disabled={!instrumentsReady} onClick={() => setStep(4)}>Continuar</button></div>
          </>
        )}

        {step === 4 && (
          <div className="generate-view">
            <span className="eyebrow">PREGUNTA 4 DE 4</span>
            <h2>¿Listo para generar la distribución inicial?</h2>
            <p className="summary-line"><b>{width} × {depth} m</b> · {members} integrantes · {genre}</p>
            
            
            <div className="generate-preview">
             {selected.map((type) => (
             <span key={type} className="generate-preview-item">
               <ItemImage
                 type={type}
                 className="summary-instrument-image"
             />
             {type}
             </span>
             ))}
             </div>
            <button className="generate" onClick={generate}>Generar Stage Plot</button>
            <small>Al terminar, podrás ajustar la distribución en el editor 3D.</small>
            <button className="link-button" onClick={() => setStep(3)}>Editar selección inicial</button>
          </div>
        )}
      </div>
    </section>
  );
}


function Library({ onAdd }) {
  const [query, setQuery] = useState("");

  const [openGroups, setOpenGroups] = useState({
    "Instrumentos y roles": true,
    "Monitoreo y audio": false,
    "Apoyo en escenario": false
  });

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();

    return LIBRARY_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        !q || item.toLowerCase().includes(q)
      )
    })).filter((group) => group.items.length > 0);
  }, [query]);

  function toggleGroup(title) {
    setOpenGroups((previous) => ({
      ...previous,
      [title]: !previous[title]
    }));
  }

  return (
    <aside className="library">
      <div className="library-title-row">
        <div>
          <h3>Biblioteca completa</h3>
          <p>Agrega un elemento si lo olvidaste en la configuración.</p>
        </div>

        <span className="library-count">
          {ALL_LIBRARY.length}
        </span>
      </div>

      <input
        className="library-search"
        placeholder="Buscar elemento..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {filteredGroups.map((group) => {
        // Cuando se busca, se muestran abiertas las categorías
        // que contienen coincidencias.
        const isOpen = query.trim()
          ? true
          : Boolean(openGroups[group.title]);

        return (
          <div className="library-group" key={group.title}>
            <button
              type="button"
              className="library-group-toggle"
              aria-expanded={isOpen}
              onClick={() => toggleGroup(group.title)}
            >
              <span>{group.title}</span>
              <span className="library-group-icon">
                {isOpen ? "−" : "+"}
              </span>
            </button>

            {isOpen && (
              <div className="library-group-items">
                {group.items.map((type) => (
                  <button
                    type="button"
                    className="library-item"
                    draggable
                    key={type}
                    onDragStart={(e) => {
                      e.dataTransfer.setData("type", type);
                      e.dataTransfer.effectAllowed = "copy";
                    }}
                    onClick={() => onAdd(type)}
                    title="Clic para agregar o arrastra al escenario"
                  >
                    <ItemImage
                      type={type}
                      className="library-item-image"
                    />

                    <span>{type}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {filteredGroups.length === 0 && (
        <p className="muted">No se encontraron elementos.</p>
      )}
    </aside>
  );
}

function buildExportData(project, items) {
  return {
    schemaVersion: 2,
    units: "m",
    project: {
      width: Number(project.width),
      depth: Number(project.depth),
      members: Number(project.members),
      genre: project.genre
    },
    items: items.map((item) => {
      const [width, height, depth] = getObjectDimensions(item.type);

      return {
        id: item.id,
        name: item.name || item.type,
        type: item.type,

        // Posición en metros, respecto al centro de la tarima.
        position: {
          x: Number(
            (((Number(item.x) / 100) - 0.5) * Number(project.width)).toFixed(3)
          ),
          z: Number(
            (((Number(item.y) / 100) - 0.5) * Number(project.depth)).toFixed(3)
          ),
          y: 0
        },

        // Dimensiones físicas del elemento en metros.
        dimensions: {
          width,
          depth,
          height
        },

        rotation: Number(item.rotation || 0),

        // Conservamos los porcentajes originales para no perder
        // la información necesaria para reconstruir el proyecto.
        positionPercent: {
          x: Number(item.x),
          z: Number(item.y)
        }
      };
    })
  };
}


function downloadText(filename, text, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

async function exportProjectHTML(project, items) {

const embeddedImagePaths = {};

await Promise.all(
  Object.entries(IMAGE_PATHS).map(async ([type, path]) => {
    try {
      const response = await fetch(path);

      if (!response.ok) {
        throw new Error("No se pudo encontrar " + path);
      }

      const blob = await response.blob();

      embeddedImagePaths[type] = await new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);

        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error al incrustar la imagen:", type, error);
    }
  })
);

  const payload = JSON.stringify({
  ...buildExportData(project, items),
   width: Number(project.width),
  depth: Number(project.depth),
  genre: project.genre,
  members: project.members,
  imagePaths: embeddedImagePaths,
  }).replace(/</g, '\\u003c');

  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Stage Plot 3D 2.0</title>
  <script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"}}</script><style>*{box-sizing:border-box}body{margin:0;font:15px Inter,Arial,sans-serif;background:#f5f6fa;color:#172033}.top{padding:22px 26px;background:white;border-bottom:1px solid #dce1eb;display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap}h1{font-size:24px;margin:0}p{color:#647087;margin:6px 0 0}.meta{display:flex;gap:10px;flex-wrap:wrap;padding:16px 24px}.meta span{background:#fff;border:1px solid #e0e4ed;border-radius:10px;padding:10px 14px}.scene{height:min(68vh,680px);min-height:390px;margin:0 24px;background:#111827;border-radius:16px;overflow:hidden;position:relative}.scene canvas{display:block;width:100%;height:100%}.hint{margin:10px 25px;color:#5c667b;font-size:13px}.inventory{margin:20px 24px 35px;background:#fff;border:1px solid #e0e4ed;border-radius:12px;padding:18px;overflow:auto}table{border-collapse:collapse;width:100%;margin-top:10px}th,td{border-bottom:1px solid #e7eaf0;text-align:left;padding:10px;font-size:13px}th{color:#47536b;background:#f8f9fc}button{border:0;border-radius:8px;padding:10px 13px;background:#3546a8;color:white;cursor:pointer}
  
@media(max-width:600px){
  .top{padding:18px}
  .scene{margin:0 12px;min-height:360px}
  .meta{padding:12px}
  .inventory{margin:16px 12px}
  .top h1{font-size:20px}
}

@media print {
  @page {
    size: A4 landscape;
    margin: 10mm;
  }

  body {
    background: #fff !important;
    margin: 0 !important;
    font-size: 10px;
  }

  .top {
    padding: 0 0 8px !important;
  }

  h1 {
    font-size: 18px !important;
  }

  .meta {
    padding: 8px 0 !important;
    gap: 5px;
  }

  .meta span {
    padding: 5px 8px !important;
  }

  .scene {
  width: 100% !important;
  height: 85mm !important;
  min-height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
  position: relative !important;
  break-inside: avoid;
  page-break-inside: avoid;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}
.scene canvas {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
}

  .hint {
    margin: 5px 0 !important;
    font-size: 9px;
  }

  .inventory {
    margin: 8px 0 0 !important;
    padding: 10px !important;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .inventory h2 {
    font-size: 14px;
    margin-top: 0;
  }

  th, td {
    padding: 5px !important;
    font-size: 9px !important;
  }

  button {
    display: none !important;
  }
}

  </style>
  </head>
  <body>
  <header class="top"><div><h1>Stage Plot 3D 2.0</h1><p>Vista tridimensional compartida · gira la cámara con el ratón o con el dedo</p></div><button onclick="window.print()">Guardar como PDF</button></header>
  <div class="meta"><span><b>Dimensiones:</b> <span id="dims"></span></span><span><b>Género:</b> <span id="genre"></span></span><span><b>Integrantes:</b> <span id="members"></span></span><span><b>Elementos:</b> <span id="count"></span></span></div>
  <div id="scene" class="scene"></div><p class="hint">Arrastra para girar la vista; usa la rueda o el gesto de pinza para acercar y alejar. Este archivo necesita conexión a internet para cargar el motor gráfico Three.js.</p>
  
  <section class="inventory">
  <h2>Inventario técnico del escenario</h2>
  <table>
    <thead>
      <tr>
        <th>Elemento</th>
        <th>Tipo</th>
        <th>Posición X (m)</th>
        <th>Posición Z (m)</th>
        <th>Ancho (m)</th>
        <th>Fondo (m)</th>
        <th>Alto (m)</th>
        <th>Rotación</th>
      </tr>
    </thead>
    <tbody id="rows"></tbody>
  </table>
  <p>
    Coordenadas relativas al centro del escenario.
    Verifica las medidas antes del montaje real.
  </p>
</section>
  
  <script type="module">
  import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
  import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';
  const data = ${payload};
  document.querySelector('#dims').textContent = data.width+' × '+data.depth+' m'; document.querySelector('#genre').textContent=data.genre||'—'; document.querySelector('#members').textContent=data.members||'—'; document.querySelector('#count').textContent=data.items.length;
  
  
document.querySelector('#rows').innerHTML = data.items.map(i =>
  '<tr>' +
    '<td>' + esc(i.name || i.type) + '</td>' +
    '<td>' + esc(i.type) + '</td>' +
    '<td>' + i.position.x.toFixed(2) + '</td>' +
    '<td>' + i.position.z.toFixed(2) + '</td>' +
    '<td>' + i.dimensions.width.toFixed(2) + '</td>' +
    '<td>' + i.dimensions.depth.toFixed(2) + '</td>' +
    '<td>' + i.dimensions.height.toFixed(2) + '</td>' +
    '<td>' + i.rotation + '°</td>' +
  '</tr>'
).join('');

  
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  
  const host=document.querySelector('#scene'), scene=new THREE.Scene();scene.background=new THREE.Color('#111827');scene.fog=new THREE.Fog('#111827',24,55);
  
  
  const maxDimension = Math.max(data.width, data.depth);
  const camera = new THREE.PerspectiveCamera(
  42,
  host.clientWidth / host.clientHeight,
  0.1,
  maxDimension * 20
);

camera.position.set(
  maxDimension * 0.9,
  maxDimension * 0.9,
  maxDimension * 1.1
);

camera.updateProjectionMatrix();

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.setSize(host.clientWidth, host.clientHeight);
renderer.shadowMap.enabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;
host.appendChild(renderer.domElement);





  const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.2,0);controls.enableDamping=true;controls.maxPolarAngle=Math.PI*.48;
  scene.add(new THREE.HemisphereLight(0xe7f3ff,0x25223b,2));const light=new THREE.DirectionalLight(0xffffff,2.4);light.position.set(-data.width,15,data.depth);light.castShadow=true;scene.add(light);
  const floor=new THREE.Mesh(new THREE.BoxGeometry(data.width,.28,data.depth),new THREE.MeshStandardMaterial({color:'#667085',roughness:.7}));floor.position.y=0;floor.receiveShadow=true;floor.castShadow=true;scene.add(floor);
  const top=new THREE.Mesh(new THREE.PlaneGeometry(data.width,data.depth),new THREE.MeshStandardMaterial({color:'#3b3850',roughness:.82}));top.rotation.x=-Math.PI/2;top.position.y=.145;top.receiveShadow=true;scene.add(top);
  const grid=new THREE.GridHelper(Math.max(data.width,data.depth),Math.max(8,Math.round(Math.max(data.width,data.depth))),'#9b8afb','#6d6688');grid.position.y=.16;grid.scale.set(data.width/Math.max(data.width,data.depth),1,data.depth/Math.max(data.width,data.depth));scene.add(grid);
  const edge=new THREE.Mesh(new THREE.BoxGeometry(data.width*.32,.04,.08),new THREE.MeshStandardMaterial({color:'#f5a65b',emissive:'#4c2810'}));edge.position.set(0,.19,data.depth/2+.07);scene.add(edge);
  // Etiqueta PÚBLICO junto a la línea amarilla
const publicCanvas = document.createElement('canvas');
publicCanvas.width = 512;
publicCanvas.height = 128;

const publicContext = publicCanvas.getContext('2d');

publicContext.font = 'bold 44px Arial';
publicContext.fillStyle = '#f5a65b';
publicContext.textAlign = 'center';
publicContext.textBaseline = 'middle';
publicContext.fillText('PÚBLICO', 256, 64);

const publicTexture = new THREE.CanvasTexture(publicCanvas);
publicTexture.colorSpace = THREE.SRGBColorSpace;

const publicLabel = new THREE.Mesh(
  new THREE.PlaneGeometry(
    Math.min(data.width * 0.25, 2.5),
    0.35
  ),
  new THREE.MeshBasicMaterial({
    map: publicTexture,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false
  })
);

// Colocarlo delante de la línea amarilla
publicLabel.rotation.x = -Math.PI / 2;
publicLabel.position.set(
  0,
  0.205,
  data.depth / 2 - 0.35
);

scene.add(publicLabel);

  const group=new THREE.Group();scene.add(group);const instrumentTypes=['Cantante','Corista','Coristas','Batería','Guitarra','Bajo','Piano/teclado','Trompeta','Trombón','Violín','Congas','Saxofón','DJ','Otros'];
  

const textureLoader = new THREE.TextureLoader();

for (const item of data.items) {
  const dimensions = item.dimensions;

  const geometry = new THREE.BoxGeometry(
    dimensions.width,
    dimensions.height,
    dimensions.depth
  );

  const isInstrument = instrumentTypes.includes(item.type);

  const color = isInstrument
    ? '#a78bfa'
    : (
        ['Monitor', 'Micrófono', 'Amplificador', 'DI Box',
         'Altavoz', 'Subwoofer', 'Consola de audio'].includes(item.type)
          ? '#5eead4'
          : '#f5a65b'
      );

  const baseMaterial = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.5,
    metalness: 0.08
  });

  const materials = Array.from(
    { length: 6 },
    () => baseMaterial.clone()
  );

  const mesh = new THREE.Mesh(geometry, materials);

  mesh.position.set(
    item.position.x,
    dimensions.height / 2 + 0.14,
    item.position.z
  );

  mesh.rotation.y = (item.rotation || 0) * Math.PI / 180;
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  group.add(mesh);

  const imagePath = data.imagePaths?.[item.type];

  if (imagePath) {
    textureLoader.load(
      imagePath,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;

        materials[2].map = texture;
        materials[2].color.set('#ffffff');
        materials[2].needsUpdate = true;
      },
      undefined,
      (error) => {
        console.warn(
          'No se pudo cargar la imagen de ' + item.type,
          error
        );
      }
    );
  }
}

  
function resize() {
  const w = host.clientWidth;
  const h = host.clientHeight;

  if (!w || !h) return;

  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}


window.addEventListener('resize', resize);

window.addEventListener('beforeprint', () => {
  const widthBeforePrint = host.clientWidth;
  const heightBeforePrint = host.clientHeight;

  if (widthBeforePrint > 0 && heightBeforePrint > 0) {
    camera.aspect = widthBeforePrint / heightBeforePrint;
    camera.updateProjectionMatrix();
    renderer.setSize(widthBeforePrint, heightBeforePrint);
  }

  controls.update();
  renderer.render(scene, camera);
});

window.addEventListener('afterprint', () => {
  resize();
  controls.update();
  renderer.render(scene, camera);
});


function loop() {
  requestAnimationFrame(loop);
  controls.update();
  renderer.render(scene, camera);
}

loop();


  </script></body></html>`;
  downloadText('Stage-Plot-3D-2.0-compartible.html', html, 'text/html;charset=utf-8');
}

function FullEditor({ project, setProject, onBackToWizard }) {
  const [items, setItems] = useState(project.items);
  const [selectedId, setSelectedId] = useState(null);

  
  function openProjectFile(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (
          !data.project ||
          !Array.isArray(data.items) ||
          !Number.isFinite(Number(data.project.width)) ||
          !Number.isFinite(Number(data.project.depth))
        ) {
          throw new Error("El archivo no tiene un formato de proyecto válido.");
        }

        const restoredItems = data.items.map((item) => {
          const position = item.positionPercent;

          if (!position) {
            throw new Error(
              "El archivo no contiene las posiciones necesarias para editar el proyecto."
            );
          }

          return {
            id: item.id || nextId(),
            name: item.name || item.type,
            type: item.type,
            x: Number(position.x),
            y: Number(position.z),
            rotation: Number(item.rotation || 0)
          };
        });

        const restoredProject = {
          width: Number(data.project.width),
          depth: Number(data.project.depth),
          members: Number(data.project.members || 0),
          genre: data.project.genre || "Rock",
          items: restoredItems
        };

        setProject(restoredProject);
        setItems(restoredItems);
        setSelectedId(null);

        alert("Proyecto abierto correctamente.");
      } catch (error) {
        console.error("Error al abrir el proyecto:", error);
        alert(
          "No se pudo abrir el archivo. Selecciona un JSON exportado por Stage Plot 3D."
        );
      } finally {
        event.target.value = "";
      }
    };

    reader.onerror = () => {
      alert("No se pudo leer el archivo seleccionado.");
      event.target.value = "";
    };

    reader.readAsText(file);
  }


  

  const selected = items.find((item) => item.id === selectedId);

  function updateItems(next) {
    setItems(next);
    setProject((current) => ({ ...current, items: next }));
  }

  function add(type, x = null, y = null) {
    const item = makeItem(type, items);
    if (x !== null && y !== null) {
  const position = clampPositionToStage(
    type,
    x,
    y,
    project.width,
    project.depth,
    item.rotation
  );

  item.x = position.x;
  item.y = position.y;

  if (
    !isPositionValid(
      type,
      item.x,
      item.y,
      items,
      project.width,
      project.depth,
      null,
      item.rotation
    )
  ) {
    const candidates = [];

    for (let py = 10; py <= 90; py += 10) {
      for (let px = 10; px <= 90; px += 10) {
        candidates.push(
          clampPositionToStage(
            type,
            px,
            py,
            project.width,
            project.depth,
            item.rotation
          )
        );
      }
    }

    const available = candidates.find((candidate) =>
      isPositionValid(
        type,
        candidate.x,
        candidate.y,
        items,
        project.width,
        project.depth,
        null,
        item.rotation
      )
    );

    if (!available) {
      window.alert(
        "No hay espacio libre suficiente para agregar este elemento. " +
        "Mueve otro objeto o amplía la tarima."
      );
      return;
    }

    item.x = available.x;
    item.y = available.y;
  }
} else {
      // Al añadir con clic, conserva la posición habitual si está libre; si no,
      // busca una ubicación cercana para evitar que los objetos nazcan superpuestos.
      const overlaps = (px, py) => items.some(existing => {
        const dx = ((px - existing.x) / 100) * project.width;
        const dz = ((py - existing.y) / 100) * project.depth;
        return Math.hypot(dx, dz) < 0.95;
      });
      if (overlaps(item.x, item.y)) {
        const candidates = [];
        for (const py of [15, 30, 45, 60, 75, 88]) {
          for (const px of [12, 27, 42, 57, 72, 87]) candidates.push([px, py]);
        }
        const available = candidates.find(([px, py]) => !overlaps(px, py));
        if (available) [item.x, item.y] = available;
      }
    }
    updateItems([...items, item]);
    setSelectedId(item.id);
  }

  
function move(id, x, y) {
  const item = items.find((current) => current.id === id);
  if (!item) return;

  const position = clampPositionToStage(
    item.type,
    x,
    y,
    project.width,
    project.depth,
    item.rotation
  );

  const valid = isPositionValid(
    item.type,
    position.x,
    position.y,
    items,
    project.width,
    project.depth,
    id,
    item.rotation
  );

  // Si el movimiento produce una colisión, no actualizar la posición.
  if (!valid) return;

  updateItems(
    items.map((current) =>
      current.id === id
        ? { ...current, x: position.x, y: position.y }
        : current
    )
  );

  setSelectedId(id);
}


  function rotate(delta) {
    if (!selected) return;
    updateItems(items.map((item) => item.id === selected.id ? { ...item, rotation: item.rotation + delta } : item));
  }

  function remove() {
    if (!selected) return;
    updateItems(items.filter((item) => item.id !== selected.id));
    setSelectedId(null);
  }

  return (
    <section className="editor-section">
      <header className="flow-header editor-header">
        <div>
          <strong>2. Editor de escenario</strong>
          <span>La distribución inicial está lista para ajustar, completar y compartir.</span>
        </div>
        <div className="editor-badges">
          <span className="tag">EDITOR 3D</span>
          <button
             className="secondary"
             onClick={() => {
             const confirmed = window.confirm(
              "¿Iniciar una nueva configuración?\n\n" +
              "Vas a regresar al asistente. " +
              "Si continúas, podrías perder los cambios " +
              "realizados en el Stage Plot actual."
              );
              if (confirmed) {
             onBackToWizard();
             }
             }}
            >

            Nueva configuración
            </button>
            </div>
      </header>

      <div className="editor-toolbar">
        
  <button
    type="button"
    onClick={() =>
      downloadText(
        "Stage-Plot-3D-2.0-proyecto.json",
        JSON.stringify(buildExportData(project, items), null, 2),
        "application/json;charset=utf-8"
      )
    }
  >
    Guardar proyecto
  </button>

  <button
    type="button"
    onClick={() =>
      document.getElementById("open-project-file").click()
    }
  >
    Abrir proyecto
  </button>

  <input
    id="open-project-file"
    type="file"
    accept=".json,application/json"
    onChange={openProjectFile}
    style={{ display: "none" }}
  />

        
       
<button
  type="button"
  onClick={() => {
    const canvas = document.querySelector(
  ".stage3d-canvas canvas"
);

if (!canvas) {
  alert("El escenario 3D todavía no está listo.");
  return;
}

let imageData;

try {
  const renderer = canvas.__threeRenderer;

  if (renderer) {
    renderer.render(
      renderer.__stageScene,
      renderer.__stageCamera
    );
  }

  imageData = canvas.toDataURL("image/png");

  if (imageData === "data:,") {
    throw new Error("La captura está vacía.");
  }
} catch (error) {
  console.error("Error al capturar el escenario:", error);
  alert("No se pudo capturar el escenario 3D.");
  return;
}

    const rows = items.map((item) => {
      const [width, height, depth] =
        getObjectDimensions(item.type);

      const x = (
        (Number(item.x) / 100 - 0.5) *
        Number(project.width)
      ).toFixed(2);

      const z = (
        (Number(item.y) / 100 - 0.5) *
        Number(project.depth)
      ).toFixed(2);

      return `
        <tr>
          <td>${item.name || item.type}</td>
          <td>${item.type}</td>
          <td>${x}</td>
          <td>${z}</td>
          <td>${width.toFixed(2)}</td>
          <td>${depth.toFixed(2)}</td>
          <td>${height.toFixed(2)}</td>
          <td>${Number(item.rotation || 0)}°</td>
        </tr>
      `;
    }).join("");

    const printFrame = document.createElement("iframe");

printFrame.style.position = "fixed";
printFrame.style.right = "0";
printFrame.style.bottom = "0";
printFrame.style.width = "0";
printFrame.style.height = "0";
printFrame.style.border = "0";

document.body.appendChild(printFrame);

const printWindow = printFrame.contentWindow;

printWindow.addEventListener("afterprint", () => {
  printFrame.remove();
});

    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Stage Plot 3D</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 10mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            color: #172033;
          }

          h1 {
            margin: 0 0 4px;
            font-size: 22px;
          }

          .info {
            margin-bottom: 12px;
            font-size: 11px;
            color: #475569;
          }

          .scene {
            width: 100%;
            height: 115mm;
            overflow: hidden;
            background: #111827;
            border-radius: 8px;
            margin-bottom: 12px;
          }

          .scene img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: contain;
          }

          h2 {
            font-size: 14px;
            margin: 0 0 6px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9px;
          }

          th, td {
            border: 1px solid #cbd5e1;
            padding: 5px;
            text-align: left;
          }

          th {
            background: #eef2f7;
          }

          .note {
            margin-top: 8px;
            font-size: 9px;
          }

          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <h1>Stage Plot 3D</h1>

        <div class="info">
          Dimensiones: ${Number(project.width)} ×
          ${Number(project.depth)} m
          &nbsp; | &nbsp;
          Género: ${project.genre}
          &nbsp; | &nbsp;
          Integrantes: ${Number(project.members)}
          &nbsp; | &nbsp;
          Elementos: ${items.length}
        </div>

        <div class="scene">
          <img
            id="stageImage"
            src="${imageData}"
            alt="Vista 3D del escenario"
          >
        </div>

        <h2>Inventario técnico del escenario</h2>

        <table>
          <thead>
            <tr>
              <th>Elemento</th>
              <th>Tipo</th>
              <th>Posición X (m)</th>
              <th>Posición Z (m)</th>
              <th>Ancho (m)</th>
              <th>Fondo (m)</th>
              <th>Alto (m)</th>
              <th>Rotación</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        <p class="note">
          Coordenadas relativas al centro del escenario.
          Verifica las medidas antes del montaje real.
        </p>

        <script>
          window.onload = () => {
            const image = document.getElementById("stageImage");

            const printWhenReady = () => {
              window.focus();
              window.print();
            };

            if (image.complete && image.naturalWidth > 0) {
              printWhenReady();
            } else {
              image.onload = printWhenReady;
              image.onerror = () => alert(
                "No se pudo cargar la imagen del escenario."
              );
            }
          };
        <\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }}
>
  Guardar PDF
</button>

        <button className="primary" onClick={() => exportProjectHTML(project, items)}>Exportar 3D compartible</button>
      </div>

      <div className="editor-body">
        <Library onAdd={add} />

        <main className="viewport">
          <div className="viewport-title">
            <div><h2>Stage Plot 3D</h2><p>{items.length} elementos · {project.width} × {project.depth} m · {project.genre}</p></div>
            <span className="edit-hint-badge">Editor libre</span>
          </div>
          <div className="editor-notice">💡 <b>¿Olvidaste algo?</b> Añádelo desde la biblioteca completa de la izquierda. También puedes arrastrarlo directamente al escenario.</div>
          <div className="mouse-instructions">
             <span><b>Click izquierdo + arrastrar:</b> girar la vista 3D.</span>
             <span><b>Rueda del ratón:</b> acercar o alejar el escenario.</span>
             <span><b>Click derecho + arrastrar:</b> desplazar la vista horizontal o verticalmente.</span>
             <span><b>Seleccionar un objeto:</b> modificar su posición desde el panel derecho.</span>
          </div>
          <Stage3D items={items} selectedId={selectedId} onSelect={setSelectedId} onMove={move} onDropLibrary={add} width={project.width} depth={project.depth} />
          
        </main>

        <aside className="properties">
          <h3>Propiedades del proyecto</h3>
          <label>Ancho (m)<input type="number" min="1" value={project.width} onChange={(e) => setProject({ ...project, width: Number(e.target.value) })} /></label>
          <label>Fondo (m)<input type="number" min="1" value={project.depth} onChange={(e) => setProject({ ...project, depth: Number(e.target.value) })} /></label>
          <p><b>Elementos:</b> {items.length}</p>
          <hr />
          <h3>Elemento seleccionado</h3>
          {selected ? (
            <>
              
<div className="selected-card">
  <img
    className="selected-card-image"
    src={IMAGE_PATHS[selected.type]}
    alt={selected.name || selected.type}
    onError={(e) => {
      e.currentTarget.style.display = "none";
    }}
  />
  <div className="selected-card-info">
    <b>{selected.name}</b>
    <small>{selected.type}</small>
  </div>
</div>




              <label>Posición X (%)<input type="number" min="0" max="100" value={Math.round(selected.x)} onChange={(e) => move(selected.id, Math.max(0, Math.min(100, Number(e.target.value))), selected.y)} /></label>
              <label>Profundidad Z (%)<input type="number" min="0" max="100" value={Math.round(selected.y)} onChange={(e) => move(selected.id, selected.x, Math.max(0, Math.min(100, Number(e.target.value))))} /></label>
              <p>Rotación: <b>{selected.rotation}°</b></p>
              <div className="row"><button onClick={() => rotate(-15)}>↺ 15°</button><button onClick={() => rotate(15)}>↻ 15°</button></div>
              <button className="danger" onClick={remove}>Eliminar </button>
            </>
          ) : (
            <div className="property-empty"><span>↖</span><p>Selecciona un elemento del escenario para editar su posición y rotación.</p></div>
          )}
        </aside>
      </div>
    </section>
  );
}

export default function App() {
  const [stage, setStage] = useState("wizard");
  const [project, setProject] = useState({ width: 10, depth: 8, members: 0, genre: "Rock", items: [] });

  function generateProject(data) {
    setProject(data);
    setStage("editor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function backToWizard() {
    setStage("wizard");
  }

  return (
    <div className="app">
      <header className="top">
        <div><h1>Stage Plot 3D 2.0</h1><p>Diseña, visualiza y comparte el montaje</p></div>
      </header>

      <div className="progress-bar"><div className={stage === "editor" ? "full" : "half"}></div></div>

      {stage === "wizard" ? (
        <Wizard onGenerate={generateProject} />
      ) : (
        <FullEditor project={project} setProject={setProject} onBackToWizard={backToWizard} />
      )}

      <footer>Stage Plot 3D 2.3 · Prototipo interactivo. La vista tridimensional es una representación conceptual para planificar la distribución; tiene cuadricula por el tema de las dimensiones reales de los instrumentos.</footer>
    </div>
  );
}
