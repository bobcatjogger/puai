# PUAI
The Prosperous Universe AI (PUAI) is a lightweight market data aggregator written in nodejs.

The goal of this project is to automate data collection and analysis without running afoul of the EULA or crushing the upstream servers with traffic. Preferably only user generated clicks will be used for scraping if PUAI can attach to an already started browser and find the correct elements in the DOM. Otherwise the strategy will be to utilize a headless browser with human-level pauses between 'clicks' to query the market data.
