import type { Cluster, Node, Deployment, Page, Pod } from '~models';

export interface Props extends Page.ComponentProps<'div'> {
  id?: string;
  clusters?: Cluster;
  nodes?: Node[];
  pods?: Pod[];
  deployments?: Deployment[];
}
