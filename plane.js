// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xeeeeee);
document.body.appendChild(renderer.domElement);

// Websocket Setup
const socket = new WebSocket('ws://192.168.0.9:8080');

socket.onopen = () => {
    console.log('WebSocket connection established');
};

socket.onmessage = (event) => {
    try {
        const data = event.data;
        const parsedData = JSON.parse(data);

        const alpha = parsedData.alpha;
        const beta = parsedData.beta;
        const gamma = parsedData.gamma;

        // Rotate the plane based on alpha, beta, and gamma values
        rotatePlane(alpha +alpha, beta, gamma);

        if (parsedData.command === 'reset') {
            // Send a message to phone.html to refresh
            socket.send(JSON.stringify({ command: 'refreshPhone' }));
        }
    } catch (error) {
        console.error('Error handling message:', error);
    }
};

socket.onerror = (error) => {
    console.log('WebSocket error:', error);
};


// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

let plane;

// Load the MTL file
const mtlLoader = new THREE.MTLLoader();
mtlLoader.load('./3dplane/piper_pa18.mtl', (materials) => {
    materials.preload();

    // Load the OBJ file
    const objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('./3dplane/piper_pa18.obj', (object) => {
        //object.rotation.y = Math.PI; // rotate by 180 degrees
        scene.add(object); // add the plane to the scene
        plane = object; // assign the loaded plane object to a variable for reference
        animate();
    });
});

camera.position.z = 5;
camera.position.y = 2;

// Function to rotate the plane based on alpha, beta, gamma values
function rotatePlane(alpha, beta, gamma) {
    // Convert degrees to radians for Three.js rotation
    const radAlpha = THREE.MathUtils.degToRad(alpha);
    const radBeta = THREE.MathUtils.degToRad(beta);
    const radGamma = THREE.MathUtils.degToRad(gamma);

    // Update plane rotation
    plane.rotation.x = radBeta; // Pitch
    plane.rotation.y = radAlpha; // Yaw
    plane.rotation.z = radGamma; // Roll

    // Ensure the rotation is updated
    renderer.render(scene, camera);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
// animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


