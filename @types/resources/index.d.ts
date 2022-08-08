declare namespace Resource {
  interface Map {
    clusters?: Map<string, Resource.Cluster>;
    pods?: Map<string, Resource.Pod>;
    nodes?: Map<string, ResourceNode>;
    deployments?: Map<string, Resource.Deployment>;
    namespaces?: Map<string, string>;
  }

  interface Cluster {
    id: string;
  }

  interface Deployment {
    id: string;
    shortId: string;
    replicas: number | null;
    availableReplicas: number | null;
    namespace: string;
  }

  interface Node {
    id: string;
    region: 'seoul' | 'busan';
    os:
      | 'rhel7'
      | 'rhel8'
      | 'rhcos7'
      | 'rhcos8'
      | 'centos7'
      | 'centos8'
      | 'ubuntu';
    type: 'bastion' | 'master' | 'router' | 'worker';
  }

  namespace Node {
    interface Metric {
      time: number;
      values: {
        CPUUsage: number;
        memoryUsage: number;
        CPUSpec: number;
        memorySpec: number;
      };
    }
  }

  interface Pod {
    id: string;
    shortId: string;
    deploymentId: string;
    namespace: string;
    nodeId: string;
  }

  namespace Pod {
    interface Metric {
      time: number;
      values: {
        CPUUsage: number;
        memoryUsage: number;
        CPUSpec: number;
        memorySpec: number;
      };
    }
  }
}
