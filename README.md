# Canvasspinner

Canvasspinner is a small collection of spinners, made with the canvas element. 

Its easy to use, just do these simple steps.


Include the canvasspinners.js in you project.
```
<script type="text/javascript" src="dist/canvasspinners.js"></script>
```


Then you need a container div with an id, and a canvas element also with an id.
```
<div id="some-container-id">
    <canvas id="some-canvas-id"></canvas>
</div>
```

Last you ned to create an instance of a spinner...

The minimum requirement for a spinner to run is.
```

        var config = {
            setup : {
                containerId : 'some-container-id',
                canvasId : 'some-canvas-id'
            }
        };
        new ClockSpinner(config);
```

If you feel like customizing, you can add values to the options parameter.
```

        var config = {
            setup : {
                containerId : 'some-container-id',
                canvasId : 'some-canvas-id'
            },
            options : {
                color : '#335b9b',
                speed : 0.12,
                radius : 200,
                direction : 'right',
                opacity : 0.5
            }
        };
        new ClockSpinner(config);
```
For more customization, you can enter the advancedOptions parameter. See references in the examples folder. The advancedOptions are uniqe for every spinner.
```

        var config = {
            setup : {
                containerId : 'some-container-id',
                canvasId : 'some-canvas-id'
            },
            options : {
                color : '#335b9b',
                speed : 0.12,
                radius : 200,
                direction : 'right',
                opacity : 0.5
            },
            advancedOptions : {
                startAngleMinutes : 0,
                startAngleHours : 0,
                armWidthMinute : 3,
                armWidthHour : 6,
                clockLineWidth : 10,
                armColorMinute : 'red',
                armColorHour : 'red',
                clockColorLine : 'red',
                clockColorFill : 'white',
                hoursIndicator : false,
                indicatorColorFill : 'red'
            }
        };
        new ClockSpinner(config);
```

If you make alteration in the advacnedOptions the spinners might break. But feel free to play around with them anyway.