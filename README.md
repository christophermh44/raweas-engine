# raweas-engine
Generate M3U with RadioDJ as backend

# Usage
```
npm start <model-file>
```

# Model file documentation

## file(id)

Get a file by its ID.

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
