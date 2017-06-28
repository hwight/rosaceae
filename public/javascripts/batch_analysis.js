function db_calls(){

  document.getElementById("loader").style.display = "block";

  var genelist = $('textarea#genelist').val();
  genelist = genelist.replace(/ /g,'')
  console.log(genelist)
  genelist = genelist.split(',');


  var uniquegenes = [];
  $.each(genelist, function(i, el){
      if($.inArray(jQuery.trim(el), uniquegenes) === -1) uniquegenes.push(el);
  });
  console.log(uniquegenes)
  $('#form').hide();

  for(var i = 0, length =  uniquegenes.length; i < length; i++)
  {
      $.post( "/get_gene", { gene: jQuery.trim(uniquegenes[i])}, function(data) {
          var ptext = '<p class="aGene"> '+JSON.stringify(data)+ ' </p>';
          $('#responses').append(ptext);
          var e1 = document.querySelectorAll('#responses *');

          var genelist = $('textarea#genelist').val();
          genelist = genelist.replace(/ /g,'');
          genelist = genelist.split(',');

          var uniquegenes = [];
          $.each(genelist, function(i, el){
              if($.inArray(jQuery.trim(el), uniquegenes) === -1) uniquegenes.push(el);
          });

          if (e1.length == uniquegenes.length){
            create_plot(false);
            $('#groupBySomething').show();
            $('h1').hide();
          }
      });
  }
}

function round(value, exp) {
  if (typeof exp === 'undefined' || +exp === 0)
    return Math.round(value);

  value = +value;
  exp = +exp;

  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
    return NaN;

  // Shift
  value = value.toString().split('e');
  value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
}


function zScores(array){

    function getVariance(arr, mean) {
      return arr.reduce(function(pre, cur) {
          pre = pre + Math.pow((cur - mean), 2);
          return pre;
      }, 0)
    }

    var sum = 0;
		for (var i = 0, l = array.length; i < l; i++){
      array[i]= parseInt(array[i]);
      sum += array[i];
    }


    var mean = sum/array.length;
    var variance = getVariance(array, mean);
    var std = Math.sqrt(variance);

		return array.map(function(num) {
      var zscore= (num - mean) / std
      if (std == 0){return 0;}
			return (round(zscore,4));
		});
}






function create_plot(zscore){
  var e1 = document.querySelectorAll('#responses *');

  var found_genes = [];
  var nf = [];
  var tpms = [];

  for(var i = 0, length =  e1.length; i < length; i++){
    var data = e1[i].textContent;
    var json = JSON.parse(data);
    if (json.message == "found"){
      found_genes.push(json.gene_id);
      if(zscore){
        z= zScores(json.tpm);
        tpms.push(z);
      }
      else{
        tpms.push(json.tpm);
      }
    }
    else {nf.push(json.gene_id);}
  }


    var width = 600;
    var height = 600;
    var size = 12;
    if (found_genes.length > 28){
      height = 800;
      size = 6;
    }
    if (found_genes.length > 55){
      height = 900;
      size = 4;
    }
    var title = "average log(tpm)"
    if (zscore){title = "Z-Score";}

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
      height:height,
      title: title,
      margin: {
          l: 100,
          r: 100,
          b: 100,
          t: 100,
          pad: 10
        },
      xaxis: {
          tickangle:45,
          tickfont: {
           size: 12,
           color: 'rgb(107, 107, 107)'
         }
       },
      yaxis:{tickfont:{size:size}}
    }
  Plotly.newPlot('myDiv', data,layout);
  document.getElementById("loader").style.display = "none";
}

function groupBy(value){
  var occ = value
  if (occ == "View As Z-Score"){
    create_plot(true);
    document.getElementById("groupBySomething").innerHTML = "View As Log(TPM)";
  }
  else{
    create_plot(false);
    document.getElementById("groupBySomething").innerHTML = "View As Z-Score";
  }
}

window.onload = function(){
  document.getElementById("loader").style.display = "none";
  $('#groupBySomething').hide();
}
