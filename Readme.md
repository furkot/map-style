
# furkot-map-style

Map styles used by Furkot trip planner.

## Schema

Furkot map style files are based on [OpenMapTiles Vector Tile Schema].
 
## Edit

Furkot map style files can be edited with an editor for vector map style, for instance [Maputnik].

## Validate

Validate styles after editing:

```sh
make validate
```

To validate any map style file:

```sh
$ node lib/validate map-style.json
```

## Normalize

If the validation fails, fix inconsistencies in map files automatically:

```sh
make normalize
```

Normalized files are placed in the `reports` folder. You should run validation again on normalized files as not all inconsistencies can be fixed automatically.

To normalize any map style file:

```sh
$ node lib/normalize map-style.json
```

To create a separate normalized file and leave the source file intact pass it as a first parameter:

```sh
$ node lib/normalize normalized-map-style.json map-style.json
```

## Merge

Normalized files from the `reports` folder can be merged back to the respective map style files:

```sh
make merge
```

To merge a map style file with another:

```sh
$ node lib/merge target-map-style.json map-style.json
```

## License

MIT © [Natalia Kowalczyk](https://melitele.me)

[Maputnik]: https://maputnik.github.io/editor
[OpenMapTiles Vector Tile Schema]: https://openmaptiles.org/schema/
