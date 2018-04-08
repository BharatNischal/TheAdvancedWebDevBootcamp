function drawMap(yearRange, allData, geoData) {
  var mapSelection =
    d3.select("#map")
        .attr("width", width)
        .attr("height", height);

  mapSelection
    .append("text")
      .classed("title", true)
      .attr("x", width / 2)
      .attr("y", "1.5em")
      .attr("text-anchor", "middle")
      .style("font-size", "1.5em");

  var projection =
    d3.geoMercator()
      .scale(100)
      .translate([width / 2, height / 1.4]);

  var path =
    d3.geoPath()
      .projection(projection);
  
  d3.select("#map")
    .selectAll(".country")
    .data(geoData)
    .enter()
    .append("path")
      .classed("country", true)
      .attr("id", d => d.id)
      .attr("d", path)
      .on("mousemove touchmove", d => showTooltip(d.properties))
      .on("mouseout touchend", hideTooltip)
      .on("click", function(d) {
        // outline selected country
        var selected =
          d3.select(this)
              .classed("selected");
        
        d3.selectAll(".country")
            .classed("selected", false);

        if (!selected) {
          d3.select(this)
            .classed("selected", true);
        }
        
        var countryData = allData.filter(e => e.country === d.properties.country);
        updateBars(countryData, !selected, yearRange, geoData);
      });
}

function updateMap(year, unit, yearData, geoData) {
  // join year data to geodata country object properties
  yearData.forEach(row => {
    var countries = geoData.filter(d => d.id === row.countryCode);
    countries.forEach(country => country.properties = row);
  });
  
  d3.select("#map")
      .selectAll(".country")
      .data(geoData);

  var maxEmissions = d3.max(yearData, d => d[unit]);

  var fScale =
    d3.scaleLinear()
      .domain([0, maxEmissions])
      .range(["#ffcc00", "#990000"])
      .interpolate(d3.interpolateHsl);

  d3.selectAll(".country")
    .transition()
    .duration(750)
    .ease(d3.easeBackIn)
    .attr("fill", d => {
      var data = d.properties[unit];
      return data ? fScale(data) : "#ccc";
    });

  d3.select(".title")
      .text(`Carbon dioxide ${unit.toLowerCase()}, ${year}`);
}