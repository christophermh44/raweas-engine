# raweas-engine

Generate M3U with RadioDJ as backend

# Usage

Generate a playlist file from a model (see documentation for model files below).

```
npm run make-playlist <model-file> <output-file>
```

Generate ads playlists files for a given date (see documentation for settings files below).

```
npm run make-screens <prefix-path> <year> <month> <day>
```

# Model file documentation

## file(id[, duration])

Get a file by its ID. You can specify an estimated duration (useful for beds played before an overlay track like a voiceover, or for Internet streams).

```
toth = file(15)
```

## event(id)

Get an event by its ID.

```
changeRotation = event(36)
```

## subcategory(id\[, repeat_rule\])

Create a variable that can pick a file from a subcategory by its ID. You can specify a Repeat Rule (see below).

```
highRotation = subcategory(8, repeatRule)
```

## repeat_rule(same_artist, same_title)

Define a repeat rule (do not repeat the same artist or the same title for X minutes).

```
rr = repeat_rule(60, 120)
```

## rotation(item\[, item, ...\])

Create a list of items to pick, one by one (and restart the rotation when the last item has been reached).

```
main = rotation(hits, gold)
```

## rotate(rotation, until_time)

Generate as many items as needed from a rotation to reach the time defined. This function has to be used inside run() function (see below).

```
rotate(main, '30:00')
```

Note that in the example above, if the rotate function is called after 15:00 of sound in the playlist, only about 15:00 of sound will be generated.

## run(item[, item, ...])

Function to call at the end of the model.

```
run(
	toth,
	rotate(main, '60:00'),
	toth
)
```

# Ads screens settings

Two files allows you to configure screens generation (will be improve in the future).

## commercials/ads.json

This file allows you to reference RadioDJ songs and makes them available for different campaigns.

Main structure (array of ads objects):

```
[
	{
		"ID": xxx,
		"type": "yyy",
		"mon": ["hh:mm", "hh:mm"],
		"tue": ["hh:mm", "hh:mm"],
		…
	},
	…
]
```
* *ID - * The ID of the RadioDJ song
* *type - * the campaign of the ad (will be referenced in the screens file, see below)
* *mon, tue, wed, … - * time slot for each day of week. First item for the start and second one for the end of the slot
* *always - * boolean that will indicate if the ad can be selected at any time. Time slots will be ignored if set to true. Default to false.

## commercials/screens.json

An object of 7 fields. One for each day of week (sun, mon, tue, …, sat). Each day is an array of screen objects.

Main structure of a screen object:

```
{
	"time": "hh:mm",
	"campaigns": ["yyy", "zzz", …]
}
```

* *time - * The screen theorical time (hh:mm 24h format)
* *campaigns - * Array of ads types.

The example above will produce an ad screen at hh:mm containing an ad from the "yyy" category, then an ad from the "zzz" category, etc.
