declare namespace Resource {
  declare interface Map {
    clusters?: Cluster[];
    pods?: Pod[];
    nodes?: Node[];
    deployments?: Deployment[];
    namespaces?: string[];
  }

  interface Cluster {
    id: string;
  }

  interface Deployment {
    id: string;
    shortId: string;
    replicas: number;
    availableReplicas: number;
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
