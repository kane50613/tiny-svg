/**
 * SVG transformation utilities
 * Handles rotation, flipping, and resizing of SVG elements
 */

const VIEWBOX_VALUES_LENGTH = 4;
const ROTATION_ANGLE = 90;
const SCALE_DIVISOR = 2;
const VIEWBOX_SPLIT_REGEX = /\s+|,/;

interface SvgDimensions {
  width: number;
  height: number;
  viewBox?: string;
}

/**
 * Parse SVG to get dimensions
 */
export function getSvgDimensions(svgString: string): SvgDimensions | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const svgElement = doc.querySelector("svg");

  if (!svgElement) {
    return null;
  }

  const widthAttr = svgElement.getAttribute("width");
  const heightAttr = svgElement.getAttribute("height");
  const viewBoxAttr = svgElement.getAttribute("viewBox");

  let width = 0;
  let height = 0;

  if (widthAttr && heightAttr) {
    width = Number.parseFloat(widthAttr);
    height = Number.parseFloat(heightAttr);
  } else if (viewBoxAttr) {
    const viewBoxValues = viewBoxAttr
      .split(VIEWBOX_SPLIT_REGEX)
      .map(Number.parseFloat);
    if (viewBoxValues.length === VIEWBOX_VALUES_LENGTH) {
      width = viewBoxValues[2] || 0;
      height = viewBoxValues[3] || 0;
    }
  }

  return {
    width,
    height,
    viewBox: viewBoxAttr || undefined,
  };
}

/**
 * Rotate SVG by 90 degrees clockwise
 */
export function rotateSvg(svgString: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const svgElement = doc.querySelector("svg");

  if (!svgElement) {
    return svgString;
  }

  const dimensions = getSvgDimensions(svgString);
  if (!dimensions) {
    return svgString;
  }

  const { width, height, viewBox } = dimensions;

  // Get viewBox values or use default
  let minX = 0;
  let minY = 0;
  let vbWidth = width;
  let vbHeight = height;

  if (viewBox) {
    const values = viewBox.split(VIEWBOX_SPLIT_REGEX).map(Number.parseFloat);
    if (values.length === VIEWBOX_VALUES_LENGTH) {
      minX = values[0] || 0;
      minY = values[1] || 0;
      vbWidth = values[2] || width;
      vbHeight = values[3] || height;
    }
  }

  // Calculate center point
  const centerX = minX + vbWidth / SCALE_DIVISOR;
  const centerY = minY + vbHeight / SCALE_DIVISOR;

  // Swap width and height attributes
  svgElement.setAttribute("width", height.toString());
  svgElement.setAttribute("height", width.toString());

  // Calculate new viewBox to keep content centered after rotation
  const newMinX = centerX - vbHeight / SCALE_DIVISOR;
  const newMinY = centerY - vbWidth / SCALE_DIVISOR;
  svgElement.setAttribute(
    "viewBox",
    `${newMinX} ${newMinY} ${vbHeight} ${vbWidth}`
  );

  // Wrap content in a group with rotation around center
  const content = Array.from(svgElement.children)
    .map((child) => child.outerHTML)
    .join("");

  svgElement.innerHTML = "";

  const group = doc.createElementNS("http://www.w3.org/2000/svg", "g");
  // Rotate around the center point of the viewBox
  group.setAttribute(
    "transform",
    `rotate(${ROTATION_ANGLE} ${centerX} ${centerY})`
  );
  group.innerHTML = content;
  svgElement.appendChild(group);

  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc);
}

/**
 * Flip SVG horizontally
 */
export function flipHorizontal(svgString: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const svgElement = doc.querySelector("svg");

  if (!svgElement) {
    return svgString;
  }

  const dimensions = getSvgDimensions(svgString);
  if (!dimensions) {
    return svgString;
  }

  const { width, viewBox } = dimensions;

  // Get viewBox values or use default
  let minX = 0;
  let vbWidth = width;

  if (viewBox) {
    const values = viewBox.split(VIEWBOX_SPLIT_REGEX).map(Number.parseFloat);
    if (values.length === VIEWBOX_VALUES_LENGTH) {
      minX = values[0] || 0;
      vbWidth = values[2] || width;
    }
  }

  // Calculate the right edge in viewBox coordinates
  const rightEdge = minX + vbWidth;

  // Wrap content in a group with horizontal flip
  const content = Array.from(svgElement.children)
    .map((child) => child.outerHTML)
    .join("");

  svgElement.innerHTML = "";

  const group = doc.createElementNS("http://www.w3.org/2000/svg", "g");
  // Flip horizontally: scale(-1, 1) then translate to correct position
  group.setAttribute("transform", `scale(-1 1) translate(${-rightEdge} 0)`);
  group.innerHTML = content;
  svgElement.appendChild(group);

  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc);
}

/**
 * Flip SVG vertically
 */
export function flipVertical(svgString: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const svgElement = doc.querySelector("svg");

  if (!svgElement) {
    return svgString;
  }

  const dimensions = getSvgDimensions(svgString);
  if (!dimensions) {
    return svgString;
  }

  const { height, viewBox } = dimensions;

  // Get viewBox values or use default
  let minY = 0;
  let vbHeight = height;

  if (viewBox) {
    const values = viewBox.split(VIEWBOX_SPLIT_REGEX).map(Number.parseFloat);
    if (values.length === VIEWBOX_VALUES_LENGTH) {
      minY = values[1] || 0;
      vbHeight = values[3] || height;
    }
  }

  // Calculate the bottom edge in viewBox coordinates
  const bottomEdge = minY + vbHeight;

  // Wrap content in a group with vertical flip
  const content = Array.from(svgElement.children)
    .map((child) => child.outerHTML)
    .join("");

  svgElement.innerHTML = "";

  const group = doc.createElementNS("http://www.w3.org/2000/svg", "g");
  // Flip vertically: scale(1, -1) then translate to correct position
  group.setAttribute("transform", `scale(1 -1) translate(0 ${-bottomEdge})`);
  group.innerHTML = content;
  svgElement.appendChild(group);

  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc);
}

/**
 * Resize SVG to new dimensions (proportional)
 */
export function resizeSvg(
  svgString: string,
  newWidth: number,
  newHeight: number
): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const svgElement = doc.querySelector("svg");

  if (!svgElement) {
    return svgString;
  }

  const dimensions = getSvgDimensions(svgString);
  if (!dimensions) {
    return svgString;
  }

  const { viewBox } = dimensions;

  // Update width and height attributes
  svgElement.setAttribute("width", newWidth.toString());
  svgElement.setAttribute("height", newHeight.toString());

  // If there's a viewBox, keep it (it defines the coordinate system)
  // If there's no viewBox, create one based on original dimensions
  if (!viewBox) {
    svgElement.setAttribute(
      "viewBox",
      `0 0 ${dimensions.width} ${dimensions.height}`
    );
  }

  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc);
}

/**
 * Calculate proportional dimensions
 */
export function calculateProportionalDimensions(
  originalWidth: number,
  originalHeight: number,
  newValue: number,
  changedDimension: "width" | "height"
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight;

  if (changedDimension === "width") {
    return {
      width: newValue,
      height: Math.round(newValue / aspectRatio),
    };
  }

  return {
    width: Math.round(newValue * aspectRatio),
    height: newValue,
  };
}
