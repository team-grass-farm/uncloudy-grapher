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
  export interface Metric {
    time: number;
    values: {
      CPUUsage: number;
      memoryUsage: number;
      CPUSpec: number;
      memorySpec: number;
    };
  }
}

export default Node;
