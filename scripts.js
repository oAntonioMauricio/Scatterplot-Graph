const w = 900;
const h = 600;
const barWidth = 0;
const padding = 40;

// RESPONSIVE
function responsivefy(svg) {
    // container will be the DOM element
    // that the svg is appended to
    // we then measure the container
    // and find its aspect ratio
    const container = d3.select(svg.node().parentNode),
        width = parseInt(svg.attr('width'), 10),
        height = parseInt(svg.attr('height'), 10),
        aspect = width / height;

    // set viewBox attribute to the initial size
    // control scaling with preserveAspectRatio
    // resize svg on inital page load
    svg.attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMinYMid')
        .call(resize);

    // add a listener so the chart will be resized
    // when the window resizes
    // multiple listeners for the same event type
    // requires a namespace, i.e., 'click.foo'
    // api docs: https://goo.gl/F3ZCFr
    d3.select(window).on(
        'resize.' + container.attr('id'),
        resize
    );

    // this is the code that resizes the chart
    // it will be called on load
    // and in response to window resizes
    // gets the width of the container
    // and resizes the svg to fill it
    // while maintaining a consistent aspect ratio
    function resize() {
        const w = parseInt(container.attr('width'));
        svg.attr('width', w);
        svg.attr('height', Math.round(w / aspect));
    }
}

// CREATE SVG
const svg = d3.select("#holder")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .call(responsivefy);

//GET JSON DATA
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json", function (data) {

    //CONVERT TIME TO SECONDS FUNCTION
    function hmsToSecondsOnly(str) {
        let p = str.split(':'),
            s = 0, m = 1;

        while (p.length > 0) {
            s += m * parseInt(p.pop(), 10);
            m *= 60;
        }

        return s;
    }

    //DATA TO YEARS AND TIME
    let years = data.map(x => x.Year);
    let time = data.map(x => hmsToSecondsOnly(x.Time))

    console.log(years)
    console.log(time)

    //X AXIS
    let minYear = d3.min(years)
    let maxYear = d3.max(years)

    let xScale = d3.scaleLinear()
        .domain([minYear - 1, maxYear + 1])
        .range([0 + padding, w - padding])

    let xAxis = d3.axisBottom(xScale).tickFormat(d3.format(""))

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis)

    //Y AXIS
    let minTime = d3.min(time)
    let maxTime = d3.max(time)

    console.log(minTime)
    console.log(maxTime)

    let yScale = d3.scaleLinear()
        .domain([minTime, maxTime])
        .range([0 + padding, h - padding])

    let yAxis = d3.axisLeft(yScale)
        .tickFormat((d) => new Date(d * 1000).toISOString().substring(14, 19));

    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis)

    // TOOLTIPS
    tooltip = d3.select("#holder")
        .append("div")
        .attr("class", "tooltip")
        .attr("id", "tooltip")
        .style("opacity", 0)

    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it.
    let mouseover = function (d) {
        tooltip
            .style("opacity", 1)
        tooltip
            .html(`${d.Name}: ${d.Nationality}<br/>Year: ${d.Year}, Time: ${d.Time}${d.Doping ? "<br/><br/>" + d.Doping : ''}`)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px")
            .attr("data-year", d.Year)
    }

    let mouseleave = function (d) {
        tooltip.style("opacity", 0)
    }

    // DOTS
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", (d) => xScale(d.Year))
        .attr("cy", (d) => yScale(d.Seconds))
        .attr("r", 6)
        .attr("fill", (d) => `${d.Doping ? "blue" : "orange"}`)
        .attr("data-xvalue", (d) => d.Year)
        .attr("data-yvalue", (d) => new Date(1970, 0, 1, 0, 0, d.Seconds).toISOString())
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)

    // LEGEND
    // DOPING ALLEGATIONS
    svg.append("rect")
        .attr("x", xScale(2015) + 20)
        .attr("y", yScale(2285))
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", "blue")

    svg.append("text")
        .attr("x", xScale(2011) - 5)
        .attr("y", yScale(2285) + 8)
        .text("Riders with doping allegations")
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle")
        .attr("id", "legend")

    // NO DOPPING
    svg.append("rect")
        .attr("x", xScale(2015) + 20)
        .attr("y", yScale(2295))
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", "orange")

    svg.append("text")
        .attr("x", xScale(2012) + 3)
        .attr("y", yScale(2295) + 8)
        .text("No doping allegations")
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle")
        .attr("id", "legend")

});