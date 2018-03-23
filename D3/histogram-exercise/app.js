var width = 600;
var height = 400;
var barPadding = 1;
var padding = 40;
var data = regionData.filter(mustHaveKeys);
var minAge = d3.min(data, d => d.medianAge);
var maxAge = d3.max(data, d => d.medianAge);

var xScale =
  d3.scaleLinear()
    .domain(d3.extent(data, d => d.medianAge))
    .rangeRound([padding, width - padding]);

var histogram = 
  d3.histogram()
      .domain(xScale.domain())
      .thresholds(50)
      .value(d => d.medianAge);

var bins = histogram(data);

var yScale =
  d3.scaleLinear()
    .domain([0, d3.max(bins, d => d.length)])
    .range([height - padding, padding]);

var xAxis = d3.axisBottom(xScale);

var yAxis = d3.axisLeft(yScale);

var svg = d3.select("svg");

svg
  .append("g")
  .attr("transform", `translate(0, ${height - padding})`)
  .call(xAxis);

svg
  .append("g")
  .attr("transform", `translate(${padding}, 0)`)
  .call(yAxis);

svg
  .append("text")
    .attr("x", width / 2)
    .attr("y", height - padding)
    .attr("dy", "2.2em")
    .attr("text-anchor", "middle")
    .text("Median Age");
    
svg
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("dy", "1.0em")
    .attr("text-anchor", "middle")
    .text("Frequency");

var bars =
  svg
      .attr("width", width)
      .attr("height", height)
    .selectAll(".bar")
    .data(bins)
    .enter()
    .append("rect")
      .classed("bar", true)
      .attr("x", d => xScale(d.x0))
      .attr("y", d => yScale(d.length))
      .attr("height", d => height - yScale(d.length) - padding)
      .attr("width", d => {
        var width = xScale(d.x1) - xScale(d.x0) - barPadding;
        return width < 0 ? 0 : width;
      })
      .attr("fill", "#0000ff");

// d3.select("input")
//     .property("min", minAge)
//     .property("max", maxAge)
//     .property("value", minAge)
//     .on("input", function() {
//       var subscribers = +d3.event.target.value;
//       subscriberData = data.filter(d => d.subscribersPer100 === subscribers);
//       xScale.domain([0, d3.max(subscriberData, d => d.medianAge)]);
//       histogram.domain(xScale.domain())
//                .thresholds(xScale.ticks());
//       bins = histogram(subscriberData);
//       yScale.domain([0, d3.max(bins, d => d.length)]);

//       bars =
//         d3.select("svg")
//           .selectAll(".bar")
//           .data(bins);

//       bars
//         .exit()
//         .remove();

//       bars
//         .enter()
//         .append("rect")
//           .classed("bar", true)
//         .merge(bars)
//           .attr("x", d => xScale(d.x0))
//           .attr("y", d => yScale(d.length))
//           .attr("width", d => {
//             var width = xScale(d.x1) - xScale(d.x0) - barPadding;
//             return width < 0 ? 0 : width;
//           })
//           .attr("height", d => height - yScale(d.length))
//           .attr("fill", "#0000ff");
//     });

function mustHaveKeys(obj) {
  var keys = [
    "medianAge"
  ];
  for (var i = 0; i < keys.length; i++) {
    if (obj[keys[i]] === null) return false;
  }
  return true;
}