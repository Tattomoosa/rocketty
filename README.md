# Rocketty

A (toy) TUI rocket chat client.

## Getting Started

### Setup

Edit `rocket_config.json` at the project root.

``` json
{
  "ROCKET_HOST": "<yourhost>"
}
```

#### Saved username/password


``` json
{
  "ROCKET_HOST": "<yourhost>",
  "ROCKET_USERNAME": "<yourusername>",
  "ROCKET_PASSWORD": "<yourpassword>"
}
```

### Running

```
$ npm run start
```

To use remote debugging in Google Chrome:
```
$ npm run dev
```

### Usage

Login, then join a room by typing `:cr <roomname>` in the text box and hitting enter.

Type a message and hit return to send it to the current room.
Type `:q` to quit.



## Future Development

Maybe?
