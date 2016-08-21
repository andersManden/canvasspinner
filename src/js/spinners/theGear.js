var theGear = (function(){
    var canvas = null,
        context = null,
        width = null,
        height = null;

    var arcRadiusA = 20,
        arcRadiusB = arcRadiusA - (arcRadiusA / 5),
        number = 16,
        speed = 0.06,
        lineWidth = arcRadiusB / 2,
        innerOffset = 0.1,
        outerOffset = 0.1;

    var particlesA = [];
    var particlesB = [];

    function init (spinner) {
        var container = document.getElementById(spinner.containerId);
        canvas = document.getElementById(spinner.canvasId);
        context = canvas.getContext('2d');
        width = canvas.width = container.offsetWidth;
        height = canvas.height = container.offsetHeight;

        particlesA = spinners.particleFactory(number, width, height, arcRadiusA,  Math.PI / number, false, null, null, null);
        particlesB = spinners.particleFactory(number, width, height, arcRadiusB, Math.PI / number, false, null, null, null);

        clearCanvas();
    }

    function clearCanvas() {
        context.clearRect(0, 0, width, height);
        render();
        requestAnimationFrame(clearCanvas);
    }

    function render () {
        context.save();

        for (var j = 0; j < number; j++) {
            context.beginPath();
            context.fillStyle = '#4b4b4b';
            if (j % 2 !== 0) {
                context.moveTo(particlesB[j].x = width / 2 + Math.cos(particlesB[j].angleStart + innerOffset) * arcRadiusB, particlesB[j].y = height / 2 + Math.sin(particlesB[j].angleStart + innerOffset) * arcRadiusB);
                context.lineTo(particlesB[j -1].x = width / 2 + Math.cos(particlesB[j -1].angleStart - innerOffset) * arcRadiusB, particlesB[j -1].y = height / 2 + Math.sin(particlesB[j -1].angleStart - innerOffset) * arcRadiusB);
                context.lineTo(particlesA[j -1].x = width / 2 + Math.cos(particlesA[j -1].angleStart + outerOffset) * arcRadiusA, particlesA[j -1].y = height / 2 + Math.sin(particlesA[j -1].angleStart + outerOffset) * arcRadiusA);
                context.lineTo(particlesA[j].x = width / 2 + Math.cos(particlesA[j].angleStart - outerOffset) * arcRadiusA, particlesA[j].y = height / 2 + Math.sin(particlesA[j].angleStart - outerOffset) * arcRadiusA);
                context.lineTo(particlesB[j].x = width / 2 + Math.cos(particlesB[j].angleStart + innerOffset) * arcRadiusB, particlesB[j].y = height / 2 + Math.sin(particlesB[j].angleStart + innerOffset) * arcRadiusB);
            }
            context.fill();
            particlesA[j].angleStart += speed;
            particlesB[j].angleStart += speed;
        }

        context.beginPath();
        context.arc(width / 2, height / 2, arcRadiusB - (lineWidth / 2), 0, Math.PI * 2, false);
        context.strokeStyle = '#4b4b4b';
        context.lineWidth = lineWidth;
        context.stroke();

        context.restore();
    }

    return {
        init : init
    }
})();