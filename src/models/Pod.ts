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

  /**
   * Kube-state-metrice
   * @description kube_pod_container_info
   */
  // interface Response {
  //   status: 'success';
  //   data: {
  //     resultType: 'vector';
  //     result: [
  //       {
  //         metric: {
  //           __name__: 'kube_pod-';
  //           container: string;
  //           container_id: string;
  //           image: string;
  //           image_id;
  //         };
  //       }
  //     ];
  //   };
  // }
}

export default Pod;
