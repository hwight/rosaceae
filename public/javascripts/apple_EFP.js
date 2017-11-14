//Create EFP with this clientside javascript
//created by Haley Wight and a variety helpful stack overflow posts

//hex to rgb
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        R: parseInt(result[1], 16),
        G: parseInt(result[2], 16),
        B: parseInt(result[3], 16)
    } : null;
}

//round numbers for scale
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

function spacing(max,min){
  var min = min;

  var spacer = (max-min)/3;

  spacer = round(spacer,2)

  var spacings = [min,(spacer+min),(max-spacer),max];

  for (var i = 0; i < 4; i ++){
    spacings[i] = round(spacings[i],2);
  }



  return spacings;
}

//recolor an image
function getPixels(img, id, color){
  var item = document.getElementById(id);
  var newColor = color;

  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var originalPixels = null;
  var currentPixels = null;


  canvas.width = img.width;
  canvas.height = img.height;

  ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);
  originalPixels = ctx.getImageData(0, 0, 300, 250);
  currentPixels = ctx.getImageData(0, 0, 300, 250);

  //img.onload = null;

  if(!originalPixels) return; // Check if image has loaded
  for(var I = 0, L = originalPixels.data.length; I < L; I += 4)
    {
        if(currentPixels.data[I + 3] > 0) // If it's not a transparent pixel
        {
              currentPixels.data[I] = newColor.R;
              currentPixels.data[I + 1] = newColor.G;
              currentPixels.data[I + 2] = newColor.B;
        }
    }

    ctx.putImageData(currentPixels, 0, 0);
    var url = canvas.toDataURL("image/png");
    item.src = url;
}

function save_efp() {
        document.getElementById("btnSave").style.visibility="hidden";
        document.getElementById("Description").style.visibility="hidden";
        document.getElementById("EFP_header").innerHTML = document.getElementById("geneName").innerHTML

        html2canvas($("#EFP_content"), {
            onrendered: function(canvas) {
                theCanvas = canvas;
                // Convert and download as image
                //Canvas2Image.saveAsPNG(canvas);

                theCanvas.toBlob(function(blob) {
                  saveAs(blob, "efp.png");
                  }, "image/png");

                document.getElementById("btnSave").style.visibility="visible";
                document.getElementById("EFP_header").innerHTML = "EFP";
                document.getElementById("Description").style.visibility="visible";
            }
        });
}


function adjust_efp(max){
  //parse json data
  var data = document.getElementById("json_res").innerHTML;
  var json = JSON.parse(data);
  json = json[0];
  //***********************************************************

  //reassign gene name
  var id = json['gene_id'];
  document.getElementById("geneName").innerHTML = id;

  //get max and tpm for scale
  var all_stages = json['stage_0'].concat(json['stage_6'],json['stage_12'],json['stage_20']);
  all_stages=all_stages.map(Number);

  var maximum = document.getElementById("max").innerHTML;
  var minimum = document.getElementById("min").innerHTML;

  var max = Math.max(...all_stages);
  if (maximum > max){
        var max = maximum
  }

  var min = Math.min(...all_stages);
  if (minimum < min)
  {
    var min = minimum
  }
  
  min = round(min,2)



   //create tpm scale
   var c = document.getElementById("myCanvas");
   var ctx = c.getContext("2d");
   var grd = ctx.createLinearGradient(0,0,300,0);
   grd.addColorStop(0,"#feebe2");
   grd.addColorStop(.25,"#fbb4b9");
   grd.addColorStop(.5,"#f768a1");
   grd.addColorStop(.75,"#c51b8a");
   grd.addColorStop(1,"#7a0177");
   // fill with gradient
   ctx.fillStyle = grd;
   ctx.fillRect(10,10,300,80);

   //get spacings
   var labels= spacing(max,min);
   document.getElementById("l1").innerHTML = labels[0];
   document.getElementById("l2").innerHTML = labels[1];
   document.getElementById("l3").innerHTML = labels[2];
   document.getElementById("l4").innerHTML = labels[3];
   //***********************************************************



  //recolor images
  var hypanthium_image = new Image();
  hypanthium_image.src = ("/images/apple-hypanthium-01.png");
  var seed_image = new Image();
  seed_image.src = ("/images/apple-seed-01.png");
  var wall_image = new Image();
  wall_image.src= ("/images/apple-wall-01.png");


 var stages = ["0","6","12","20"];
 var rainbow = new Rainbow();
 rainbow.setNumberRange(min, max);
 rainbow.setSpectrum('#feebe2','#fbb4b9','#f768a1','#c51b8a','#7a0177');

 for(var i = 0, length = stages.length; i < length; i++)
 {
     var stage = stages[i];

     var arr_id = "stage_"+stage;
     var h_id = "h"+stage;
     var s_id = "s"+stage;
     var w_id = "w"+stage;


     //get tpm values and weights for that stage
     var json_array = json[arr_id];

     //calculate rgb values based on weights
     var h_color = hexToRgb(rainbow.colourAt(json_array[0]));
     var s_color = hexToRgb(rainbow.colourAt(json_array[2]));
     var w_color = hexToRgb(rainbow.colourAt(json_array[1]));

     //redraw image with selected color
     getPixels(hypanthium_image,h_id,h_color);
     getPixels(wall_image,w_id,w_color);
     getPixels(seed_image,s_id, s_color);

 }
}



function plot_bar_stage(){
    //parse json data
    var data = document.getElementById("json_res").innerHTML;
    var json = JSON.parse(data);
    json = json[0];
    //***********************************************************

    var stage0 = {
      x: ['hypanthium_0', 'wall_0', 'seed_0'],
      y: json['stage_0'],
      name: '0 DPA',
      type: 'bar'
    };

    var stage6 = {
      x: ['hypanthium_6', 'wall_6', 'seed_6'],
      y: json['stage_6'],
      name: '6 DPA',
      type: 'bar'
    };

    var stage12 = {
      x: ['hypanthium_12', 'wall_12', 'seed_12'],
      y: json['stage_12'],
      name: '12 DPA',
      type: 'bar'
    };

    var stage20 = {
      x: ['hypanthium_20', 'wall_20', 'seed_20'],
      y: json['stage_20'],
      name: '20 DPA',
      type: 'bar'
    };


  var data = [stage0,stage6,stage12,stage20];

  var layout = {
    barmode: 'group',
    bargroupgap:0.1,
    bargap:0.2,
    title: json['gene_id'],
    yaxis: {
      title: 'average tpm',
      titlefont: {
        size: 16,
        color: 'rgb(107, 107, 107)'
      }},
   xaxis: {
     tickangle:45,
     tickfont: {
      size: 12,
      color: 'rgb(107, 107, 107)'
    }
    }
  };

  Plotly.newPlot('myDiv', data,layout);
}


function plot_bar_tissue(){
    //parse json data
    var data = document.getElementById("json_res").innerHTML;
    var json = JSON.parse(data);
    json = json[0];
    //***********************************************************
    var stage0 = json['stage_0'];
    var stage5 = json['stage_6'];
    var stage12 = json['stage_12'];
    var stage18 = json['stage_20'];


    var hypanthium = {
      x: ['hypanthium_0', 'hypanthium_6', 'hypanthium_12','hypanthium_20'],
      y: [stage0[0],stage5[0],stage12[0],stage18[0]],
      name: 'receptacle',
      type: 'bar'
    };

    var wall = {
      x: ['wall_0', 'wall_6', 'wall_12','wall_20'],
      y: [stage0[1],stage5[1],stage12[1],stage18[1]],
      name: 'wall',
      type: 'bar'
    };

    var seed = {
      x: ['seed_0', 'seed_6', 'seed_12','seed_20'],
      y: [stage0[2],stage5[2],stage12[2],stage18[2]],
      name: 'seed',
      type: 'bar'
    };


  var data = [hypanthium,seed,wall];

  var layout = {
    barmode: 'group',
    bargroupgap:0.1,
    bargap:0.2,
    title: json['gene_id'],
    yaxis: {
      title: 'average tpm',
      titlefont: {
        size: 16,
        color: 'rgb(107, 107, 107)'
      }},
   xaxis: {
     tickangle:45,
     tickfont: {
      size: 12,
      color: 'rgb(107, 107, 107)'
    }
    }
  };

  Plotly.newPlot('myDiv', data,layout);
}

function groupBy(value){
  var occ = value
  if (occ == "Group By Stage"){
    plot_bar_stage();
    document.getElementById("groupBySomething").innerHTML = "Group By Tissue";
  }
  else{
    plot_bar_tissue();
    document.getElementById("groupBySomething").innerHTML = "Group By Stage";
  }
}



function fill_table(){
  var data = document.getElementById("json_res").innerHTML;
  var json = JSON.parse(data);
  json = json[0];

  var raw = json['stage_0'].concat(json['stage_6'],json['stage_12'],json['stage_20']);
  for(var i = 0, length = raw.length; i < length; i++)
  {
    id=i+1;
    document.getElementById(id).innerHTML = round(raw[i],3);
  }
}

function fill_orthologs(){
    //parse json data
    var data = document.getElementById("json_res").innerHTML;
    var json = JSON.parse(data);
    json = json[0];
    //***********************************************************

    var prunus = json["prunus_ortho"];
    var frag = json["frag_ortho"];
    var rubus = json["rubus_ortho"];
    var pyrus = json["pyrus_ortho"];
    if (prunus){ $('#prunus').append( prunus.join(',') );}
    if(frag){ $('#frag').append( frag.join(',') );}
    if(rubus){$('#rubus').append( rubus.join(',') );}
    if(pyrus){$('#pyrus').append( pyrus.join(',') );}
}

function hide_graph(){
  $('#myDiv').hide();
  $('#groupBySomething').hide();
  $('#graphShow').show();
  $('#graphHide').hide();
}

function show_graph(){
  $('#myDiv').show();
  $('#groupBySomething').show();
  $('#graphShow').hide();
  $('#graphHide').show();
}

function hide_table(){
  $('.table_content').hide();
  $('#dataShow').show();
  $('#dataHide').hide();
}

function show_table(){
  $('.table_content').show();
  $('#dataShow').hide();
  $('#dataHide').show();
}

function hide_orth(){
  $('.orth_list').hide();
  $('#orthoShow').show();
  $('#orthoHide').hide();
}

function show_orth(){
  $('.orth_list').show();
  $('#orthoShow').hide();
  $('#orthoHide').show();
}

//ready set GO!
window.onload = function(){
  adjust_efp(0);
  plot_bar_tissue();
  hide_graph();
  hide_table();
  fill_table();
  hide_orth();
  fill_orthologs();
}

