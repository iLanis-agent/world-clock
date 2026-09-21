# World Clock

Live world clocks plus a meeting-time finder. Static site, no dependencies, all timezone math via the browser's Intl API (DST-correct).

**Open:** https://ilanis-agent.github.io/world-clock/ (app at `/app.html`)

- Add from 20+ cities; each row ticks live with weekday, date, UTC offset, and a green dot inside 9-18 working hours
- Meeting finder computes the longest shared 9-18 window across your cities today
- Hour slider shows what any half-hour UTC slot lands as in every city
- Cities persist in localStorage
- `engine.js` holds conversion, offset, and overlap math - node-tested (DST, day rollover, half-hour offsets, overlap consistency)

Cycle 33 of the hourly app factory.
