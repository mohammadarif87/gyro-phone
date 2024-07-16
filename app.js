const socket = new WebSocket('ws://192.168.0.9:8080');

const circle = document.getElementById('circle');
if (!circle) {
    console.error('Circle element not found');
}
const maxX = window.innerWidth - 50;
const maxY = window.innerHeight - 50;

let x = maxX / 2;
let y = maxY / 2;

let initialAlpha = null;
let initialBeta = null;

// threshold is the gap to check slowdown so the pointer doesn't drift off
const threshold = 0.35; 

socket.onopen = () => {
    console.log('WebSocket connection established');
};

socket.onmessage = (event) => {
    try {
        const data = event.data;
        //console.log('Data received:', data);
        const parsedData = JSON.parse(data);
        //console.log('Parsed data:', parsedData);

        // Check for reset gyro command incoming from phone.html
        if (parsedData.command === 'reset') {
            // Reset circle position to center
            x = maxX / 2;
            y = maxY / 2;

            // Reinitialize initialAlpha and initialBeta
            initialAlpha = null;
            initialBeta = null;

            // Update the circle's position
            circle.style.left = `${x}px`;
            circle.style.top = `${y}px`;
            console.log('Circle reset to center');

            return; // Exit the handler after reset
        }

        const alpha = parsedData.alpha;
        const beta = parsedData.beta;
        const gamma = parsedData.gamma;

        const xAccel = parsedData.x;
        const yAccel = parsedData.y;
        const zAccel = parsedData.z;


        // Capture initial values for calibration
        if (initialAlpha === null || initialBeta === null) {
            initialAlpha = alpha;
            initialBeta = beta;
        }

        // Adjust alpha and beta based on initial values
        const adjustedAlpha = alpha - initialAlpha;
        const adjustedBeta = beta - initialBeta;

        // The value to multiply the movement speed by
        const sensitivity = 0.5; // Increased for testing

        // Update the position based on orientation data if they are above the threshold
        if (Math.abs(adjustedAlpha) > threshold) {
            x -= adjustedAlpha * sensitivity;
        }

        if (Math.abs(adjustedBeta) > threshold) {
            y -= adjustedBeta * sensitivity;
        }

        // Keep the circle within the window boundaries
        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));

        //console.log('New position from data:', { x, y });

        // Update the circle's position
        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;
        //console.log('Circle position updated:', { left: circle.style.left, top: circle.style.top });
    } catch (error) {
        console.error('Error handling message:', error);
    }
};

socket.onerror = (error) => {
    console.log('WebSocket error:', error);
};
