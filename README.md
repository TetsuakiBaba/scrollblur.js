# scrollblur.js

This project demonstrates a blur effect applied to web page content based on scrolling speed. The faster you scroll, the stronger the blur effect becomes, and when scrolling stops, the blur effect gradually fades away.

## Overview

The scroll speed blur effect provides visual feedback that enhances the user experience. This demo implements the following features:


## File Structure

- `index.html` - Main HTML structure and style definitions
- `scrollblur.js` - Scroll blur effect implementation

## Usage

### Local Usage

1. Clone or download the repository
2. Open `index.html` in your browser
3. Scroll the page to see the effect in action

### CDN Usage

You can load the script from a CDN as follows:

```html
<!-- Add this to the head element or before the closing body tag in your HTML file -->
<script src="https://cdn.example.com/scrollblur.js"></script>
```

You can also customize settings using URL parameters:

```html
<!-- Specify custom values for blurMax and threshold -->
<script src="https://cdn.example.com/scrollblur.js?blurMax=50&threshold=0.8"></script>
```

## Customization

### Script Customization

You can customize the blur effect by adjusting the following parameters in the `scrollblur.js` file:

```javascript
let blurMax = 100;    // Maximum blur value (px)
let threshold = 1;    // Scroll speed threshold (px/ms)
```

- `blurMax`: The maximum blur value applied (in pixels)
- `threshold`: The scroll speed threshold at which blur effect is applied

### CDN Customization

When loading the script from a CDN, you can customize settings using URL parameters:

```html
<script src="https://cdn.example.com/scrollblur.js?blurMax=50&threshold=0.8"></script>
```

This allows you to change settings without modifying the source code.

You can also customize the blur fade-out speed by modifying the decay rate in the `fadeOutBlur` function:

```javascript
currentBlur = currentBlur * 0.9; // Adjust decay rate (smaller values make the blur disappear faster)
```

## Browser Compatibility

This demo works in the following modern browsers:
- Google Chrome
- Mozilla Firefox
- Safari
- Microsoft Edge

## License

Released under the MIT License. See the LICENSE file for details.
