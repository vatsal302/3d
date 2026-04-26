// Ensure Three.js is loaded before executing
window.addEventListener('load', () => {
    initThreeJS();
});

function initThreeJS() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true, // Transparent background
        antialias: true 
    });
    
    // Initial resize to fit parent container
    const resizeRenderer = () => {
        const width = canvas.parentElement.clientWidth;
        const height = canvas.parentElement.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };
    
    resizeRenderer();
    window.addEventListener('resize', resizeRenderer);

    // Create a group to hold our 3D objects
    const group = new THREE.Group();
    scene.add(group);

    // Geometry: Icosahedron gives a nice modern tech/finance vibe
    const geometry = new THREE.IcosahedronGeometry(2, 0);
    
    // Material: Wireframe for inner core
    const wireframeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00f3ff, 
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    
    // Material: Solid for outer structure with metallic feel
    const solidMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x111111,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0x002244,
        emissiveIntensity: 0.2
    });

    // Create meshes
    const solidMesh = new THREE.Mesh(geometry, solidMaterial);
    const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);
    wireframeMesh.scale.set(1.05, 1.05, 1.05); // Slightly larger
    
    group.add(solidMesh);
    group.add(wireframeMesh);

    // Add some orbiting particles/coins
    const particleGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32);
    const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1,
        roughness: 0.3
    });

    const particles = [];
    for (let i = 0; i < 5; i++) {
        const coin = new THREE.Mesh(particleGeo, goldMaterial);
        
        // Random initial positions and rotation speeds
        const angle = (i / 5) * Math.PI * 2;
        const radius = 3 + Math.random();
        
        coin.position.x = Math.cos(angle) * radius;
        coin.position.y = (Math.random() - 0.5) * 4;
        coin.position.z = Math.sin(angle) * radius;
        
        // Custom properties for animation
        coin.userData = {
            angle: angle,
            radius: radius,
            speed: 0.01 + Math.random() * 0.02,
            yOffset: coin.position.y,
            yPhase: Math.random() * Math.PI * 2
        };
        
        particles.push(coin);
        scene.add(coin);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f3ff, 2, 10);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0xffd700, 1.5, 10);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Mouse interaction variables
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
        
        const time = clock.getElapsedTime();

        // Smooth mouse follow
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        group.rotation.y += 0.005;
        group.rotation.x += 0.002;
        
        // Apply mouse interaction with easing
        group.rotation.y += 0.05 * (targetX - group.rotation.y);
        group.rotation.x += 0.05 * (targetY - group.rotation.x);

        // Animate particles (coins)
        particles.forEach(coin => {
            coin.userData.angle += coin.userData.speed;
            
            // Orbiting motion
            coin.position.x = Math.cos(coin.userData.angle) * coin.userData.radius;
            coin.position.z = Math.sin(coin.userData.angle) * coin.userData.radius;
            
            // Bobbing motion
            coin.position.y = coin.userData.yOffset + Math.sin(time * 2 + coin.userData.yPhase) * 0.5;
            
            // Spin
            coin.rotation.x += 0.02;
            coin.rotation.y += 0.05;
        });

        renderer.render(scene, camera);
    }

    animate();
}
