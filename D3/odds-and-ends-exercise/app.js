d3.queue()
  .defer(d3.csv, './data/co2-emissions.csv', function(row) {
    return {
      country: row["Country Name"],
      countryCode: row["Country Code"],
      co2Emissions: +row["1990"]
    };
  })
  .defer(d3.csv, './data/methane-emissions.csv', function(row) {
    return {
      country: row["Country Name"],
      countryCode: row["Country Code"],
      methaneEmissions: +row["1990"]
    };
  })
  .defer(d3.csv, './data/renewable-energy-consumption.csv', function(row) {
    return {
      country: row["Country Name"],
      countryCode: row["Country Code"],
      renewConsumption: +row["1990"]
    };
  })
  .defer(d3.csv, './data/urban-population.csv', function(row) {
    return {
      country: row["Country Name"],
      countryCode: row["Country Code"],
      urbanPop: +row["1990"]
    };
  })
  .await(function(err, co2Res, methaneRes, renewRes, urbanPopRes) {
    if (err) throw err;
    
    // get data for each country
    var data = co2Res.map(co2 => {
      co2.methaneEmissions = methaneRes.filter(methane => methane.countryCode === co2.countryCode)[0].methaneEmissions;
      co2.renewConsumption = renewRes.filter(renew => renew.countryCode === co2.countryCode)[0].renewConsumption;
      co2.urbanPop = urbanPopRes.filter(pop => pop.countryCode === co2.countryCode)[0].urbanPop;
      return co2;
    });
    console.log(data);
    // plot data
    var width = 600;
    var height = 600;
    var padding = 50;

    // scales
    var xScale =
      d3.scaleLinear()
        .domain(d3.extent(data, d => d.co2Emissions))
        .range([padding, width - padding]);

    var yScale =
      d3.scaleLinear()
        .domain(d3.extent(data, d => d.methaneEmissions))
        .range([height - padding, padding]);

    var fScale =
      d3.scaleLinear()
        .domain(d3.extent(data, d => d.renewConsumption))
        .range(["black", "green"]);

    var rScale =
      d3.scaleLinear()
        .domain(d3.extent(data, d => d.urbanPop))
        .range([5, 30]);

    // build graph
    var svg = 
      d3.select("svg")
          .attr("width", width)
          .attr("height", height);

    // bind data
    var circle =
      svg
        .selectAll("circle")
        .data(data);

    // remove old data
    circle
      .exit()
      .remove();

    // add element for new nodes
    circle
      .enter()
        .append("circle")
      .merge(circle)
        .attr("cx", d => xScale(d.co2Emissions))
        .attr("cy", d => yScale(d.methaneEmissions))
        .attr("r", d => rScale(d.urbanPop))
        .attr("fill", d => fScale(d.renewConsumption))
        .attr("stroke", "#fff")
        .attr("stroke-width", "0.5px");
  })