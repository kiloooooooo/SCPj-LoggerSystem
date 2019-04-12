######################################
### MODIFY THIS FILE:              ###
###   THIS SCRIPT SENDS DUMMY DATA ###
######################################


import json
import random
import csv
import time
from pathlib import Path


def dump_log(data: list):
    targetpath = Path('./logdumps/dump.csv')
    current = time.asctime()
    with open(targetpath, 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([current] + data)


def gen_random(mininum, maximum):
    val_range = maximum - mininum
    rand = random.random() * val_range
    return rand + mininum


while True:
    input() # |> ignore

    # Dummy Data
    log = [
        gen_random(80, 120),
        gen_random(0, 150),
        gen_random(20, 120),
        gen_random(-4, 4),
        gen_random(0, 1.2)
    ]

    dump_log(log)

    message = {
        'data': log
    }
    print(json.dumps(message))
