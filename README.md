# PIXELS

This program takes an image as an input and extracts the dominant color pallet. The image is then drawn to multiple layers on individual `<canvas>` elements, one color per layer.

Using the camera and the tracking.js library to detect the user's face the layers are redrawn in an artistic parallax effect.

I wanted to add an image uploader so the user could easily upload their own image to see the effect on their image of choice. If you'd like to try this out simply update the `src` in the `<img>` tag.

## Credits

- Tracking.js (https://trackingjs.com/)
- Gulp build boilerplate (I developed this over the last couple of years and copied parts to this project to save time.)

## Build

In the root of the project run `npm install` followed by `npm run dev`