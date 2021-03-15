# Tactics board
Project for futsal Tactics board [preview](https://gljubojevic.github.io/tactics-board)

Reference for project is https://tactical-board.com/uk/mini-football  
**All features there are required here too**

Project is using following technologies/libraries:
- [React](https://create-react-app.dev/)
- [Material UI](https://material-ui.com/)
	- [UI icons](https://materialdesignicons.com/)

Proposition for storage and sharing:
- [Google Firebase](https://firebase.google.com/)

This should enable following features:
- saving tactics for each user separately
- sharing saved tactics by link
- collaborating on same tactics

## What needs to be done
Here is list of what needs to be done in project.  
Reference for project is https://tactical-board.com/uk/mini-football  
**Project is required to have all features of reference project but for futsal only.**

**NOTE:** Functionality that is already done is ~~scratched~~ in description below.

## Image creation
Base for editor and image creation is SVG.
Tactics board is SVG image generated client side and displayed with [React](https://create-react-app.dev/)

All drawing is done by modifying parameters of shape elements than SVG is generated and displayed.

Image can be saved:
- as set of parameters to be editable (JSON definition)
- ~~as PNG bitmap images as download~~

Target platforms
- web browsers on pc for phase 1
- web browsers on touch devices for phase 2

### Drawing units
SVG image is generated using metric centimeter (cm) as default unit.  
1 in SVG image equals 1cm in real world.

## Futsal pitch
Main editing area is shown as default futsal pitch including all elements defined by [futsal rules](https://www.fifa.com/who-we-are/news/new-futsal-laws-of-the-game-approved-3073616)

Pitch is created as SVG image and is is base for all editing.

## Predefined shapes
Tactics board has number of predefined shapes:
- ~~players~~
- ~~cones~~
- ~~balls~~
- goals

Number of predefined shapes is available for placing on pitch.
Predefined shapes are dragged on pitch to be placed on desired position.

## Drawing shapes
- lines
  - ~~straight (should be replaced by b-spline)~~
  - ~~b - spline (default drawing shape for lines)~~
- ~~rectangles~~
- ~~ellipses~~
- filled irregular shapes
- text
	- four different sizes, predefined text size
	- needs debugging to show cursor before entering text
	- needs selection, copy, cut, paste

All the shapes can be drawn with one of 6 colors.

Line options for shapes
- arrows at start, end or both for
	- ~~lines~~
	- ~~b-splines~~
- line pattern filled or dashed for
	- ~~rectangles~~
	- ~~ellipses~~
	- filled irregular shapes

## Editing shapes
All shapes can be edited on pitch. Some of shapes have different edit options.

Edit options:
- drag (for placement)
- ~~rotate (all shapes)~~
- ~~resize (all except for predefined shapes e.g. players, goals etc..)~~
- ~~remove (return to default pool only for predefined shapes)~~
- ~~rename (players only)~~

## Overlays
Sometimes futsal training is held on different pitch than original.
For that purpose is is required to show overlay of:
- ~~exercises pitch (28mx20m)~~
- ~~basketball pitch (28mx15m)~~
- ~~volleyball pitch (18mx9m)~~

Overlay is shown as outline over original pitch as outline centered on pitch.

## Animation
Animation is done using key frames.
Adding new animation frame is done by copying positions and parameters of previous frame.
Each shape that is moved on new key frame is moved on b-spline.
Moving shape shows b-spline so moving path for shape can be edited.

### Animation UI
UI consists of few simple controls:
- play
- pause
- seek forward and back by a key frame
- display current key frame with
	- keyframe back
	- keyframe forward
- playback position bar showing current position in playing animation

Except for playback position bar UI should be visible on app toolbar.

### Creating animation
Animation is created by:
- adding key frames and moving (dragging) shapes to new positions
- editing b-splines between previous and new position to define move path

## Sharing and collaboration
Each tactic can be shared as link. Base for sharing should be saved document.
For sharing link should be generated to open existing tactics setup.
Sharing should have options:
- view only
- edit
- collaborate

Collaborations should alow two or more  different users to edit same tactics setup. Any change to element during collaboration will be propagated to both users after modifications is done.

Saving latest change can be done by any user during sharing session.
Shared document is overwritten when any of users saves it.

## References
https://create-react-app.dev/

UI using:
https://material-ui.com/

UI Icons additional:
https://materialdesignicons.com/

UI alternatives:  
https://classpert.com/blog/top-bootstrap-alternatives

SVG to png:  
https://github.com/webkul/myscale  
Check source and canvas part

SVG Convert to react:  
https://github.com/gregberge/svgr
- Maybe useful

SVG loading:  
https://github.com/tanem/react-svg
- Might be useful to modify SVG after insert

SVG manipulation library for react:  
https://github.com/hugozap/react-svgmt
- Useless can't add elements

SVG Manipulation:  
https://github.com/svgdotjs/svg.js
- Can't use with react

Example of custom react svg component:  
https://github.com/hugozap/react-rotary-knob

Drag/Resize:  
https://interactjs.io/
- Maybe useful as example