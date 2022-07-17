declare namespace Fetcher {
  interface PromResponse {
    status: 'success';
    data: {
      resultType: 'matrix' | 'vector';
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
    };
  }

  interface PodMemoryUsageBytes extends PromResponse {
    data: {
      resultType: 'matrix';
      result: {
        metric: {};
      };
    };
  }
}
