import json

while True:
    command = input().upper()

    if command == 'SEND':
        # Dummy Data
        message = {
            'status': 200,
            'data': [12, 24, 36, 48, 60]
        }
        print(json.dumps(message))

    elif command == 'SHUTDOWN':
        message = {
            'status': 202,
            'data': 'Shutting down...'
        }
        print(json.dumps(message))

    else:
        message = {
            'status': 400,
            'data': 'Error: Unknown command: ' + command
        }
        print(json.dumps(message))

print('Shut down.')
