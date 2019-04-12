import smbus
import time
import csv
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
    log = bus.read_i2c_block_data(SLAVE_ADDRESS, 0, 5)
    dumplog(log)
    print(log)
