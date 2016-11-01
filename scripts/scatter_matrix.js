d3.csv('../data_resource/forest_fire_pred.csv', convert, renderScatterMatrix);

function renderScatterMatrix(data) {
    var width = 650;
    var height = 650;
    var cell_size = 100;
    var margin = 5;
    var rad = 1;

    var attributes = ['area', 'RH', 'FFMC', 'ISI', 'temp'];
    var attributeMatrix = [];

    attributes.forEach(function (a, x) {
        attributes.forEach(function (b, y) {
            attributeMatrix.push({a: a, b: b, x: x, y: y})
        })
    });

    var cScale = d3.scaleSequential(d3.interpolateInferno);

    var scale = {};
    attributes.forEach(function (attr) {
        scale[attr] = d3.scaleLinear();
        var domain = d3.extent(data, function (d) {
            return d[attr]
        });
        scale[attr].domain(domain).range([margin, cell_size - margin]);
    });

    var svg = d3.select('#scatter-matrix').append('svg')
        .attr('width', width)
        .attr('height', height);

    data.forEach(function (d) {
        attributes.forEach(function (feature) {
            d[feature] = parseFloat(d[feature])
        })
    });

    svg.selectAll('g')
        .data(attributeMatrix)
        .enter()
        .append("g")
        .attr("transform", function (d) {
            return "translate(" + (d.x * 100) + "," + (d.y * 100) + ")"
        });
    svg.selectAll('g')
        .each(function (m) {
            d3.select(this).append("rect")
                .style("fill", "black")
                .style("stroke", "white")
                .style("stroke-width", 1)
                .attr("height", 100)
                .attr("width", 100);

            d3.select(this).append("text")
                .attr("x", 50)
                .attr("y", 15)
                .style('font-size', 12)
                .style("text-anchor", "middle")
                .text(m.a + " - " + m.b);

            d3.select(this).selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) {return scale[m.a](d[m.a])})
                .attr("cy", function (d) {return 95 - scale[m.b](d[m.b])})
                .style('fill', 'red')
                .attr('r', 0)
                .transition()
                .style('fill', 'red')
                .attr('r', 5 * rad)
                .style('opacity', 0.3)
                .duration(500)
                .transition()
                .attr('r', rad)
                .style('opacity', 1)
                .duration(1000);
        });
}

function convert(d) {
    d.month = +d.month;
    d.temp = +d.temp;
    d.FFMC = +d.FFMC;
    d.ISI = +d.ISI;
    d.RH = +d.RH;
    d.wind = +d.wind;
    d.area = +d.area;
    d.X = +d.X;
    d.Y = +d.Y;
    d.day = +d.day;
    d.DMC = +d.DMC;
    d.DC = +d.DC;
    d.rain = +d.rain;

    return d;
}