import type { Page } from '~models';

export interface Props extends Page.ComponentProps<'span'> {
  id?: string;
  kind: 'Pod';
  wide?: boolean;
}
