import { Page } from '~models';

export interface Props extends Page.ComponentProps<'div'> {
  id?: string;
  showGrids?: boolean;
  showPoints?: boolean;
  level?: number;
  onChangeShowGrids?: (showGrids: boolean) => any;
  onChangeShowPoints?: (showPoints: boolean) => any;
  onChangeLevel?: (levels: number) => any;
}
