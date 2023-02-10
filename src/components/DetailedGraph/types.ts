import type { Page } from '~models';

export interface Props extends Page.ComponentProps<'div'> {
  id?: string;
  data: Resource.Detail | null;
  options?: never;
  onRequestDetailedData: (id: string) => any;
  onClearDetailedData: () => any;
}
