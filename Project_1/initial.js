function drawChartData(){
    read.get(function(error, rows) {
    var star = d3.starPlot()
      .width(width)
      .accessors([
        function(d) { if (dict[0]["inv"] == 0) return invScale(d[dict[0]["label"]]); else return scale(d[dict[0]["label"]]); },
        function(d) { if (dict[1]["inv"] == 0) return invScale(d[dict[1]["label"]]); else return scale(d[dict[1]["label"]]); },
        function(d) { if (dict[2]["inv"] == 0) return invScale(d[dict[2]["label"]]); else return scale(d[dict[2]["label"]]); },
      ])
      .labels([
        [dict[0]["label"]],
        [dict[1]["label"]],
        [dict[2]["label"]],
      ])
      .title(function(d) { return d.BrandCar; })
      .margin(margin)
      .labelMargin(labelMargin)

    rows.forEach(function(d, i) {
      star.includeLabels(i % 4 === 0 ? true : false);

      d3.select('#target').append('svg')
        .attr('class', 'chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', width + margin.top + margin.bottom)
        .append('g')
          .datum(d)
          .call(star)
    });
    });
}

var margin = {
    top: 36,
    right: 50,
    bottom: 20,
    left: 50
  };

  var width = 240 - margin.left - margin.right;
  var height = 240 - margin.top - margin.bottom;
  var labelMargin = 8;
  

  var dict = {
    0:{
      "inv":-1,
      "label":"Famous"
    },
    1:{
      "inv":-1,
      "label":"Speed"
    },
    2:{
      "inv":-1,
      "label":"Emissions"
    }
  };
  
  var scale = d3.scale.linear()
    .domain([0, 11])
    .range([0, 100])
  
  var invScale = d3.scale.linear().domain([11,0]).range([0,100])
  
  var read = d3.json('data.json', function(data){
        data.forEach(d => {
          d.Famous = +d.Famous;
          d.Speed = +d.Speed;
          d.Emissions = +d.Emissions;
          return d;
      });
    });

drawChartData() //start draw the chart


