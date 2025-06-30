// base config for 2 line layers hrz/vert
const paintLine = {
  "line-emissive-strength": 1.0,
  "line-blur": 0.25,
  "line-width": 2.75,
  "line-color": "limegreen",
};
let layoutLine = {
  // shared layout between two layers
  "line-z-offset": [
    "at",
    ["*", ["line-progress"], ["-", ["length", ["get", "elevation"]], 1]],
    ["get", "elevation"],
  ],
  "line-elevation-reference": "sea",
  "line-cap": "round",
};

export { paintLine, layoutLine };