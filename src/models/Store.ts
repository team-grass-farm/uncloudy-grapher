import { Cluster, Deployment, Node, Pod } from '~models';

export class AppStore {
  isPageLoading: boolean;
  storedVersion = '';
  pods: Pod[] = [];
  nodes: Node[] = [];
  clusters: Cluster[] = [];
  deployments: Deployment[] = [];

  constructor() {
    this.isPageLoading = false;
    return { ...this };
  }
}
