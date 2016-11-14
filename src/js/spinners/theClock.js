function ClockSpinner (spinner){
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
        color = null,
        direction = null,
        opacity = null;

    var ratio = null;

    var particles = [];

    init(spinner);

    function init (spinner) {
        setEnviroment(spinner);
        standardOptions(spinner);
        specificOptions(spinner);
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
        speedMinutes = spinner.options.speed ? spinner.options.speed : 0.1;
        speedHour = speedMinutes / 12;
        direction = spinner.options.direction ? spinner.options.direction : 'right';
        opacity = spinner.options.opacity ? spinner.options.opacity : 1;
    }

    function specificOptions (spinner) {
        startAngleMinutes = spinner.advancedOptions.startAngleMinutes ? spinner.advancedOptions.startAngleMinutes : 0;
        startAngleHours = spinner.advancedOptions.startAngleHours ? spinner.advancedOptions.startAngleHours : 0;
        armWidthMinute = spinner.advancedOptions.armWidthMinute ? spinner.advancedOptions.armWidthMinute : 1;
        armWidthHour = spinner.advancedOptions.armWidthHour ? spinner.advancedOptions.armWidthHour : 2;
        clockLineWidth = spinner.advancedOptions.clockLineWidth ? spinner.advancedOptions.clockLineWidth : 1;
        armColorMinute = spinner.advancedOptions.armColorMinute ? spinner.advancedOptions.armColorMinute : '#4b4b4b';
        armColorHour = spinner.advancedOptions.armColorHour ? spinner.advancedOptions.armColorHour : '#4b4b4b';
        clockColorLine = spinner.advancedOptions.clockColorLine ? spinner.advancedOptions.clockColorLine : '#4b4b4b';
        clockColorFill = spinner.advancedOptions.clockColorFill ? spinner.advancedOptions.clockColorFill : '#ffffff';
        indicatorColorFill = spinner.advancedOptions.indicatorColorFill ? spinner.advancedOptions.indicatorColorFill : '#4b4b4b';

        if (spinner.advancedOptions.hoursIndicator) {
            particles = spinners.particleFactory(12, width, height, arcRadius / 1.2, 0, false, null, null, null);
        }
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


        if (direction === 'right') {
            startAngleMinutes += speedMinutes;
            startAngleHours += speedHour;
        } else if (direction === 'left') {
            startAngleMinutes -= speedMinutes;
            startAngleHours -= speedHour;
        }

        context.restore();
    }

    return {
        init : init
    }
};