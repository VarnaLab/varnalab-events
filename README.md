
# varnalab-events

> Built on top of [facebook-sync](https://github.com/simov/facebook-sync)

## CLI

```bash
node varnalab-events/bin/
  --auth auth.json \
  --config config.json \
  --fields fields.json \
  --db db.json \
  --env production \
  --sync add|update
```

## config.json

```json
{
  "production": {
    "token": "[Facebook Access Token]"
  }
}

```

## config.json

```json
{
  "production": {
    "feeds": [
      "varnalab",
      "121769877975286"
    ],
    "place": {
      "id": "214440281946231"
    },
    "sync": {
      "add": {
        "limit": 5,
        "since": 0
      },
      "update": {
        "limit": 30,
        "since": 0
      }
    }
  }
}
```

## fields.json

```json
{
  "production": {
    "post": [
      "id",
      "created_time",
      "object_id",
      "type"
    ],
    "event": [
      "id",
      "name",
      "description",
      "cover",
      "place",
      "start_time",
      "end_time",
      "updated_time"
    ],
    "photo": [
      "id",
      "width",
      "images"
    ]
  }
}
```

## db.json

```json
[]
```
