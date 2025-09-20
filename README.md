# SVG 变换移除工具

**注意：本工具不支持处理含有 `matrix(...)` 的变换。**

本项目用于移除 SVG 文件中的所有 transform 属性，并将变换直接应用到元素本身，同时保留分组结构，确保图像的视觉效果不变。

## 安装

```bash
npm install
```

## 使用方法

1. 将你的 `input.svg` 文件放入 `svg_folder` 目录
2. 运行以下命令：
    ```bash
    npm start
    ```
3. 处理后的文件会生成在 `svg_folder` 目录下，名为 `output.svg`

## 功能特点

-   递归处理所有元素，包括嵌套的分组（`<g>`）元素
-   支持对 `path`、`polyline`、`polygon` 及常见坐标属性的变换
-   保留 SVG 的内部分组结构
-   保证图像视觉效果与原图一致
-   将 transform 属性展平成直接的坐标值

---

# SVG Transform Remover

**Note: This tool does not support transforms containing `matrix(...)`.**

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
