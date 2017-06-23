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
            create_plot();
          }
      });
  }
}

function create_plot(){
  var e1 = document.querySelectorAll('#responses *');

  var found_genes = [];
  var nf = [];
  var tpms = [];

  for(var i = 0, length =  e1.length; i < length; i++){
    var data = e1[i].textContent;
    var json = JSON.parse(data);
    if (json.message == "found"){
      found_genes.push(json.gene_id);
      tpms.push(json.tpm);
    }
    else {nf.push(json.gene_id);}
  }

    var data = [{
      x: ['receptacle_0', 'seed_0', 'wall_0','receptacle_2', 'seed_2', 'wall_2','receptacle_4', 'seed_4', 'wall_4','receptacle_6', 'seed_6', 'wall_6','receptacle_9', 'seed_9', 'wall_9','receptacle_12', 'seed_12', 'wall_12'],
      y: found_genes,
      z: tpms,
      type: 'heatmap',
      showscale: true
    }];

    layout = {
      autosize: false,
      width:600,
      height:600,
      margin: {
          l: 100,
          r: 100,
          b: 100,
          t: 100,
          pad: 10
        }
    }


  Plotly.newPlot('myDiv', data,layout);
}
