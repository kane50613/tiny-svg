import { HISTORY_CONSTANTS, ROTATION_ANGLES } from "./constants/history";

export function getStaggerDelay(
  index: number,
  delayMs: number = HISTORY_CONSTANTS.ANIMATION_STAGGER_MS
): string {
  return `${index * delayMs}ms`;
}

export function getCardRotation(index: number): number {
  return ROTATION_ANGLES[index % ROTATION_ANGLES.length] ?? 0;
}
