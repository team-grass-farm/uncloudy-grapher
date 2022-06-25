interface Pod {
  namespace: string;
  pod: string;
  uid: string;
}

namespace Pod {
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
