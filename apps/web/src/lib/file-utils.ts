import {
  DEFAULT_DIMENSION,
  DEFAULT_ICO_SIZES,
  DEFAULT_JPEG_QUALITY,
  DEFAULT_WEBP_QUALITY,
  ICO_MIME_TYPE,
  JPEG_MIME_TYPE,
  MIN_EXPORT_DIMENSION,
  PNG_MIME_TYPE,
  SVG_BLOB_TYPE,
  SVG_EXTENSION,
  SVG_MIME_TYPE,
  SVG_NAMESPACE,
  VIEWBOX_SPLIT_PATTERN,
  VIEWBOX_VALUES_COUNT,
  WEBP_MIME_TYPE,
} from "./constants";

export const isSvgFile = (file: File): boolean =>
  file.type === SVG_MIME_TYPE || file.name.endsWith(SVG_EXTENSION);

export const readFileAsText = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("Failed to read file as text"));
      }
    });
    reader.addEventListener("error", () => {
      reject(new Error("Failed to read file"));
    });
    reader.readAsText(file);
  });

/**
 * Generic file download function
 * Downloads content as a file with specified filename and MIME type
 */
export const downloadFile = (
  content: string,
  fileName: string,
  mimeType = "text/plain;charset=utf-8"
): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadSvg = (svg: string, fileName: string): void => {
  downloadFile(svg, fileName, SVG_MIME_TYPE);
};

export const copyToClipboard = async (text: string): Promise<void> => {
  await navigator.clipboard.writeText(text);
};

export const isSvgContent = (content: string): boolean => {
  const trimmed = content.trim();
  return trimmed.startsWith("<svg") || trimmed.includes("<svg");
};

export const extractSvgFromBase64 = (base64: string): string | null => {
  try {
    const base64Prefix = `data:${SVG_MIME_TYPE};base64,`;
    if (base64.startsWith(base64Prefix)) {
      const svgData = base64.replace(base64Prefix, "");
      return atob(svgData);
    }
    return null;
  } catch {
    return null;
  }
};

export const prettifySvg = async (svg: string): Promise<string> => {
  try {
    const prettier = await import("prettier");
    const parserHtml = await import("prettier/parser-html");

    return prettier.format(svg, {
      parser: "html",
      plugins: [parserHtml],
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
    });
  } catch (_error) {
    return svg;
  }
};

export const svgToDataUrl = (svg: string): string => {
  const blob = new Blob([svg], { type: SVG_MIME_TYPE });
  return URL.createObjectURL(blob);
};

const getSvgDimensions = (svg: string): { width: number; height: number } => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, "image/svg+xml");
  const svgElement = doc.querySelector("svg");

  if (!svgElement) {
    return { width: DEFAULT_DIMENSION, height: DEFAULT_DIMENSION };
  }

  // Try to get width and height attributes
  let width: string | null = svgElement.getAttribute("width");
  let height: string | null = svgElement.getAttribute("height");

  // If width/height are not present, try to get from viewBox
  if (!(width && height)) {
    const viewBox = svgElement.getAttribute("viewBox");
    if (viewBox) {
      const values = viewBox.split(VIEWBOX_SPLIT_PATTERN);
      if (values.length === VIEWBOX_VALUES_COUNT) {
        width = values[2] ?? null;
        height = values[3] ?? null;
      }
    }
  }

  // Parse dimensions, removing units like 'px', 'pt', etc.
  const parseSize = (size: string | null): number => {
    if (!size) {
      return DEFAULT_DIMENSION;
    }
    const parsed = Number.parseFloat(size);
    return Number.isNaN(parsed) ? DEFAULT_DIMENSION : parsed;
  };

  const parsedWidth = parseSize(width);
  const parsedHeight = parseSize(height);

  // Scale up if dimensions are too small (less than MIN_EXPORT_DIMENSION)
  const scale = Math.max(
    1,
    MIN_EXPORT_DIMENSION / Math.max(parsedWidth, parsedHeight)
  );

  return {
    width: Math.round(parsedWidth * scale),
    height: Math.round(parsedHeight * scale),
  };
};

/**
 * Add xmlns attribute to SVG if not present
 */
const addXmlnsToSvg = (svg: string): string => {
  const xmlnsAttr = `xmlns="${SVG_NAMESPACE}"`;
  if (svg.includes(xmlnsAttr)) {
    return svg;
  }
  return svg.replace("<svg", `<svg ${xmlnsAttr}`);
};

/**
 * Create canvas with SVG rendered on it
 */
const createCanvasFromSvg = async (
  svg: string,
  width: number,
  height: number,
  options: {
    backgroundColor?: string;
    centered?: boolean;
    canvasSize?: number;
  } = {}
): Promise<HTMLCanvasElement> => {
  const { backgroundColor, centered = false, canvasSize } = options;
  const finalCanvasWidth = canvasSize || width;
  const finalCanvasHeight = canvasSize || height;

  const canvas = document.createElement("canvas");
  canvas.width = finalCanvasWidth;
  canvas.height = finalCanvasHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Fill background if specified
  if (backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, finalCanvasWidth, finalCanvasHeight);
  }

  const svgWithNamespace = addXmlnsToSvg(svg);
  const img = new Image();
  const svgBlob = new Blob([svgWithNamespace], { type: SVG_BLOB_TYPE });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    img.addEventListener("load", () => {
      const offsetX = centered ? (finalCanvasWidth - width) / 2 : 0;
      const offsetY = centered ? (finalCanvasHeight - height) / 2 : 0;
      ctx.drawImage(img, offsetX, offsetY, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas);
    });

    img.addEventListener("error", () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    });

    img.src = url;
  });
};

/**
 * Download a blob as a file
 */
const downloadBlob = (blob: Blob, fileName: string): void => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

/**
 * Convert canvas to blob and download
 */
const canvasToBlobAndDownload = async (
  canvas: HTMLCanvasElement,
  fileName: string,
  mimeType: string,
  quality?: number
): Promise<void> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          downloadBlob(blob, fileName);
          resolve();
        } else {
          reject(new Error("Failed to create blob"));
        }
      },
      mimeType,
      quality
    );
  });

export const exportAsPng = async (
  svg: string,
  fileName: string,
  customWidth?: number,
  customHeight?: number
): Promise<void> => {
  const svgDimensions = getSvgDimensions(svg);
  const width =
    customWidth && customWidth > 0 ? customWidth : svgDimensions.width;
  const height =
    customHeight && customHeight > 0 ? customHeight : svgDimensions.height;

  const canvas = await createCanvasFromSvg(svg, width, height);
  await canvasToBlobAndDownload(
    canvas,
    fileName.replace(SVG_EXTENSION, ".png"),
    PNG_MIME_TYPE
  );
};

export const exportAsWebP = async (
  svg: string,
  fileName: string,
  quality = DEFAULT_WEBP_QUALITY,
  customWidth?: number,
  customHeight?: number
): Promise<void> => {
  const svgDimensions = getSvgDimensions(svg);
  const width =
    customWidth && customWidth > 0 ? customWidth : svgDimensions.width;
  const height =
    customHeight && customHeight > 0 ? customHeight : svgDimensions.height;

  const canvas = await createCanvasFromSvg(svg, width, height);
  await canvasToBlobAndDownload(
    canvas,
    fileName.replace(SVG_EXTENSION, ".webp"),
    WEBP_MIME_TYPE,
    quality
  );
};

export const exportAsIco = async (
  svg: string,
  fileName: string,
  customWidth?: number,
  customHeight?: number
): Promise<void> => {
  const svgDimensions = getSvgDimensions(svg);
  const width =
    customWidth && customWidth > 0 ? customWidth : svgDimensions.width;
  const height =
    customHeight && customHeight > 0 ? customHeight : svgDimensions.height;

  // For ICO, use a square canvas with the largest dimension
  const size = Math.max(width, height, Math.max(...DEFAULT_ICO_SIZES));

  const canvas = await createCanvasFromSvg(svg, width, height, {
    centered: true,
    canvasSize: size,
  });
  await canvasToBlobAndDownload(
    canvas,
    fileName.replace(SVG_EXTENSION, ".ico"),
    ICO_MIME_TYPE
  );
};

export const exportAsPdf = async (
  svg: string,
  fileName: string,
  customWidth?: number,
  customHeight?: number
): Promise<void> => {
  const svgDimensions = getSvgDimensions(svg);
  const width =
    customWidth && customWidth > 0 ? customWidth : svgDimensions.width;
  const height =
    customHeight && customHeight > 0 ? customHeight : svgDimensions.height;

  const canvas = await createCanvasFromSvg(svg, width, height, {
    backgroundColor: "white",
  });

  try {
    const { jsPDF } = await import("jspdf");

    // Calculate PDF dimensions in mm (A4 size constraints)
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = 297; // A4 height in mm
    const aspectRatio = width / height;

    let imgWidth = pdfWidth - 20; // 10mm margin on each side
    let imgHeight = imgWidth / aspectRatio;

    // If image height exceeds page height, scale down
    if (imgHeight > pdfHeight - 20) {
      imgHeight = pdfHeight - 20;
      imgWidth = imgHeight * aspectRatio;
    }

    const pdf = new jsPDF({
      orientation: width > height ? "landscape" : "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgData = canvas.toDataURL(PNG_MIME_TYPE);
    const xOffset = (pdfWidth - imgWidth) / 2;
    const yOffset = (pdfHeight - imgHeight) / 2;

    pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);
    pdf.save(fileName.replace(SVG_EXTENSION, ".pdf"));
  } catch (error) {
    throw new Error(`Failed to generate PDF: ${error}`);
  }
};

export const exportAsJpeg = async (
  svg: string,
  fileName: string,
  quality = DEFAULT_JPEG_QUALITY,
  customWidth?: number,
  customHeight?: number
): Promise<void> => {
  const svgDimensions = getSvgDimensions(svg);
  const width =
    customWidth && customWidth > 0 ? customWidth : svgDimensions.width;
  const height =
    customHeight && customHeight > 0 ? customHeight : svgDimensions.height;

  const canvas = await createCanvasFromSvg(svg, width, height, {
    backgroundColor: "white",
  });
  await canvasToBlobAndDownload(
    canvas,
    fileName.replace(SVG_EXTENSION, ".jpg"),
    JPEG_MIME_TYPE,
    quality
  );
};
