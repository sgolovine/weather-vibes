# Weather Vibes

This is a simple weather app that I "vibe coded". It is intended to evaluate how well "vibe coding" actually works.

## Issues Found

This is non-exhaustive list of the various issues I ran into while developing this application.

- Initially the React project was boilerplated with Create React App. Had to re-prompt to get it to configure it with Vite.
- When asking to convert the project to use TailwindCSS, the agent got confused with the various packages and kept trying to fix the issues again and again. Eventually had to manually intervene and setup TailwindCSS by hand.
- (Cline Specific) Seemed to take too many steps validating and summarizing the changes. Would often get stuck waiting for `npm run dev` to complete which was annoying. Had to add manual instructions to get it to stop doing this thought it still did it in some cases. Found myself thinking "are you done yet??" a few too many times.
- (Cline Specific / Machine Specific) Could not launch my web browser so any requests where it had to open a browser failed. Still attempted to open even after I set it so it did not.
- The way the NWS API is setup, there are many fields that are URL's that let you GET more data. Attempted to ask Claude/Cline to update the app to pull this data but after a number of failed attempts I gave up on it.
