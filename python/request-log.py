import json
import random

def genRandom(mininum, maximum):
    val_range = maximum - mininum
    rand = random.random() * val_range
    return rand + mininum


while True:
    input() # |> ignore

    # Dummy Data
    message = {
        'data': [
            genRandom(80, 120),
            genRandom(0, 150),
            genRandom(20, 120),
            genRandom(-4, 4),
            genRandom(0, 1.2)
        ]
    }
    print(json.dumps(message))

print('Shut down.')
