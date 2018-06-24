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

gene = {
        "organism" : "rubus",
        "gene_id" : "Rr035862.t1",
        #data in order of receptacle, seed, wall
        "stage_0":[17.175758,29.8271,102.602886],
        "stage_2":[23.778951,23.1938,87.2042853],
        "stage_4":[29.6589,19.0710,71.61217],
        "stage_6":[25.18763,13.4655,75.0171],
        "stage_9":[30.7212,23.090,98.068],
        "stage_12":[19.26855,13.414,74.769694],
        "malus_ortho":[],
        "frag_ortho":["gene22887"],
        "prunus_ortho":[],
        "pyrus_ortho":[],
        "raw":[]
}

db.rubus.insert_one(gene)