# Prehistoric Domain

## Installation

### Prerequisites

- IDE (Vscode, Atom, Sublime...)
- NodeJS and NPM <https://nodejs.org/en/>
- Read A-Frame docs <https://aframe.io/docs/1.0.0/introduction/> & <https://aframe.io/aframe-school/#/>

### Scenes

The `main-scenes` folder contains all independants VR experiences.
Each one may launch one or multiples `scenes`. each scenes are in the `components` folder.
It is possible to display only one scene or to chain them one after the other .

### Installation

```
npm install
```

## Start the project

Start process to test and develop localy.

### To run the VR experience run

```
npm start
```

### Start a specific vr scene

- Open **scenes.config.js** file
- Change the value of **selection** before starting the project (ex: gate, dilo, trex...)

And visit the url **localhost:8080**,
there is a live reloead process, when you make a code change, the page reload automatically.

### To run the website run

```
npm run start:ws
```

And visit the url **localhost:8080/website**

## Build the project

Build process to add files in production.

### Build a specific scene

To build a specific scene run:

```
npm run build:scene --mainscene=aviary
```

All files are exported in the **dist** folder

### Build assets

To build the VR experience run:

```
npm run copy:assets
```

All files are exported in the **dist** folder

### Build all scenes

To build the VR experience run:

```
npm run build --mainscene=aviary  --assetprefix=live
```

All files are exported in the **dist** folder

### Build all scenes and assets

To build the VR experience run:

```
npm run build:all --assetprefix=live
```

All files are exported in the **dist** folder

### Build the website

To build the website run:

```
npm run build:ws
```

All files are exported in the **dist-ws** folder

## VR display on desktop (Debugging)

Debugging process to test the VR experience and see it on the desktop screen instead of the headset.

- Open **debug.const.js** file

- Set the debug value to **true**

- Start the VR experience:

```
npm run start
```

- Open **localhost:8080**

- When the website is open press **8** from the keyboard

It will directly open the VR experience on the desktop screen instead of the headset.

## VR 3D scene live modification

### Start the editor

To visually add, delete or modify 3D elements in the VR scene:

- Start the VR experience:

```
npm run start
```

- Open **localhost:8080**

- When the website is open press **8** from the keyboard
- When the VR scene is displayed, press **ctrl + alt + i**

This will open the A-Frame editor

See more here <https://aframe.io/docs/1.0.0/introduction/visual-inspector-and-dev-tools.html>

### Easily save modifications

Use **aframe-watcher**: <https://github.com/supermedium/aframe-watcher>
