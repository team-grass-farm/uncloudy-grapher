interface Pod {
  id: string;
  shortId: string;
  deploymentId: string;
  namespace: string;
}

namespace Pod {
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

export default Pod;
