function Tailspinner(spinner){
    var canvas = null,
        context = null,
        width = null,
        height = null;

    var arcRadius = null,
        position = 0,
        color = null,
        direction = null,
        opacity = null,
        speed = null;

    var shrinkValue = null,
        defaultParticleSize = null,
        backgroundStroke = null,
        backgroundStrokeColor = null,
        backgroundStrokeWidth = null,
        fadeoutValue = null,
        particleNumber = null;

    var particles = [];

    var ratio = null;

    init(spinner);

    function init (spinner) {
        setEnviroment(spinner);
        standardOptions(spinner);
        specificOptions(spinner);
        createParticles();
        clearCanvas();
    }

    function setEnviroment (spinner) {
        var container = document.getElementById(spinner.setup.containerId);
        canvas = document.getElementById(spinner.setup.canvasId);
        context = canvas.getContext('2d');
        retinaDimensions(container);
    }

    function retinaDimensions (container) {
        var devicePixelRatio = window.devicePixelRatio || 1,
            backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
        ratio = devicePixelRatio / backingStoreRatio;
        width = canvas.width = container.offsetWidth * ratio;
        height = canvas.height = container.offsetHeight * ratio;
        canvas.style.width = width / ratio + 'px';
        canvas.style.height = height / ratio + 'px';
    }

    function standardOptions (spinner) {
        arcRadius = spinner.options.radius ? spinner.options.radius : 15;
        speed = spinner.options.speed ? spinner.options.speed : 0.1;
        color = spinner.options.color ? spinner.options.color : '#4b4b4b';
        direction = spinner.options.direction ? spinner.options.direction : 'right';
        opacity = spinner.options.opacity ? spinner.options.opacity : 1;
    }

    function specificOptions (spinner) {
        defaultParticleSize = spinner.advancedOptions.particleSize ? spinner.advancedOptions.particleSize : 4;
        shrinkValue = spinner.advancedOptions.shrinkValue ? spinner.advancedOptions.shrinkValue : 0.05;
        fadeoutValue = spinner.advancedOptions.fadeoutValue ? spinner.advancedOptions.fadeoutValue : 0.05;
        particleNumber = spinner.advancedOptions.particles ? spinner.advancedOptions.particles : 40;
        backgroundStroke = spinner.advancedOptions.backgroundStroke ? spinner.advancedOptions.backgroundStroke : false;
        backgroundStrokeColor = spinner.advancedOptions.backgroundStrokeColor? spinner.advancedOptions.backgroundStrokeColor: '#ffffff';
        backgroundStrokeWidth = spinner.advancedOptions.backgroundStrokeWidth? spinner.advancedOptions.backgroundStrokeWidth: 12;
    }

    function createParticles () {
        particles = spinners.particleFactory(particleNumber, width, height, arcRadius, 0, false, null, null, null);
        setParticleOpacity();
        setParticleSize();
        setParticlePosition();
    }

    function setParticleSize () {
        var  particleSize = defaultParticleSize;
        for (var i = 0; i < particles.length; i++) {
            particles[i].size = particleSize;
            particleSize -= shrinkValue;
        }
    }

    function setParticleOpacity () {
        var  particleOpacity =  1;
        for (var i = 0; i < particles.length; i++) {
            particles[i].opacity = particleOpacity;
            particleOpacity -= fadeoutValue;
        }
    }

    function setParticlePosition () {
        var particlePosition = position;
        for (var i = 0; i < particles.length; i++) {
            particles[i].position = particlePosition;
            particlePosition -= shrinkValue;
        }
    }

    function clearCanvas() {
        context.clearRect(0, 0, width, height);
        render();
        updateAngle();
        requestAnimationFrame(clearCanvas);
    }

    function updateAngle () {
        for (var i = 0; i < particles.length; i++) {
            if (direction === 'right') {
                particles[i].position += speed;
            } else if (direction === 'left') {
                particles[i].position -= speed;
            }
        }
    }

    function render () {
        context.save();

        if (backgroundStroke === true) {
            context.beginPath();
            context.arc(width / 2, height / 2, arcRadius, 0, Math.PI * 2, false);
            context.strokeStyle = backgroundStrokeColor;
            context.lineWidth = backgroundStrokeWidth;
            context.stroke();
        }

        for (var i = 0; i < particles.length; i++) {
            context.beginPath();
            context.arc(particles[i].x = width / 2 + Math.cos(particles[i].position) * arcRadius, particles[i].y = height / 2 + Math.sin(particles[i].position) * arcRadius, particles[i].size, 0, Math.PI * 2, false);
            context.globalAlpha = particles[i].opacity;
            context.fillStyle = color;
            context.fill();
        }
        context.restore();
    }
}