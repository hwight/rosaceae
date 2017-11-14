//load flat image
function loadImage(path, width, height, target, id) {
    $('<img style="z-index:2;" src="'+ path +'" id='+id+'>').load(function() {
        $(this).width(width).height(height).appendTo(target); 
    });
}


//load an image in a different color (weighted by count value)
function loadImageColor(path, width,height,target,id,color){
    var img = new Image(width,height);
    img.src = (path)

    img.onload = function(){

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

          $('<img src="'+ url +'" id='+id+'>').load(function() {
              $(this).width(width).height(height).appendTo(target); 
          });
        }
}

//add rubus images to page
function add_rubus_img(gene_no,doc,min,max){
    stages=['0','2','4','6','9','12'];

    var rainbow = new Rainbow();
    rainbow.setNumberRange(min, max);
     rainbow.setSpectrum('#ffffb2','#fecc5c','#fd8d3c','#f03b20','#bd0026');

    for (i in stages){
        this_stage= stages[i];
        target='#r'+this_stage+"-"+gene_no;
        stage= doc["stage_"+this_stage];

        if(stage){
        //calculate rgb values based on weights
        var r_color = hexToRgb(rainbow.colourAt(stage[0]));
        var s_color = hexToRgb(rainbow.colourAt(stage[1]));
        var w_color = hexToRgb(rainbow.colourAt(stage[2]));

        loadImageColor('images/receptacle_color.png',100,100,target,target+"-receptacle",r_color);
        loadImageColor('images/wall2.png',100,100,target,target+"-wall",w_color);
        loadImageColor('images/seed_color.png',100,100,target,target+"-seed",s_color);
        loadImage('images/outline.png', 100, 100, target,target+"-outline");
      }
    }
}

//add malus images to page
function add_malus_img(gene_no,doc,min,max){
    stages=['0','6','12','20'];


    var rainbow = new Rainbow();
    rainbow.setNumberRange(min, max);
     rainbow.setSpectrum('#ffffb2','#fecc5c','#fd8d3c','#f03b20','#bd0026');

    for (i in stages){
        this_stage= stages[i];

        stage= doc["stage_"+this_stage];

        //calculate rgb values based on weights
        var h_color = hexToRgb(rainbow.colourAt(stage[0]));
        var s_color = hexToRgb(rainbow.colourAt(stage[2]));
        var w_color = hexToRgb(rainbow.colourAt(stage[1]));


        target=jQuery.trim('#m'+this_stage+"-"+gene_no);
        loadImageColor('images/apple-hypanthium-01.png', 150, 150, target,target+"-hypanthium",h_color);
        loadImageColor('images/apple-wall-01.png', 150, 150, target,target+"-wall",w_color);
        loadImageColor('images/apple-seed-01.png', 150, 150, target,target+"-seed",s_color);
        loadImage('images/apple_outline-01.png', 150, 150, target,target+"-outline");
    }
}

//add fragaria images to page
function add_frag_img(gene_no,doc,min,max){
    var cortex=doc["cortex"];
    var pith=doc["pith"];
    var embryo=doc["embryo"];
    var seed=doc["seed"];
    var ghost=doc["ghost"];
    var wall =doc["wall"];


    var rainbow = new Rainbow();
    rainbow.setNumberRange(min, max);
     rainbow.setSpectrum('#ffffb2','#fecc5c','#fd8d3c','#f03b20','#bd0026');

    stages=['1','2','3','4','5'];
    for (i in stages){
        this_stage= stages[i];
        target='#f'+this_stage+"-"+gene_no;


        loadImageColor('images/straw_cortex-01.png', 150, 150, target,target+"-cortex",hexToRgb(rainbow.colourAt(cortex[i])));
        loadImageColor('images/strawberry-pith-01.png', 150, 150, target,target+"-pith",hexToRgb(rainbow.colourAt(pith[i])));
        loadImageColor('images/strawberry-wall-01.png', 150, 150, target,target+"-wall",hexToRgb(rainbow.colourAt(wall[i])));

        if(this_stage == '3' || this_stage == '4' || this_stage =='5'){
            loadImageColor('images/strawberry-embryo-01.png', 150, 150, target,target+"-embryo",hexToRgb(rainbow.colourAt(embryo[i-2])));
            loadImageColor('images/strawberry-ghost-01.png', 150, 150, target,target+"-ghost",hexToRgb(rainbow.colourAt(ghost[i-2])));
            loadImage('images/strawberry_outline-01.png', 150, 150, target,target+"-outline");
        }
        else{
            loadImageColor('images/strawberry-ghost-01.png', 150, 150, target,target+"-ghost",hexToRgb(rainbow.colourAt(seed[i])));
            loadImage('images/strawberry_outline-early-01.png', 150, 150, target,target+"-outline");
        }
    }
}

//add prunus images to page
function add_prunus_img(gene_no,doc,min,max){
    stages=['0','5','12','18'];

    var rainbow = new Rainbow();
    rainbow.setNumberRange(min, max);
     rainbow.setSpectrum('#ffffb2','#fecc5c','#fd8d3c','#f03b20','#bd0026');

    for (i in stages){
        this_stage= stages[i];
        stage= doc["stage_"+this_stage];

        //calculate rgb values based on weights
        var h_color = hexToRgb(rainbow.colourAt(stage[0]));
        var s_color = hexToRgb(rainbow.colourAt(stage[2]));
        var w_color = hexToRgb(rainbow.colourAt(stage[1]));


        target='#p'+this_stage+"-"+gene_no;
        loadImageColor('images/peach_hypanthium-01.png',200,200,target,target+"-hypanthium",h_color);
        loadImageColor('images/peach_seed-01.png',200,200,target,target+"-seed",s_color);
        loadImageColor('images/peach_wall-01.png',200,200,target,target+"-wall",w_color);
        loadImage('images/peach_outline-01.png', 200, 200, target,target+"-outline");
    }
}

//add divs to DOM to which images will be bound
function append_targets(spec,gene_no,geneName,isCurrentGene){
    var toAdd = document.createElement('div');
    toAdd.className='efp_container';
    var target=''

    var gene_header=document.createElement('h4');
    gene_header.innerHTML = geneName;
    toAdd.appendChild(gene_header);

    //attach rubus
    if(spec == 'rubus'){
        var target = 'rubus_id';

        toAdd.id = 'r_efp-'+gene_no;
        toAdd.className+=" rubus_container"
        
        stages=['0','2','4','6','9','12'];
        for (i in stages){
            this_stage= stages[i];
            var newDiv = document.createElement('div');
            newDiv.id = "r"+this_stage+'-'+gene_no;
            newDiv.className ="efp_img "

            if(this_stage=='0' || this_stage=='6'){
                newDiv.className +='left';
            }
            else if(this_stage=='4' || this_stage=='12'){
                newDiv.className +='right';
            }
            else{
                newDiv.className+='center';
            }

            if(this_stage=='6' || this_stage =='9' || this_stage =='12'){
                newDiv.className+=' bottom';
            }

            var imgCaption= document.createElement('p');
            imgCaption.innerHTML=this_stage+' DPA';
            newDiv.appendChild(imgCaption);

            toAdd.appendChild(newDiv);
        }
    }
 
    //attach malus
    if (spec=='malus'){
        var target = 'malus_dom';
        toAdd.id = 'm_efp-'+gene_no;

        stages=['0','6','12','20'];
        for (i in stages){
           this_stage= stages[i];
           var newDiv = document.createElement('div');
           newDiv.id = "m"+this_stage+'-'+gene_no; 


            newDiv.className ="efp_img "

            if(this_stage=='0'){
                newDiv.className +='left';
            }
            else if(this_stage=='12'){
                newDiv.className +='right';
            }
            else if(this_stage=='6'){
                newDiv.className+='center';
            }
            else{
              newDiv.className+=' really_right';
            }


            var imgCaption= document.createElement('p');
            imgCaption.innerHTML=this_stage+' DPA';
            newDiv.appendChild(imgCaption);  
            toAdd.appendChild(newDiv);         
        }
    }

    //attach prunus
    if (spec=='prunus'){
        var target = 'prunus_pers';
        toAdd.id = 'p_efp-'+gene_no;
        toAdd.className+=" peach_container"

        var stages=['0','5','12','18'];
        for (i in stages){
           this_stage= stages[i];
           var newDiv = document.createElement('div');
           newDiv.id = "p"+this_stage+'-'+gene_no; 

           newDiv.className ="efp_img "

            if(this_stage=='0'){
                newDiv.className +='left';
            }
            else if(this_stage=='12'){
                newDiv.className +='right';
            }
            else if(this_stage=='5'){
                newDiv.className+='center';
            }
            else{
              newDiv.className+='really_right';
            }

            
            var imgCaption= document.createElement('p');
            imgCaption.innerHTML=this_stage+' DPA';
            newDiv.appendChild(imgCaption);  
            toAdd.appendChild(newDiv);         
        }
    }

    if(spec=='frag'){
         var target = 'frag_vesca';
         toAdd.id = 'f_efp-'+gene_no;

         var stages=['1','2','3','4','5'];
         for (i in stages){
            this_stage= stages[i];

           var newDiv = document.createElement('div');
           newDiv.id = "f"+this_stage+'-'+gene_no;

            newDiv.className ="efp_img "

            if(this_stage=='1'){
                newDiv.className +='left';
            }
            else if(this_stage=='3'){
                newDiv.className +='right';
            }
            else if(this_stage=='2'){
                newDiv.className+='center';
            }

            else if(this_stage=='4'){
                newDiv.className+=' really_right';
            }
            else{
              newDiv.className+=' really_really_right';
            }


           var imgCaption= document.createElement('p');
           imgCaption.innerHTML='stage '+this_stage;

            newDiv.appendChild(imgCaption);  
            toAdd.appendChild(newDiv);   

         }
    }

    if(isCurrentGene)
    {
        target='current_gene'
    }

    document.getElementById(target).appendChild(toAdd);
}

//get counts for each ortholog and add to a hidden paragraph 
//when all paragraphs are filled, color the images with 
//proper values
function db_call(gene_id,gene_no,species,target){

    $.post( "/get_gene_comp", {gene:jQuery.trim(gene_id),species:species}, function(data) {
            
            var id='gene_info_'
            if(species=='malus'){id+="malus";}
            else if(species =='frag'){id+='frag';}
            else if(species=='rubus'){id+="rubus";}
            else{id+="prunus";}
            id+='_'

            var ptext = '<p  id='+id+gene_no+' class="aGene hidden"> '+JSON.stringify(data)+ ' </p>';
            $(target).append(ptext);

            //parse json data and get number of db calls that should be made
            var orig_data = document.getElementById("json_res").innerHTML;
            var json = JSON.parse(orig_data);
            json = json[0];

            var malus = json["malus_ortho"];
            var frag = json["frag_ortho"];
            var prunus = json["prunus_ortho"];
            var rubus = json["rubus_ortho"];
            var num_of_genes=1;
            if(malus){num_of_genes+=malus.length;}
            if(frag){num_of_genes+=frag.length;}
            if(prunus){num_of_genes+=prunus.length}
            if(rubus){num_of_genes+=rubus.length;}
            //***********************************************************
 


            //get number of all successful db calls 
            var e1 = document.querySelectorAll('.aGene');

            if(e1.length == num_of_genes){
                launch_color(false);
                create_raw_value_list();
            }
      });

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

//find proper spacings for scale
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


//add color scale and fill EFP
function launch_color(is_Zscore){
    var docs = Array.prototype.slice.call(document.getElementsByClassName('aGene')).map(function(x){return x.innerHTML});

    //get total max and min for color bar
    raw_counts=[];

    for (i in docs){
        this_doc=docs[i];
        this_doc=JSON.parse(this_doc);

        //the first doc aka current doc is weird
        if (i == 0){
            this_doc=this_doc[0];
        }
        else{
            this_doc=this_doc['json'];
        }
        if(is_Zscore){raw_counts=raw_counts.concat(zScores(this_doc['raw']));}
        else{raw_counts=raw_counts.concat(this_doc['raw']);}
    }  


    raw_counts= raw_counts.map(Number);
    var max = Math.max(...raw_counts);
    var min = Math.min(...raw_counts);

    //create scale
   var c = document.getElementById("myCanvas");
   var ctx = c.getContext("2d");
   var grd = ctx.createLinearGradient(0,0,200,0);
   grd.addColorStop(0,"#ffffb2");
   grd.addColorStop(.25,"#fecc5c");
   grd.addColorStop(.5,"#fd8d3c");
   grd.addColorStop(.75,"#f03b20");
   grd.addColorStop(1,"#bd0026");

   // fill with gradient
   ctx.fillStyle = grd;
   ctx.fillRect(10,10,200,80);

   //get spacings
   var labels= spacing(max,min);
   document.getElementById("l1").innerHTML = labels[0];
   document.getElementById("l2").innerHTML = labels[1];
   document.getElementById("l3").innerHTML = labels[2];
   document.getElementById("l4").innerHTML = labels[3];
   //***********************************************************


   //fill EFP images
   fill_EFP(min,max,is_Zscore);
}

//hex to rgb
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        R: parseInt(result[1], 16),
        G: parseInt(result[2], 16),
        B: parseInt(result[3], 16)
    } : null;
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


function convert_to_zscore(this_doc,stages){

  var total_counts=[];
          
  for (i in stages){
    this_stage = stages[i];
    total_counts=total_counts.concat(this_doc['stage_'+this_stage]);
  }

  //convert stage tpm value to respective z scores
  var z_scores = zScores(total_counts);
  var next_i=-3
  for (i in stages){
    next_i= next_i+3;
    this_stage = stages[i];
    this_doc['stage_'+this_stage]=[z_scores[next_i],z_scores[next_i+1],z_scores[next_i+2]];
  }

  return(this_doc);

}

//fill EFP images with color 
function fill_EFP(min,max,is_Zscore){
  var rubus_docs=Array.prototype.slice.call(document.querySelectorAll('#rubus_id .aGene')).map(function(x){return x.innerHTML});
  
  for (i in rubus_docs){
        var json = JSON.parse(rubus_docs[i]);
        var this_doc=json['json'];
        var gene_id=json['gene_id'];
        gene_id=jQuery.trim(gene_id)

        if(is_Zscore){
          this_doc = convert_to_zscore(this_doc,['0','2','4','6','9','12']);
        }

        add_rubus_img(gene_id,this_doc,min,max);
  }

  var peach_docs = Array.prototype.slice.call(document.querySelectorAll('#prunus_pers .aGene')).map(function(x){return x.innerHTML});
  for (i in peach_docs){
        var json = JSON.parse(peach_docs[i]);
        var this_doc=json["json"];
        var gene_id=this_doc['gene_id'];
        gene_id=jQuery.trim(gene_id)

        if(is_Zscore){
          this_doc = convert_to_zscore(this_doc,['0','5','12','18']);
        }

        add_prunus_img(gene_id,this_doc,min,max);
  }

  var malus_docs = Array.prototype.slice.call(document.querySelectorAll('#malus_dom .aGene')).map(function(x){return x.innerHTML});
  for (i in malus_docs){
      var json = JSON.parse(malus_docs[i]);
      var this_doc=json["json"];
      var gene_id=this_doc['gene_id'];
      gene_id=jQuery.trim(gene_id)

      if(is_Zscore){
          this_doc = convert_to_zscore(this_doc,['0','6','12','20']);
      }

      add_malus_img(gene_id,this_doc,min,max);
  }

  var frag_docs = Array.prototype.slice.call(document.querySelectorAll('#frag_vesca .aGene')).map(function(x){return x.innerHTML});
  for (i in frag_docs){
      var json = JSON.parse(frag_docs[i]);
      var this_doc=json["json"];
      var gene_id=this_doc['gene_id'];
      gene_id=jQuery.trim(gene_id)

      if(is_Zscore){
        var total_counts=[];
        var stages=['cortex','pith','wall','seed','embryo','ghost'];
          
        for (i in stages){
          this_stage = stages[i];
          total_counts=total_counts.concat(this_doc[this_stage]);
        }
        var z_scores = zScores(total_counts);

        this_doc['cortex']=z_scores.slice(0,5);
        this_doc['pith']=z_scores.slice(5,10);
        this_doc['wall']=z_scores.slice(10,15);
        this_doc['seed']=z_scores.slice(15,17);
        this_doc['embryo']=z_scores.slice(17,20);
        this_doc['ghost']=z_scores.slice(20,23);
      }

      add_frag_img(gene_id,this_doc,min,max);
  }

  //parse json data
  var data = document.getElementById("json_res").innerHTML;
  var json = JSON.parse(data);
  json = json[0];
  //***********************************************************

  var id = json['gene_id']; 
  var species = document.getElementById("species").innerHTML;

  if(species == "Rubus idaeus"){
      add_rubus_img(50,json,min,max);
  }
  else if(species == "Fragaria vesca"){
      add_frag_img(50,json,min,max);
  }
  else if(species == "Malus domestica"){
      add_malus_img(50,json,min,max);
  }
  else if(species == "Prunus persica"){
      add_prunus_img(50,json,min,max);
  }

}

//create space for orthologs on the page and launch a db call for each 
//to get counts
function fill_orthologs(){
    //parse json data
    var data = document.getElementById("json_res").innerHTML;
    var json = JSON.parse(data);
    json = json[0];
    //***********************************************************

    var id = json['gene_id']; 
    var species = document.getElementById("species").innerHTML;


    if(species == "Rubus idaeus"){
      $("#ri").hide();
      $('#rubus_id').hide()
      append_targets('rubus',50,id,true);
    }
    else if(species == "Fragaria vesca"){
      $("#fv").hide();
      $('#frag_vesca').hide();
      append_targets('frag',50,id,true);
    }
    else if(species == "Malus domestica"){
      $("#md").hide();
      $('#malus_dom').hide()
      append_targets('malus',50,id,true);
    }
    else if(species == "Prunus persica"){
      $("#pp").hide();
      $('#prunus_pers').hide();
      append_targets('prunus',50,id,true);
    }


    var malus = json["malus_ortho"];
    var frag = json["frag_ortho"];
    var prunus = json["prunus_ortho"];
    var pyrus = json["pyrus_ortho"];
    var rubus = json["rubus_ortho"];
    
    if (malus){
        for (gene in malus){
            var mgene=jQuery.trim(malus[gene])
            append_targets('malus',mgene,mgene,false);
            db_call(mgene,gene,"malus","#malus_dom");
        }
    }
    else{
        $('#malus_dom').hide();
        $('#md').hide();
    }


    if(frag){
        for (gene in frag){
            var fgene=jQuery.trim(frag[gene])
            append_targets('frag',fgene,fgene,false);
            db_call(fgene,gene,"frag","#frag_vesca");
        }        
    }
    else{
      $("#fv").hide();
      $('#frag_vesca').hide();
    }


    if(rubus){
        for (gene in rubus){
            var rgene=jQuery.trim(rubus[gene])
            append_targets('rubus',rgene,rgene,false);
            db_call(rgene,gene,"rubus","#rubus_id");
        }
    }
    else{
      $("#ri").hide();
      $('#rubus_id').hide()
    }

    if(prunus){
        for (gene in prunus){
            var pgene=jQuery.trim(prunus[gene])
            append_targets('prunus',pgene,pgene,false);
            db_call(pgene,gene,"prunus","#prunus_pers");
        }        
    }
    else{
      $("#pp").hide();
      $('#prunus_pers').hide();
    }
    
}

//make images appear and disapear for the image description section of the page
function show_descriptor(id){
  $('#'+id).show();
  $('#'+id+'_button').css('background-color','teal').css('color','white');
  $('.description').not('#' + id).hide();
  $('.btn').not('#'+id+'_button').css('background-color','white').css('color','black');
}

//convert values to z score
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

//convert tpms to z score for each function
function tpm_to_z(){
  launch_color(true);
  document.getElementById("scale_header").innerHTML='Z-score';
  $("#z_score").hide();
  $("#log_tpm").show();
}

//convert z score to tpm for each function
function z_to_tpm(){
  launch_color(false);
  document.getElementById("scale_header").innerHTML='log(tpm)';
  $("#log_tpm").hide();
  $("#z_score").show();
}

function rubus_values(rubus_docs){
  var rubus_header=document.createElement('h4');
  rubus_header.innerHTML="Rubus idaeus";
  for (i in rubus_docs){
        var json = JSON.parse(rubus_docs[i]);
        var this_doc=json['json'];
        var gene_id=json['gene_id'];
        var gene_header=document.createElement('h5')
        gene_header.innerHTML=gene_id

        var new_ul=document.createElement('ul');

        var stages=['0','2','4','6','9','12'];
        for (i in stages){
          this_stage=stages[i];
          stage=this_doc['stage_'+this_stage];

          var receptacle = round(stage[0],3);
          var seed = round(stage[1],3);
          var wall= round(stage[2],3);
          
          var r_item=document.createElement('li');
          var s_item=document.createElement('li');
          var w_item=document.createElement('li');

          r_item.innerHTML='receptacle_'+this_stage+": "+receptacle;
          s_item.innerHTML='seed_'+this_stage+": "+seed;
          w_item.innerHTML='wall_'+this_stage+": "+wall;

          new_ul.appendChild(r_item);
          new_ul.appendChild(s_item);
          new_ul.appendChild(w_item);
        }

        gene_header.appendChild(new_ul);
        rubus_header.appendChild(gene_header);
        console.log(document.getElementById('raw_counts'));
        document.getElementById('raw_counts').appendChild(rubus_header);
  }
}

function peach_values(peach_docs){
  var header=document.createElement('h4');
  header.innerHTML="Prunus persica";
  
  for (i in peach_docs){
        var json = JSON.parse(peach_docs[i]);
        var this_doc=json['json'];
        var gene_id=json['gene_id'];
        var gene_header=document.createElement('h5')
        gene_header.innerHTML=gene_id

        var new_ul=document.createElement('ul');

        var stages=['0','5','12','18'];

        for (i in stages){
          this_stage=stages[i];
          stage=this_doc['stage_'+this_stage];

          var hypanthium = stage[0];
          var seed = stage[2];
          var wall = stage[1];
          
          var h_item=document.createElement('li');
          var s_item=document.createElement('li');
          var w_item=document.createElement('li');

          h_item.innerHTML='hypanthium_'+this_stage+": "+hypanthium;
          s_item.innerHTML='seed_'+this_stage+": "+seed;
          w_item.innerHTML='wall_'+this_stage+": "+wall;

          new_ul.appendChild(h_item);
          new_ul.appendChild(s_item);
          new_ul.appendChild(w_item);
        }

        gene_header.appendChild(new_ul);
        header.appendChild(gene_header);
        document.getElementById('raw_counts').appendChild(header);
  }
}

function apple_values(apple_docs){
  var header=document.createElement('h4');
  header.innerHTML="Malus domestica";
  
  for (i in apple_docs){
        var json = JSON.parse(apple_docs[i]);
        var this_doc=json['json'];
        var gene_id=json['gene_id'];
        var gene_header=document.createElement('h5')
        gene_header.innerHTML=gene_id;

        var new_ul=document.createElement('ul');

        var stages=['0','6','12','20'];

        for (i in stages){
          this_stage=stages[i];
          stage=this_doc['stage_'+this_stage];

          var hypanthium = stage[0];
          var seed = stage[2];
          var wall = stage[1];
          
          var h_item=document.createElement('li');
          var s_item=document.createElement('li');
          var w_item=document.createElement('li');

          h_item.innerHTML='hypanthium_'+this_stage+": "+hypanthium;
          s_item.innerHTML='seed_'+this_stage+": "+seed;
          w_item.innerHTML='wall_'+this_stage+": "+wall;

          new_ul.appendChild(h_item);
          new_ul.appendChild(s_item);
          new_ul.appendChild(w_item);
        }

        gene_header.appendChild(new_ul);
        header.appendChild(gene_header);
        document.getElementById('raw_counts').appendChild(header);
  }
}

function frag_values(docs){
  var header=document.createElement('h4');
  header.innerHTML='Fragaria vesca';

  for (i in docs){
        var json = JSON.parse(docs[i]);
        var doc=json['json'];
        var gene_id=json['gene_id'];

        var gene_header=document.createElement('h5')
        gene_header.innerHTML=gene_id;

       var cortex=doc["cortex"];
       var pith=doc["pith"];
       var embryo=doc["embryo"];
       var seed=doc["seed"];
       var ghost=doc["ghost"];
       var wall =doc["wall"];

        var new_ul=document.createElement('ul');
        stages=['1','2','3','4','5'];
        for (i in stages){
            this_stage= stages[i];
            
            var c_item=document.createElement('li');
            var w_item=document.createElement('li');
            var p_item=document.createElement('li');

            c_item.innerHTML='cortex_'+this_stage+": "+round(cortex[i],3);
            p_item.innerHTML='pith_'+this_stage+": "+round(pith[i],3);
            w_item.innerHTML='wall_'+this_stage+": "+round(wall[i],3);

            new_ul.appendChild(c_item);
            new_ul.appendChild(p_item);
            new_ul.appendChild(w_item);


            if(this_stage == '3' || this_stage == '4' || this_stage =='5'){
                var e_item=document.createElement('li');
                var g_item=document.createElement('li');

                e_item.innerHTML='embryo_'+this_stage+": "+round(embryo[i-2],3);
                g_item.innerHTML='ghost_'+this_stage+": "+round(ghost[i-2],3);

                new_ul.appendChild(e_item);
                new_ul.appendChild(g_item);
            }
            else{
                var s_item=document.createElement('li');
                s_item.innerHTML='embryo_'+this_stage+": "+round(seed[i],3);
                new_ul.appendChild(s_item);
            }
        }

        gene_header.appendChild(new_ul);
        header.appendChild(gene_header);
        document.getElementById('raw_counts').appendChild(header); 

    }
}




function create_raw_value_list(){
  var rubus_docs=Array.prototype.slice.call(document.querySelectorAll('#rubus_id .aGene')).map(function(x){return x.innerHTML});
  var prunus_docs=Array.prototype.slice.call(document.querySelectorAll('#prunus_pers .aGene')).map(function(x){return x.innerHTML});
  var malus_docs=Array.prototype.slice.call(document.querySelectorAll('#malus_dom .aGene')).map(function(x){return x.innerHTML});
  var frag_docs=Array.prototype.slice.call(document.querySelectorAll('#frag_vesca .aGene')).map(function(x){return x.innerHTML});

  
  var species = document.getElementById("species").innerHTML;
  //***********************************************************
  var data = document.getElementById("json_res").innerHTML;
  var json = JSON.parse(data);
  json = json[0];
  var id = json['gene_id']; 


  if(species == "Rubus idaeus"){
      var rubus_docs = [JSON.stringify({"json":json,"gene_id":id})];
  }
  else if(species == "Fragaria vesca"){
    var frag_docs = [JSON.stringify({"json":json,"gene_id":id})];
  }
  else if(species == "Malus domestica"){
      var malus_docs = [JSON.stringify({"json":json,"gene_id":id})];
  }
  else if(species == "Prunus persica"){
      var prunus_docs = [JSON.stringify({"json":json,"gene_id":id})];
  }

  if(rubus_docs){
    rubus_values(rubus_docs);
  }


  if(prunus_docs){
    peach_values(prunus_docs);
  }

  if(malus_docs){
    apple_values(malus_docs);
  }
  if(frag_docs){
    frag_values(frag_docs);
  }

}

function hide_raw(){
  $('#raw_counts').hide();
  $('#showButton').show();
  $('#hideButton').hide();
}

function show_raw(){
  $('#raw_counts').show();
  $('#showButton').hide();
  $('#hideButton').show();
}

//ready set GO!
window.onload = function(){
  $("#log_tpm").hide();
  fill_orthologs();
  hide_raw();
}
