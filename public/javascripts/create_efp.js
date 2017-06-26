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
  if (min < 0){
    min = min*-1
  }
  var spacer = (max-min)/3;
  spacings =[0,0,0,0];
  for (var i = 1; i < 4; i ++){
    spacings[i] = spacings[i-1]+spacer;
  }

  for (var i = 0; i < 4; i ++){
    spacings[i] = round(spacings[i],2);
  }
  spacings[0]=round(min,2);
  spacings[3] = round(max,2);
  console.log(spacings);
  return spacings;
}


//recolor an image
function getPixels(img, id, color)
{
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
  var all_stages = json['stage_0'].concat(json['stage_2'],json['stage_4'],json['stage_6'],json['stage_9'],json['stage_12']);
  var max = max;
  var min = 900;
  for(var i = 0, length =  all_stages.length; i < length; i++){
      if (all_stages[i] > max){
         max = all_stages[i]
      }
      if (all_stages[i] < max){
        min = all_stages[i];
      }
   }
   //***********************************************************



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
   console.log(labels);
   console.log(max);
   //***********************************************************



  //recolor images
  var receptacle_image = new Image();
  receptacle_image.src = ("/images/receptacle.png");
  var seed_image = new Image();
  seed_image.src = ("/images/seed.png");
  var wall_image = new Image();
  wall_image.src= ("/images/wall.png");


 var stages = ["0","2","4","6","9","12"];
 var rainbow = new Rainbow();
 rainbow.setNumberRange(0, max);
 rainbow.setSpectrum('#feebe2','#fbb4b9','#f768a1','#c51b8a','#7a0177');

 for(var i = 0, length = stages.length; i < length; i++)
 {
     var stage = stages[i];

     var arr_id = "stage_"+stage;
     var r_id = "r"+stage;
     var s_id = "s"+stage;
     var w_id = "w"+stage;


     //get tpm values and weights for that stage
     var json_array = json[arr_id];

     //calculate rgb values based on weights
     var r_color = hexToRgb(rainbow.colourAt(json_array[0]));
     var s_color = hexToRgb(rainbow.colourAt(json_array[1]));
     var w_color = hexToRgb(rainbow.colourAt(json_array[2]));

     //redraw image with selected color
     getPixels(receptacle_image,r_id,r_color);
     getPixels(wall_image,w_id,w_color);
     getPixels(seed_image,s_id, s_color);

 }
}

function change_max(){
  var new_max = document.getElementById("num").value;
  adjust_efp(new_max);
  $('#myModal').modal('toggle');
}

function save_efp() {
        document.getElementById("btnSave").style.visibility="hidden";
        document.getElementById("modalButton").style.visibility="hidden";
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
                document.getElementById("modalButton").style.visibility="visible";
                document.getElementById("EFP_header").innerHTML = "EFP";
                document.getElementById("Description").style.visibility="visible";
            }
        });

}

function plot_bar_stage(){
    //parse json data
    var data = document.getElementById("json_res").innerHTML;
    var json = JSON.parse(data);
    json = json[0];
    //***********************************************************

    var stage0 = {
      x: ['receptacle_0', 'seed_0', 'wall_0'],
      y: json['stage_0'],
      name: '0 DPA',
      type: 'bar'
    };

    var stage2 = {
      x: ['receptacle_2', 'seed_2', 'wall_2'],
      y: json['stage_2'],
      name: '2 DPA',
      type: 'bar'
    };

    var stage4 = {
      x: ['receptacle_4', 'seed_4', 'wall_4'],
      y: json['stage_4'],
      name: '4 DPA',
      type: 'bar'
    };

    var stage6 = {
      x: ['receptacle_6', 'seed_6', 'wall_6'],
      y: json['stage_6'],
      name: '6 DPA',
      type: 'bar'
    };

    var stage9 = {
      x: ['receptacle_9', 'seed_9', 'wall_9'],
      y: json['stage_9'],
      name: '9 DPA',
      type: 'bar'
    };

    var stage12 = {
      x: ['receptacle_12', 'seed_12', 'wall_12'],
      y: json['stage_12'],
      name: '12 DPA',
      type: 'bar'
    };

  var data = [stage0,stage2,stage4,stage6,stage9,stage12];

  var layout = {
    barmode: 'group',
    bargroupgap:0.1,
    bargap:0.2,
    title: json['gene_id'],
    yaxis: {
      title: 'avergae log(tpm)',
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
    var stage2 = json['stage_2'];
    var stage4 = json['stage_4'];
    var stage6 = json['stage_6'];
    var stage9 = json['stage_9'];
    var stage12 = json['stage_12'];

    console.log(stage0[0].concat(stage2[0],stage4[0],stage6[0],stage9[0],stage12[0]));

    var receptacle = {
      x: ['receptacle_0', 'receptacle_2', 'receptacle_4','receptacle_6','receptacle_9','receptacle_12'],
      y: [stage0[0],stage2[0],stage4[0],stage6[0],stage9[0],stage12[0]],
      name: 'receptacle',
      type: 'bar'
    };

    var seed = {
      x: ['seed_0', 'seed_2', 'seed_4','seed_6','seed_9','seed_12'],
      y: [stage0[1],stage2[1],stage4[1],stage6[1],stage9[1],stage12[1]],
      name: 'seed',
      type: 'bar'
    };

    var wall = {
      x: ['wall_0', 'wall_2', 'wall_4','wall_6','wall_9','wall_12'],
      y: [stage0[2],stage2[2],stage4[2],stage6[2],stage9[2],stage12[2]],
      name: 'wall',
      type: 'bar'
    };

  var data = [receptacle,seed,wall];

  var layout = {
    barmode: 'group',
    bargroupgap:0.1,
    bargap:0.2,
    title: json['gene_id'],
    yaxis: {
      title: 'avergae log(tpm)',
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


function fill_table(){
  var data = document.getElementById("json_res").innerHTML;
  var json = JSON.parse(data);
  json = json[0];

  raw = json['raw'];

  for(var i = 0, length = raw.length; i < length; i++)
  {
    document.getElementById(i).innerHTML = round(raw[i],3);
  }
}


function generate_excel(tableid) {
  $(function() {
    var gene_name = document.getElementById("geneName").innerHTML;
    $(tableid).table2excel({
      exclude: ".noExl",
      name: "Excel Document Name",
      filename: gene_name,
      fileext: ".xls",
      exclude_img: true,
      exclude_links: true,
      exclude_inputs: true
    });
  });
}



function fill_orthologs(){
    //parse json data
    var data = document.getElementById("json_res").innerHTML;
    var json = JSON.parse(data);
    json = json[0];
    //***********************************************************

    var malus = json["malus_ortho"];
    var frag = json["frag_ortho"];
    var prunus = json["prunus_ortho"];
    var pyrus = json["pyrus_ortho"];
    if (malus){
      $('#malus').append( malus.join(',') );
    }
    if(frag){ $('#frag').append( frag.join(',') );}
    if(prunus){$('#prunus').append( prunus.join(',') );}
    if(pyrus){$('#pyrus').append( pyrus.join(',') );}
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


//ready set GO!
window.onload = function(){
  adjust_efp(0);
  plot_bar_tissue();
  fill_table();
  fill_orthologs();
  hide_graph();
  hide_table();
  hide_orth();
}
