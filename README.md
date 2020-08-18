## PIXEL BOARD
---
This idea was heavily inspired by the reddit april fools from /r/place.

This project is setup so that whenever an issue is created with a specific format you can change the colour of a pixel on the 'pixel board'.

[VISIT PIXEL BOARD](https://pixelboard.netlify.app/)

### BACKGROUND
---
This project is setup using the following components:
- React Server side rendering
    - This allows for the pixel board to be rendered for the user even when they don't have JS enabled.
    - Different versions of the pixel board are rendered dependent on if JS is enabled or not (the JS version is much more performant)
- No API Requests are used. All data about pixels are gathered from the DOM/JS Files that are generated via workflows.
- Server that fetches data about pixels from mongoDB and deals with updating when an issue is received.

### TODO List
---
- [ ] Users have a cooldown period
    - Each user can only submit a new pixel every 5 minutes or so
- [ ] Leaderboard data on most pixels, longest 'kept' pixels and so on. (Maybe have this update the readme?)
- [ ] Colour picker that can be used to easily create the issue if the user has javascript enabled.
- [ ] Have pipeline comment back on the issue if it failed / successfully updated the board?
- [ ] Display a screenshot of the pixel board and its state every hour using cron based workflow?
- [x] Having better dynamic styling when javascript is enabled would be awesome too.
- [x] Nicer styling (Currently pixels might not be squares depending on the resolution of the monitor that you run on)
- [x] Create the ability to initialise the grid via an image. (Can only be done locally not via CI/CD pipes)
