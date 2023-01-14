const w = 900;
const h = 500;
const barWidth = 0;
const padding = 40;

// CREATE SVG
const svg = d3.select("#holder")
    .append("svg")
    .attr("width", w)
    .attr("height", h)

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

    // DOTS
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", (d) => xScale(d.Year))
        .attr("cy",(d) => yScale(d.Seconds))
        .attr("r", 6)
        .attr("data-xvalue", (d) => d.Year)
        .attr("data-yvalue", (d) => new Date(1970, 0, 1, 0, 0, d.Seconds).toISOString())

    // TOOLTIPS
});