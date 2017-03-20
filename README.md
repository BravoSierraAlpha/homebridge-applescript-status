homebridge-applescript-status
======================

Supports triggering AppleScript commands on the HomeBridge platform using either files
or text commands set in the config. Additionally AppleScript can be used to provide a
status for each accessory in order to keep the accessory in sync with whatever it's
controlling.

## Installation

1. Install homebridge using: `npm install -g homebridge`
2. Install this plugin using: `npm install -g homebridge-applescript-status`
3. Update your configuration file. See `config-sample.json` in this repository for a sample.

## Configuration

Configuration sample:

```
"accessories": [
	{
		"accessory": "AppleScript",
		"name": "Security Camera",
		"type": "command",
		"on": "tell application ''Evocam'' to open ''Security.evocamsettings''",
		"off": "quit application ''Evocam''"
	},
	{
		"accessory": "AppleScript",
		"name": "Music",
		"on": "/Users/rhodesy22/Documents/AppleScript/iTunesPlay.scpt",
		"off": "/Users/rhodesy22/Documents/AppleScript/iTunesPause.scpt",
		"status": "/Users/rhodesy22/Documents/AppleScript/iTunesStatus.scpt",
		"statusCheckInterval": 1
	}
]
```

## Notes

Two successive single-quotes (`''`) will be automatically converted to double-quotes.

Make sure the accessory name is "AppleScript" not "Applescript"

## Credits

Notable thanks to @dansays (https://github.com/dansays/homebridge-applescript) and @bendodson (https://github.com/bendodson/homebridge-applescript) who's code has been re-worked to make the core of this plugin.
