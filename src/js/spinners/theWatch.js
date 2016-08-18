var theWatch = (function(){
    var canvas = null,
        context = null,
        width = null,
        height = null;

    var arcRadius = null,
        speedMinutes = null,
        speedHour = null,
        startAngleMinutes = null,
        startAngleHours = null,
        armWidthMinute = null,
        armWidthHour = null,
        clockLineWidth = null,
        armColorMinute = null,
        armColorHour = null,
        clockColorLine = null,
        clockColorFill = null,
        indicatorColorFill = null,
        opacity = null;

    var particles = [];

    function init (spinner) {
        var container = document.getElementById(spinner.containerId);
        canvas = document.getElementById(spinner.canvasId);
        context = canvas.getContext('2d');
        width = canvas.width = container.offsetWidth;
        height = canvas.height = container.offsetHeight;

        arcRadius = spinner.arcRadius ? spinner.arcRadius : 15;
        speedMinutes = spinner.speed ? spinner.speed : 0.1;
        speedHour = speedMinutes / 12;
        startAngleMinutes = spinner.startAngleMinutes ? spinner.startAngleMinutes : 0;
        startAngleHours = spinner.startAngleHours ? spinner.startAngleHours : 0;
        armWidthMinute = spinner.armWidthMinute ? spinner.armWidthMinute : 1;
        armWidthHour = spinner.armWidthHour ? spinner.armWidthHour : 2;
        clockLineWidth = spinner.clockLineWidth ? spinner.clockLineWidth : 1;
        armColorMinute = spinner.armColorMinute ? spinner.armColorMinute : '#4b4b4b';
        armColorHour = spinner.armColorHour ? spinner.armColorHour : '#4b4b4b';
        clockColorLine = spinner.clockColorLine ? spinner.clockColorLine : '#4b4b4b';
        clockColorFill = spinner.clockColorFill ? spinner.clockColorFill : '#ffffff';
        indicatorColorFill = spinner.indicatorColorFill ? spinner.indicatorColorFill : '#4b4b4b';
        opacity = spinner.opacity ? spinner.opacity : 1;

        if (spinner.hoursIndicator) {
            particles = canvasSpinners.particleFactory(12, width, height, arcRadius / 1.2, 0, false, null, null, null);
        }
        clearCanvas();
    }

    function clearCanvas() {
        context.clearRect(0, 0, width, height);
        render();
        requestAnimationFrame(clearCanvas);
    }

    function render () {
        context.save();

        context.globalAlpha = opacity;

        context.beginPath();
        context.arc(width / 2, height / 2, arcRadius, 0, Math.PI * 2, false);
        context.strokeStyle = clockColorLine;
        context.lineWidth = clockLineWidth;
        context.fillStyle = clockColorFill;
        context.globalAlpha = opacity;
        context.fill();
        context.stroke();

        for (var i = 0; i < particles.length; i++) {
            context.beginPath();
            context.arc(particles[i].x, particles[i].y, 1, 0, Math.PI * 2, false);
            context.fillStyle = indicatorColorFill;
            context.fill();
        }

        context.beginPath();
        context.moveTo(width / 2, height / 2);
        context.lineTo(width / 2 + Math.cos(startAngleHours) * (arcRadius / 2), height / 2 + Math.sin(startAngleHours) * (arcRadius / 2));
        context.strokeStyle = armColorHour;
        context.lineWidth = armWidthHour;
        context.stroke();

        context.beginPath();
        context.moveTo(width / 2, height / 2);
        context.lineTo(width / 2 + Math.cos(startAngleHours) * -(arcRadius / 4), height / 2 + Math.sin(startAngleHours) * -(arcRadius / 4));
        context.strokeStyle = armColorHour;
        context.lineWidth = armWidthHour;
        context.stroke();

        context.beginPath();
        context.moveTo(width / 2, height / 2);
        context.lineTo(width / 2 + Math.cos(startAngleMinutes) * (arcRadius / 1.3), height / 2 + Math.sin(startAngleMinutes) * (arcRadius / 1.3));
        context.strokeStyle = armColorMinute;
        context.lineWidth = armWidthMinute;
        context.stroke();

        context.beginPath();
        context.moveTo(width / 2, height / 2);
        context.lineTo(width / 2 + Math.cos(startAngleMinutes) * -(arcRadius / 3) , height / 2 + Math.sin(startAngleMinutes) * -(arcRadius / 3));
        context.strokeStyle = armColorMinute;
        context.lineWidth = armWidthMinute;
        context.stroke();

        startAngleMinutes += speedMinutes;
        startAngleHours += speedHour;

        context.restore();
    }

    return {
        init : init
    }
})();