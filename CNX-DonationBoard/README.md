# CNX-DonationBoard

Enter the name of your project above and provide a brief description of your project including what is the impact for the ecosystem or society.

## Team Information

**Project Members**

- Name: `TANMAY GOEL`
  - Discord Username: `guyphy`
  - Devfolio Username: `GuyPhy`
  - Github Username: `GuyPhy`
  - Role: `Developer`

- Name: `Tim Pechersky`
  - Discord Username: `peersky`
  - Devfolio Username: ``
  - Github Username: `peersky`
  - Role: `Developer` and `Sponsor`

## Technical Approach

- **Components** (Select all that apply)
  - [x] Frontend
  - [x] Backend
  - [ ] Smart Contracts
  - [ ] ZK Circuits
  - [ ] Machine Learning (ML)

- High-level outline of the main technical components, tech you used and approaches used in the project:
  - This project leverages an **ESP32 microcontroller** to connect to WiFi and make HTTPS requests to a remote server for fetching multisig wallet data related to flood relief donations.
  - The **LED matrix display** (HUB75) is utilized for real-time visualization of donation updates, showcasing key information such as donor name, amount, currency, and equivalent USD value.
  - The backend primarily consists of an HTTPS API that serves JSON data related to the multisig wallet, which is periodically queried by the ESP32.
  - The project architecture follows a modular approach, with separate utility files for WiFi configuration, HTTPS requests, JSON parsing, and data storage to promote maintainability and scalability.

## Sponsors (if applicable)

If you are applying for a sponsor project idea or grant, select the sponsors below.

- [ ] Push Protocol
- [ ] Polygon
- [ ] Chainlink
- [ ] Brevis
- [ ] Orbiter
- [ ] ZKM
- [ ] Nethermind
- [ ] PSE
- [ ] AltLayer

## What do you plan to achieve with your project?

The goal of this project is to create a robust, user-friendly system for monitoring multisig wallet donations in real-time. I plan to continue developing this project by:
- Enhancing the user interface and experience on the LED matrix display, possibly adding more detailed information and alerts.
- Integrating additional features, such as sending notifications to users about significant changes in wallet status or donations.
- Collaborating with the community for feedback and improvements.

Help in the form of code reviews, suggestions for feature enhancements, or partnership opportunities would be greatly appreciated!

## Lessons Learned (For Submission)

- What are the most important takeaways from your project?
  - Effective modular design simplifies development and maintenance. Separating concerns into different utility files has made the code easier to manage.
  - Real-time data visualization significantly enhances user engagement and awareness regarding donation efforts.

- Are there any patterns or best practices that you've learned that would be useful for other projects?
  - Using consistent naming conventions and clear documentation within the codebase improves readability and helps onboard new contributors quickly.
  - Implementing error handling in network communications is crucial for maintaining the application's reliability.

- Highlight reusable code patterns, key code snippets, and best practices - what are some of the ‘lego bricks’ you’ve built, and how could someone else best use them?
  - The utility functions for WiFi connection and HTTPS requests can be reused in other projects requiring similar functionality.
  - The scrolling text display function can be adapted for various types of notifications beyond just donation updates.

## Project Links (For Submission)

This project was made completely from scratch with only external code being staple libraries for `Arduino ESP32 Core`.

## Video Demo (For Submission)

[Video Demonstration](https://drive.google.com/file/d/1fd9VD9AVbs01TGDn9JoyjdKm4amZs7N1/view?usp=sharing)
