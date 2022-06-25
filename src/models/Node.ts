interface Node {
  name: string;
  CPUUsage: number;
  MemoryUsage: number;
  OS: 'rhel7' | 'rhel8' | 'centos7' | 'centos8' | 'ubuntu';
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
