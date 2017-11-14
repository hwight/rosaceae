function db_calls(){

        var genelist = $('textarea#genelist').val();
        genelist = genelist.split(',');

        create_paragraphs(genelist,function something(jSONarr){
          console.log(jSONarr);
        });


        $('#form').hide();
}


function create_paragraphs (genelist,callback)
{
  var last = genelist[genelist.length - 1]
  for(var i = 0, length =  genelist.length; i < length; i++)
  {
      $.post( "/get_gene", { gene: jQuery.trim(genelist[i])}, function(data) {
          var ptext = '<p class="aGene"> '+JSON.stringify(data)+ ' </p>';
          $('#responses').append(ptext);
          var e1 = document.querySelectorAll('#responses *');
          var genelist = $('textarea#genelist').val();
          genelist = genelist.split(',');
          if (e1.length == genelist.length){
            heatmapChart();
          }
      });
  }
}


var heatmapChart = function() {
      var margin = { top: 50, right: 0, bottom: 100, left: 30 },
          width = 960 - margin.left - margin.right,
          height = 430 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 24),
          legendElementWidth = gridSize*2,
          buckets = 9,
          colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
          days = $('textarea#genelist').val()
          days = days.split(','),
          times = ['receptacle_0', 'seed_0', 'wall_0','receptacle_2', 'seed_2', 'wall_2','receptacle_4', 'seed_4', 'wall_4','receptacle_6', 'seed_6', 'wall_6','receptacle_9', 'seed_9', 'wall_9','receptacle_12', 'seed_12', 'wall_12'];
          datasets = ["data.tsv", "data2.tsv"];

      var svg = d3.select("#chart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var dayLabels = svg.selectAll(".dayLabel")
          .data(days)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")

      var timeLabels = svg.selectAll(".timeLabel")
          .data(times)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });


          var e1 = document.querySelectorAll('#responses *');
          var values = [];
          var genes = [];

          var isFirst = true;
          var a_sample = ['receptacle_0', 'seed_0', 'wall_0','receptacle_2', 'seed_2', 'wall_2','receptacle_4', 'seed_4', 'wall_4','receptacle_6', 'seed_6', 'wall_6','receptacle_9', 'seed_9', 'wall_9','receptacle_12', 'seed_12', 'wall_12'];
          var samples = [];

          var nf = [];

          for(var i = 0, length =  e1.length; i < length; i++){

            console.log(e1[i]);
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
                  values.push(tpm[j])
                  genes.push(json.gene_id);
              }

            }
            else {nf.push(json.gene_id);}
          }

          var data =  {
            day: genes,
            hour: samples,
            value: values
          };

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


};



/*var datasetpicker = d3.select("#dataset-picker").selectAll(".dataset-button")
  .data(datasets);

datasetpicker.enter()
  .append("input")
  .attr("value", function(d){ return "Dataset " + d })
  .attr("type", "button")
  .attr("class", "dataset-button")
  .on("click", function(d) {
    heatmapChart(d);
  });*/
