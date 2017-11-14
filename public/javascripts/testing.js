var heatmapChart = function() {
  function() {
    var e1 = document.querySelectorAll('#responses *');

    var values = [];
    var genes = [];

    var isFirst = true;
    var a_sample = ['receptacle_0', 'seed_0', 'wall_0','receptacle_2', 'seed_2', 'wall_2','receptacle_4', 'seed_4', 'wall_4','receptacle_6', 'seed_6', 'wall_6','receptacle_9', 'seed_9', 'wall_9','receptacle_12', 'seed_12', 'wall_12'];
    var samples = [];

    var nf = [];

    for(var i = 0, length =  e1.length; i < length; i++){
      var data = e1[i].textContent;
      var json = JSON.parse(data);
      if (json.message == "found"){

        if(isFirst){
          isFirst = false;
          samples = a_sample;
        }
        else{samples.concat(a_sample);}


        var tpm = json.tpm
        for(var j = 0, length =  tpm.length; j < length; j++){
            values = values.push(tpm[j])
            genes.push(json.gene_id);
            tpms.push(json.tpm);
        }

      }
      else {nf.push(json.gene_id);}
    }
    return {
      day: genes,
      hour: samples,
      value: values
    };
  },
  function(error, data) {
    var colorScale = d3.scale.quantile()
        .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
        .range(colors);

    var cards = svg.selectAll(".hour")
        .data(data, function(d) {return d.day+':'+d.hour;});

    cards.append("title");

    cards.enter().append("rect")
        .attr("x", function(d) { return (d.hour - 1) * gridSize; })
        .attr("y", function(d) { return (d.day - 1) * gridSize; })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "hour bordered")
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("fill", colors[0]);

    cards.transition().duration(1000)
        .style("fill", function(d) { return colorScale(d.value); });

    cards.select("title").text(function(d) { return d.value; });

    cards.exit().remove();

    var legend = svg.selectAll(".legend")
        .data([0].concat(colorScale.quantiles()), function(d) { return d; });

    legend.enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", height)
      .attr("width", legendElementWidth)
      .attr("height", gridSize / 2)
      .style("fill", function(d, i) { return colors[i]; });

    legend.append("text")
      .attr("class", "mono")
      .text(function(d) { return "≥ " + Math.round(d); })
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", height + gridSize);

    legend.exit().remove();

  });
};
