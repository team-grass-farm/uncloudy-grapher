import type { Page } from '~models';

export interface Props extends Page.ComponentProps<'div'> {
  id?: string;
  detailedData: Resource.Detail | null;
}
