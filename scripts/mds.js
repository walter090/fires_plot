var margin = {top: 30, bottom: 30, right: 30, left: 30};
var labelOffset = 15;

var width = 650;
var height = 650;

var inner_width = width - margin.left - margin.right;
var inner_height = height - margin.top - margin.bottom;

var rad = 1;

d3.csv('../data_resource/mds.csv', function (data) {
    render(data);
});

function render(data) {
    var svg = d3.select('#mds').append('svg')
        .attr('width', width)
        .attr('height', height);

    var group = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    // set up x and y
    // ?Value is the value of data on the x axis
    // ?Map maps the value to a position on the chart
    var xValue = function (d) {
            return +d['x'];
        },
        xScale = d3.scaleLinear().rangeRound([0, inner_width])
            .domain(d3.extent(data, xValue)).nice(),
        xAxis = d3.axisBottom(xScale),
        xAxisGroup = group.append('g')
            .attr('transform', 'translate(0,' + inner_height + ')'),

        xMap = function (d) {
            return xScale(xValue(d))
        };

    var yValue = function (d) {
            return +d['y'];
        },
        yScale = d3.scaleLinear().rangeRound([inner_height, 0])
            .domain(d3.extent(data, yValue)).nice(),
        yAxis = d3.axisLeft(yScale),
        yAxisGroup = group.append('g'),

        yMap = function (d) {
            return yScale(yValue(d));
        };

    console.log(xScale.range());
    console.log(xScale(8));

    var dot = group.selectAll('.dot').data(data);

    xAxisGroup
        .transition()
        .duration(1000)
        .attr('class', 'axis')
        .call(xAxis);

    xAxisGroup
        .append('text')
        .attr('x', inner_width)
        .attr('y', -labelOffset / 2)
        .attr('fill', '#000')
        .style('text-anchor', 'end')
        .text('x');

    yAxisGroup
        .transition()
        .duration(1000)
        .attr('class', 'axis')
        .call(yAxis);

    yAxisGroup
        .attr('class', 'axis')
        .append('text')
        .attr('y', labelOffset)
        .attr('transform', 'rotate(-90)')
        .attr('fill', '#000')
        .style('text-anchor', 'end')
        .text('y');

    dot.enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', rad)
        .attr('xxx', xValue)
        .attr('cx', xMap)
        .attr('cy', yMap)
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
}