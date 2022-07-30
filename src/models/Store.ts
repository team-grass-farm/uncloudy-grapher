export class AppStore {
  isPageLoading: boolean;
  storedVersion = '';
  pods: Resource.Pod[] = [];
  nodes: Resource.Node[] = [];
  clusters: Resource.Cluster[] = [];
  deployments: Resource.Deployment[] = [];
  podMetrics: Resource.Pod.Metric[] = [];
  nodeMetrics: Resource.Node.Metric[] = [];

  constructor() {
    this.isPageLoading = false;
    return { ...this };
  }
}
