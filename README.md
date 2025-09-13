# SVG Transform Remover

This project is designed to remove all transform attributes from SVG files and apply the transformations directly to the elements themselves, while preserving the group structure and maintaining the visual appearance of the image.

## Installation

```bash
npm install
```

## Usage

1. Place your `input.svg` file in the `svg_folder` directory
2. Run the following command:
    ```bash
    npm start
    ```
3. The processed file will be generated as `output.svg` in the `svg_folder` directory

## Features

-   Recursively processes all elements, including nested group (`<g>`) elements
-   Supports transformation of `path`, `polyline`, `polygon`, and common coordinate attributes
-   Preserves the internal group structure of the SVG
-   Maintains the exact visual appearance of the original image
-   Flattens transform attributes into direct coordinate values
