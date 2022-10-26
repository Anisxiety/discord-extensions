
# Embeds Extensions
```js
module.exports = new function main() {
  this.content = "Hello"
  this.files = ["https://image.png", "https://video.mp4"]
  this.components = [Rows[Buttons, Select Menu etc...]]
  this.embeds = [{
      "description": "..",
    },
    {
      "description": "..",
    }]
}
```

The JS file should export a constructor that has values such as embeds, content...
<br>
<br>
## Embeds
Use [Discohook](https://discohook.org/) to create <svg width="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> your embed

Scroll down when you are done editing your embed till you see **JSON Data Editor**

Click it, and copy "embeds" value, it should be an **Array of Embeds**
```json
{
  "content": null,
  "embeds": [
    {
      "description": "..",
      "color": null
    },
    {
      "description": "..",
      "color": null
    }
  ],
  "attachments": []
}
```


You should have something like this
```json
[
    {
      "description": "..",
      "color": null
    },
    {
      "description": "..",
      "color": null
    }
]
```
This above should be a value of embeds (Max 10 embeds) in the constructor we are exporting in the file

## Content

Max 2000 characters

## Files

Array of string has links to media to upload in the message

## Components

buttons shit

<br><br><br>
Very good explanation thank u i know
