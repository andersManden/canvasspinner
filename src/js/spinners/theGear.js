function GearSpinner (spinner){
    var canvas = null,
        context = null,
        width = null,
        height = null;

    var arcRadiusA = null,
        arcRadiusB = null,
        number = null,
        speed = null,
        lineWidth = null,
        innerOffset = 0.1,
        outerOffset = 0.1,
        color = null,
        direction = null,
        opacity = null;

    var particlesA = [];
    var particlesB = [];

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
        color = spinner.options.color ? spinner.options.color : '#4b4b4b';
        speed = spinner.options.speed ? spinner.options.speed : 0.06;
        direction = spinner.options.direction ? spinner.options.direction : 'right';
        opacity = spinner.options.opacity ? spinner.options.opacity : 1;
    }

    function specificOptions (spinner) {
        number = spinner.advancedOptions.teeth ? spinner.advancedOptions.teeth : 16;
        arcRadiusA = spinner.options.radius ? spinner.options.radius : 40;
        arcRadiusB = arcRadiusA - (arcRadiusA / 5);
        lineWidth = arcRadiusB / 2;
    }

    function createParticles () {
        particlesA = spinners.particleFactory(number, width, height, arcRadiusA,  Math.PI / number, false, null, null, null);
        particlesB = spinners.particleFactory(number, width, height, arcRadiusB, Math.PI / number, false, null, null, null);
    }

    function clearCanvas() {
        context.clearRect(0, 0, width, height);
        render();
        requestAnimationFrame(clearCanvas);
    }

    function render () {
        context.save();

        context.globalAlpha = opacity;

        for (var j = 0; j < number; j++) {
            context.beginPath();
            context.fillStyle = color;
            if (j % 2 !== 0) {
                context.moveTo(particlesB[j].x = width / 2 + Math.cos(particlesB[j].angleStart + innerOffset) * arcRadiusB, particlesB[j].y = height / 2 + Math.sin(particlesB[j].angleStart + innerOffset) * arcRadiusB);
                context.lineTo(particlesB[j -1].x = width / 2 + Math.cos(particlesB[j -1].angleStart - innerOffset) * arcRadiusB, particlesB[j -1].y = height / 2 + Math.sin(particlesB[j -1].angleStart - innerOffset) * arcRadiusB);
                context.lineTo(particlesA[j -1].x = width / 2 + Math.cos(particlesA[j -1].angleStart + outerOffset) * arcRadiusA, particlesA[j -1].y = height / 2 + Math.sin(particlesA[j -1].angleStart + outerOffset) * arcRadiusA);
                context.lineTo(particlesA[j].x = width / 2 + Math.cos(particlesA[j].angleStart - outerOffset) * arcRadiusA, particlesA[j].y = height / 2 + Math.sin(particlesA[j].angleStart - outerOffset) * arcRadiusA);
                context.lineTo(particlesB[j].x = width / 2 + Math.cos(particlesB[j].angleStart + innerOffset) * arcRadiusB, particlesB[j].y = height / 2 + Math.sin(particlesB[j].angleStart + innerOffset) * arcRadiusB);
            }
            context.fill();

            if (direction === 'right') {
                particlesA[j].angleStart += speed;
                particlesB[j].angleStart += speed;
            } else if (direction === 'left') {
                particlesA[j].angleStart -= speed;
                particlesB[j].angleStart -= speed;
            }
        }

        context.beginPath();
        context.arc(width / 2, height / 2, arcRadiusB - (lineWidth / 2), 0, Math.PI * 2, false);
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.stroke();

        context.restore();
    }

}