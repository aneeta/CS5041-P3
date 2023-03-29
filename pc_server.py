import socket
import json
from datetime import datetime

from firebase_admin import (
    credentials, initialize_app, db
)

# References
# https://www.geeksforgeeks.org/socket-programming-python/


# Local Port Specification
port = 12345

# Specifies the number of unaccepted connections that the system will allow before refusing new connections
number_of_backlog = 5

# Allowed buffer size for messages
message_size = 4096  # bytes

# db setup


cred_obj = credentials.Certificate(
    'secrets/cs5041-p3-dcdf7-firebase-adminsdk-vdhjk-a7b58bb0d0.json')
app = initialize_app(cred_obj, {
    'databaseURL': "https://cs5041-p3-dcdf7-default-rtdb.europe-west1.firebasedatabase.app"
})

users = db.reference("/users").get()
settings = db.reference("/settings").get()


def main():

    # next create a socket object
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # '' = the server listen to requests coming from other computers on the network
    s.bind(('', port))
    print("socket binded to %s" % (port))

    # put the socket into listening mode
    s.listen(number_of_backlog)
    print("socket is listening")

    # Set Server to Blocking (already this by default)
    s.setblocking(True)

    # Plant connection variables
    plant_one_conn = None
    plant_two_conn = None

    # TODO refactor to be less verbose
    conn_map = {
        'user1': plant_one_conn,
        'user2': plant_two_conn
    }

    while (plant_one_conn == None or plant_two_conn == None):

        # Establish connection with client.
        conn, addr = s.accept()
        print('Got connection from', addr)

        # Determine whether plant_1 or plant_2
        client_res = conn.recv(message_size).decode().strip()

        try:
            client_res_int = int(client_res)

            if (client_res_int == 1 and plant_one_conn == None):
                # Plant 1
                plant_one_conn = conn
                print("[Success] Plant 1 Connected")

            elif (client_res_int == 2 and plant_two_conn == None):
                # Plant 2
                plant_two_conn = conn
                print("[Success] Plant 2 Connected")

        except:
            print("[Error] Bad client response - ", client_res)

    # Set Server to Non-Blocking
    s.setblocking(False)
    plant_one_conn.setblocking(False)
    plant_two_conn.setblocking(False)

    print("[Notification] Starting Relay Operation")

    # Tell plants to begin relaying
    plant_one_conn.sendall('1'.encode())
    plant_two_conn.sendall('1'.encode())

    # relayPlantRequests(plant_one_conn, plant_two_conn)
    relayReqs(conn_map)


def handlePlantMessageDb(user, conn_map):
    try:
        leaf = int(conn_map[user].recv(message_size).decode().strip())
        if (leaf < 0 or leaf > 2):
            raise NotImplementedError("Unrecognised leaf!")

        response = settings[user]['leaf'][leaf]
        json_str = json.dumps(response)

        # Forward message to paired plant
        try:
            # Send JSON to other plant
            conn_map[settings[user]['pair']].sendall(json_str.encode())
            # Send touch to DB
            db.reference("/touch").push().set({
                "from": user,
                "to": settings[user]['pair'],
                "sent": datetime.now().timetuple(),
                "leaf": leaf,
                "msg": response['msg'],
                "color": {
                    "r": response['r'],
                    "g": response['g'],
                    "b": response['b']
                }
            })

            # Log Operation
            print("[Success] Sent JSON string (" +
                  json_str + ") to " + settings[user]['pair'])
            # Connection is still alive
            return True
        except:

            # Connection is closed
            print("[Error] " + settings[user]['pair'] +
                  " connection has been closed (Closing Relay Server)")
            return False

    except:
        # TODO - idk what this block if for??
        # print("[Notification] No messages from ", plant_to_check_name) - spam
        return True


def handlePlantMessage(plant_to_check_conn, plant_to_check_mapping, plant_to_check_name, plant_to_send_conn, plant_to_send_name):
    try:
        # ^ will throw exception due to Non-blocking socket if buffer empty
        plant_to_check_res = plant_to_check_conn.recv(
            message_size).decode().strip()
        plant_to_check_res_int = int(plant_to_check_res)

        # Checking if valid input
        if (plant_to_check_res_int < 3 and plant_to_check_res_int >= 0):

            # Forward message to Plant Two
            relevent_json = plant_to_check_mapping[plant_to_check_res]

            # Convert to JSON string
            json_str = json.dumps(relevent_json)

            try:
                # Send JSON
                plant_to_send_conn.sendall(json_str.encode())

                # Log Operation
                print("[Success] Sent JSON string (" +
                      json_str + ") to " + plant_to_send_name)

                # Connection is still alive
                return True

            except:

                # Connection is closed
                print("[Error] " + plant_to_send_name +
                      " connection has been closed (Closing Relay Server)")
                return False

        else:
            print("[Error] Invalid Input received from " + plant_to_check_name)

            # Input was invalid, but the connection is still alive
            return True

    except:
        # print("[Notification] No messages from ", plant_to_check_name) - spam
        return True


def relayReqs(conn_map):
    while True:
        if not (
            handlePlantMessageDb('user1', conn_map) and handlePlantMessageDb(
                'user2', conn_map)
        ):
            # If either Plant 1 or Plant 2 has closed the connection, the relay server must shutdown
            break
    for conn in conn_map.values():
        conn.close()


def relayPlantRequests(plant_one_conn, plant_two_conn):

    while True:

        # Check plant 1 and 2

        if not (
            handlePlantMessage(plant_one_conn, plant_one_mapping, 'Plant One', plant_two_conn, 'Plant Two') and
            handlePlantMessage(plant_two_conn, plant_two_mapping,
                               'Plant Two', plant_one_conn, 'Plant One')
        ):
            # If either Plant 1 or Plant 2 has closed the connection, the relay server must shutdown
            break

    # Properly close connections with clients
    plant_one_conn.close()
    plant_two_conn.close()


# Plant Mappings (should be controllable by users)
plant_one_mapping = {
    '0': {  # Left-side of plant touched
        'r': '255',  # red channel
        'g': '0',  # green channel
        'b': '0',   # blue
        'l': '0',   # location on plant
        'm': 'l_1'   # message to display
    },

    '1': {  # Middle of plant touched
        'r': '0',  # red channel
        'g': '0',  # green channel
        'b': '255',   # blue
        'l': '1',   # location on plant
        'm': 'm_1'   # message to display
    },

    '2': {  # Right-side of plant touched
        'r': '255',  # red channel
        'g': '120',  # green channel
        'b': '125',   # blue
        'l': '2',   # location on plant
        'm': 'r_1'   # message to display
    },

}


plant_two_mapping = {
    '0': {  # Left-side of plant touched
        'r': '255',  # red channel
        'g': '0',  # green channel
        'b': '0',   # blue
        'l': '0',   # location on plant
        'm': 'l_2'   # message to display
    },

    '1': {  # Middle of plant touched
        'r': '0',  # red channel
        'g': '0',  # green channel
        'b': '255',   # blue
        'l': '1',   # location on plant
        'm': 'm_2'   # message to display
    },

    '2': {  # Right-side of plant touched
        'r': '255',  # red channel
        'g': '120',  # green channel
        'b': '125',   # blue
        'l': '2',   # location on plant
        'm': 'r_2'   # message to display
    },

}


if __name__ == '__main__':
    main()
