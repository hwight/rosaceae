import pymongo
import sys
import os
import urllib.request
import json
import re
import numpy as np

#check git


#--------------------
# database stuff...
from pymongo import MongoClient
client = MongoClient()
#client = MongoClient('mongodb://hwight:letmein@ds135382.mlab.com:35382/ros')
db = client.ros
#--------------------

rubus_base = '/Users/Haley/Desktop/rubus_info/'
rubus_tpm = rubus_base+'counts.txt'
raw_counts = rubus_base+'rubus2.txt'
rubus_frag = rubus_base+'Rubus_occidentalis_v1.0.a1.proteins__v__Frag_vesca.csv'
rubus_malus = rubus_base+'Rubus_occidentalis_v1.0.a1.proteins__v__Malus.domes.csv'
rubus_prunus = rubus_base+'Rubus_occidentalis_v1.0.a1.proteins__v__Prunus_pers.csv'
rubus_potentilla = rubus_base+'Rubus_occidentalis_v1.0.a1.proteins__v__Potentilla_micrantha_gene_predictions_aa.csv'
rubus_pyrus = rubus_base+'Rubus_occidentalis_v1.0.a1.proteins__v__Pyrus_communis_v1.0-proteins_hybrid.csv'

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
            if (x[0] != " Bras"):
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

frag_orths = makeOrthDictionary(rubus_frag)
pyrus_orths = makeOrthDictionary(rubus_pyrus)
prunus_orths = makeOrthDictionary(rubus_prunus)
malus_orths = makeOrthDictionary(rubus_malus)

raw = get_rawCounts(raw_counts)

counts = open(rubus_tpm)
#data
for line in counts:
    line = line.strip()
    values = line.split(',')
    gene_id = values[0]
    malus = None
    frag = None
    prunus = None
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
    if gene_id in prunus_orths:
        prunus = prunus_orths[gene_id]
    if gene_id in pyrus_orths:
        pyrus = pyrus_orths[gene_id]
    gene = {
        "organism" : "rubus",
        "gene_id" : gene_id,
        #data in order of receptacle, seed, wall
        "stage_0":[values[1],values[7],values[13]],
        "stage_2":[values[2],values[8],values[14]],
        "stage_4":[values[3],values[9],values[15]],
        "stage_6":[values[4],values[10],values[16]],
        "stage_9":[values[5],values[11],values[17]],
        "stage_12":[values[6],values[12],values[18]],
        "malus_ortho":malus,
        "frag_ortho":frag,
        "prunus_ortho":prunus,
        "pyrus_ortho":pyrus,
        "raw":raw[gene_id]
    }
    db.rubus.insert_one(gene)
    print("inserted gene: ", gene_id)
