import { Page } from '~models';

export interface Props extends Page.ComponentProps<'div'> {
  id?: string;
  showGrids?: boolean;
  showPoints?: boolean;
  onChangeShowGrids: (showGrids: boolean) => any;
  onChangeShowPoints: (showPoints: boolean) => any;
}
