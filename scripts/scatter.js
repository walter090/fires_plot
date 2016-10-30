var xFeatureList = document.getElementById('x-feature');
var yFeatureList = document.getElementById('y-feature');

var margin = {top: 30, bottom: 30, right: 30, left: 30};
var labelOffset = 15;

var rad = 1.5;

var width = 650;
var height = 650;

var inner_width = width - margin.left - margin.right;
var inner_height = height - margin.top - margin.bottom;

var xFeature;
var yFeature;

var xSelection;
var ySelection;

d3.csv('../data_resource/forest_fire_pred.csv', convert, function (data) {
    xFeatureList.onclick = function (event) {
        let selection = select(event);

        if (xSelection !== selection) {
            if (xSelection == undefined) {
                xSelection = selection;
                xFeature = xSelection.id.split('-')[1];
                anew(data);
                return;
            } else {
                xSelection.classList.remove('selected');
                xSelection = selection;
                xFeature = xSelection.id.split('-')[1];
            }
            anew(data);
        } else {
            xSelection = undefined;
            anew(data);
        }
    };

    yFeatureList.onclick = function (event) {
        let selection = select(event);

        if (ySelection !== selection) {
            if (ySelection == undefined) {
                ySelection = selection;
                yFeature = ySelection.id.split('-')[1];
                anew(data);
                return;
            } else {
                ySelection.classList.remove('selected');
                ySelection = selection;
                yFeature = ySelection.id.split('-')[1];
            }
            anew(data);
        } else {
            ySelection = undefined;
            anew(data);
        }
    };

    function select(event) {
        let target = event.target;
        let selected = document.getElementById(target.id);

        if (!selected.classList.contains('selected')) {
            selected.classList.add('selected');
        } else {
            selected.classList.remove('selected');
        }

        return selected
    }
});

function render(data) {
    var svg = d3.select('#chart').append('svg')
        .attr('width', width)
        .attr('height', height);

    var group = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    // set up x and y
    // ?Value is the value of data on the x axis
    // ?Map maps the value to a position on the chart
    var xScale = d3.scaleLinear().range([0, inner_width]),
        xAxis = d3.axisBottom(xScale),
        xAxisGroup = group.append('g')
            .attr('transform', 'translate(0,' + inner_height + ')'),
        xValue = function (d) {
            return d[xFeature];
        },
        xMap = function (d) {
            return xScale(xValue(d))
        };

    var yScale = d3.scaleLinear().range([inner_height, 0]),
        yAxis = d3.axisLeft(yScale),
        yAxisGroup = group.append('g'),
        yValue = function (d) {
            return d[yFeature];
        },
        yMap = function (d) {
            return yScale(yValue(d))
        };

    var dot = group.selectAll('.dot').data(data);

    // shift domain by 1 so the points do not intersect with the axis
    xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]).nice();
    yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]).nice();

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
        .text(xFeature);

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
        .text(yFeature);

    dot.enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', rad)
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

function anew(data) {
    d3.selectAll('.dot')
        .transition()
        .attr('r', 5 * rad)
        .style('opacity', 0.3)
        .duration(250)
        .transition()
        .attr('r', 0)
        .duration(250);
    d3.selectAll('.tick')
        .transition()
        .style('opacity', 0)
        .duration(250);
    d3.selectAll('text')
        .transition()
        .style('fill', 'red')
        .style('opacity', 0)
        .duration(250);

    setTimeout(function () {
        d3.selectAll('svg').remove();
        if (xFeature != undefined && yFeature != undefined) {
            render(data);
        }
    }, 501);

}

function convert(d) {
    d.month = +d.month;
    d.temp = +d.temp;
    d.FFMC = +d.FFMC;
    d.ISI = +d.ISI;
    d.RH = +d.RH;
    d.wind = +d.wind;
    d.area = +d.area;

    return d;
}
