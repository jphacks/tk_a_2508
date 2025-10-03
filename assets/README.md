# Assets

Place your app images here.

- icon.png: 1024x1024 PNG, no transparency required
- splash.png: 1242x2436 PNG (portrait), background recommended

Update `app.json` to reference these files:

```
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": { "image": "./assets/splash.png", "resizeMode": "contain", "backgroundColor": "#ffffff" }
  }
}
```
