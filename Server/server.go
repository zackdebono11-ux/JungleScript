package main

import (
	"fmt"
	"net"
	"os"
	"strconv"
	"sync"
)

var (
	activeConnections int
	mutex             sync.Mutex
	serverSize        int
)

func handleConnection(conn net.Conn) {
	defer conn.Close()

	mutex.Lock()
	activeConnections++
	current := activeConnections
	mutex.Unlock()

	fmt.Printf("Client connected. Active connections: %d/%d\n", current, serverSize)

	buffer := make([]byte, 1024)
	conn.Read(buffer)

	mutex.Lock()
	activeConnections--
	current = activeConnections
	mutex.Unlock()

	fmt.Printf("Client disconnected. Active connections: %d/%d\n", current, serverSize)
}

func main() {
	serverSize = 200

	if len(os.Args) > 1 {
		size, err := strconv.Atoi(os.Args[1])

		if err != nil || size < 1 {
			fmt.Println("Invalid server size.")
			fmt.Println("Usage: go run server.go <number>")
			return
		}

		serverSize = size
	}

	listener, err := net.Listen("tcp", "127.0.0.1:25565")
	if err != nil {
		fmt.Println("Failed to start server:", err)
		return
	}

	defer listener.Close()

	fmt.Println("🌴 JungleScript server started")
	fmt.Printf("Maximum connections: %d\n", serverSize)
	fmt.Println("Listening on port 25565")

	for {
		conn, err := listener.Accept()
		if err != nil {
			fmt.Println("Connection error:", err)
			continue
		}

		mutex.Lock()
		full := activeConnections >= serverSize
		mutex.Unlock()

		if full {
			fmt.Println("Server full — connection rejected.")
			conn.Close()
			continue
		}

		go handleConnection(conn)
	}
}