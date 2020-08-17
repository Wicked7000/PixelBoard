## PIXEL BOARD
---
This idea was heavily inspired by the reddit april fools from /r/place.

This project is setup so that whenever an issue is correctly with a specific format you can change one of the pixels that is on the 'Pixel board'.

[VISIT PIXEL BOARD](https://pixelboard.netlify.app/)

### BACKGROUND
---
This project is setup using the following components:
- React Server side renderning
    - This allows for the pixel board to be rendered for the user even when they don't have JS enabled.
- Server that fetches data about pixels from mongoDB and deals with updating when an issue is received.

### TODO List
---
- [ ] Users have a cooldown period
    - Each user can only submit a new pixel every 5 minutes or so
- [ ] Leaderboard data on most pixels, longest 'kept' pixels and so on.
- [ ] Colour picker that can be used to easily create the issue if the user has javascript enabled.
    - Having better dynamic styling when javascript is enabled would be awesome too.
- [x] Nicer styling (Currently pixels might not be squares depending on the resolution of the monitor that you run on)
- [ ] Create the ability to initialise the grid via an image. (Can only be done locally not via CI/CD pipes)