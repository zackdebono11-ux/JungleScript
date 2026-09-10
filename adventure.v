import os

fn main() {
	println('🌴 ===========================')
	println('🌴   JUNGLE ADVENTURE')
	println('🌴 ===========================')
	println('')
	println('You wake up in a mysterious jungle.')
	println('There are three paths in front of you.')
	println('')
	println('1. 🌊 Follow the river')
	println('2. 🌲 Enter the forest')
	println('3. 🏔️ Climb the mountain')

	choice := os.input('Choose a path (1-3): ')

	if choice == '1' {
		println('')
		println('🌊 You follow the river...')
		println('You discover an abandoned boat!')
	} else if choice == '2' {
		println('')
		println('🌲 You enter the forest...')
		println('You discover an ancient temple!')
	} else if choice == '3' {
		println('')
		println('🏔️ You climb the mountain...')
		println('You discover a mysterious cave!')
	} else {
		println('')
		println('❌ That is not a valid path!')
	}

	println('')
	println('🌴 Your adventure has begun!')
}