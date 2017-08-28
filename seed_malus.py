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

malus_base = '/Users/Haley/Desktop/malus_info/'
malus_frag = malus_base+'Malus.domes__v__Frag_vesca.csv'
malus_prunus = malus_base+'Malus.domes__v__Prunus_pers.csv'
malus_rubus = malus_base+'Malus.domes__v__Rubus_occidentalis_v1.0.a1.proteins.csv'
malus_potentilla = malus_base+'Malus.domes__v__Potentilla_micrantha_gene_predictions_aa.csv'
malus_pyrus = malus_base+'Malus.domes__v__Pyrus_communis_v1.0-proteins_hybrid.csv'

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
            x = val.replace(" ", "")
            if (x[0] != "M"):
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

frag_orths = makeOrthDictionary(malus_frag)
pyrus_orths = makeOrthDictionary(malus_pyrus)
rubus_orths = makeOrthDictionary(malus_rubus)
prunus_orths = makeOrthDictionary(malus_prunus)

counts = open(malus_base+"malus_list.txt")


#data
for line in counts:
    line = line.strip()
    values = line.split(',')
    gene_id = values[0]
    prunus = None
    frag = None
    rubus = None
    pyrus = None
    if gene_id in prunus_orths:
        prunus = prunus_orths[gene_id]
    if gene_id in frag_orths:
        frag = frag_orths[gene_id]
    if gene_id in rubus_orths:
        rubus = rubus_orths[gene_id]
    if gene_id in pyrus_orths:
        pyrus = pyrus_orths[gene_id]
    gene = {
        "organism" : "malus",
        "gene_id" : gene_id,
        "prunus_ortho":prunus,
        "frag_ortho":frag,
        "rubus_ortho":rubus,
        "pyrus_ortho":pyrus
    }
    db.malus.insert_one(gene)
    print("inserted gene: ", gene_id)