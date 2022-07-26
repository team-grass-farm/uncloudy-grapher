// @see https://prometheus.io/docs/prometheus/latest/querying/api/
declare namespace Fetcher {
  interface PromResponse {
    status: 'success';
    data: {
      resultType: 'matrix' | 'vector';
      result: {
        metric: any;
        values: Array<[number, string]>;
      }[];
    };
  }

  interface PodCPUUsageResponse extends PromResponse {
    data: {
      resultType: 'matrix';
      result: {
        metric: {
          __name__: string;
          instance: string;
          job: 'kube_state_demo';
          namespace: string;
          pod: string;
        };
        values: Array<[number, string]>;
      }[];
    };
  }

  interface PodMemoryUsageBytesResponse extends PromResponse {
    data: {
      resultType: 'matrix';
      result: {
        metric: {
          __name__: string;
          instance: string;
          job: 'kube_state_demo';
          namespace: string;
          pod: string;
        };
        values: Array<[number, string]>;
      }[];
    };
  }

  interface NodeCPUUsageResponse extends PromResponse {
    data: {
      resultType: 'matrix';
      result: {
        metric: {
          __name__: string;
          cluster: string;
          container: string;
          instance: string;
          job: 'kube_state_demo';
        };
        values: Array<[number, string]>;
      }[];
    };
  }

  interface NodeCPUTotalResponse extends PromResponse {
    data: {
      resultType: 'matrix';
      result: {
        metric: {
          __name__: string;
          cluster: string;
          container: string;
          instance: string;
          job: 'kube_state_demo';
        };
        values: Array<[number, string]>;
      }[];
    };
  }

  interface PodMemoryUsageResponse extends PromResponse {
    data: {
      resultType: 'matrix';
      result: {
        metric: {
          __name__: string;
          instance: string;
          job: 'kube_state_demo';
          namespace: string;
          pod: string;
        };
        values: Array<[number, string]>;
      }[];
    };
  }

  interface NodeMemoryTotalResponse extends PromResponse {
    data: {
      resultType: 'matrix';
      result: {
        metric: {
          __name__: string;
          cluster: string;
          container: string;
          instance: string;
          job: 'kube_state_demo';
        };
        values: Array<[number, string]>;
      }[];
    };
  }

  interface PodMemoryTotalResponse extends PromResponse {
    data: {
      resultType: 'matrix';
      result: {
        metric: {
          __name__: string;
          instance: string;
          job: 'kube_state_demo';
          namespace: string;
          pod: string;
        };
        values: Array<[number, string]>;
      }[];
    };
  }

  type FetchPodRelatedResources = () => Promise<{
    pods: Pod[];
    nodes: Node[];
    deployments: Deployment[];
    namespaces: string[];
  }>;

  type FetchNodeRelatedResources = () => Promise<{
    nodes: Node[];
    clusters: Cluster[];
  }>;

  type FetchPodMetrics = (
    data: Pod.Metric[],
    timeRange: string
  ) => Promise<Pod.Metric[]>;

  type FetchNodeMetrics = (
    data: Node.Metrice[],
    timeRange: string
  ) => Promise<Node.Metric[]>;
}
