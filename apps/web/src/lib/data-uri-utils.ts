import {
  BASE64_DATA_URI_PREFIX,
  BYTE_PRECISION,
  BYTES_DIVISOR,
  DATA_URI_PREFIX,
  SIZE_UNITS,
  URL_ENCODING_REPLACEMENTS,
} from "./constants";

export interface DataUriResult {
  minified: string;
  base64: string;
  urlEncoded: string;
  minifiedSize: number;
  base64Size: number;
  urlEncodedSize: number;
}

/**
 * Converts SVG content to various Data URI formats
 * @param svg - The SVG string content
 * @returns Object containing different Data URI formats and their sizes
 */
export function svgToDataUri(svg: string): DataUriResult {
  // Minified Data URI (using encodeURIComponent with optimizations)
  let encoded = encodeURIComponent(svg);
  for (const [encoded_char, decoded] of Object.entries(
    URL_ENCODING_REPLACEMENTS
  )) {
    encoded = encoded.replaceAll(encoded_char, decoded);
  }
  const minified = `data:${DATA_URI_PREFIX},${encoded}`;

  // Base64 Data URI
  const base64 = `${BASE64_DATA_URI_PREFIX}${btoa(unescape(encodeURIComponent(svg)))}`;

  // URL Encoded Data URI
  const urlEncoded = `data:${DATA_URI_PREFIX},${encodeURIComponent(svg)}`;

  return {
    minified,
    base64,
    urlEncoded,
    minifiedSize: new Blob([minified]).size,
    base64Size: new Blob([base64]).size,
    urlEncodedSize: new Blob([urlEncoded]).size,
  };
}

/**
 * Formats byte size to human-readable format
 * @param bytes - The size in bytes
 * @returns Formatted string (e.g., "1.23 KB")
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return `0 ${SIZE_UNITS[0]}`;
  }

  const i = Math.floor(Math.log(bytes) / Math.log(BYTES_DIVISOR));

  return `${(bytes / BYTES_DIVISOR ** i).toFixed(BYTE_PRECISION)} ${SIZE_UNITS[i]}`;
}
