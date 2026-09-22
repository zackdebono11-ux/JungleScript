use std::io::{self, Write};

fn main() {
    println!("🌴 JungleScript Terminal");
    println!("Type 'help' for commands.");

    loop {
        print!("JLS> ");
        io::stdout().flush().unwrap();

        let mut input = String::new();
        io::stdin().read_line(&mut input).unwrap();

        let command = input.trim();

        match command {
            "help" => {
                println!("Available commands:");
                println!("  help");
                println!("  version");
                println!("  clear");
                println!("  exit");
                println!("  owner");
                println!("  my youtube");

                
            }

            "version" => {
                println!("JungleScript v1.0");
            }

            "clear" => {
                print!("\x1B[2J\x1B[1;1H");
            }

            "exit" => {
                println!("Goodbye! 🌴");
                break;
            }
            "owner" => {
                println!("Of course, the owner of this project is @zackdebono11-ux. You can reach out to him for any queries or contributions. 🌴");
            }
            "my youtube" => {
                println!("Check out my YouTube channel: https://www.youtube.com/@JUNGLESCRIPT ▶");
            }

            "" => {}

            _ => {
                println!("Unknown command: {}", command);
            }
        }
    }
}