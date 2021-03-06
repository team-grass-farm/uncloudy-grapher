interface Node {
  id: string;
  region: 'seoul' | 'busan';
  CPUUsage: number;
  memoryUsage: number;
  CPUSpec: number;
  memorySpec: number;
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
  /** Prometheus HTTP API Response
   * @see https://prometheus.io/docs/prometheus/latest/querying/api/
   */
  interface Response {
    status: 'success';
    data: {
      resultType: 'vector';
      result: [
        {
          metric: {
            __name__: string;
            job: string;
            instance: string;
          };
          value: [number, string];
        }
      ];
    };
  }
}

export default Node;
