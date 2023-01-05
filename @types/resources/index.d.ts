declare namespace Resource {
  interface Map {
    clusters?: Map<string, Resource.Cluster>;
    pods?: Map<string, Resource.Pod>;
    nodes?: Map<string, Resource.Node>;
    deployments?: Map<string, Resource.Deployment>;
    namespaces?: Map<string, string>;
  }

  interface Cluster {
    id: string;
  }

  /**
   * @draft designed for k8s  api
   */
  /*
  interface API {
    apiVersion: string;
    kind: string;
    metadata: any;
    spec: any;
    status: any;
  }
  */

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

    /**
     * @draft designed for k8s pod api
     */
    /*
    interface API extends Resource.API {
      apiVersion: 'v1';
      kind: 'Pod';
      metadata: {
        annotations?: Record<string, any>;
        creationTimestamp?: string;
        generateName?: string;
        labels?: Record<string, any>;
        name: string;
        namespace: string;
        resourceVersion: string;
        uid: string;
      };
      spec: {
        containers?: any[];
        dnsPolicy?: string;
        nodeName: string;
        restartPolicy: string;
      };
      status: {
        conditions?: Array<{
          lastProbeTime: string | null;
          lastTransitionTime: string;
          status: 'True' | 'False';
          type: string;
        }>;
        containerStatuses?: any[];
        hostIP?: string;
        phase?: 'Pending' | 'Running' | 'Succeeded' | 'Failed' | 'Unknown';
      };
    }

    interface Spec {
      activeDeadlineSeconds?: number;
      affinity: Affinity;
    }
  */
  }
}
