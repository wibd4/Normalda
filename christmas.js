(function() {
    const style = document.createElement('style');
    style.textContent = `
        #snow-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
        }

        .ny-garland-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 50px;
            z-index: 9999;
            pointer-events: none;
        }

        .garland-wire {
            stroke: #334155;
            stroke-width: 1.5;
            fill: none;
        }

        .garland-bulb {
            animation: garlandFlash 1s infinite alternate;
            transform-origin: center;
        }

        @keyframes garlandFlash {
            0% { opacity: 0.2; filter: drop-shadow(0 0 2px cubic-bezier(0.4, 0, 0.2, 1)); }
            100% { opacity: 1; filter: drop-shadow(0 0 12px currentColor); }
        }
    `;
    document.head.appendChild(style);

    const garlandContainer = document.createElement('div');
    garlandContainer.className = 'ny-garland-container';
    document.body.appendChild(garlandContainer);

    function drawGarland() {
        const w = window.innerWidth;
        const bulbSpacing = 40; 
        const bulbsCount = Math.floor(w / bulbSpacing) + 1;
        const actualSpacing = w / (bulbsCount - 1);

        let svgContent = `<svg width="${w}" height="60" xmlns="http://w3.org">`;
        
        let wirePath = `M 0,0`;
        for (let i = 0; i < bulbsCount - 1; i++) {
            const x1 = i * actualSpacing;
            const x2 = (i + 1) * actualSpacing;
            const cx = x1 + actualSpacing / 2;
            const cy = 25; 
            wirePath += ` Q ${cx},${cy} ${x2},0`;
        }
        svgContent += `<path d="${wirePath}" class='garland-wire' />`;

        const colors = [
            { hex: '#ff0055', delay: '0s' },
            { hex: '#00ffcc', delay: '0.25s' },
            { hex: '#ffcc00', delay: '0.5s' },
            { hex: '#0099ff', delay: '0.75s' }
        ];

        for (let i = 0; i < bulbsCount; i++) {
            const x = i * actualSpacing;
            let y = 0;
            
            if (i === 0 || i === bulbsCount - 1) {
                y = 0;
            } else {
                y = 12;
            }

            const color = colors[i % colors.length];

            svgContent += `
                <g transform="translate(${x}, ${y})">
                    <rect x="-1.5" y="-1" width="3" height="3" fill="#64748b" />
                    <ellipse cx="0" cy="6" rx="4.5" ry="6.5" class="garland-bulb" style="color: ${color.hex}; fill: ${color.hex}; animation-delay: ${color.delay};" />
                </g>
            `;
        }

        svgContent += `</svg>`;
        garlandContainer.innerHTML = svgContent;
    }

    drawGarland();
    window.addEventListener('resize', drawGarland);

    const canvas = document.createElement('canvas');
    canvas.id = 'snow-canvas';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const flakes = Array.from({ length: 140 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.5 + 1,
        d: Math.random() * 1
    }));

    function drawSnow() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        for (let i = 0; i < flakes.length; i++) {
            const f = flakes[i];
            ctx.moveTo(f.x, f.y);
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
            
            f.y += Math.cos(f.d) + 1 + f.r / 2;
            f.x += Math.sin(f.d) * 0.4;

            if (f.y > height) {
                flakes[i] = { x: Math.random() * width, y: 0, r: f.r, d: f.d };
            }
        }
        ctx.fill();
        requestAnimationFrame(drawSnow);
    }
    drawSnow();
})();
