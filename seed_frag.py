import pymongo
import sys
import os
import urllib.request
import json
import re
import numpy as np



#--------------------
# database stuff...
from pymongo import MongoClient
client = MongoClient();
#client = MongoClient('mongodb://hwight:letmein@ds135382.mlab.com:35382/ros')
db = client.ros
#------------------

frag_base = '/Users/Haley/Desktop/frag_info/'

frag_rubus = frag_base+'Frag_vesca__v__Rubus_occidentalis_v1.0.a1.proteins.csv'
frag_malus = frag_base+'Frag_vesca__v__Malus.domes.csv'
frag_prunus = frag_base+'Frag_vesca__v__Prunus_pers.csv'
frag_potentilla = frag_base+'Frag_vesca__v__Potentilla_micrantha_gene_predictions_aa.csv'
frag_pyrus = frag_base+'Frag_vesca__v__Pyrus_communis_v1.0-proteins_hybrid.csv'

def makeConversion(file):
    ids = {}
    id_file = open(file)
    for line in id_file:
        line = line.strip()
        values = line.split(" ")
        old_id = values [0]
        new_id = values[1]
        ids[old_id] = new_id
    return ids

def makeOrthDictionary(file):
    orthologues={}
    orth_file = open(file)
    next(orth_file)
    id_map= makeConversion(frag_base+"/id_map.txt")
    for line in orth_file:
        line = line.strip()
        line = line.replace("\\s","")
        values = line.split(',')
        gene_id= values[1]
        orthos= values[2:]
        final = []
        for val in orthos:
            x = val.split('_')
            if (x[0] != " PPE"):
                final.append(val)
        orthologues[gene_id] = final
    return (orthologues)



def get_rawCounts(file):
    counts = {}
    this_file = open(file)
    next(this_file)
    for line in this_file:
        line = line.strip()
        values = line.split(',')
        gene_id = values[0]
        c = values[1:]
        counts[gene_id] = c
    return(counts)

rubus_orths = makeOrthDictionary(frag_rubus)
pyrus_orths = makeOrthDictionary(frag_pyrus)
prunus_orths = makeOrthDictionary(frag_prunus)
malus_orths = makeOrthDictionary(frag_malus)




gene_list= get_rawCounts(frag_base+"gene_list.txt")

id_map=makeConversion(frag_base+"id_map.txt")

raw_counts =get_rawCounts(frag_base+"straw_counts.txt")




#data
for line in gene_list:
    gene_id = line.strip()
    malus = None
    frag = None
    prunus = None
    pyrus = None
    if gene_id in malus_orths:
        malus = malus_orths[gene_id]
    if gene_id in rubus_orths:
        rubus = rubus_orths[gene_id]
    if gene_id in prunus_orths:
        prunus = prunus_orths[gene_id]
    if gene_id in pyrus_orths:
        pyrus = pyrus_orths[gene_id]

    gene_id=id_map[gene_id]

    if gene_id in raw_counts:
        raw= raw_counts[gene_id]
        cortex=raw[:5]
        embryo=raw[5:8]
        ghost=raw[8:11]
        ovule=raw[11]
        pith=raw[12:17]
        seed=raw[17]
        wall=raw[18:]

        gene = {
            "organism" : "frag",
            "gene_id" : gene_id,
            "malus_ortho":malus,
            "rubus_ortho":rubus,
            "prunus_ortho":prunus,
            "pyrus_ortho":pyrus,
            "cortex":cortex,
            "pith":pith,
            "seed":[ovule,seed],
            "embryo":embryo,
            "ghost":ghost,
            "wall":wall,
            "raw":raw
        }

        db.frag.insert_one(gene)
        print("inserted gene: ", gene_id)
