Ionic App Base
=====================

A starting project for Ionic that optionally supports using custom SCSS.

## Using this project

We recommend using the [Ionic CLI](https://github.com/driftyco/ionic-cli) to create new Ionic projects that are based on this project but use a ready-made starter template.

For example, to start a new Ionic project with the default tabs interface, make sure the `ionic` utility is installed:

```bash
$ sudo npm install -g ionic cordova
```

Start a project

```bash
$ ionic start myApp blank
```

Setup sass

```bash
$ ionic setup sass
```

Run on bower

```bash
$ ionic serve
```

Add Android platform

```bash
$ ionic platform add android
```

Add cordova plugin
```bash
ionic plugin add cordova-plugin-crosswalk-webview
...
...
```

Update Android project
```bash
$ ionic platform update android
$ ionic run android
```

Crosswalk with Cordova
```bash
ionic plugin add cordova-plugin-crosswalk-webview
```

<preference name="xwalk64bit" value="xwalk64bit" />

More info on this can be found on the Ionic [Getting Started](http://ionicframework.com/getting-started) page and the [Ionic CLI](https://github.com/driftyco/ionic-cli) repo.

## Issues
Issues have been disabled on this repo, if you do find an issue or have a question consider posting it on the [Ionic Forum](http://forum.ionicframework.com/).  Or else if there is truly an error, follow our guidelines for [submitting an issue](http://ionicframework.com/submit-issue/) to the main Ionic repository.


## Difference between crosswalk

"Mozilla/5.0 (Linux; Android 4.4.2; Coolpad 9976D Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36"

"Mozilla/5.0 (Linux; Android 4.4.2; Coolpad 9976D Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Crosswalk/19.49.514.5 Mobile Safari/537.36"