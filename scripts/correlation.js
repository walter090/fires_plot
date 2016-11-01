var margin = {top: 50, bottom: 50, right: 50, left: 50};
var labelOffset = 15;

var width = 650;
var height = 650;

var inner_width = width - margin.left - margin.right;
var inner_height = height - margin.top - margin.bottom;

d3.csv('../data_resource/corr_matrix.csv', convert, function (data) {
    render(data);
});

function render(data) {
    var svg = d3.select('#correlation').append('svg')
        .attr('width', width)
        .attr('height', height);

    var group = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    var features = Object.keys(data[0]);
    features.splice(0, 1);

    var xScale = d3.scaleBand()
            .domain(features)
            .rangeRound([0, inner_width]),
        xAxis = d3.axisBottom(xScale),
        xAxisGroup = group.append('g')
            .attr('transform', 'translate(0,' + inner_height + ')');

    var yScale = d3.scaleBand()
            .domain(features)
            .rangeRound([inner_height, 0]),
        yAxis = d3.axisLeft(yScale),
        yAxisGroup = group.append('g');

    let list = [];
    for (let i = 1; i < features.length; i++) {
        list.push(d3.min(data, function (d) {
            return d[features[i]];
        }));
    }
    let min = d3.min(list);
    list = [];
    for (let i = 1; i < features.length; i++) {
        list.push(d3.max(data, function (d) {
            return d[features[i]];
        }));
    }
    let max = d3.max(list);

    var cScale = d3.scaleSequential(d3.interpolateInferno)
        .domain([min, max]);

    d3.csv('../data_resource/corr_matrix_list.csv', function (mList) {
        var box = group.selectAll('.box').data(mList);
        var box_width = xScale.step();
        var box_height = yScale.step();

        var tip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0)
            .style('position', 'absolute');

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
            .style('text-anchor', 'end');

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
            .style('text-anchor', 'end');

        box.enter()
            .append('rect')
            .attr('class', 'box')
            .attr('height', box_height)
            .attr('width', box_width)
            .attr('y', function (d) {
                return yScale(d['row']);
            })
            .attr('x', function (d) {
                return xScale(d['col']);
            })
            .attr('fill', 'black')
            .on('mouseover', function (d) {
                tip.transition()
                    .style('opacity', .9)
                    .duration(500);
                tip.html(d['value'])
                    .style('left', (d3.event.pageX) + 'px')
                    .style('top', (d3.event.pageY - 28) + 'px');
            })
            .on('mouseout', function (d) {
                tip.transition()
                    .style("opacity", 0)
                    .duration(500);
            })
            .transition()
            .attr('fill', 'red')
            .duration(500)
            .transition()
            .attr('fill', function (d) {
                return cScale(d['value']);
            })
            .duration(1000)
            .attr('transform', 'translate(' + 2 + ')');
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