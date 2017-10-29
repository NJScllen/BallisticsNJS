(function () {
    var graphics = {};
    /**
     * Draws chart from two coordinate functions.
     * @function drawChart
     * @param {Dependency}      dep function, providing y coordinate from x
     * @param {ImportantPoints} impoints starting, highest and ending point
     * @param {Snap.Paper}      canvas canvas to draw on
     * @param {graphUtils.Size} paperSize size of the canvas
     * @param {?number}         fields fields around the canvas
     *
     * @returns {Snap.Element} drawn path
     */
    graphics.drawChart = function (dep, impoints, paper, paperSize, fields = 10) {
        let pathAttrs = {
            "stroke-width": 3,
            "stroke": "#5389e0",
            "fill": "#FFF"
        };
        let scale = Math.round((Math.min(paperSize.width, paperSize.height) - (fields * 2))
            /
                (Math.max(impoints.highest.y, impoints.end.x) + (fields * 2)));
        let points = [];
        let c = (impoints.end.x - impoints.start.x) / 10; //Chart will be constructed via 13 points
        points.push(impoints.start);
        for (var x = impoints.start.x + c; x <= impoints.end.x - c; x += c) {
            var y = dep(x);
            points.push({ x: x, y: y });
        }
        points.push(impoints.end);
        if (!points.some((p) => p.x === impoints.highest.x && p.y === impoints.highest.y)) {
            points.push(impoints.highest);
            points = points.sort((a, b) => {
                if (a.x > b.x)
                    return 1;
                if (a.x < b.x)
                    return -1;
                return 0;
            });
        }
        let pathString = `M ${impoints.start.x * scale + fields} ${paperSize.height - (impoints.start.y * scale + fields)} R `;
        points.forEach((p) => {
            pathString = pathString.concat(`${(p.x * scale) + fields} ${paperSize.height - (p.y * scale) - fields} `);
        });
        let path = paper.path(pathString).attr(pathAttrs);
        path.scale = scale;
        return path;
    };
    /**
     * Draws two axis on provided canvas.
     * @function drawAxis
     * @param {Snap.Paper}  canvas  canvas to draw on
     * @param {Size}        size    size of the canvas
     * @param {number}      scale   scale of a single segment
     * @param {AxisLabels}  labels  labels to write under the axis
     * @param {number}      fields  fields around the canvas
     *
     * @returns {Axis}  axis object, containing both axis
     */
    graphics.drawAxis = function (canvas, size, scale, labels = { x: "", y: "" }, fields = 10) {
        const INDENT = 5;
        const ARROW_HEIGHT = 6;
        const ARROW_WIDTH = 4;
        let axisparams = {
            "stroke-width": "3",
            "stroke": "#000",
            "stroke-opacity": "0.7"
        };
        let x = canvas.line(fields - INDENT, size.height - fields, size.width - fields, size.height - fields).attr(axisparams);
        let y = canvas.line(fields, size.height - fields + INDENT, fields, fields).attr(axisparams);
        let xa = canvas.polyline([size.width - fields - ARROW_HEIGHT, size.height - fields - ARROW_WIDTH,
            size.width - fields, size.height - fields,
            size.width - fields - ARROW_HEIGHT, size.height - fields + ARROW_WIDTH]).attr(axisparams);
        let ya = canvas.polyline([fields - ARROW_WIDTH, fields + ARROW_HEIGHT,
            fields, fields, fields + ARROW_WIDTH,
            fields + ARROW_HEIGHT]).attr(axisparams);
        return { axisX: x, axisY: y, arrowX: xa, arrowY: ya };
    };
    /**
     * Draws markers showing coordinates of the specific point
     * @function drawScale
     * @param {Snap.Paper}  canvas canvas to draw on
     * @param {Point}       point point which needs to be marked
     * @param {number}      fields fields around the canvas
     *
     * @returns {Axis} axis object, containing lines to both axis
     */
    graphics.drawScale = function (canvas, point, fields = 10) {
        //TODO
        throw new Error("Not implemented");
    };
    window.graphics = graphics;
})();