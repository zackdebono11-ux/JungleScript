import os
import rand

fn main() {
	println('🌴 JUNGLE V GAME')
	println('================')
	println('Guess the secret number!')
	println('It is between 1 and 100.')

	secret := rand.intn(100) or { 50 }

	for {
		input := os.input('Enter your guess: ')

		guess := input.int()

		if guess < 1 || guess > 100 {
			println('❌ Enter a number from 1 to 100!')
			continue
		}

		if guess < secret {
			println('⬆️ Too low!')
		} else if guess > secret {
			println('⬇️ Too high!')
		} else {
			println('🎉 YOU GOT IT!')
			break
		}
	}

	println('🌴 Thanks for playing!')
}