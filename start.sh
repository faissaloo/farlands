#!/bin/bash
cd server/
npm start &
server_pid=$!
echo "Server started with PID: $server_pid"
cd - >/dev/null

cd client/
npm start &
client_pid=$!
echo "Client started with PID: $client_pid"
cd - >/dev/null

# Wait for both processes to finish
wait $server_pid
wait $client_pid
