
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

## License

MIT © [Natalia Kowalczyk](https://melitele.me)

[Maputnik]: https://maputnik.github.io/editor
[OpenMapTiles Vector Tile Schema]: https://openmaptiles.org/schema/
