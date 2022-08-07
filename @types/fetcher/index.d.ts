// @see https://prometheus.io/docs/prometheus/latest/querying/api/
declare namespace Fetcher {
  interface PromResponse {
    resultType: 'matrix' | 'vector';
    result: {
      metric: any;
      values: Array<[number, string]>;
    }[];
  }

  interface PodCPUUsageResponse extends PromResponse {
    resultType: 'matrix';
    result: {
      metric: {
        __name__: string;
        instance: string;
        job: 'kube_state_demo';
        namespace: string;
        deployment: string;
        pod: string;
      };
      values: Array<[number, string]>;
    }[];
  }

  interface PodMemoryUsageBytesResponse extends PromResponse {
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
  }

  interface NodeCPUUsageResponse extends PromResponse {
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
  }

  interface NodeCPUTotalResponse extends PromResponse {
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
  }

  interface PodMemoryUsageResponse extends PromResponse {
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
  }

  interface NodeMemoryTotalResponse extends PromResponse {
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
  }

  interface PodMemoryTotalResponse extends PromResponse {
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
  }

  type FetchResource = <
    T extends Map<
      string,
      | Resource.Cluster
      | Resource.Deployment
      | Resource.Node
      | Resource.Pod
      | null
    >
  >(
    query: [string, (response: PromResponse) => T],
    index: number
  ) => Promise<T>;

  type FetchResources = <
    T extends Record<
      string,
      Map<
        string,
        | Resource.Cluster
        | Resource.Deployment
        | Resource.Node
        | Resource.Pod
        | null
      >
    >
  >(
    queries: Record<string, (response: PromResponse) => T>
  ) => Promise<T>;

  /**
   * pods' Map key: string === Resource.Pod.id
   * nodes' Map key: string === Resource.Pod.id
   * deployments' Map key: string === Resource.Pod.id
   * namespaces' Map key: string === namespace
   * namespaces' Map value: MUST BE NULL (because there's no Resource.Namespace)
   */
  type FetchPodRelatedResources = () => Promise<{
    pods: Map<string, Resource.Pod>;
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
