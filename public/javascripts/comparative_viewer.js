function fill_orthologs(){
    //parse json data
    var data = document.getElementById("json_res").innerHTML;
    var json = JSON.parse(data);
    json = json[0];
    //***********************************************************

    var id = json['gene_id'];
    document.getElementById("geneName").innerHTML = id;

    var species = document.getElementById("species").innerHTML;


    if(species == "Rubus idaeus"){
      $("#ri").hide();
    }
    else if(species == "Fragaria vesca"){
      $("#fv").hide();
    }
    else if(species == "Malus domestica"){
      $("#md").hide();
    }
    else if(species == "Prunus persica"){
      $("#pp").hide();
    }

    var malus = json["malus_ortho"];
    var frag = json["frag_ortho"];
    var prunus = json["prunus_ortho"];
    var pyrus = json["pyrus_ortho"];
    var rubus = json["rubus_ortho"];
    
    if (malus){$('#malus').append( malus.join(',') );}
    if(frag){ $('#frag').append( frag.join(',') );}
    if(prunus){$('#prunus').append( prunus.join(',') );}
    if(pyrus){$('#pyrus').append( pyrus.join(',') );}
    if(rubus){$('#rubus').append( rubus.join(',') );}
}



//ready set GO!
window.onload = function(){
  fill_orthologs();
}