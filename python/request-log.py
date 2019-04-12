import smbus
import time
import csv
import json
from pathlib import Path


SLAVE_ADDRESS = 0x04

bus = smbus.SMBus(1)


def dumplog(data: list):
    target = Path('./logdumps/dump.csv')
    current = time.asctime()
    with open(target, 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([current] + data)


while True:
    input() # |> ignore
    try:
        log = bus.read_i2c_block_data(SLAVE_ADDRESS, 0, 5)
        dumplog(log)
        data = {
            'status': 200,
            'data': log
        }
        print(json.dumps(data))
    except OSError as e:
        data = {
            'status': 500,
            'data': 'ERROR OCCURED!\n' + str(e)
        }
        print(json.dumps(data))
