// --- Color Changing Protocol ---
const colors = ['#00f3ff', '#00ff88', '#ff0000', '#00ffff', '#ff00ff'];

function changeColor() {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    document.documentElement.style.setProperty('--header-text', newColor);
    document.documentElement.style.setProperty('--primary', newColor);
}

// --- Status Updates ---
const statusMessages = [
    "Calibrating pizza oven...",
    "Breeding code hamsters...",
    "Reversing polarity...",
    "Defragmenting dad jokes...",
    "Herding cats...",
    "Dividing by zero...",
    "Rewriting history...",
    "Downloading more RAM...",
    "Consulting the magic 8-ball...",
    "Asking Stack Overflow..."
];

function updateStatus() {
    const statusElement = document.getElementById('randomStatus');
    if (statusElement) {
        statusElement.textContent = `> System Status: ${statusMessages[Math.floor(Math.random() * statusMessages.length)]}`;
    }
}

setInterval(updateStatus, 3000);

// --- Navigation ---
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// --- Form Handling ---
let canSubmit = true;

function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit) return false;

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (name && email && message) {
        const subject = encodeURIComponent('Message from BitWise Games Contact Form');
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\n${message}`
        ).replace(/%20/g, ' '); 
        
        const mailtoLink = `mailto:bitwisevault@gmail.com?subject=${subject}&body=${body}`;
        window.location.href = mailtoLink;
        
        canSubmit = false;
        const submitBtn = document.getElementById('submitBtn');
        const formStatus = document.getElementById('formStatus');
        
        if (submitBtn) submitBtn.disabled = true;
        if (formStatus) {
            formStatus.style.display = 'block';
            formStatus.textContent = 'Message launched! Cooldown initiated...';
        }

        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }
    return false;
}

// --- Canvas & Particles Logic ---
(function() {
    const canvas = document.getElementById('gridCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 150;
    const mouse = { x: null, y: null, radius: 100 };

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawGrid();
    }

    // Grid drawing function
    function drawGrid() {
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.1)';
        ctx.lineWidth = 0.5;
        
        // Vertical lines
        for(let x = 0; x < canvas.width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // Horizontal lines
        for(let y = 0; y < canvas.height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 10) + 2;
        }
        
        draw() {
            ctx.fillStyle = 'rgba(0, 243, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        
        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;
            
            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.baseX - this.x;
                    this.x += dx / 10;
                }
                if (this.y !== this.baseY) {
                    let dy = this.baseY - this.y;
                    this.y += dy / 10;
                }
            }
        }
    }

    // Initialize particles
    function init() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }

    // Mouse position tracker
    window.addEventListener('mousemove', function(e) {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    // Reset mouse position when leaving canvas
    window.addEventListener('mouseout', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        resizeCanvas();
        init();
    });

    // Touch support for particle effect
    window.addEventListener('touchmove', function(e) {
        if(e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    });

    window.addEventListener('touchend', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    // Start everything
    resizeCanvas();
    init();
    animate();
})();