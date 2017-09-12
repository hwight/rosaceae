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
client = MongoClient('mongodb://hwight:letmein@ds135382.mlab.com:35382/ros')
db = client.ros
#--------------------

prunus_base = '/Users/Haley/Desktop/prunus_info/'
prunus_frag = prunus_base+'Prunus_pers__v__Frag_vesca.csv'
prunus_malus = prunus_base+'Prunus_pers__v__Malus.domes.csv'
prunus_rubus = prunus_base+'Prunus_pers__v__Rubus_occidentalis_v1.0.a1.proteins.csv'
prunus_potentilla = prunus_base+'Prunus_pers__v__Potentilla_micrantha_gene_predictions_aa.csv'
prunus_pyrus = prunus_base+'Prunus_pers__v__Pyrus_communis_v1.0-proteins_hybrid.csv'

def makeOrthDictionary(file):
    orthologues={}
    orth_file = open(file)
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
    for line in this_file:
        line = line.strip()
        values = line.split('\t')
        gene_id = values[0]
        c = values[1:]
        counts[gene_id] = c
    return(counts)

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


id_map= makeConversion("/Users/Haley/Desktop/frag_info/id_map.txt")

frag_orths = makeOrthDictionary(prunus_frag)
pyrus_orths = makeOrthDictionary(prunus_pyrus)
rubus_orths = makeOrthDictionary(prunus_rubus)
malus_orths = makeOrthDictionary(prunus_malus)

counts = open(prunus_base+"prunus_list.txt")


#data
for line in counts:
    line = line.strip()
    values = line.split(',')
    gene_id = values[0]
    malus = None
    frag = None
    rubus = None
    pyrus = None
    if gene_id in malus_orths:
        malus = malus_orths[gene_id]
    if gene_id in frag_orths:
        frag = frag_orths[gene_id]
        frag_list = []
        for g in frag_orths[gene_id]:
            m = id_map[g.strip()]
            frag_list.append(m)
        frag = frag_list
    if gene_id in rubus_orths:
        rubus = rubus_orths[gene_id]
    if gene_id in pyrus_orths:
        pyrus = pyrus_orths[gene_id]
    gene = {
        "organism" : "prunus",
        "gene_id" : gene_id,
        "malus_ortho":malus,
        "frag_ortho":frag,
        "rubus_ortho":rubus,
        "pyrus_ortho":pyrus
    }
    db.prunus.insert_one(gene)
    print("inserted gene: ", gene_id)