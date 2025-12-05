import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Сцена
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f5f5);
scene.fog = new THREE.Fog(0xf5f5f5, 50, 100);

// Камера
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(30, 25, 30);
camera.lookAt(0, 0, 0);

// Рендерер
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Контролы
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 15;
controls.maxDistance = 80;
controls.maxPolarAngle = Math.PI / 2.1;

// Цвета
const red = 0xEF3124;
const black = 0x000000;
const white = 0xFFFFFF;
const gray = 0xcccccc;
const darkGray = 0x666666;
const lightGray = 0xe8e8e8;
const metalGray = 0x888888;

// Материалы
const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: white,
    roughness: 0.8,
    metalness: 0.1
});

const wallMaterial = new THREE.MeshStandardMaterial({ 
    color: white,
    roughness: 0.9,
    metalness: 0.0
});

const redMaterial = new THREE.MeshStandardMaterial({ 
    color: red,
    roughness: 0.6,
    metalness: 0.3
});

const blackMaterial = new THREE.MeshStandardMaterial({ 
    color: black,
    roughness: 0.4,
    metalness: 0.7
});

const metalMaterial = new THREE.MeshStandardMaterial({ 
    color: metalGray,
    roughness: 0.3,
    metalness: 0.9
});

// Освещение
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Основное направленное освещение
const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
mainLight.position.set(15, 25, 10);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 4096;
mainLight.shadow.mapSize.height = 4096;
mainLight.shadow.camera.near = 0.5;
mainLight.shadow.camera.far = 150;
mainLight.shadow.camera.left = -40;
mainLight.shadow.camera.right = 40;
mainLight.shadow.camera.top = 40;
mainLight.shadow.camera.bottom = -40;
mainLight.shadow.bias = -0.0001;
mainLight.shadow.normalBias = 0.02;
scene.add(mainLight);

// Дополнительное освещение
const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
fillLight.position.set(-10, 15, -10);
scene.add(fillLight);

// Освещение от потолка (точечные светильники)
const spotLights = [];
for (let i = -15; i <= 15; i += 5) {
    for (let j = -10; j <= 10; j += 5) {
        const spotLight = new THREE.PointLight(0xffffff, 0.8, 20);
        spotLight.position.set(i, 6.5, j);
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 512;
        spotLight.shadow.mapSize.height = 512;
        scene.add(spotLight);
        spotLights.push(spotLight);
    }
}

// Пол с деталями
const floorSize = { width: 50, height: 35 };

// Основной пол
const floorGeometry = new THREE.PlaneGeometry(floorSize.width, floorSize.height);
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Плинтусы
const plinthHeight = 0.15;
const plinthDepth = 0.05;

function createPlinth(length, x, z, rotation) {
    const plinth = new THREE.Mesh(
        new THREE.BoxGeometry(length, plinthHeight, plinthDepth),
        blackMaterial
    );
    plinth.position.set(x, plinthHeight / 2, z);
    plinth.rotation.y = rotation;
    scene.add(plinth);
}

createPlinth(floorSize.width, 0, -floorSize.height/2, 0);
createPlinth(floorSize.width, 0, floorSize.height/2, 0);
createPlinth(floorSize.height, -floorSize.width/2, 0, Math.PI/2);
createPlinth(floorSize.height, floorSize.width/2, 0, Math.PI/2);

// Ковры в зонах
function createCarpet(x, z, width, depth, color = 0x2a2a2a) {
    const carpet = new THREE.Mesh(
        new THREE.PlaneGeometry(width, depth),
        new THREE.MeshStandardMaterial({ 
            color: color,
            roughness: 0.9,
            metalness: 0.0
        })
    );
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.set(x, 0.01, z);
    carpet.receiveShadow = true;
    scene.add(carpet);
    
    // Красная окантовка ковра
    const border = new THREE.Mesh(
        new THREE.RingGeometry(width/2 - 0.05, width/2, 32),
        redMaterial
    );
    border.rotation.x = -Math.PI / 2;
    border.position.set(x, 0.015, z);
    scene.add(border);
}

createCarpet(-6, -8, 12, 3); // Зона касс
createCarpet(0, 5, 20, 4); // Зона консультаций
createCarpet(-12, 0, 4, 6); // Зона ожидания слева
createCarpet(12, 0, 4, 6); // Зона ожидания справа

// Стены (высокие - 7 метров)
const wallHeight = 7;
const wallThickness = 0.3;

// Задняя стена
const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(floorSize.width, wallHeight, wallThickness),
    wallMaterial
);
backWall.position.set(0, wallHeight / 2, -floorSize.height/2);
backWall.castShadow = true;
backWall.receiveShadow = true;
scene.add(backWall);

// Левая стена
const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallThickness, wallHeight, floorSize.height),
    wallMaterial
);
leftWall.position.set(-floorSize.width/2, wallHeight / 2, 0);
leftWall.castShadow = true;
leftWall.receiveShadow = true;
scene.add(leftWall);

// Правая стена
const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallThickness, wallHeight, floorSize.height),
    wallMaterial
);
rightWall.position.set(floorSize.width/2, wallHeight / 2, 0);
rightWall.castShadow = true;
rightWall.receiveShadow = true;
scene.add(rightWall);

// Потолок
const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(floorSize.width, floorSize.height),
    new THREE.MeshStandardMaterial({ 
        color: 0xfafafa,
        roughness: 0.8,
        metalness: 0.1
    })
);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = wallHeight;
scene.add(ceiling);

// Светильники на потолке (визуальные элементы)
function createCeilingLight(x, z) {
    const lightGroup = new THREE.Group();
    
    // Основание светильника
    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16),
        metalMaterial
    );
    base.position.y = wallHeight - 0.05;
    lightGroup.add(base);
    
    // Стекло светильника
    const glass = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 0.05, 16),
        new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8
        })
    );
    glass.position.y = wallHeight - 0.075;
    lightGroup.add(glass);
    
    lightGroup.position.set(x, 0, z);
    scene.add(lightGroup);
}

for (let i = -20; i <= 20; i += 8) {
    for (let j = -12; j <= 12; j += 6) {
        createCeilingLight(i, j);
    }
}

// Перегородки между зонами
function createPartition(x, z, width, height, rotation = 0) {
    const partition = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, 0.1),
        new THREE.MeshStandardMaterial({ 
            color: lightGray,
            roughness: 0.7,
            metalness: 0.2
        })
    );
    partition.position.set(x, height / 2, z);
    partition.rotation.y = rotation;
    partition.castShadow = true;
    partition.receiveShadow = true;
    scene.add(partition);
    
    // Красная акцентная полоса
    const accent = new THREE.Mesh(
        new THREE.BoxGeometry(width, 0.15, 0.12),
        redMaterial
    );
    accent.position.set(x, height - 0.3, z);
    accent.rotation.y = rotation;
    scene.add(accent);
}

createPartition(-6, -5, 0.1, 2.5, 0);
createPartition(6, -5, 0.1, 2.5, 0);
createPartition(0, 0, 0.1, 2.5, Math.PI/2);

// Детальная касса
function createCashDesk(x, z, rotation = 0) {
    const group = new THREE.Group();
    
    // Основание
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.15, 1.4),
        blackMaterial
    );
    base.position.y = 0.075;
    base.castShadow = true;
    group.add(base);
    
    // Столешница
    const top = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.08, 1.4),
        new THREE.MeshStandardMaterial({ 
            color: white,
            roughness: 0.3,
            metalness: 0.1
        })
    );
    top.position.y = 0.85;
    top.castShadow = true;
    group.add(top);
    
    // Боковые панели
    const sidePanel1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.7, 1.4),
        blackMaterial
    );
    sidePanel1.position.set(-1.05, 0.5, 0);
    sidePanel1.castShadow = true;
    group.add(sidePanel1);
    
    const sidePanel2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.7, 1.4),
        blackMaterial
    );
    sidePanel2.position.set(1.05, 0.5, 0);
    sidePanel2.castShadow = true;
    group.add(sidePanel2);
    
    // Монитор
    const monitorBase = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.1, 0.3),
        blackMaterial
    );
    monitorBase.position.set(0.4, 0.9, 0);
    group.add(monitorBase);
    
    const monitorArm = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.3, 0.08),
        metalMaterial
    );
    monitorArm.position.set(0.4, 1.15, 0);
    group.add(monitorArm);
    
    const screen = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.5, 0.05),
        new THREE.MeshStandardMaterial({ 
            color: 0x1a1a1a,
            emissive: 0x222222,
            emissiveIntensity: 0.3
        })
    );
    screen.position.set(0.4, 1.4, 0);
    screen.castShadow = true;
    group.add(screen);
    
    // Красная акцентная полоса
    const accent = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.12, 0.08),
        redMaterial
    );
    accent.position.set(0, 0.89, 0.7);
    group.add(accent);
    
    // Клавиатура
    const keyboard = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.02, 0.2),
        blackMaterial
    );
    keyboard.position.set(-0.3, 0.87, 0.3);
    group.add(keyboard);
    
    // Сканер документов
    const scanner = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.1, 0.2),
        blackMaterial
    );
    scanner.position.set(-0.7, 0.87, 0.3);
    group.add(scanner);
    
    // Принтер/терминал
    const printer = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.15, 0.25),
        blackMaterial
    );
    printer.position.set(0.8, 0.9, 0.3);
    group.add(printer);
    
    // Стул сотрудника
    const chair = createOfficeChair();
    chair.position.set(0, 0, -0.8);
    group.add(chair);
    
    group.position.set(x, 0, z);
    group.rotation.y = rotation;
    return group;
}

// Функция создания офисного стула
function createOfficeChair() {
    const group = new THREE.Group();
    
    // Сиденье
    const seat = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.08, 0.5),
        new THREE.MeshStandardMaterial({ color: black, roughness: 0.6 })
    );
    seat.position.y = 0.45;
    seat.castShadow = true;
    group.add(seat);
    
    // Спинка
    const back = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.6, 0.08),
        new THREE.MeshStandardMaterial({ color: black, roughness: 0.6 })
    );
    back.position.set(0, 0.75, -0.21);
    back.castShadow = true;
    group.add(back);
    
    // Ножки (5-лучевая база)
    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.05, 5),
        metalMaterial
    );
    base.position.y = 0.025;
    base.rotation.z = Math.PI / 2;
    group.add(base);
    
    // Колесики
    for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5;
        const wheel = new THREE.Mesh(
            new THREE.SphereGeometry(0.03, 8, 8),
            blackMaterial
        );
        wheel.position.set(
            Math.cos(angle) * 0.12,
            0.01,
            Math.sin(angle) * 0.12
        );
        group.add(wheel);
    }
    
    return group;
}

// Создание касс
const cashDesk1 = createCashDesk(-9, -8, 0);
scene.add(cashDesk1);

const cashDesk2 = createCashDesk(-3, -8, 0);
scene.add(cashDesk2);

const cashDesk3 = createCashDesk(3, -8, 0);
scene.add(cashDesk3);

const cashDesk4 = createCashDesk(9, -8, 0);
scene.add(cashDesk4);

// Детальный стол консультанта
function createConsultationTable(x, z) {
    const group = new THREE.Group();
    
    // Столешница
    const table = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.1, 1.2),
        new THREE.MeshStandardMaterial({ 
            color: white,
            roughness: 0.4,
            metalness: 0.1
        })
    );
    table.position.y = 0.45;
    table.castShadow = true;
    group.add(table);
    
    // Ножки (металлические)
    const legGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.45, 16);
    const legPositions = [
        [-0.8, 0.225, -0.5],
        [0.8, 0.225, -0.5],
        [-0.8, 0.225, 0.5],
        [0.8, 0.225, 0.5]
    ];
    
    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, metalMaterial);
        leg.position.set(...pos);
        leg.castShadow = true;
        group.add(leg);
    });
    
    // Планшет на столе
    const tablet = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.025, 0.45),
        new THREE.MeshStandardMaterial({ 
            color: black,
            roughness: 0.3,
            metalness: 0.5
        })
    );
    tablet.position.set(0.3, 0.48, 0);
    tablet.rotation.x = -0.25;
    group.add(tablet);
    
    // Экран планшета (свечение)
    const tabletScreen = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.001, 0.42),
        new THREE.MeshStandardMaterial({ 
            color: 0x1a1a1a,
            emissive: 0x4444ff,
            emissiveIntensity: 0.4
        })
    );
    tabletScreen.position.set(0.3, 0.482, 0);
    tabletScreen.rotation.x = -0.25;
    group.add(tabletScreen);
    
    // Стулья
    const chair1 = createOfficeChair();
    chair1.position.set(-0.6, 0, -0.9);
    group.add(chair1);
    
    const chair2 = createOfficeChair();
    chair2.position.set(0.6, 0, -0.9);
    group.add(chair2);
    
    // Кофейный столик рядом
    const coffeeTable = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 0.05, 16),
        new THREE.MeshStandardMaterial({ 
            color: black,
            roughness: 0.4,
            metalness: 0.6
        })
    );
    coffeeTable.position.set(0, 0.25, 1.2);
    coffeeTable.castShadow = true;
    group.add(coffeeTable);
    
    group.position.set(x, 0, z);
    return group;
}

// Столы консультантов
const table1 = createConsultationTable(-12, 6);
scene.add(table1);

const table2 = createConsultationTable(-4, 6);
scene.add(table2);

const table3 = createConsultationTable(4, 6);
scene.add(table3);

const table4 = createConsultationTable(12, 6);
scene.add(table4);

// Детальные диваны
function createSofa(x, z, rotation = 0) {
    const group = new THREE.Group();
    
    // Основание
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.15, 0.7),
        new THREE.MeshStandardMaterial({ color: black, roughness: 0.7 })
    );
    base.position.y = 0.075;
    base.castShadow = true;
    group.add(base);
    
    // Сиденье
    const seat = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.2, 0.7),
        redMaterial
    );
    seat.position.y = 0.25;
    seat.castShadow = true;
    group.add(seat);
    
    // Спинка
    const back = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.9, 0.12),
        redMaterial
    );
    back.position.set(0, 0.7, -0.29);
    back.castShadow = true;
    group.add(back);
    
    // Подлокотники
    const armrest1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.5, 0.7),
        blackMaterial
    );
    armrest1.position.set(-0.74, 0.5, 0);
    armrest1.castShadow = true;
    group.add(armrest1);
    
    const armrest2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.5, 0.7),
        blackMaterial
    );
    armrest2.position.set(0.74, 0.5, 0);
    armrest2.castShadow = true;
    group.add(armrest2);
    
    // Подушки (декоративные)
    const pillow1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.15, 0.6),
        new THREE.MeshStandardMaterial({ 
            color: 0xcc0000,
            roughness: 0.8
        })
    );
    pillow1.position.set(-0.3, 0.35, 0);
    group.add(pillow1);
    
    const pillow2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.15, 0.6),
        new THREE.MeshStandardMaterial({ 
            color: 0xcc0000,
            roughness: 0.8
        })
    );
    pillow2.position.set(0.3, 0.35, 0);
    group.add(pillow2);
    
    group.position.set(x, 0, z);
    group.rotation.y = rotation;
    return group;
}

// Диваны в зоне ожидания
const sofas = [
    [-14, -3, 0], [-14, 0, 0], [-14, 3, 0],
    [14, -3, Math.PI], [14, 0, Math.PI], [14, 3, Math.PI]
];

sofas.forEach(([x, z, rot]) => {
    scene.add(createSofa(x, z, rot));
});

// Кофейные столики между диванами
function createCoffeeTable(x, z) {
    const group = new THREE.Group();
    
    const top = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 0.05, 16),
        new THREE.MeshStandardMaterial({ 
            color: black,
            roughness: 0.3,
            metalness: 0.7
        })
    );
    top.position.y = 0.4;
    top.castShadow = true;
    group.add(top);
    
    const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.4, 16),
        metalMaterial
    );
    leg.position.y = 0.2;
    group.add(leg);
    
    group.position.set(x, 0, z);
    return group;
}

createCoffeeTable(-14, -1.5);
createCoffeeTable(-14, 1.5);
createCoffeeTable(14, -1.5);
createCoffeeTable(14, 1.5);

// Растения (декоративные)
function createPlant(x, z) {
    const group = new THREE.Group();
    
    // Горшок
    const pot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.12, 0.2, 16),
        new THREE.MeshStandardMaterial({ 
            color: black,
            roughness: 0.6
        })
    );
    pot.position.y = 0.1;
    pot.castShadow = true;
    group.add(pot);
    
    // Растение (упрощенное)
    const plant = new THREE.Mesh(
        new THREE.ConeGeometry(0.2, 0.4, 8),
        new THREE.MeshStandardMaterial({ 
            color: 0x2d5016,
            roughness: 0.9
        })
    );
    plant.position.y = 0.4;
    plant.castShadow = true;
    group.add(plant);
    
    group.position.set(x, 0, z);
    return group;
}

createPlant(-18, -10);
createPlant(-18, 10);
createPlant(18, -10);
createPlant(18, 10);
createPlant(0, -12);

// Интерактивные экраны на стенах (детальные)
function createScreen(x, y, z, rotation = 0, size = { w: 2.5, h: 1.5 }) {
    const group = new THREE.Group();
    
    // Экран
    const screen = new THREE.Mesh(
        new THREE.BoxGeometry(size.w, size.h, 0.08),
        new THREE.MeshStandardMaterial({ 
            color: 0x0a0a0a,
            emissive: 0x222222,
            emissiveIntensity: 0.5
        })
    );
    screen.position.set(0, 0, 0);
    screen.castShadow = true;
    group.add(screen);
    
    // Красная рамка
    const frame = new THREE.Mesh(
        new THREE.BoxGeometry(size.w + 0.1, size.h + 0.1, 0.1),
        redMaterial
    );
    frame.position.set(0, 0, -0.01);
    group.add(frame);
    
    // Крепление к стене
    const mount = new THREE.Mesh(
        new THREE.BoxGeometry(size.w + 0.2, 0.15, 0.15),
        metalMaterial
    );
    mount.position.set(0, -size.h/2 - 0.1, 0.08);
    group.add(mount);
    
    group.position.set(x, y, z);
    group.rotation.y = rotation;
    scene.add(group);
}

createScreen(-18, 3.5, -17.4, 0, { w: 3, h: 2 });
createScreen(18, 3.5, -17.4, 0, { w: 3, h: 2 });
createScreen(0, 4, -17.4, 0, { w: 4, h: 2.5 });
createScreen(-18, 3.5, 17.4, Math.PI, { w: 2.5, h: 1.8 });
createScreen(18, 3.5, 17.4, Math.PI, { w: 2.5, h: 1.8 });

// Детальные терминалы самообслуживания
function createTerminal(x, z) {
    const group = new THREE.Group();
    
    // Основание
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.2, 0.8),
        blackMaterial
    );
    base.position.y = 0.1;
    base.castShadow = true;
    group.add(base);
    
    // Корпус
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 1.8, 0.7),
        blackMaterial
    );
    body.position.y = 1;
    body.castShadow = true;
    group.add(body);
    
    // Экран
    const screen = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.5, 0.05),
        new THREE.MeshStandardMaterial({ 
            color: 0x1a1a1a,
            emissive: 0x333333,
            emissiveIntensity: 0.4
        })
    );
    screen.position.set(0, 1.5, 0.35);
    group.add(screen);
    
    // Красная акцентная полоса
    const accent = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.15, 0.08),
        redMaterial
    );
    accent.position.set(0, 0.3, 0.35);
    group.add(accent);
    
    // Клавиатура/тачпад
    const touchpad = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.05, 0.3),
        new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            roughness: 0.2,
            metalness: 0.8
        })
    );
    touchpad.position.set(0, 0.8, 0.35);
    group.add(touchpad);
    
    // Принтер/выдача документов
    const printer = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.2, 0.25),
        blackMaterial
    );
    printer.position.set(0.3, 0.5, 0.35);
    group.add(printer);
    
    group.position.set(x, 0, z);
    return group;
}

const terminals = [
    [-18, 10], [-12, 10], [12, 10], [18, 10]
];

terminals.forEach(([x, z]) => {
    scene.add(createTerminal(x, z));
});

// Детальный ресепшн
const receptionGroup = new THREE.Group();

// Основание
const receptionBase = new THREE.Mesh(
    new THREE.BoxGeometry(5, 0.2, 2),
    blackMaterial
);
receptionBase.position.y = 0.1;
receptionBase.castShadow = true;
receptionGroup.add(receptionBase);

// Столешница
const receptionTop = new THREE.Mesh(
    new THREE.BoxGeometry(5, 0.1, 2),
    new THREE.MeshStandardMaterial({ 
        color: white,
        roughness: 0.3,
        metalness: 0.1
    })
);
receptionTop.position.y = 1.1;
receptionTop.castShadow = true;
receptionGroup.add(receptionTop);

// Фасад
const receptionFront = new THREE.Mesh(
    new THREE.BoxGeometry(5, 1, 0.1),
    new THREE.MeshStandardMaterial({ 
        color: white,
        roughness: 0.6
    })
);
receptionFront.position.set(0, 0.6, 1);
receptionFront.castShadow = true;
receptionGroup.add(receptionFront);

// Красная акцентная полоса
const receptionAccent = new THREE.Mesh(
    new THREE.BoxGeometry(5.2, 0.2, 0.15),
    redMaterial
);
receptionAccent.position.set(0, 1.15, 0.95);
receptionGroup.add(receptionAccent);

// Биометрический сканер (детальный)
const scannerBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.15, 16),
    metalMaterial
);
scannerBase.position.set(0, 0.6, 1.1);
scannerBase.rotation.x = Math.PI / 2;
receptionGroup.add(scannerBase);

const scannerTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.05, 16),
    new THREE.MeshStandardMaterial({ 
        color: 0x1a1a1a,
        emissive: 0x00ff00,
        emissiveIntensity: 0.3
    })
);
scannerTop.position.set(0, 0.625, 1.1);
scannerTop.rotation.x = Math.PI / 2;
receptionGroup.add(scannerTop);

// Табло с номерами очереди
const queueDisplay = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.8, 0.1),
    new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        emissive: 0xff0000,
        emissiveIntensity: 0.6
    })
);
queueDisplay.position.set(1.8, 1.5, 0.95);
receptionGroup.add(queueDisplay);

receptionGroup.position.set(0, 0, 15);
scene.add(receptionGroup);

// Логотип и вывески на стенах
function createSign(x, y, z, width, height, text = "", rotation = 0) {
    const group = new THREE.Group();
    
    // Фон вывески
    const background = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, 0.1),
        redMaterial
    );
    background.position.set(0, 0, 0);
    group.add(background);
    
    // Белая полоса для текста
    const textArea = new THREE.Mesh(
        new THREE.BoxGeometry(width - 0.2, height * 0.4, 0.11),
        new THREE.MeshStandardMaterial({ color: white })
    );
    textArea.position.set(0, 0, 0.01);
    group.add(textArea);
    
    group.position.set(x, y, z);
    group.rotation.y = rotation;
    scene.add(group);
}

// Главный логотип
createSign(0, 5, -17.4, 6, 1.5, "", 0);

// Вывески зон
createSign(-6, 1.5, -17.3, 2, 0.6, "", 0);
createSign(6, 1.5, -17.3, 2, 0.6, "", 0);
createSign(-18, 2, -17.3, 1.5, 0.5, "", 0);
createSign(18, 2, -17.3, 1.5, 0.5, "", 0);

// Шкафы и стеллажи
function createCabinet(x, z, width, height, depth) {
    const group = new THREE.Group();
    
    const cabinet = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        new THREE.MeshStandardMaterial({ 
            color: white,
            roughness: 0.7,
            metalness: 0.1
        })
    );
    cabinet.position.y = height / 2;
    cabinet.castShadow = true;
    cabinet.receiveShadow = true;
    group.add(cabinet);
    
    // Ручки
    const handle = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.02, 0.05),
        metalMaterial
    );
    handle.position.set(width/2 - 0.1, height/2, depth/2 + 0.01);
    group.add(handle);
    
    group.position.set(x, 0, z);
    return group;
}

scene.add(createCabinet(-22, 0, 0.8, 2, 0.6));
scene.add(createCabinet(22, 0, 0.8, 2, 0.6));

// Переговорные комнаты (стеклянные перегородки)
function createMeetingRoom(x, z, width, depth) {
    const group = new THREE.Group();
    
    // Пол переговорной
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(width, depth),
        new THREE.MeshStandardMaterial({ 
            color: 0x2a2a2a,
            roughness: 0.8
        })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.01;
    floor.receiveShadow = true;
    group.add(floor);
    
    // Стеклянные стены
    const glassMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1,
        metalness: 0.8
    });
    
    const wall1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 2.5, depth),
        glassMaterial
    );
    wall1.position.set(-width/2, 1.25, 0);
    group.add(wall1);
    
    const wall2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 2.5, depth),
        glassMaterial
    );
    wall2.position.set(width/2, 1.25, 0);
    group.add(wall2);
    
    const wall3 = new THREE.Mesh(
        new THREE.BoxGeometry(width, 2.5, 0.05),
        glassMaterial
    );
    wall3.position.set(0, 1.25, -depth/2);
    group.add(wall3);
    
    // Металлические рамы
    const frameMaterial = metalMaterial;
    const frameThickness = 0.05;
    
    // Вертикальные рамы
    for (let i = -1; i <= 1; i += 2) {
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(frameThickness, 2.5, depth),
            frameMaterial
        );
        frame.position.set(i * width/2, 1.25, 0);
        group.add(frame);
    }
    
    // Горизонтальные рамы
    const topFrame = new THREE.Mesh(
        new THREE.BoxGeometry(width, frameThickness, depth),
        frameMaterial
    );
    topFrame.position.set(0, 2.5, 0);
    group.add(topFrame);
    
    // Стол в переговорной
    const table = new THREE.Mesh(
        new THREE.BoxGeometry(width * 0.7, 0.1, depth * 0.6),
        new THREE.MeshStandardMaterial({ 
            color: white,
            roughness: 0.4
        })
    );
    table.position.set(0, 0.45, 0);
    table.castShadow = true;
    group.add(table);
    
    // Стулья вокруг стола
    for (let i = -1; i <= 1; i += 2) {
        for (let j = -1; j <= 1; j += 2) {
            const chair = createOfficeChair();
            chair.position.set(i * width * 0.25, 0, j * depth * 0.2);
            group.add(chair);
        }
    }
    
    group.position.set(x, 0, z);
    return group;
}

scene.add(createMeetingRoom(-22, -10, 4, 3));
scene.add(createMeetingRoom(22, -10, 4, 3));

// Дверные проемы
function createDoorway(x, z, width, height) {
    const group = new THREE.Group();
    
    // Дверная коробка
    const frame = new THREE.Mesh(
        new THREE.BoxGeometry(width + 0.2, height + 0.2, 0.3),
        metalMaterial
    );
    frame.position.y = height / 2;
    group.add(frame);
    
    // Дверь
    const door = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, 0.1),
        new THREE.MeshStandardMaterial({ 
            color: white,
            roughness: 0.6
        })
    );
    door.position.set(0, height / 2, 0.1);
    door.castShadow = true;
    group.add(door);
    
    // Ручка двери
    const handle = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.02, 0.05),
        metalMaterial
    );
    handle.position.set(width/2 - 0.15, height/2, 0.15);
    group.add(handle);
    
    group.position.set(x, 0, z);
    return group;
}

// Входная дверь
const mainDoor = createDoorway(0, 17, 2, 2.5);
scene.add(mainDoor);

// Функции управления видом
window.setView = function(view) {
    switch(view) {
        case 'top':
            camera.position.set(0, 50, 0.1);
            camera.lookAt(0, 0, 0);
            break;
        case 'side':
            camera.position.set(0, 15, 45);
            camera.lookAt(0, 3, 0);
            break;
        case 'iso':
            camera.position.set(35, 28, 35);
            camera.lookAt(0, 2, 0);
            break;
    }
    controls.update();
};

window.resetCamera = function() {
    camera.position.set(30, 25, 30);
    camera.lookAt(0, 2, 0);
    controls.reset();
};

// Анимация
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

