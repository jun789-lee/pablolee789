/**
 * Three.js Solar System Implementation v2
 * Features: OrbitControls, Connection Lines, Recency Twinkle, Nebula Background
 */

class SolarSystem {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.tooltip = document.getElementById('tooltip');

        // Scene Setup
        this.scene = new THREE.Scene();
        // Darker fog for depth, but lighter "nebula" background via CSS/Texture
        this.scene.fog = new THREE.FogExp2(0x050510, 0.0015);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 40, 80);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 20;
        this.controls.maxDistance = 150;
        this.controls.maxPolarAngle = Math.PI / 2 + 0.2; // Don't go too far below grid

        // Interaction
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.mouseWorld = new THREE.Vector3();

        this.planets = [];
        this.satellites = [];
        this.gridVertices = [];

        this.init();
    }

    async init() {
        this.createLights();
        this.createBackground(); // Stars + Nebula
        this.createGravityGrid();
        await this.createSolarSystem();

        this.addEventListeners();
        this.animate();
    }

    createLights() {
        const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
        this.scene.add(ambientLight);

        // Central Sun Light
        const pointLight = new THREE.PointLight(0xffddaa, 2, 150);
        pointLight.position.set(0, 0, 0);
        this.scene.add(pointLight);

        // Color glow lights for atmosphere
        const blueLight = new THREE.PointLight(0x00ffff, 1, 100);
        blueLight.position.set(30, 10, 30);
        this.scene.add(blueLight);

        const purpleLight = new THREE.PointLight(0xbd00ff, 1, 100);
        purpleLight.position.set(-30, 10, -30);
        this.scene.add(purpleLight);
    }

    createBackground() {
        // 1. Stars
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        for (let i = 0; i < 3000; i++) {
            vertices.push(
                (Math.random() - 0.5) * 400,
                (Math.random() - 0.5) * 400,
                (Math.random() - 0.5) * 400
            );
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2, transparent: true, opacity: 0.6 });
        const stars = new THREE.Points(geometry, material);
        this.scene.add(stars);

        // 2. Central Glow (Nebula Stub)
        const spriteMaterial = new THREE.SpriteMaterial({
            map: this.createGlowTexture(),
            color: 0x222244,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(100, 100, 1);
        sprite.position.y = -10;
        this.scene.add(sprite);
    }

    createGlowTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.5, 'rgba(100,100,255,0.5)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    createGravityGrid() {
        const size = 200;
        const divisions = 50;

        this.gridGeo = new THREE.PlaneGeometry(size, size, divisions, divisions);

        // Store original positions
        const pos = this.gridGeo.attributes.position;
        this.originalGridPositions = [];

        for (let i = 0; i < pos.count; i++) {
            this.originalGridPositions.push({
                x: pos.getX(i),
                y: pos.getY(i),
                z: pos.getZ(i)
            });
        }

        const material = new THREE.LineBasicMaterial({
            color: 0x4444ff,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending
        });

        const grid = new THREE.LineSegments(new THREE.WireframeGeometry(this.gridGeo), material);
        grid.rotation.x = -Math.PI / 2;
        grid.position.y = -15;
        this.scene.add(grid);
        this.gridMesh = grid;

        this.planeMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(300, 300),
            new THREE.MeshBasicMaterial({ visible: false })
        );
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -15;
        this.scene.add(this.planeMesh);
    }

    getTwinkleFactor(dateStr) {
        if (!dateStr) return { speed: 1, intensity: 0.5, color: 0xaaaaaa };
        const date = new Date(dateStr);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 30) return { speed: 8, intensity: 1.0, color: 0xffffff };
        if (diffDays < 90) return { speed: 4, intensity: 0.7, color: 0xddddff };
        return { speed: 1.5, intensity: 0.4, color: 0xaaaaaa };
    }

    async createSolarSystem() {
        const projects = await this.loadJSON('data/projects.json');
        const posts = await this.loadJSON('data/posts.json');

        this.createPlanetSystem({
            name: 'Portfolio',
            color: 0x00ffff,
            distance: 30,
            orbitSpeed: 0.004,
            size: 4,
            url: 'portfolio.html',
            satellites: projects
        });

        this.createPlanetSystem({
            name: 'Essay',
            color: 0xbd00ff,
            distance: 50,
            orbitSpeed: 0.0025,
            size: 3.5,
            url: 'blog.html',
            satellites: posts
        });
    }

    createPlanetSystem(config) {
        const orbitGroup = new THREE.Group();
        this.scene.add(orbitGroup);

        const orbitCurve = new THREE.EllipseCurve(0, 0, config.distance, config.distance, 0, 2 * Math.PI, false, 0);
        const orbitPoints = orbitCurve.getPoints(100);
        const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
        const orbitMat = new THREE.LineBasicMaterial({ color: config.color, opacity: 0.15, transparent: true });
        const orbitLine = new THREE.Line(orbitGeo, orbitMat);
        orbitLine.rotation.x = -Math.PI / 2;
        this.scene.add(orbitLine);

        const planetPivot = new THREE.Group();
        orbitGroup.add(planetPivot);

        const geometry = new THREE.IcosahedronGeometry(config.size, 2);
        const material = new THREE.MeshStandardMaterial({
            color: config.color,
            emissive: config.color,
            emissiveIntensity: 0.4,
            roughness: 0.6,
            metalness: 0.3,
            flatShading: true
        });
        const planet = new THREE.Mesh(geometry, material);
        planet.position.x = config.distance;
        planet.userData = { type: 'planet', url: config.url, name: config.name };
        planetPivot.add(planet);
        this.planets.push(planet);

        const satelliteGroup = new THREE.Group();
        planet.add(satelliteGroup);

        config.satellites.forEach((item, index) => {
            const twinkle = this.getTwinkleFactor(item.date);
            const satDist = config.size + 3 + (index * 0.8) + (Math.random() * 2);
            const angle = (index / config.satellites.length) * Math.PI * 2 + (Math.random());

            const satGeo = new THREE.SphereGeometry(0.5 + (twinkle.intensity * 0.2), 8, 8);
            const satMat = new THREE.MeshStandardMaterial({
                color: twinkle.color,
                emissive: twinkle.color,
                emissiveIntensity: twinkle.intensity
            });
            const sat = new THREE.Mesh(satGeo, satMat);

            const x = Math.cos(angle) * satDist;
            const z = Math.sin(angle) * satDist;
            const y = Math.sin(angle * 2) * 2;
            sat.position.set(x, y, z);

            sat.userData = {
                type: 'satellite',
                title: item.title,
                desc: item.description || item.summary,
                link: item.link || (item.file ? `post.html?id=${item.id}` : '#'),
                orbitSpeed: 0.01 + Math.random() * 0.02,
                twinkleSpeed: twinkle.speed,
                baseIntensity: twinkle.intensity,
                angle: angle,
                distance: satDist,
                date: item.date
            };

            const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z)];
            const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
            const lineMat = new THREE.LineBasicMaterial({ color: config.color, transparent: true, opacity: 0.2 });
            const line = new THREE.Line(lineGeo, lineMat);

            satelliteGroup.add(line);
            satelliteGroup.add(sat);
            sat.userData.line = line;
            this.satellites.push(sat);
        });

        config.pivot = planetPivot;
        config.satGroup = satelliteGroup;
        config.speed = config.orbitSpeed;
        this.planets.push(config);
    }

    async loadJSON(path) {
        try {
            const res = await fetch(path);
            return await res.json();
        } catch { return []; }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        this.planets.forEach(p => {
            if (p.pivot) {
                p.pivot.rotation.y += p.speed;
                if (p.satGroup) {
                    p.satGroup.rotation.y -= 0.01;
                    p.satGroup.children.forEach(child => {
                        if (child.userData.type === 'satellite') {
                            const data = child.userData;
                            if (child.material) {
                                child.material.emissiveIntensity = data.baseIntensity + Math.sin(time * data.twinkleSpeed * 3) * 0.3;
                            }
                        }
                    });
                }
            }
        });

        this.checkIntersections();
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    checkIntersections() {
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const objects = [];
        this.planets.forEach(p => {
            if (p.pivot) {
                p.pivot.children.forEach(planetObj => {
                    if (planetObj.userData.type === 'planet') objects.push(planetObj);
                    planetObj.children.forEach(satGroup => {
                        satGroup.children.forEach(sat => {
                            if (sat.userData.type === 'satellite') objects.push(sat);
                        })
                    })
                });
            }
        });

        const intersects = this.raycaster.intersectObjects(objects);

        if (intersects.length > 0) {
            const obj = intersects[0].object;
            document.body.style.cursor = 'pointer';

            if (obj.userData.type === 'satellite') {
                const worldPos = new THREE.Vector3();
                obj.getWorldPosition(worldPos);
                this.showTooltip(worldPos, obj.userData);
            } else if (obj.userData.type === 'planet') {
                const worldPos = new THREE.Vector3();
                obj.getWorldPosition(worldPos);
                this.showTooltip(worldPos, {
                    title: obj.userData.name,
                    desc: 'Click to explore category'
                });
            }
        } else {
            document.body.style.cursor = 'default';
            this.hideTooltip();
        }
    }

    showTooltip(pos, data) {
        const vector = pos.clone();
        vector.project(this.camera);

        const x = (vector.x * .5 + .5) * window.innerWidth;
        const y = (-(vector.y * .5) + .5) * window.innerHeight;

        this.tooltip.style.left = `${x}px`;
        this.tooltip.style.top = `${y}px`;
        this.tooltip.innerHTML = `
      <h3>${data.title}</h3>
      <p>${data.desc}</p>
      ${data.date ? `<small>${data.date}</small>` : ''}
    `;
        this.tooltip.style.opacity = 1;
    }

    hideTooltip() {
        this.tooltip.style.opacity = 0;
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('click', () => {
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const objects = [];
            this.scene.traverse(child => {
                if (child.userData.type) objects.push(child);
            });

            const intersects = this.raycaster.intersectObjects(objects);
            if (intersects.length > 0) {
                const obj = intersects[0].object;
                if (obj.userData.link && obj.userData.link !== '#') window.location.href = obj.userData.link;
                if (obj.userData.url) window.location.href = obj.userData.url;
            }
        });
    }
}

new SolarSystem();
