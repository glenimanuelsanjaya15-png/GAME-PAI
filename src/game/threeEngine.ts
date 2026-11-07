/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PENJAGA BUMI NUSANTARA — 3D Game Engine (Three.js r128+)
 * 60 FPS, TPP Camera Collision, Procedural Multi-part Models, Dual Controls
 */

import * as THREE from 'three';
import { sound } from '../audio/soundSystem';
import { AvatarId, GradeLevel } from '../types';

export interface InteractiveObjectInfo {
  id: string;
  name: string;
  promptText: string;
  category: string;
  distance: number;
}

export interface EngineCallbacks {
  onCollect: (item: { id: string; name: string; category: string; points: number; coins: number }) => void;
  onProximityChange: (info: InteractiveObjectInfo | null) => void;
  onLevelComplete: (level: number) => void;
  onClawTrigger?: () => void;
  onRadarTrigger?: (hotspotId: string) => void;
  onGateTrigger?: (gateIndex: number) => void;
  onDamage?: (amount: number, reason: string) => void;
}

export class Nusantara3DEngine {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private clock: THREE.Clock;
  private callbacks: EngineCallbacks;

  // Level & Profile
  public currentLevel = 1;
  public grade: GradeLevel = '5';
  public avatar: AvatarId = 'rayyan';

  // Game loop & state
  private isRunning = false;
  private animationFrameId = 0;
  private isSoftwareGl = false;

  // Player actor
  private playerGroup: THREE.Group;
  private playerMeshParts: {
    leftLeg?: THREE.Mesh;
    rightLeg?: THREE.Mesh;
    leftArm?: THREE.Mesh;
    rightArm?: THREE.Mesh;
    halo?: THREE.Mesh;
    backpack?: THREE.Mesh;
  } = {};
  private playerVelocity = new THREE.Vector3();
  private isGrounded = true;
  private moveSpeed = 8.5;
  private jumpForce = 8.0;
  private gravity = 22.0;
  private walkTime = 0;

  // Input states
  public keys = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    interact: false,
  };
  public virtualJoystick = { x: 0, y: 0, active: false };

  // TPP Camera
  private cameraYaw = 0;
  private cameraPitch = 0.35; // radians
  private cameraDistance = 7.5;
  private targetCameraDistance = 7.5;
  private isDraggingMouse = false;
  private lastMouseX = 0;
  private lastMouseY = 0;
  private raycaster = new THREE.Raycaster();

  // Environment & collisions
  private colliders: THREE.Box3[] = [];
  private interactiveObjects: {
    id: string;
    name: string;
    promptText: string;
    category: string;
    mesh: THREE.Object3D;
    radius: number;
    collected: boolean;
    onInteract?: () => void;
  }[] = [];
  private animatedElements: ((dt: number, time: number) => void)[] = [];
  private activeProximity: InteractiveObjectInfo | null = null;

  // Claw machine state (Level 3)
  public clawPosition = new THREE.Vector3(0, 4.5, 0);
  public clawGrabbed = false;
  private clawMesh: THREE.Group | null = null;
  private clawCable: THREE.Line | null = null;

  constructor(container: HTMLElement, callbacks: EngineCallbacks, initialLevel = 1, grade: GradeLevel = '5', avatar: AvatarId = 'rayyan') {
    this.container = container;
    this.callbacks = callbacks;
    this.currentLevel = initialLevel;
    this.grade = grade;
    this.avatar = avatar;

    // 1. Detect Software GL
    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Setup Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb); // Will adapt per level
    this.scene.fog = new THREE.FogExp2(0x87ceeb, 0.012);

    // 3. Setup Camera (TPP FOV 70)
    const aspect = container.clientWidth / (container.clientHeight || 1);
    this.camera = new THREE.PerspectiveCamera(70, aspect, 0.1, 500);

    // 4. Setup Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(this.renderer.domElement);

    // 5. Clock & Groups
    this.clock = new THREE.Clock();
    this.playerGroup = new THREE.Group();
    this.scene.add(this.playerGroup);

    // 6. Build Player & Load Initial Level
    this.buildPlayerCharacter();
    this.loadLevel(this.currentLevel);

    // 7. Bind Window & Pointer Events
    this.setupEventListeners();
  }

  // ==========================================
  // PLAYER PROCEDURAL 3D MODEL (COMPOSITE GROUP)
  // ==========================================
  private buildPlayerCharacter() {
    while (this.playerGroup.children.length > 0) {
      this.playerGroup.remove(this.playerGroup.children[0]);
    }

    const isGirl = this.avatar === 'aisyah';
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xdca884, roughness: 0.6 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.5 }); // Indonesian flag red / pramuka
    const navyMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 }); // Indonesian SD uniform skirt/trousers
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.4 }); // Khalifah green badge/vest
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.7 }); // Peci / Shoes

    // Torso (Shirt + Vest)
    const torsoGeo = new THREE.BoxGeometry(0.7, 0.85, 0.45);
    const torsoMesh = new THREE.Mesh(torsoGeo, whiteMat);
    torsoMesh.position.y = 1.25;
    torsoMesh.castShadow = true;
    this.playerGroup.add(torsoMesh);

    // Khalifah Green Vest / Pramuka neckerchief
    const vestGeo = new THREE.BoxGeometry(0.74, 0.65, 0.48);
    const vestMesh = new THREE.Mesh(vestGeo, greenMat);
    vestMesh.position.y = 1.32;
    vestMesh.castShadow = true;
    this.playerGroup.add(vestMesh);

    // Red-White Neckerchief (Kacu Pramuka / Merah Putih)
    const tieGeo = new THREE.ConeGeometry(0.18, 0.45, 4);
    const tieMesh = new THREE.Mesh(tieGeo, redMat);
    tieMesh.rotation.z = Math.PI;
    tieMesh.position.set(0, 1.35, 0.25);
    this.playerGroup.add(tieMesh);

    // Head
    const headGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.position.y = 1.95;
    headMesh.castShadow = true;
    this.playerGroup.add(headMesh);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.11, 1.98, 0.28);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.11, 1.98, 0.28);
    this.playerGroup.add(leftEye, rightEye);

    // Headwear: Songkok/Peci for Rayyan, Hijab for Aisyah
    if (isGirl) {
      // Hijab / Kerudung Cilik
      const hijabGeo = new THREE.SphereGeometry(0.38, 16, 16);
      const hijabMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.5 });
      const hijabMesh = new THREE.Mesh(hijabGeo, hijabMat);
      hijabMesh.position.set(0, 1.98, -0.05);
      hijabMesh.scale.set(1.05, 1.15, 1.05);
      this.playerGroup.add(hijabMesh);

      const veilGeo = new THREE.CylinderGeometry(0.38, 0.48, 0.5, 16);
      const veilMesh = new THREE.Mesh(veilGeo, hijabMat);
      veilMesh.position.set(0, 1.65, 0);
      this.playerGroup.add(veilMesh);
    } else {
      // Indonesian Songkok / Peci Hitam
      const peciGeo = new THREE.CylinderGeometry(0.33, 0.33, 0.25, 16);
      const peciMesh = new THREE.Mesh(peciGeo, blackMat);
      peciMesh.position.set(0, 2.22, 0);
      this.playerGroup.add(peciMesh);
    }

    // Arms
    const armGeo = new THREE.BoxGeometry(0.2, 0.7, 0.2);
    const leftArm = new THREE.Mesh(armGeo, skinMat);
    leftArm.position.set(-0.48, 1.25, 0);
    leftArm.castShadow = true;
    this.playerGroup.add(leftArm);
    this.playerMeshParts.leftArm = leftArm;

    const rightArm = new THREE.Mesh(armGeo, skinMat);
    rightArm.position.set(0.48, 1.25, 0);
    rightArm.castShadow = true;
    this.playerGroup.add(rightArm);
    this.playerMeshParts.rightArm = rightArm;

    // Legs
    const legGeo = new THREE.BoxGeometry(0.24, 0.8, 0.25);
    const leftLeg = new THREE.Mesh(legGeo, navyMat);
    leftLeg.position.set(-0.2, 0.45, 0);
    leftLeg.castShadow = true;
    this.playerGroup.add(leftLeg);
    this.playerMeshParts.leftLeg = leftLeg;

    const rightLeg = new THREE.Mesh(legGeo, navyMat);
    rightLeg.position.set(0.2, 0.45, 0);
    rightLeg.castShadow = true;
    this.playerGroup.add(rightLeg);
    this.playerMeshParts.rightLeg = rightLeg;

    // Shoes
    const shoeGeo = new THREE.BoxGeometry(0.25, 0.15, 0.35);
    const leftShoe = new THREE.Mesh(shoeGeo, blackMat);
    leftShoe.position.set(-0.2, 0.08, 0.05);
    leftShoe.castShadow = true;
    this.playerGroup.add(leftShoe);

    const rightShoe = new THREE.Mesh(shoeGeo, blackMat);
    rightShoe.position.set(0.2, 0.08, 0.05);
    rightShoe.castShadow = true;
    this.playerGroup.add(rightShoe);

    // "Tas Pemulihan" Backpack
    const backpackGeo = new THREE.BoxGeometry(0.5, 0.65, 0.3);
    const backpackMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
    const backpack = new THREE.Mesh(backpackGeo, backpackMat);
    backpack.position.set(0, 1.25, -0.32);
    backpack.castShadow = true;
    this.playerGroup.add(backpack);
    this.playerMeshParts.backpack = backpack;

    // Ground Contact Shadow Disc
    const shadowGeo = new THREE.CircleGeometry(0.65, 16);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.02;
    this.playerGroup.add(shadowMesh);

    // Interaction Aura Halo
    const haloGeo = new THREE.RingGeometry(0.9, 1.1, 32);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = 0.04;
    this.playerGroup.add(halo);
    this.playerMeshParts.halo = halo;

    this.playerGroup.position.set(0, 0, 0);
  }

  // ==========================================
  // LEVEL LOADING & PROCEDURAL 3D ENVIRONMENTS
  // ==========================================
  public loadLevel(levelNum: number) {
    this.currentLevel = levelNum;

    // Clear previous environment
    this.colliders = [];
    this.interactiveObjects = [];
    this.animatedElements = [];
    this.activeProximity = null;
    this.callbacks.onProximityChange(null);

    // Remove old environment objects (keep playerGroup)
    const objectsToRemove: THREE.Object3D[] = [];
    this.scene.children.forEach(child => {
      if (child !== this.playerGroup) {
        objectsToRemove.push(child);
      }
    });
    objectsToRemove.forEach(obj => this.scene.remove(obj));

    // Reset player position
    this.playerGroup.position.set(0, 0, 0);
    this.playerVelocity.set(0, 0, 0);
    this.cameraYaw = 0;
    this.cameraPitch = 0.35;

    // Setup Lighting per Level
    this.setupLighting(levelNum);

    // Generate Level Environment
    switch (levelNum) {
      case 1:
        this.buildLevel1_RumahkuAsri();
        break;
      case 2:
        this.buildLevel2_SekolahkuTanggungJawabku();
        break;
      case 3:
        this.buildLevel3_LaboratoriumKhalifah();
        break;
      case 4:
        this.buildLevel4_GuaKebijaksanaan();
        break;
      case 5:
        this.buildLevel5_PenjelajahCiptaanAllah();
        break;
      case 6:
        this.buildLevel6_RadarNusantara();
        break;
      default:
        this.buildLevel1_RumahkuAsri();
    }
  }

  private setupLighting(levelNum: number) {
    if (levelNum === 4) {
      // Cave: Dim mysterious ambient, glowing point lights
      this.scene.background = new THREE.Color(0x060d17);
      this.scene.fog = new THREE.FogExp2(0x060d17, 0.025);

      const hemiLight = new THREE.HemisphereLight(0x1e3a8a, 0x0f172a, 0.4);
      this.scene.add(hemiLight);

      const keyLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
      keyLight.position.set(10, 20, 10);
      this.scene.add(keyLight);
    } else if (levelNum === 6) {
      // Hologram Room: Cyber cyan & deep navy
      this.scene.background = new THREE.Color(0x020617);
      this.scene.fog = new THREE.FogExp2(0x020617, 0.015);

      const hemiLight = new THREE.HemisphereLight(0x0ea5e9, 0x020617, 0.6);
      this.scene.add(hemiLight);

      const centralLight = new THREE.PointLight(0x38bdf8, 2.5, 60);
      centralLight.position.set(0, 8, 0);
      this.scene.add(centralLight);
    } else {
      // Outdoor / Semi-outdoor (Levels 1, 2, 3, 5): Warm tropical daylight
      const skyColor = levelNum === 5 ? 0x6ee7b7 : 0x7dd3fc;
      const groundColor = 0x334155;
      this.scene.background = new THREE.Color(levelNum === 5 ? 0x064e3b : 0x38bdf8);
      this.scene.fog = new THREE.FogExp2(levelNum === 5 ? 0x064e3b : 0x7dd3fc, 0.008);

      const hemiLight = new THREE.HemisphereLight(skyColor, groundColor, 0.7);
      this.scene.add(hemiLight);

      const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.25);
      dirLight.position.set(25, 40, 20);
      dirLight.castShadow = !this.isSoftwareGl;
      if (!this.isSoftwareGl) {
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 120;
        const d = 35;
        dirLight.shadow.camera.left = -d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = -d;
        dirLight.shadow.bias = -0.0005;
      }
      this.scene.add(dirLight);
    }
  }

  // ----------------------------------------------------
  // LEVEL 1: RUMAHKU ASRI (Rumah, Kebun, 3 Tong Pilah)
  // ----------------------------------------------------
  private buildLevel1_RumahkuAsri() {
    // Ground Grass Terrain
    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.8 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Cobblestone walkway
    const pathGeo = new THREE.PlaneGeometry(3, 30);
    const pathMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.9 });
    const path = new THREE.Mesh(pathGeo, pathMat);
    path.rotation.x = -Math.PI / 2;
    path.position.set(0, 0.02, 5);
    path.receiveShadow = true;
    this.scene.add(path);

    // House Model (Nusantara Vernacular Modern Home)
    const houseGroup = new THREE.Group();
    houseGroup.position.set(0, 0, -14);

    // Walls
    const wallGeo = new THREE.BoxGeometry(14, 5, 10);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.5 });
    const walls = new THREE.Mesh(wallGeo, wallMat);
    walls.position.y = 2.5;
    walls.castShadow = true;
    walls.receiveShadow = true;
    houseGroup.add(walls);

    // Roof (Limas Joglo style)
    const roofGeo = new THREE.ConeGeometry(11, 4.5, 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.4 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 6.8;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    houseGroup.add(roof);

    // Front Door & Windows
    const doorGeo = new THREE.BoxGeometry(1.8, 3.2, 0.1);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });
    const door = new THREE.Mesh(doorGeo, woodMat);
    door.position.set(0, 1.6, 5.06);
    houseGroup.add(door);

    const verandaRoofGeo = new THREE.BoxGeometry(8, 0.3, 3);
    const verandaRoof = new THREE.Mesh(verandaRoofGeo, woodMat);
    verandaRoof.position.set(0, 3.5, 6.2);
    houseGroup.add(verandaRoof);

    this.scene.add(houseGroup);
    this.addColliderBox(new THREE.Vector3(0, 2.5, -14), new THREE.Vector3(14, 5, 10));

    // Wooden Fences
    for (let x = -25; x <= 25; x += 5) {
      if (Math.abs(x) < 4) continue; // Entrance gap
      const fenceGeo = new THREE.BoxGeometry(4.8, 1.2, 0.2);
      const fence = new THREE.Mesh(fenceGeo, woodMat);
      fence.position.set(x, 0.6, 22);
      fence.castShadow = true;
      this.scene.add(fence);
      this.addColliderBox(fence.position, new THREE.Vector3(4.8, 1.2, 0.5));
    }

    // Trees & Plants
    this.createTree(12, 0, -6);
    this.createTree(-12, 0, -4);
    this.createTree(16, 0, 10);
    this.createTree(-15, 0, 12);
    this.createPalmTree(8, 0, 15);
    this.createPalmTree(-9, 0, 18);

    // 3 Trash Sorting Bins:
    // Green (Organik), Yellow (Anorganik), Red (B3 Aman)
    this.createTrashBin(-4, 0, 4, 'bin_organik', 'Tong Sampah Organik (Hijau)', 0x16a34a, 'Masukkan sampah sisa makanan/daun di sini');
    this.createTrashBin(0, 0, 4, 'bin_anorganik', 'Tong Sampah Anorganik (Kuning)', 0xeab308, 'Masukkan botol plastik/kaleng di sini');
    this.createTrashBin(4, 0, 4, 'bin_b3', 'Tong Sampah B3 Aman (Merah)', 0xdc2626, 'Masukkan baterai/wadah obat nyamuk (Gunakan Penjepit!)');

    // Collectible Trash Items on Lawn
    // Organik
    this.createTrashItem(-6, 0.2, 8, 'item_daun', 'Daun & Kulit Buah Kering', 'organik', 0x65a30d);
    this.createTrashItem(7, 0.2, 3, 'item_sayur', 'Sisa Sayur & Ranting Lapuk', 'organik', 0x4d7c0f);

    // Anorganik
    this.createTrashItem(5, 0.2, 11, 'item_botol', 'Botol Plastik Bekas', 'anorganik', 0x38bdf8);
    this.createTrashItem(-8, 0.2, -1, 'item_kaleng', 'Kaleng Minuman Bekas', 'anorganik', 0x94a3b8);

    // B3 Aman (Baterai & Kaleng aerosol obat nyamuk)
    this.createTrashItem(-10, 0.2, 6, 'item_baterai', 'Baterai Mainan Bekas (B3)', 'b3', 0xef4444);
    this.createTrashItem(11, 0.2, 8, 'item_aerosol', 'Wadah Obat Nyamuk Kosong (B3)', 'b3', 0xb91c1c);

    // Tool: Penjepit Sampah Pelindung (B3 Safe Grabber)
    this.createToolItem(-2, 0.4, 2, 'tool_grabber', 'Alat Penjepit Sampah B3', 'Gunakan untuk mengambil sampah B3 dengan aman!');
  }

  // ----------------------------------------------------
  // LEVEL 2: SEKOLAHKU TANGGUNG JAWABKU (SDN 2 Girimarto)
  // ----------------------------------------------------
  private buildLevel2_SekolahkuTanggungJawabku() {
    // School Courtyard & Floor
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 }); // Paving block
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // School Field Grass Patch
    const fieldGeo = new THREE.PlaneGeometry(30, 20);
    const fieldMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
    const field = new THREE.Mesh(fieldGeo, fieldMat);
    field.rotation.x = -Math.PI / 2;
    field.position.set(0, 0.02, 6);
    this.scene.add(field);

    // School Main Building (SDN 2 Girimarto)
    const schoolGroup = new THREE.Group();
    schoolGroup.position.set(0, 0, -18);

    const schoolWallGeo = new THREE.BoxGeometry(36, 6, 12);
    const schoolWallMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.5 }); // Cream/yellow school
    const schoolWall = new THREE.Mesh(schoolWallGeo, schoolWallMat);
    schoolWall.position.y = 3;
    schoolWall.castShadow = true;
    schoolGroup.add(schoolWall);

    // Roof
    const roofGeo = new THREE.ConeGeometry(24, 5, 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.4 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 8.5;
    roof.rotation.y = Math.PI / 4;
    schoolGroup.add(roof);

    // School Signboard "SDN 2 GIRIMARTO - WONOGIRI"
    const signGeo = new THREE.BoxGeometry(10, 1.4, 0.2);
    const signMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.3 });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, 5, 6.12);
    schoolGroup.add(sign);

    this.scene.add(schoolGroup);
    this.addColliderBox(new THREE.Vector3(0, 3, -18), new THREE.Vector3(36, 6, 12));

    // Bendera Merah Putih Flagpole in Courtyard
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 9, 12);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.7, roughness: 0.2 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(0, 4.5, 0);
    pole.castShadow = true;
    this.scene.add(pole);

    // Red-White Flag
    const flagGeo = new THREE.BoxGeometry(2, 1.2, 0.04);
    const flagMatRed = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const flagMeshRed = new THREE.Mesh(new THREE.BoxGeometry(2, 0.6, 0.04), flagMatRed);
    flagMeshRed.position.set(1.0, 8.2, 0);
    const flagMeshWhite = new THREE.Mesh(new THREE.BoxGeometry(2, 0.6, 0.04), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    flagMeshWhite.position.set(1.0, 7.6, 0);
    this.scene.add(flagMeshRed, flagMeshWhite);

    // Fasilitas 1: Tempat Wudhu & Keran Air yang meluap (Interactive)
    this.createWudhuTap(-14, 0, -8);

    // Fasilitas 2: Saklar Lampu Kelas yang menyala siang bolong (Interactive)
    this.createClassroomLightSwitch(14, 0, -8);

    // 3R Floating Glyphs to collect:
    // R - E - D - U - C - E, R - E - U - S - E, R - E - C - Y - C - L - E
    const glyphs = [
      { text: 'R-E-D-U-C-E', x: -8, z: 8, color: 0x10b981 },
      { text: 'R-E-U-S-E', x: 0, z: 14, color: 0x3b82f6 },
      { text: 'R-E-C-Y-C-L-E', x: 8, z: 8, color: 0xf59e0b },
    ];
    glyphs.forEach((g, idx) => {
      this.create3RGlyph(g.x, 1.2, g.z, `glyph_${idx}`, g.text, g.color);
    });

    // Trees around school
    this.createTree(-22, 0, 5);
    this.createTree(-22, 0, -5);
    this.createTree(22, 0, 5);
    this.createTree(22, 0, -5);
  }

  // ----------------------------------------------------
  // LEVEL 3: LABORATORIUM KHALIFAH (Pusat Daur Ulang & Claw Machine)
  // ----------------------------------------------------
  private buildLevel3_LaboratoriumKhalifah() {
    // Futuristic Lab Floor
    const groundGeo = new THREE.PlaneGeometry(70, 70);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.4 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Glowing hex grid decals
    const gridHelper = new THREE.GridHelper(60, 30, 0x06b6d4, 0x1e293b);
    gridHelper.position.y = 0.03;
    this.scene.add(gridHelper);

    // Futuristic Lab Walls
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(60, 10, 2), wallMat);
    backWall.position.set(0, 5, -25);
    this.scene.add(backWall);
    this.addColliderBox(backWall.position, new THREE.Vector3(60, 10, 2));

    // Conveyor Belt in center
    const conveyorGeo = new THREE.BoxGeometry(22, 1.2, 4);
    const conveyorMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7, metalness: 0.5 });
    const conveyor = new THREE.Mesh(conveyorGeo, conveyorMat);
    conveyor.position.set(0, 0.6, -2);
    this.scene.add(conveyor);
    this.addColliderBox(conveyor.position, new THREE.Vector3(22, 1.2, 4));

    // 3 Sorting Bins for Claw Crane / Player Decision
    this.createLabSortingChute(-7, 0, 4, 'chute_reduce', 'TABUNG REDUCE (Kurangi Pemakaian)', 0x10b981);
    this.createLabSortingChute(0, 0, 4, 'chute_reuse', 'TABUNG REUSE (Gunakan Kembali)', 0x06b6d4);
    this.createLabSortingChute(7, 0, 4, 'chute_recycle', 'TABUNG RECYCLE (Daur Ulang Pabrik)', 0x8b5cf6);

    // 3D Interactive Claw Crane Gantry
    this.build3DClawCrane();

    // Lab Console Trigger
    this.createLabTerminal(0, 0, 8);
  }

  private build3DClawCrane() {
    this.clawMesh = new THREE.Group();
    this.clawMesh.position.copy(this.clawPosition);

    // Claw Gantry Rail
    const railGeo = new THREE.BoxGeometry(18, 0.4, 0.4);
    const railMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.2 });
    const rail = new THREE.Mesh(railGeo, railMat);
    rail.position.set(0, 6.5, -2);
    this.scene.add(rail);

    // Crane Head Unit
    const headGeo = new THREE.BoxGeometry(1.4, 0.6, 1.4);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 });
    const head = new THREE.Mesh(headGeo, headMat);
    this.clawMesh.add(head);

    // 3 Claw Prongs
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const prongGeo = new THREE.CylinderGeometry(0.06, 0.04, 1.0, 8);
      const prongMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
      const prong = new THREE.Mesh(prongGeo, prongMat);
      prong.position.set(Math.cos(angle) * 0.4, -0.6, Math.sin(angle) * 0.4);
      prong.rotation.z = Math.cos(angle) * 0.3;
      prong.rotation.x = -Math.sin(angle) * 0.3;
      this.clawMesh.add(prong);
    }

    this.scene.add(this.clawMesh);

    // Crane Cable
    const points = [new THREE.Vector3(0, 6.5, -2), this.clawPosition];
    const cableGeo = new THREE.BufferGeometry().setFromPoints(points);
    const cableMat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
    this.clawCable = new THREE.Line(cableGeo, cableMat);
    this.scene.add(this.clawCable);

    this.animatedElements.push(() => {
      if (this.clawMesh && this.clawCable) {
        this.clawMesh.position.copy(this.clawPosition);
        const positions = this.clawCable.geometry.attributes.position as THREE.BufferAttribute;
        positions.setXYZ(1, this.clawPosition.x, this.clawPosition.y + 0.3, this.clawPosition.z);
        positions.needsUpdate = true;
      }
    });
  }

  // ----------------------------------------------------
  // LEVEL 4: GUA KEBIJAKSANAAN (Labirin Kristal & Pintu Teka-Teki)
  // ----------------------------------------------------
  private buildLevel4_GuaKebijaksanaan() {
    // Cave Rocky Floor
    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Glowing Underground River
    const riverGeo = new THREE.PlaneGeometry(10, 80);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85,
    });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(-6, 0.05, 0);
    this.scene.add(river);

    // Natural Stepping Stone Bridges across river
    [-15, 0, 15].forEach(z => {
      for (let x = -10; x <= -2; x += 2.5) {
        const stoneGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.3, 8);
        const stoneMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 });
        const stone = new THREE.Mesh(stoneGeo, stoneMat);
        stone.position.set(x, 0.15, z + (Math.random() - 0.5) * 1.5);
        this.scene.add(stone);
      }
    });

    // Glowing Crystals clusters
    const crystalColors = [0x06b6d4, 0x10b981, 0xa855f7, 0xf59e0b];
    for (let i = 0; i < 20; i++) {
      const x = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 50;
      if (Math.abs(x) < 4 && Math.abs(z) < 4) continue;
      this.createCrystalCluster(x, 0, z, crystalColors[i % crystalColors.length]);
    }

    // Stalagmites & Rock Pillars
    for (let i = 0; i < 18; i++) {
      const x = (Math.random() - 0.5) * 60;
      const z = (Math.random() - 0.5) * 60;
      if (Math.abs(x) < 5) continue;
      this.createStalagmite(x, 0, z);
    }

    // 3 Ancient Wisdom Puzzle Gates (Safe, Non-trapping checkpoints)
    this.createWisdomGate(0, 0, -6, 1, 'Gerbang 1: Amanah Khalifah');
    this.createWisdomGate(8, 0, -18, 2, 'Gerbang 2: Keseimbangan Al-Mizan');
    this.createWisdomGate(-8, 0, -30, 3, 'Gerbang 3: Sunnatullah & Biotik-Abiotik');
  }

  // ----------------------------------------------------
  // LEVEL 5: PENJELAJAH CIPTAAN ALLAH (Hutan Tropis, Satwa, & Tanggap Bahaya)
  // ----------------------------------------------------
  private buildLevel5_PenjelajahCiptaanAllah() {
    // Lush Forest Floor
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.85 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // River winding through forest
    const riverGeo = new THREE.PlaneGeometry(8, 90);
    const riverMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.6 });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(10, 0.04, 0);
    this.scene.add(river);

    // Wooden Footbridge over river
    const bridgeGeo = new THREE.BoxGeometry(12, 0.4, 4);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
    const bridge = new THREE.Mesh(bridgeGeo, woodMat);
    bridge.position.set(10, 0.4, 0);
    bridge.castShadow = true;
    this.scene.add(bridge);

    // Dense Rainforest Trees & Foliage
    for (let i = 0; i < 35; i++) {
      const x = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 80;
      if (Math.abs(x) < 5 && Math.abs(z) < 5) continue;
      if (Math.abs(x - 10) < 6) continue; // keep river path clear
      this.createRainforestTree(x, 0, z);
    }

    // Friendly Wildlife (Rusa Bawean Deer & Bird)
    this.createFriendlyDeer(-8, 0, 6);
    this.createFriendlyDeer(-14, 0, 10);

    // Environmental Challenge 1: Sampah di Tepi Sungai (Clean up)
    this.createForestHazard(12, 0.3, 8, 'hazard_river_trash', 'Pembersihan Sampah Aliran Sungai', 'Ambil sampah agar air sungai tetap jernih dan satwa tidak teracuni.');

    // Environmental Challenge 2: Sisa Bara Api Unggun (Padamkan dari jarak aman)
    this.createForestHazard(-12, 0.3, -8, 'hazard_campfire', 'Pemadaman Sisa Api Unggun', 'Padamkan bara api dari jarak aman agar tidak terjadi kebakaran hutan!');

    // Environmental Challenge 3: Bibit Pohon Reboisasi (Tanam di area gundul)
    this.createForestHazard(4, 0.3, -15, 'hazard_reboisasi', 'Penanaman Bibit Pohon Pelindung', 'Tanam bibit pohon sebagai sedekah jariyah oksigen bumi.');

    // Pos Jagawana / Ranger Station
    this.createRangerStation(0, 0, 20);
  }

  // ----------------------------------------------------
  // LEVEL 6: RADAR KHALIFAH NUSANTARA (Ruang Kendali & Peta Hologram)
  // ----------------------------------------------------
  private buildLevel6_RadarNusantara() {
    // High-Tech Hexagonal Floor
    const groundGeo = new THREE.CylinderGeometry(35, 35, 1, 6);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.2, metalness: 0.8 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.5;
    this.scene.add(ground);

    // Glowing Neon Rings on floor
    const ringGeo1 = new THREE.RingGeometry(8, 8.4, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x0284c7, side: THREE.DoubleSide });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = -Math.PI / 2;
    ring1.position.y = 0.03;
    this.scene.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(22, 22.5, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.03;
    this.scene.add(ring2);

    // Central Floating Hologram Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(1.8, 2.5, 1.2, 16);
    const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.7 });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.set(0, 0.6, 0);
    this.scene.add(pedestal);

    // 3D Procedural Holographic Indonesian Archipelago (Peta Nusantara)
    this.buildHologramIndonesiaMap();

    // 6 Hologram Radar Hotspot Pillars
    // Wonogiri, Demak, Bandung, Balikpapan, Palu, Sentani
    const hotspots = [
      { id: 'wonogiri', name: 'Wonogiri (Waduk Gajah Mungkur & DAS Keduang)', x: -4, z: 5, color: 0x10b981 },
      { id: 'demak', name: 'Demak (Sabuk Mangrove Pesisir Sayung)', x: -2, z: 3, color: 0x06b6d4 },
      { id: 'bandung', name: 'Bandung (Restorasi Citarum Harum)', x: -7, z: 2, color: 0x3b82f6 },
      { id: 'balikpapan', name: 'Balikpapan (HLSW & Koridor Hijau IKN)', x: 4, z: -1, color: 0xa855f7 },
      { id: 'palu', name: 'Palu (Sabuk Hijau Pantai & Mitigasi)', x: 9, z: 1, color: 0xf59e0b },
      { id: 'sentani', name: 'Sentani Papua (Pegunungan Cycloop)', x: 16, z: 3, color: 0xec4899 },
    ];

    hotspots.forEach(h => {
      this.createRadarPillar(h.x, 0, h.z, h.id, h.name, h.color);
    });
  }

  private buildHologramIndonesiaMap() {
    const mapGroup = new THREE.Group();
    mapGroup.position.set(0, 2.8, 0);

    const islandMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0369a1,
      roughness: 0.3,
      metalness: 0.8,
      transparent: true,
      opacity: 0.75,
      wireframe: false,
    });

    // Stylized Island Masses
    // Sumatra
    const sumatra = new THREE.Mesh(new THREE.BoxGeometry(4, 0.3, 10), islandMat);
    sumatra.position.set(-14, 0, -4);
    sumatra.rotation.y = -0.55;
    mapGroup.add(sumatra);

    // Java (including Wonogiri & Demak)
    const java = new THREE.Mesh(new THREE.BoxGeometry(10, 0.3, 2.2), islandMat);
    java.position.set(-4, 0, 4);
    mapGroup.add(java);

    // Kalimantan
    const borneo = new THREE.Mesh(new THREE.BoxGeometry(8, 0.4, 7), islandMat);
    borneo.position.set(3, 0, -3);
    mapGroup.add(borneo);

    // Sulawesi (K-shape stylized)
    const sulawesi = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.35, 6), islandMat);
    sulawesi.position.set(10, 0, 0);
    mapGroup.add(sulawesi);

    // Papua
    const papua = new THREE.Mesh(new THREE.BoxGeometry(9, 0.4, 5), islandMat);
    papua.position.set(18, 0, 3);
    mapGroup.add(papua);

    this.scene.add(mapGroup);

    // Gentle floating bobbing animation
    this.animatedElements.push((_dt, time) => {
      mapGroup.position.y = 2.8 + Math.sin(time * 1.5) * 0.15;
    });
  }

  // ==========================================
  // PROCEDURAL PREFABS & INTERACTIVE ELEMENTS
  // ==========================================

  private createTree(x: number, y: number, z: number) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.3, 0.45, 3.5, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.75;
    trunk.castShadow = true;
    group.add(trunk);

    // Foliage (Tiered Spheres)
    const folMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });
    const fol1 = new THREE.Mesh(new THREE.SphereGeometry(1.8, 8, 8), folMat);
    fol1.position.y = 4.2;
    fol1.castShadow = true;
    group.add(fol1);

    const fol2 = new THREE.Mesh(new THREE.SphereGeometry(1.3, 8, 8), folMat);
    fol2.position.y = 5.4;
    fol2.castShadow = true;
    group.add(fol2);

    this.scene.add(group);
    this.addColliderBox(new THREE.Vector3(x, 1.5, z), new THREE.Vector3(1.2, 3.5, 1.2));
  }

  private createPalmTree(x: number, y: number, z: number) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.35, 6, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0xa16207, roughness: 0.7 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 3;
    trunk.rotation.z = 0.08;
    trunk.castShadow = true;
    group.add(trunk);

    // Palm leaves
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.6 });
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const leafGeo = new THREE.BoxGeometry(3.5, 0.1, 0.6);
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set(Math.cos(angle) * 1.5, 5.8, Math.sin(angle) * 1.5);
      leaf.rotation.y = angle;
      leaf.rotation.z = -0.35;
      group.add(leaf);
    }

    this.scene.add(group);
    this.addColliderBox(new THREE.Vector3(x, 2.5, z), new THREE.Vector3(1.0, 5, 1.0));
  }

  private createRainforestTree(x: number, y: number, z: number) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const trunkGeo = new THREE.CylinderGeometry(0.4, 0.7, 7, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 3.5;
    trunk.castShadow = true;
    group.add(trunk);

    const canopyGeo = new THREE.ConeGeometry(3.8, 5.5, 7);
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.8 });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.y = 7.5;
    canopy.castShadow = true;
    group.add(canopy);

    this.scene.add(group);
    this.addColliderBox(new THREE.Vector3(x, 3, z), new THREE.Vector3(1.4, 6, 1.4));
  }

  private createTrashBin(x: number, y: number, z: number, id: string, name: string, color: number, promptText: string) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const binGeo = new THREE.CylinderGeometry(0.7, 0.6, 1.6, 16);
    const binMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4 });
    const bin = new THREE.Mesh(binGeo, binMat);
    bin.position.y = 0.8;
    bin.castShadow = true;
    group.add(bin);

    // Lid
    const lidGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.25, 16);
    const lid = new THREE.Mesh(lidGeo, new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.5 }));
    lid.position.y = 1.7;
    group.add(lid);

    this.scene.add(group);
    this.addColliderBox(new THREE.Vector3(x, 0.8, z), new THREE.Vector3(1.4, 1.6, 1.4));

    this.interactiveObjects.push({
      id,
      name,
      promptText: `[E] ${promptText}`,
      category: 'bin',
      mesh: group,
      radius: 2.8,
      collected: false,
    });
  }

  private createTrashItem(x: number, y: number, z: number, id: string, name: string, category: 'organik' | 'anorganik' | 'b3', color: number) {
    const geo = category === 'b3' ? new THREE.BoxGeometry(0.4, 0.5, 0.4) : new THREE.DodecahedronGeometry(0.35);
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.3 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y + 0.3, z);
    mesh.castShadow = true;
    this.scene.add(mesh);

    // Floating bobbing effect
    this.animatedElements.push((_dt, time) => {
      mesh.position.y = y + 0.35 + Math.sin(time * 3 + x) * 0.1;
      mesh.rotation.y += 0.02;
    });

    this.interactiveObjects.push({
      id,
      name,
      promptText: `[E] Ambil ${name}`,
      category,
      mesh,
      radius: 2.2,
      collected: false,
      onInteract: () => {
        sound.playPickup();
        mesh.visible = false;
        this.callbacks.onCollect({
          id,
          name,
          category,
          points: category === 'b3' ? 200 : 100,
          coins: 2,
        });
      },
    });
  }

  private createToolItem(x: number, y: number, z: number, id: string, name: string, description: string) {
    const toolGroup = new THREE.Group();
    toolGroup.position.set(x, y, z);

    const rodGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8);
    const rodMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8, roughness: 0.2 });
    const rod = new THREE.Mesh(rodGeo, rodMat);
    rod.rotation.z = Math.PI / 4;
    toolGroup.add(rod);

    // Glowing icon indicator
    const glowGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.set(0, 0.8, 0);
    toolGroup.add(glow);

    this.scene.add(toolGroup);

    this.interactiveObjects.push({
      id,
      name,
      promptText: `[E] Ambil ${name} (${description})`,
      category: 'alat',
      mesh: toolGroup,
      radius: 2.2,
      collected: false,
      onInteract: () => {
        sound.playSuccess();
        toolGroup.visible = false;
        this.callbacks.onCollect({
          id,
          name,
          category: 'alat',
          points: 150,
          coins: 3,
        });
      },
    });
  }

  private createWudhuTap(x: number, y: number, z: number) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    // Concrete basin
    const basinGeo = new THREE.BoxGeometry(4, 1.0, 2);
    const basinMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 });
    const basin = new THREE.Mesh(basinGeo, basinMat);
    basin.position.y = 0.5;
    group.add(basin);

    // Tap pipe
    const pipeGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8);
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.position.set(0, 1.4, 0);
    group.add(pipe);

    // Water particles
    const waterGeo = new THREE.CylinderGeometry(0.05, 0.15, 0.8, 8);
    const waterMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 });
    const waterStream = new THREE.Mesh(waterGeo, waterMat);
    waterStream.position.set(0, 0.9, 0.3);
    group.add(waterStream);

    this.scene.add(group);
    this.addColliderBox(new THREE.Vector3(x, 0.5, z), new THREE.Vector3(4, 1.2, 2));

    let isClosed = false;

    this.interactiveObjects.push({
      id: 'wudhu_tap',
      name: 'Keran Air Tempat Wudhu',
      promptText: isClosed ? 'Keran sudah tertutup rapat (Alhamdulillah)' : '[E] Tutup Keran Wudhu yang Meluap!',
      category: 'fasilitas',
      mesh: group,
      radius: 2.8,
      collected: false,
      onInteract: () => {
        if (!isClosed) {
          isClosed = true;
          sound.playSuccess();
          waterStream.visible = false;
          this.callbacks.onCollect({
            id: 'closed_wudhu_tap',
            name: 'Menutup Keran Air Wudhu',
            category: 'fasilitas',
            points: 250,
            coins: 5,
          });
        }
      },
    });
  }

  private createClassroomLightSwitch(x: number, y: number, z: number) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const postGeo = new THREE.BoxGeometry(0.8, 2.5, 0.8);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.y = 1.25;
    group.add(post);

    // Glowing bulb on top
    const bulbGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.y = 2.8;
    group.add(bulb);

    const light = new THREE.PointLight(0xfef08a, 1.5, 8);
    light.position.y = 2.8;
    group.add(light);

    this.scene.add(group);
    this.addColliderBox(new THREE.Vector3(x, 1.25, z), new THREE.Vector3(0.8, 2.5, 0.8));

    let isOff = false;

    this.interactiveObjects.push({
      id: 'classroom_light',
      name: 'Lampu Kelas Siang Hari',
      promptText: isOff ? 'Lampu hemat energi sudah dimatikan' : '[E] Matikan Lampu Kelas (Hemat Energi)',
      category: 'fasilitas',
      mesh: group,
      radius: 2.8,
      collected: false,
      onInteract: () => {
        if (!isOff) {
          isOff = true;
          sound.playSuccess();
          (bulb.material as THREE.MeshBasicMaterial).color.setHex(0x334155);
          light.intensity = 0;
          this.callbacks.onCollect({
            id: 'turned_off_light',
            name: 'Mematikan Lampu di Siang Hari',
            category: 'fasilitas',
            points: 250,
            coins: 5,
          });
        }
      },
    });
  }

  private create3RGlyph(x: number, y: number, z: number, id: string, label: string, color: number) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const torusGeo = new THREE.TorusGeometry(0.8, 0.2, 12, 24);
    const torusMat = new THREE.MeshStandardMaterial({ color, roughness: 0.2, metalness: 0.8 });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    group.add(torus);

    const centerGeo = new THREE.OctahedronGeometry(0.45);
    const centerMat = new THREE.MeshBasicMaterial({ color });
    const center = new THREE.Mesh(centerGeo, centerMat);
    group.add(center);

    this.scene.add(group);

    this.animatedElements.push((_dt, time) => {
      group.rotation.y += 0.03;
      group.position.y = y + Math.sin(time * 2.5 + x) * 0.2;
    });

    this.interactiveObjects.push({
      id,
      name: `Prinsip ${label}`,
      promptText: `[E] Ambil Sandi 3R: ${label}`,
      category: 'huruf',
      mesh: group,
      radius: 2.2,
      collected: false,
      onInteract: () => {
        sound.playSuccess();
        group.visible = false;
        this.callbacks.onCollect({
          id,
          name: `Prinsip ${label}`,
          category: 'huruf',
          points: 300,
          coins: 5,
        });
      },
    });
  }

  private createLabSortingChute(x: number, y: number, z: number, id: string, name: string, color: number) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const tubeGeo = new THREE.CylinderGeometry(1.6, 1.4, 2.2, 16);
    const tubeMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.6 });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.position.y = 1.1;
    group.add(tube);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.65, 0.15, 8, 24),
      new THREE.MeshBasicMaterial({ color })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 2.2;
    group.add(ring);

    this.scene.add(group);
    this.addColliderBox(new THREE.Vector3(x, 1.1, z), new THREE.Vector3(3.2, 2.2, 3.2));
  }

  private createLabTerminal(x: number, y: number, z: number) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const standGeo = new THREE.BoxGeometry(2, 1.4, 1.2);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.y = 0.7;
    group.add(stand);

    // Glowing screen
    const screenGeo = new THREE.PlaneGeometry(1.6, 1.0);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 1.3, 0.61);
    group.add(screen);

    this.scene.add(group);
    this.addColliderBox(new THREE.Vector3(x, 0.7, z), new THREE.Vector3(2, 1.4, 1.2));

    this.interactiveObjects.push({
      id: 'claw_terminal',
      name: 'Konsol Kendali Mesin Capit',
      promptText: '[E] Aktifkan Kendali Mesin Capit Daur Ulang!',
      category: 'terminal',
      mesh: group,
      radius: 3.0,
      collected: false,
      onInteract: () => {
        sound.playInteract();
        if (this.callbacks.onClawTrigger) {
          this.callbacks.onClawTrigger();
        }
      },
    });
  }

  private createCrystalCluster(x: number, y: number, z: number, color: number) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const crystalMat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.5,
      transparent: true,
      opacity: 0.85,
    });

    for (let i = 0; i < 5; i++) {
      const h = 1.0 + Math.random() * 1.8;
      const crystalGeo = new THREE.ConeGeometry(0.25, h, 6);
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      crystal.position.set((Math.random() - 0.5) * 0.8, h / 2, (Math.random() - 0.5) * 0.8);
      crystal.rotation.set((Math.random() - 0.5) * 0.4, Math.random() * Math.PI, (Math.random() - 0.5) * 0.4);
      group.add(crystal);
    }

    const light = new THREE.PointLight(color, 0.8, 6);
    light.position.y = 1.2;
    group.add(light);

    this.scene.add(group);
    this.addColliderBox(new THREE.Vector3(x, 0.8, z), new THREE.Vector3(1.2, 1.8, 1.2));
  }

  private createStalagmite(x: number, y: number, z: number) {
    const geo = new THREE.ConeGeometry(1.2, 5.0, 8);
    const mat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, 2.5, z);
    mesh.castShadow = true;
    this.scene.add(mesh);
    this.addColliderBox(new THREE.Vector3(x, 2.5, z), new THREE.Vector3(2.4, 5.0, 2.4));
  }

  private createWisdomGate(x: number, y: number, z: number, gateNum: number, label: string) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    // Stone Pillars
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 });
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 6, 1.2), pillarMat);
    p1.position.set(-3.5, 3, 0);
    const p2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 6, 1.2), pillarMat);
    p2.position.set(3.5, 3, 0);
    const arch = new THREE.Mesh(new THREE.BoxGeometry(8.2, 1.2, 1.2), pillarMat);
    arch.position.set(0, 6, 0);
    group.add(p1, p2, arch);

    // Glowing energy barrier
    const barrierGeo = new THREE.PlaneGeometry(6, 5.5);
    const barrierMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    const barrier = new THREE.Mesh(barrierGeo, barrierMat);
    barrier.position.set(0, 3, 0);
    group.add(barrier);

    this.scene.add(group);
    this.addColliderBox(new THREE.Vector3(x, 3, z), new THREE.Vector3(8.2, 6, 1.5));

    this.interactiveObjects.push({
      id: `gate_${gateNum}`,
      name: label,
      promptText: `[E] Pecahkan Teka-Teki ${label}`,
      category: 'gate',
      mesh: group,
      radius: 3.5,
      collected: false,
      onInteract: () => {
        sound.playInteract();
        if (this.callbacks.onGateTrigger) {
          this.callbacks.onGateTrigger(gateNum);
        }
      },
    });
  }

  public unlockGate(gateNum: number) {
    const obj = this.interactiveObjects.find(i => i.id === `gate_${gateNum}`);
    if (obj) {
      obj.collected = true;
      obj.mesh.visible = false;
      // remove collider
      const box = this.colliders.find(c => Math.abs(c.min.z - obj.mesh.position.z) < 2);
      if (box) {
        const idx = this.colliders.indexOf(box);
        if (idx !== -1) this.colliders.splice(idx, 1);
      }
      sound.playSuccess();
    }
  }

  private createFriendlyDeer(x: number, y: number, z: number) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.7 });

    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 1.4), bodyMat);
    body.position.y = 1.0;
    group.add(body);

    // Neck & Head
    const neck = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.8, 0.3), bodyMat);
    neck.position.set(0, 1.5, 0.6);
    neck.rotation.x = -0.3;
    group.add(neck);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 0.6), bodyMat);
    head.position.set(0, 1.85, 0.8);
    group.add(head);

    // Antlers
    const antlerMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 });
    const leftAntler = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 6), antlerMat);
    leftAntler.position.set(-0.2, 2.2, 0.7);
    leftAntler.rotation.z = -0.4;
    const rightAntler = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 6), antlerMat);
    rightAntler.position.set(0.2, 2.2, 0.7);
    rightAntler.rotation.z = 0.4;
    group.add(leftAntler, rightAntler);

    // Legs
    for (let i = 0; i < 4; i++) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.8, 6), bodyMat);
      leg.position.set((i % 2 === 0 ? -0.3 : 0.3), 0.4, (i < 2 ? -0.5 : 0.5));
      group.add(leg);
    }

    this.scene.add(group);

    // Gentle head turning animation
    this.animatedElements.push((_dt, time) => {
      head.rotation.y = Math.sin(time * 0.8 + x) * 0.3;
    });

    this.interactiveObjects.push({
      id: `deer_${x}`,
      name: 'Rusa Bawean (Satwa Dilindungi)',
      promptText: '[E] Amati Satwa (Adab: Jangan ganggu atau beri makan sembarangan)',
      category: 'satwa',
      mesh: group,
      radius: 3.0,
      collected: false,
      onInteract: () => {
        sound.playInteract();
        this.callbacks.onCollect({
          id: 'observe_deer',
          name: 'Menyayangi & Tidak Mengganggu Satwa Hutan',
          category: 'satwa',
          points: 150,
          coins: 3,
        });
      },
    });
  }

  private createForestHazard(x: number, y: number, z: number, id: string, name: string, description: string) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    let mainMesh: THREE.Mesh;
    if (id === 'hazard_campfire') {
      // Campfire with embers & smoke
      const logGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.2, 8);
      const logMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
      for (let i = 0; i < 3; i++) {
        const log = new THREE.Mesh(logGeo, logMat);
        log.rotation.y = (i * Math.PI) / 3;
        log.rotation.z = Math.PI / 2;
        group.add(log);
      }
      mainMesh = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.3),
        new THREE.MeshBasicMaterial({ color: 0xef4444 })
      );
      mainMesh.position.y = 0.3;
      group.add(mainMesh);
    } else if (id === 'hazard_reboisasi') {
      // Tree sapling in pot
      mainMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.4, 0.5, 8),
        new THREE.MeshStandardMaterial({ color: 0x78350f })
      );
      const sprout = new THREE.Mesh(
        new THREE.ConeGeometry(0.3, 0.8, 6),
        new THREE.MeshStandardMaterial({ color: 0x22c55e })
      );
      sprout.position.y = 0.6;
      group.add(mainMesh, sprout);
    } else {
      // River trash pile
      mainMesh = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.6),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5 })
      );
      group.add(mainMesh);
    }

    this.scene.add(group);

    this.interactiveObjects.push({
      id,
      name,
      promptText: `[E] Selesaikan: ${name} (${description})`,
      category: 'hazard',
      mesh: group,
      radius: 2.8,
      collected: false,
      onInteract: () => {
        sound.playSuccess();
        group.visible = false;
        this.callbacks.onCollect({
          id,
          name,
          category: 'hazard',
          points: 300,
          coins: 5,
        });
      },
    });
  }

  private createRangerStation(x: number, y: number, z: number) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const houseGeo = new THREE.BoxGeometry(6, 4, 5);
    const houseMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.6 });
    const house = new THREE.Mesh(houseGeo, houseMat);
    house.position.y = 2;
    house.castShadow = true;
    group.add(house);

    const roofGeo = new THREE.ConeGeometry(5, 2.5, 4);
    const roof = new THREE.Mesh(roofGeo, new THREE.MeshStandardMaterial({ color: 0x78350f }));
    roof.position.y = 5.2;
    roof.rotation.y = Math.PI / 4;
    group.add(roof);

    this.scene.add(group);
    this.addColliderBox(new THREE.Vector3(x, 2, z), new THREE.Vector3(6, 4, 5));

    this.interactiveObjects.push({
      id: 'ranger_station',
      name: 'Pos Pengawas Jagawana',
      promptText: '[E] Lapor Situasi Hutan ke Petugas Jagawana',
      category: 'station',
      mesh: group,
      radius: 3.5,
      collected: false,
      onInteract: () => {
        sound.playSuccess();
        this.callbacks.onCollect({
          id: 'report_ranger',
          name: 'Melaporkan Keamanan Hutan ke Jagawana',
          category: 'station',
          points: 350,
          coins: 8,
        });
      },
    });
  }

  private createRadarPillar(x: number, y: number, z: number, id: string, name: string, color: number) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    // Pillar base
    const baseGeo = new THREE.CylinderGeometry(0.8, 1.1, 0.6, 16);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.3;
    group.add(base);

    // Vertical Beam of Holographic Light
    const beamGeo = new THREE.CylinderGeometry(0.12, 0.12, 4.5, 12);
    const beamMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.6 });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = 2.5;
    group.add(beam);

    // Floating Holographic Diamond Beacon
    const beaconGeo = new THREE.OctahedronGeometry(0.45);
    const beaconMat = new THREE.MeshBasicMaterial({ color });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.y = 4.8;
    group.add(beacon);

    this.scene.add(group);
    this.addColliderBox(new THREE.Vector3(x, 1, z), new THREE.Vector3(1.6, 2, 1.6));

    this.animatedElements.push((_dt, time) => {
      beacon.rotation.y += 0.04;
      beacon.position.y = 4.8 + Math.sin(time * 3 + x) * 0.15;
    });

    this.interactiveObjects.push({
      id: `radar_${id}`,
      name: `Stasiun Radar: ${name}`,
      promptText: `[E] Buka Investigasi Berita Resmi ${name}`,
      category: 'radar',
      mesh: group,
      radius: 3.2,
      collected: false,
      onInteract: () => {
        sound.playInteract();
        if (this.callbacks.onRadarTrigger) {
          this.callbacks.onRadarTrigger(id);
        }
      },
    });
  }

  private addColliderBox(center: THREE.Vector3, size: THREE.Vector3) {
    const half = size.clone().multiplyScalar(0.5);
    const box = new THREE.Box3(center.clone().sub(half), center.clone().add(half));
    this.colliders.push(box);
  }

  // ==========================================
  // INPUT CONTROLS & CAMERA COLLISION SYSTEM
  // ==========================================
  private setupEventListeners() {
    // Keyboard
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);

    // Mouse Drag for TPP Camera
    this.container.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);

    // Mouse Wheel Zoom
    this.container.addEventListener('wheel', this.handleWheel, { passive: true });

    // Resize
    window.addEventListener('resize', this.handleResize);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.keys.forward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.keys.backward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.keys.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.keys.right = true;
        break;
      case 'Space':
        this.keys.jump = true;
        this.triggerJump();
        e.preventDefault();
        break;
      case 'KeyE':
        this.keys.interact = true;
        this.triggerInteraction();
        break;
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.keys.forward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.keys.backward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.keys.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.keys.right = false;
        break;
      case 'Space':
        this.keys.jump = false;
        break;
      case 'KeyE':
        this.keys.interact = false;
        break;
    }
  };

  private handleMouseDown = (e: MouseEvent) => {
    if (e.button === 0) {
      this.isDraggingMouse = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    }
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (this.isDraggingMouse) {
      const deltaX = e.clientX - this.lastMouseX;
      const deltaY = e.clientY - this.lastMouseY;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;

      this.cameraYaw -= deltaX * 0.005;
      this.cameraPitch = Math.max(0.05, Math.min(Math.PI / 2.3, this.cameraPitch + deltaY * 0.004));
    }
  };

  private handleMouseUp = () => {
    this.isDraggingMouse = false;
  };

  private handleWheel = (e: WheelEvent) => {
    this.targetCameraDistance = Math.max(3.5, Math.min(14.0, this.targetCameraDistance + e.deltaY * 0.005));
  };

  private handleResize = () => {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / (height || 1);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public triggerJump() {
    if (this.isGrounded) {
      this.playerVelocity.y = this.jumpForce;
      this.isGrounded = false;
      sound.playJump();
    }
  }

  public triggerInteraction() {
    if (this.activeProximity) {
      const target = this.interactiveObjects.find(i => i.id === this.activeProximity?.id);
      if (target && target.onInteract) {
        target.onInteract();
      }
    }
  }

  // ==========================================
  // CLAW MACHINE CONTROLS (LEVEL 3)
  // ==========================================
  public moveClaw(dx: number, dz: number) {
    this.clawPosition.x = Math.max(-8, Math.min(8, this.clawPosition.x + dx));
    this.clawPosition.z = Math.max(-6, Math.min(6, this.clawPosition.z + dz));
    sound.playClawMove();
  }

  public lowerAndGrabClaw(onGrabResult: (item: string, chuteDecision: 'reduce' | 'reuse' | 'recycle') => void) {
    if (this.clawPosition.y <= 1.8) return;
    sound.playClawMove();

    // Descend
    this.clawPosition.y = 1.6;
    setTimeout(() => {
      this.clawGrabbed = true;
      sound.playPickup();
      // Ascend
      this.clawPosition.y = 4.5;

      setTimeout(() => {
        // Evaluate chute
        let chute: 'reduce' | 'reuse' | 'recycle' = 'reduce';
        if (this.clawPosition.x < -3) chute = 'reduce';
        else if (this.clawPosition.x < 3) chute = 'reuse';
        else chute = 'recycle';

        onGrabResult('Botol Plastik Kemasan Bersih', chute);
        this.clawGrabbed = false;
      }, 1000);
    }, 600);
  }

  // ==========================================
  // MAIN GAME LOOP (TICK & PHYSICS)
  // ==========================================
  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.clock.start();
    this.tick();
  }

  public stop() {
    this.isRunning = false;
    cancelAnimationFrame(this.animationFrameId);
  }

  private tick = () => {
    if (!this.isRunning) return;

    const dt = Math.min(this.clock.getDelta(), 0.1);
    const time = this.clock.getElapsedTime();

    this.updatePlayer(dt);
    this.updateCamera(dt);
    this.checkProximityPrompts();

    // Run animations
    this.animatedElements.forEach(fn => fn(dt, time));

    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  private updatePlayer(dt: number) {
    // 1. Calculate input movement direction relative to camera angle
    let moveX = 0;
    let moveZ = 0;

    if (this.keys.forward) moveZ -= 1;
    if (this.keys.backward) moveZ += 1;
    if (this.keys.left) moveX -= 1;
    if (this.keys.right) moveX += 1;

    // Apply Virtual Joystick if active
    if (this.virtualJoystick.active) {
      moveX += this.virtualJoystick.x;
      moveZ -= this.virtualJoystick.y;
    }

    const inputLen = Math.sqrt(moveX * moveX + moveZ * moveZ);
    const isMoving = inputLen > 0.1;

    if (isMoving) {
      const normX = moveX / Math.max(1, inputLen);
      const normZ = moveZ / Math.max(1, inputLen);

      // Rotate by camera yaw
      const forwardX = Math.sin(this.cameraYaw);
      const forwardZ = Math.cos(this.cameraYaw);
      const rightX = Math.cos(this.cameraYaw);
      const rightZ = -Math.sin(this.cameraYaw);

      const worldMoveX = rightX * normX - forwardX * normZ;
      const worldMoveZ = rightZ * normX - forwardZ * normZ;

      const targetX = this.playerGroup.position.x + worldMoveX * this.moveSpeed * dt;
      const targetZ = this.playerGroup.position.z + worldMoveZ * this.moveSpeed * dt;

      // Box Collision Check
      if (!this.checkPlayerCollision(targetX, this.playerGroup.position.z)) {
        this.playerGroup.position.x = targetX;
      }
      if (!this.checkPlayerCollision(this.playerGroup.position.x, targetZ)) {
        this.playerGroup.position.z = targetZ;
      }

      // Smooth rotate player facing move direction
      const targetAngle = Math.atan2(worldMoveX, worldMoveZ);
      this.playerGroup.rotation.y = THREE.MathUtils.lerp(this.playerGroup.rotation.y, targetAngle, 0.15);

      // Walk cycle animation
      this.walkTime += dt * 10;
      if (this.playerMeshParts.leftLeg && this.playerMeshParts.rightLeg) {
        this.playerMeshParts.leftLeg.rotation.x = Math.sin(this.walkTime) * 0.6;
        this.playerMeshParts.rightLeg.rotation.x = -Math.sin(this.walkTime) * 0.6;
      }
      if (this.playerMeshParts.leftArm && this.playerMeshParts.rightArm) {
        this.playerMeshParts.leftArm.rotation.x = -Math.sin(this.walkTime) * 0.5;
        this.playerMeshParts.rightArm.rotation.x = Math.sin(this.walkTime) * 0.5;
      }
    } else {
      // Idle leg & arm reset
      if (this.playerMeshParts.leftLeg && this.playerMeshParts.rightLeg) {
        this.playerMeshParts.leftLeg.rotation.x = THREE.MathUtils.lerp(this.playerMeshParts.leftLeg.rotation.x, 0, 0.2);
        this.playerMeshParts.rightLeg.rotation.x = THREE.MathUtils.lerp(this.playerMeshParts.rightLeg.rotation.x, 0, 0.2);
      }
      if (this.playerMeshParts.leftArm && this.playerMeshParts.rightArm) {
        this.playerMeshParts.leftArm.rotation.x = THREE.MathUtils.lerp(this.playerMeshParts.leftArm.rotation.x, 0, 0.2);
        this.playerMeshParts.rightArm.rotation.x = THREE.MathUtils.lerp(this.playerMeshParts.rightArm.rotation.x, 0, 0.2);
      }
    }

    // 2. Vertical Jump & Gravity Physics
    this.playerVelocity.y -= this.gravity * dt;
    this.playerGroup.position.y += this.playerVelocity.y * dt;

    if (this.playerGroup.position.y <= 0) {
      this.playerGroup.position.y = 0;
      this.playerVelocity.y = 0;
      this.isGrounded = true;
    }
  }

  private checkPlayerCollision(x: number, z: number): boolean {
    const playerRadius = 0.5;
    const playerMin = new THREE.Vector3(x - playerRadius, 0.2, z - playerRadius);
    const playerMax = new THREE.Vector3(x + playerRadius, 2.0, z + playerRadius);
    const playerBox = new THREE.Box3(playerMin, playerMax);

    for (const collider of this.colliders) {
      if (collider.intersectsBox(playerBox)) {
        return true;
      }
    }
    return false;
  }

  private updateCamera(dt: number) {
    // Smooth lerp distance
    this.cameraDistance = THREE.MathUtils.lerp(this.cameraDistance, this.targetCameraDistance, dt * 5);

    const targetPos = this.playerGroup.position.clone().add(new THREE.Vector3(0, 1.6, 0));

    // Ideal camera position based on yaw & pitch
    const idealOffset = new THREE.Vector3(
      Math.sin(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance,
      Math.sin(this.cameraPitch) * this.cameraDistance,
      Math.cos(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance
    );
    const idealCameraPos = targetPos.clone().add(idealOffset);

    // Raycast Camera Collision Check: ensure camera doesn't clip inside obstacles
    const rayDir = idealOffset.clone().normalize();
    this.raycaster.set(targetPos, rayDir);
    this.raycaster.far = this.cameraDistance;

    // Check intersection with scene objects or colliders
    let safeDistance = this.cameraDistance;
    for (const collider of this.colliders) {
      const ray = new THREE.Ray(targetPos, rayDir);
      const hitPoint = new THREE.Vector3();
      if (ray.intersectBox(collider, hitPoint)) {
        const dist = targetPos.distanceTo(hitPoint) - 0.4;
        if (dist > 1.0 && dist < safeDistance) {
          safeDistance = dist;
        }
      }
    }

    const finalCameraPos = targetPos.clone().add(rayDir.multiplyScalar(safeDistance));

    // Smooth Lerp Camera to final position
    this.camera.position.lerp(finalCameraPos, dt * 10);
    this.camera.lookAt(targetPos);
  }

  private checkProximityPrompts() {
    let nearest: InteractiveObjectInfo | null = null;
    let minDistance = Infinity;

    const pPos = this.playerGroup.position;

    for (const item of this.interactiveObjects) {
      if (item.collected || !item.mesh.visible) continue;

      const objPos = item.mesh.position;
      const dist = pPos.distanceTo(objPos);

      if (dist <= item.radius && dist < minDistance) {
        minDistance = dist;
        nearest = {
          id: item.id,
          name: item.name,
          promptText: item.promptText,
          category: item.category,
          distance: dist,
        };
      }
    }

    if (nearest?.id !== this.activeProximity?.id) {
      this.activeProximity = nearest;
      this.callbacks.onProximityChange(nearest);
    }
  }

  public dispose() {
    this.stop();
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.container.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    this.container.removeEventListener('wheel', this.handleWheel);
    window.removeEventListener('resize', this.handleResize);

    this.renderer.dispose();
    if (this.container && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
