var express = require('express');
var router = express.Router();
var Rainbow = require('rainbowvis.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'The Rosaceae Project' });
});

router.get('//', function(req, res, next) {
  res.render('index', { title: 'The Rosaceae Project' });
});

router.get('/index', function(req, res, next) {
  res.render('index', { title: 'The Rosaceae Project' });
});


router.get('/about', function(req, res, next) {
  res.render('about', { title: 'The Rosaceae Project' });
});

router.get('/events', function(req, res, next) {
  res.render('events', { title: 'The Rosaceae Project' });
});

router.get('/publications', function(req, res, next) {
  res.render('publications', { title: 'Publications' });
});


router.get('/compare', function(req, res, next) {
  res.render('comparative_analysis.jade', { title: 'Orthology Comparison' });
});

router.get('/rubus_form', function(req, res, next) {
  res.render('rubus_form', { title: 'Rubus EFP' });
});

router.get('/rubus_batch_form', function(req, res, next) {
  res.render('rubus_batch_form', { title: 'Rubus EFP' });
});


router.post('/rubus_response', function(req, res) {
    var db = req.db;
    var collection = db.get('rubus');
    var gene = req.body.gene;

  collection.find({ "gene_id": gene},{},function(e,docs){
      msg = "";
      if (docs.length == 0)
      {
        res.render('error', {message: "Not a valid rubus id"});
      }
      else{
        res.render('rubus_response',{gene_id:gene,response:JSON.stringify(docs)})
      }

    });
});





router.post('/ortho', function(req, res) {
    var db = req.db;
    var gene = req.body.gene;
    var species= req.body.species;

    var works = false;

    var collection = db.get('frag');
    if(species == "Rubus idaeus"){
      var collection = db.get('rubus');
    }
    else if(species == "Fragaria vesca"){
      var collection = db.get('frag');
    }
    else if(species == "Malus domestica"){
      var collection = db.get('malus');
    }
    else if(species == "Prunus persica"){
      var collection = db.get('prunus');
    }

    var msg = species+works

  

  collection.find({"gene_id": gene},{},function(e,docs){
      //res.render('error',{message:collection})
      if (docs.length == 0)
      {
        res.render('error', {message: "Gene not found"});
      }
      else{
        res.render('ortho_viewer',{gene_id:gene,species:species,response:JSON.stringify(docs)})
      }

  });

});






router.post('/get_gene', function(req, res) {
    var db = req.db;
    var collection = db.get('rubus');
    var gene = req.body.gene;

   collection.find({ "gene_id": gene},{},function(e,docs){
          if (docs.length == 0)
          {
            res.send({message: "not found",gene_id:gene});
          }
          else{
            var json = docs[0];
            var exp_data = json.stage_0.concat(json.stage_2,json.stage_4,json.stage_6,json.stage_9,json.stage_12);
            res.send({message:"found", gene_id:gene, tpm:exp_data});
          }
   });

});



module.exports = router;
