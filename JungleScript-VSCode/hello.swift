// A simple Struct with a method
struct Player {
    var name: String
    var highScore: Int = 0
    
    mutating func updateScore(newScore: Int) {
        if newScore > highScore {
            highScore = newScore
            print("New high score for \(name): \(highScore)! 🎉")
        }
    }
}

// Creating an instance of the struct
var player1 = Player(name: "Tomas")
player1.updateScore(newScore: 50) 
