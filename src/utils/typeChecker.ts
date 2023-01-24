/**
 * @module typeChecker
 */

export const isSingleBlockPosition = (
  positions: BlockPosition | BlockPositions
): positions is BlockPosition => !!!(positions instanceof Map);

export const IsSameMatrix = (
  a: PointMatrix | BlockMatrix | null,
  b: PointMatrix | BlockMatrix | null
): boolean =>
  a === b || (!!a && !!b && a.row === b.row && a.column === b.column);
