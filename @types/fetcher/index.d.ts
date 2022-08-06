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

  /**
   * pods' Map key: string === Resource.Pod.id
   * nodes' Map key: string === Resource.Pod.id
   * deployments' Map key: string === Resource.Pod.id
   * namespaces' Map key: string === namespace
   * namespaces' Map value: MUST BE NULL (because there's no Resource.Namespace)
   */
  type FetchPodRelatedResources = () => Promise<{
    pods: Map<string, Resource.Pod>;
    nodes: Map<string, Resource.Node>;
    deployments: Map<string, Resource.Deployment>;
    namespaces: Map<string, null>;
  }>;

  /**
   * nodes's Map key: string === Resource.Node.id
   * clusters' Map key: string === Resource.Cluster.id
   */
  type FetchNodeRelatedResources = () => Promise<{
    nodes: Map<string, Resource.Node>;
    clusters: Map<string, Resource.Cluster>;
  }>;

  /**
   * data's Map key: string === Resource.Pod.id
   * return value's Map key: string === Resource.Pod.id
   */
  type FetchPodMetrics = (
    data: Map<string, Resource.Pod>,
    timeRange: string
  ) => Promise<Map<string, Resource.Pod.Metric[]>>;

  /**
   * data's Map key: string === Resource.Node.id
   * return value's Map key: string === Resource.Node.id
   */
  type FetchNodeMetrics = (
    data: Map<string, Resource.Node>,
    timeRange: string
  ) => Promise<Map<string, Resource.Node.Metric[]>>;
}
