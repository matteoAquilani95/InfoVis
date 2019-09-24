d3.starPlot = function() {
    var width = 200,
        margin = {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        labelMargin = 20,
        includeGuidelines = true,
        includeLabels = true,
        accessors = [],
        labels = [],
        title = nop,

        g,
        datum,
        radius = width / 2,
        origin = [radius, radius],
        radii = accessors.length,
        radians = 2 * Math.PI / radii,
        scale = d3.scale.linear()
          .domain([0, 100])
          .range([0, radius])
  
    function chart(selection) {
      datum = selection.datum();
      g = selection
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  
      if (includeGuidelines) {
        drawGuidelines();
      }
      if (includeLabels) {
        drawLabels();
      }
      drawChart();
    }
  
    function drawGuidelines() {
      var r = 0;
      accessors.forEach(function(d, i) {
        var l, x, y;
  
        l = radius;
        x = l * Math.cos(r);
        y = l * Math.sin(r);
        g.append('line')
          .attr('class', 'star-axis')
          .attr('id', 'asse'+i)
          .attr('x1', origin[0])
          .attr('y1', origin[1])
          .attr('x2', origin[0] + x)
          .attr('y2', origin[1] + y)
          .on("click", function(d){

            let etichetta = dict[i]["inv"];
            if (etichetta == -1)
              dict[i]["inv"] = 0;
            else
              dict[i]["inv"] = -1;
            d3.selectAll(".chart").remove()
            
            drawChartData();
          
          });
        r += radians;
      })

      g.append('circle') //cerchio tra asse 1 e 2
          .attr('cx', scale('30'))
          .attr('cy', scale('100'))
          .attr('r', '40')
          .attr('fill', 'blue')
          .style("opacity", 0.0)
          .on("click", function(d){
            
            let charts = d3.selectAll('.chart')
            //console.log(asse1[0][0])
            //paths.transition().duration(2000).style("opacity", 0.0).remove()
            charts.remove()
            
            let temp = dict[1]["label"];
            dict[1]["label"] = dict[2]["label"];
            dict[2]["label"] = temp;
            drawChartData();          
          })
      
      g.append('circle') //cerchio tra asse 2 e 0
          .attr('cx', scale('135'))
          .attr('cy', scale('40'))
          .attr('r', '40')
          .attr('fill', 'green')
          .style("opacity", 0.0)
          .on("click", function(d){
            d3.selectAll('.chart').remove()
            
            let temp = dict[0]["label"]
            dict[0]["label"] = dict[2]["label"];
            dict[2]["label"] = temp;
            
            drawChartData();            
          })
      
      g.append('circle') //cerchio tra asse 1 e 0
          .attr('cx', scale('135'))
          .attr('cy', scale('160'))
          .attr('r', '40')
          .attr('fill', 'red')
          .style("opacity", 0.0)
          .on("click", function(d){
            let charts = d3.selectAll('.chart')
            charts.remove()
            
            let temp = dict[0]["label"]
            dict[0]["label"] = dict[1]["label"];
            dict[1]["label"] = temp;
            
            drawChartData();         
          })
    }
  
    function drawLabels() {
      var r = 0;
      accessors.forEach(function(d, i) {
        var l, x, y;
  
        l = radius;
        x = (l + labelMargin) * Math.cos(r);
        y = (l + labelMargin) * Math.sin(r);

        //console.log("asse "+i+" x: " + x +" y: "+y)
        g.append('text')
          .attr('class', 'star-label')
          .attr('x', origin[0] + x +10)
          .attr('y', origin[1] + y )
          .text(labels[i])
          .style('text-anchor', 'middle')
          .style('dominant-baseline', 'central')
  
        r += radians;
      })
    }
  
    function drawChart() {
      g.append('circle')
        .attr('class', 'star-origin')
        .attr('cx', origin[0])
        .attr('cy', origin[1])
        .attr('r', 2)
  
      var path = d3.svg.line.radial()
  
      var pathData = [];
      var r = Math.PI / 2;
      accessors.forEach(function(d) {
        pathData.push([
          scale(d(datum)),
          r
        ])
        r += radians;
      });
  
      g.append('path')
        .attr('class', 'star-path')
        .attr('transform', 'translate(' + origin[0] + ',' + origin[1] + ')')
        .attr('d', path(pathData) + 'Z');
  
      g.append('text')
        .attr('class', 'star-title')
        .attr('x', origin[0])
        .attr('y', -(margin.top / 2))
        .text(title(datum))
        .style('text-anchor', 'middle')
    }
  
    function nop() {
      return;
    }
  
    chart.accessors = function(_) {
      if (!arguments.length) return accessors;
      accessors = _;
      radii = accessors.length;
      radians = 2 * Math.PI / radii;
      return chart;
    };
  
    chart.width = function(_) {
      if (!arguments.length) return width;
      width = _;
      radius = width / 2;
      origin = [radius, radius];
      scale.range([0, radius])
      return chart;
    };
  
    chart.margin = function(_) {
      if (!arguments.length) return margin;
      margin = _;
      origin = [radius, radius];
      return chart;
    };
  
    chart.labelMargin = function(_) {
      if (!arguments.length) return labelMargin;
      labelMargin = _;
      return chart;
    };
  
    chart.title = function(_) {
      if (!arguments.length) return title;
      title = _;
      return chart;
    };
  
    chart.labels = function(_) {
      if (!arguments.length) return labels;
      labels = _;
      return chart;
    };
  
    chart.includeGuidelines = function(_) {
      if (!arguments.length) return includeGuidelines;
      includeGuidelines = _;
      return chart;
    };
  
    chart.includeLabels = function(_) {
      if (!arguments.length) return includeLabels;
      includeLabels = _;
      return chart;
    };
  
    return chart;
  }