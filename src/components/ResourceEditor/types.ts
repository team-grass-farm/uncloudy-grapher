import type { Page } from '~models';

export interface Props<T extends Resource.Pod | Resource.Node>
  extends Page.ComponentProps<'div'> {
  id?: string;
  metric: T extends Resource.Pod
    ? Resource.Pod.Metric[] | null
    : Resource.Node.Metric[] | null;
  data: T extends Resource.Pod
    ? Resource.Pod.API | null
    : Resource.Node.API | null;
}
