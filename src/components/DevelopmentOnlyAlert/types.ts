import { Page } from '~models';

export interface Props extends Page.ComponentProps<'div'> {
  id?: string;
  data: Page.DebuggingOptions;
  onChangeData: (data: Page.DebuggingOptions) => any;
}
