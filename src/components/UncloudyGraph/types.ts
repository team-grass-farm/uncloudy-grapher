import type { Cluster, Node, Deployment, Page, Pod } from '~models';

export interface Props extends Page.ComponentProps<'div'> {
  id?: string;
  panelMode: 'dev' | 'admin';
  clusters?: Cluster;
  nodes?: Node[];
  pods?: Pod[];
  deployments?: Deployment[];
  options: {
    showBlocks?: boolean;
    showGrids?: boolean;
    showPoints?: boolean;
    level?: number;
  };
}
