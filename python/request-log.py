import smbus
import time
import csv
import json
from pathlib import Path


SLAVE_ADDRESS = 0x08

bus = smbus.SMBus(1)


def dumplog(data: list):
    target = Path('./logdumps/dump.csv')
    current = time.asctime()
    with open(target, 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([current] + data)


def shift(zero, one, two):
    return (two << 16) + (one << 8) + zero


while True:
    input() # |> ignore
    try:
        log = bus.read_i2c_block_data(SLAVE_ADDRESS, 0, 15)
        
        vlt = shift(log[0], log[1], log[2])
        spd = shift(log[3], log[4], log[5])
        tmp = shift(log[6], log[7], log[8])
        con = shift(log[9], log[10], log[11])
        gen = shift(log[12], log[13], log[14])

        dumplog(log)
        data = {
            'status': 200,
            'data': {
                'vlt': vlt,
                'spd': spd,
                'tmp': tmp,
                'con': con,
                'gen': gen
            }
        }
        print(json.dumps(data))
    except OSError as e:
        data = {
            'status': 500,
            'data': 'ERROR OCCURED!\n' + str(e)
        }
        print(json.dumps(data))
