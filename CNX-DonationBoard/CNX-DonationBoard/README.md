# CNX-DonationBoard - Chiang Mai Flood Relief Multisig Wallet Monitor

This project is an open-source application that checks the status of a multisig wallet set up for flood relief efforts in Chiang Mai in September-October 2024. It utilizes an ESP32 microcontroller and a HUB75 LED matrix display to provide real-time updates on donations and wallet status.

## Table of Contents

- [Features](#features)
- [Hardware Requirements](#hardware-requirements)
- [Software Requirements](#software-requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- Connects to WiFi and displays the connection status on the LED matrix.
- Periodically fetches updates from a specified HTTPS endpoint.
- Displays donation details on the LED panel, including donor name, amount, currency, and equivalent USD value.
- User-friendly scrolling text display for continuous updates.

## Hardware Requirements

- **ESP32 Development Board** (e.g., ESP32 DevKit)
- **HUB75 LED Matrix Display** (e.g., 64x32 pixel)
- **Power Supply** for the ESP32 and LED display
- **Jumper Wires** for connections

## Software Requirements

- Arduino IDE (or compatible IDE)
- Required Libraries:
  - SmartMatrix
  - WiFi
  - HTTP Client (for making HTTPS requests)
  - Arduino JSON (for parsing JSON responses)

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/GuyPhy/CNX-DonationBoard.github
   cd CNX-DonationBoard
   ```

2. **Install Required Libraries**

- Open the Arduino IDE, go to `Sketch -> Include Library -> Manage Libraries`
- Search for and install the `SmartMatrix`, `WiFi`, and `Arduino JSON` libraries

3. **Configure WiFi**

- Update the `[wifi_config.h](./main/utils/wifi_config.h)` file with your WiFi SSID and password

4. **Upload the Code**

- Open the [main sketch](./main/main.ino) in the Arduino IDE
- Select your ESP32 board from `Tools -> Board`.
- Upload the code to your ESP32 board.

> Original Sketch is tested with `ESP32 v3.0.5`, use `ESP32 DEV Board` connected to a Serial port on you computer.

## Usage

- Once uploaded, the device will connect to your WiFi network and display the connection status.
- It will start fetching data from the configured HTTPS endpoint every 30 seconds.
- Any updates regarding donations will be displayed on the LED matrix.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) for details.
