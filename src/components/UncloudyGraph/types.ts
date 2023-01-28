import type { Page } from '~models';

export interface Props extends Page.ComponentProps<'div'> {
  id?: string;
  panelMode: 'dev' | 'admin';
  data: Resource.Map;
  detailedData: {
    metric: Resource.Pod.Metric[] | null;
    api: Resource.Pod.API | null;
  };
  options: {
    showBlocks?: boolean;
    showGrids?: boolean;
    showPoints?: boolean;
    level?: 1 | 2 | 3;
  };
  onRequestDetailedData: (id: string) => any;
}

export type ViewOption =
  | 'CPUUsage'
  | 'memoryUsage'
  | 'numPods'
  | 'nodeId'
  | 'nodes'
  | 'clusters'
  | 'deployments'
  | 'namespaces';
