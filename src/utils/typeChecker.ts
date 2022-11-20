/**
 * @module typeChecker
 */

export const isBlockPosition = <T extends BlockPosition | BlockPositions>(
  positions: any | T
): positions is BlockPosition => !!!(positions.data instanceof Map);

export const IsSameMatrix = (a: Matrix | null, b: Matrix | null): boolean =>
  !!a && !!b && a.row === b.row && a.column === b.column;
