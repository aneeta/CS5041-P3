# Import socket module
import socket	
import time		
import sys


def main(plant_number):
    # Create a socket object
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)		

    # Define the port on which you want to connect
    port = 12345	

    # Allowed buffer size for messages
    message_size = 4096 # bytes

    # Connect to the server on local computer
    s.connect(('127.0.0.1', port))

    print("[Success] Connected to Server (waiting for other plant)")

    # Confirm identity to Server
    s.sendall(plant_number.encode())

    # Wait for other plant
    ready = s.recv(message_size).decode().strip()

    if(not(ready)):
        print("[Error] Server unable to connect with other plant, aborting")
        s.close()
        return

    # Set Server to Non-blocking, so that Serial connection and Server can be continually checked
    s.setblocking(False)

    # Process Server Messages
    while True:
        
        try:
            
            # Receive data from the server and decoding to get the string.
            # print("[Notification] Waiting for message")
            server_message = s.recv(message_size).decode()

            # Log Server Message
            print("[Success] Received Server Message - " + server_message)

        except:
            # No Messages from the Server
            # print("[Notification] No Messages found from the Server")
            x = 5

        finally:
            
            try:
                # Check Serial
                serial_message = plant_number  # L = 0, M = 1, R = 2
                
                # Send Message to Server
                s.sendall(serial_message.encode())

                # Log
                print("[Success] Message Sent to Server - ", serial_message)

            except Exception as e:

                print("[Error] Server Connection lost - closing connection")
                # Connection to Server must have failed - closing connection
                break
    
        time.sleep(10)


    # close the connection
    s.close()	
	

if __name__ == '__main__':
    main(sys.argv[1])