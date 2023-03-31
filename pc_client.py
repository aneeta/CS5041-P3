# Import socket module
import socket
import time
import sys
import serial
import json


def main(plant_number, port):
    linux_port = '/dev/ttyACM0'
    # Set up serial connection to the Arduino
    arduino = serial.Serial(port=port,
                            baudrate=9600, timeout=1)

    time.sleep(2)  # standard convention

    # Create a socket object
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # Define the port on which you want to connect
    port = 22007

    # Allowed buffer size for messages
    message_size = 4096  # bytes

    # Connect to the server on local computer
    s.connect(('127.0.0.1', port))

    print("[Success] Connected to Server (waiting for other plant)")

    # Confirm identity to Server
    s.sendall(plant_number.encode())

    # Wait for other plant
    ready = s.recv(message_size).decode().strip()

    if (not (ready)):
        print("[Error] Server unable to connect with other plant, aborting")
        s.close()
        return

    # Set Server to Non-blocking, so that Serial connection and Server can be continually checked
    s.setblocking(False)

    # Process Server Messages
    while True:

        try:

            # Receive data from the server and decoding to get the JSON string
            server_json_message = s.recv(message_size).decode()

            print(server_json_message)

            # Send data down Serial Connection
            arduino.write(server_json_message.encode('ascii'))
            arduino.flush()

            # Log Arduino Message
            print("[Success] Received Server Message sent to Arduino (" +
                  server_json_message + ") at", time.time())

        except:
            # No Messages from the Server
            # print("[Notification] No Messages found from the Server")
            x = 5  # could use pass

        finally:

            try:

                # Check Serial
                serial_message = arduino.readline()

                if (serial_message != b''):  # check if actual data

                    print(serial_message)

                    serial_message = serial_message.decode()  # Convert to string

                    serial_message = serial_message.strip()  # remove \r\n

                    if serial_message == '0' or serial_message == '1' or serial_message == '2':

                        # Valid input - send to server

                        # Send Message to Server
                        s.sendall(serial_message.encode())

                        # Log message
                        print("[Success] Receieved Arduino Message Sent to Server (" +
                              serial_message + ") at", time.time())

            except Exception as e:
                print("[Error] Server Connection lost - closing connection")
                # Connection to Server must have failed - closing connection
                break

    # End the Serial Connection
    arduino.close()

    # close the connection
    s.close()


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
