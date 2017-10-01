function loadImage(path, width, height, target, id) {
    $('<img style="z-index:2;" src="'+ path +'" id='+id+'>').load(function() {
        $(this).width(width).height(height).appendTo(target); 
    });
}

function loadImageColor(path, width,height,target,id,color){
    var img = new Image();
    img.src = (path);
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


//add rubus images to page
function add_rubus_img(gene_no,doc,min,max){
    stages=['0','2','4','6','9','12'];

    var rainbow = new Rainbow();
    rainbow.setNumberRange(min, max);
    rainbow.setSpectrum('#edf8e9','#bae4b3','#74c476','#31a354','#006d2c');

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
function add_malus_img(gene_no){
    stages=['0','6','12','20'];
    for (i in stages){
        this_stage= stages[i];
        target='#m'+this_stage+"-"+gene_no;
        loadImage('images/apple-hypanthium-01.png', 150, 150, target,target+"-hypanthium");
        loadImage('images/apple-wall-01.png', 150, 150, target,target+"-wall");
        loadImage('images/apple-seed-01.png', 150, 150, target,target+"-seed");
        loadImage('images/apple_outline-01.png', 150, 150, target,target+"-outline");
    }
}

//add fragaria images to page
function add_frag_img(gene_no){
    stages=['1','2','3','4','5'];
    for (i in stages){
        this_stage= stages[i];
        target='#f'+this_stage+"-"+gene_no;
        loadImage('images/straw_cortex-01.png', 150, 150, target,target+"-cortex");
        loadImage('images/strawberry-ghost-01.png', 150, 150, target,target+"-ghost");
        loadImage('images/strawberry-pith-01.png', 150, 150, target,target+"-pith");
        loadImage('images/strawberry-wall-01.png', 150, 150, target,target+"-wall");

        if(this_stage == '3' || this_stage == '4' || this_stage =='5'){
            loadImage('images/strawberry-embryo-01.png', 150, 150, target,target+"-embryo");
            loadImage('images/strawberry_outline-01.png', 150, 150, target,target+"-outline");
        }
        else{
            loadImage('images/strawberry_outline-early-01.png', 150, 150, target,target+"-outline");
        }
    }
}

//add prunus images to page
function add_prunus_img(gene_no,doc,min,max){
    stages=['0','5','12','18'];

    var rainbow = new Rainbow();
    rainbow.setNumberRange(min, max);
    rainbow.setSpectrum('#edf8e9','#bae4b3','#74c476','#31a354','#006d2c');

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

            if(this_stage=='0' || this_stage=='20'){
                newDiv.className +='left';
            }
            else if(this_stage=='12'){
                newDiv.className +='right';
            }
            else{
                newDiv.className+='center';
            }

            if(this_stage=='20'){
                newDiv.className+=' bottom';
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

            if(this_stage=='0' || this_stage=='18'){
                newDiv.className +='left';
            }
            else if(this_stage=='12'){
                newDiv.className +='right';
            }
            else{
                newDiv.className+='center';
            }

            if(this_stage=='18'){
                newDiv.className+=' bottom';
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
         toAdd.className+=" peach_container"

         var stages=['1','2','3','4','5'];
         for (i in stages){
            this_stage= stages[i];

           var newDiv = document.createElement('div');
           newDiv.id = "f"+this_stage+'-'+gene_no;

            newDiv.className ="efp_img "

            if(this_stage=='1' || this_stage=='4'){
                newDiv.className +='left';
            }
            else if(this_stage=='3'){
                newDiv.className +='right';
            }
            else{
                newDiv.className+='center';
            }

            if(this_stage=='4'||this_stage=='5'){
                newDiv.className+=' bottom';
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
                launch_color();
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
function launch_color(){
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
     
        raw_counts=raw_counts.concat(this_doc['raw']);
    }  
    raw_counts= raw_counts.map(Number);
    var max = Math.max(...raw_counts);
    var min = Math.min(...raw_counts);

    //create scale
   var c = document.getElementById("myCanvas");
   var ctx = c.getContext("2d");
   var grd = ctx.createLinearGradient(0,0,200,0);
   grd.addColorStop(0,"#edf8e9");
   grd.addColorStop(.25,"#bae4b3");
   grd.addColorStop(.5,"#74c476");
   grd.addColorStop(.75,"#31a354");
   grd.addColorStop(1,"#006d2c");
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
   fill_peach_EFP(min,max);
   fill_rubus_EFP(min,max);

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


function fill_rubus_EFP(min,max){

  var rubus_docs=Array.prototype.slice.call(document.querySelectorAll('#rubus_id .aGene')).map(function(x){return x.innerHTML});
  for (i in rubus_docs){
        var json = JSON.parse(rubus_docs[i]);
        var this_doc=json['json'];
        var gene_id=json['gene_id'];
        add_rubus_img(gene_id,this_doc,min,max);
  }
}

function fill_peach_EFP(min,max){
  var peach_docs = Array.prototype.slice.call(document.querySelectorAll('#prunus_pers .aGene')).map(function(x){return x.innerHTML});
  for (i in peach_docs){
        var json = JSON.parse(peach_docs[i]);
        var this_doc=json["json"];
        var gene_id=this_doc['gene_id'];
        add_prunus_img(gene_id,this_doc,min,max);
  }
}


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
      add_rubus_img(50);
    }
    else if(species == "Fragaria vesca"){
      $("#fv").hide();
      $('#frag_vesca').hide();
      append_targets('frag',50,id,true);
      add_frag_img(50);
    }
    else if(species == "Malus domestica"){
      $("#md").hide();
      $('#malus_dom').hide()
      append_targets('malus',50,id,true);
      add_malus_img(50);
    }
    else if(species == "Prunus persica"){
      $("#pp").hide();
      $('#prunus_pers').hide();
      append_targets('prunus',50,id,true);
      add_prunus_img(50);
    }


    var malus = json["malus_ortho"];
    var frag = json["frag_ortho"];
    var prunus = json["prunus_ortho"];
    var pyrus = json["pyrus_ortho"];
    var rubus = json["rubus_ortho"];
    
    if (malus){
        for (gene in malus){
            append_targets('malus',malus[gene],malus[gene],false);
            add_malus_img(malus[gene]);
            db_call(malus[gene],gene,"malus","#malus_dom");
        }
    }
    else{
        $('#malus_dom').hide();
        $('#md').hide();
    }


    if(frag){
        for (gene in frag){
            append_targets('frag',frag[gene],frag[gene],false);
            add_frag_img(frag[gene]);
            db_call(frag[gene],gene,"frag","#frag_vesca");
        }        
    }
    else{
      $("#fv").hide();
      $('#frag_vesca').hide();
    }


    if(rubus){
        for (gene in rubus){
            append_targets('rubus',rubus[gene],rubus[gene],false);
            db_call(rubus[gene],gene,"rubus","#rubus_id");
        }
    }
    else{
      $("#ri").hide();
      $('#rubus_id').hide()
    }

    if(prunus){
        for (gene in prunus){
            append_targets('prunus',prunus[gene],prunus[gene],false);
            db_call(prunus[gene],gene,"prunus","#prunus_pers");
        }        
    }
    else{
      $("#pp").hide();
      $('#prunus_pers').hide();
    }
    
}


//ready set GO!
window.onload = function(){
  fill_orthologs();
}