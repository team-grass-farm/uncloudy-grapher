import { SAMPLE_NODES, SAMPLE_PODS } from '~constants';

import type { Page } from '~models';

const API_URL = 'http://133.186.222.196:9090/api/v1/';

export const getFilteringOptions = (mode: 'admin' | 'dev'): Page.Option[] => {
  if (mode === 'admin') {
    const candidates: { [s in 'seoul' | 'busan']: Page.Option } = {
      seoul: { value: 'seoul', label: '서울', children: [] },
      busan: { value: 'busan', label: '부산', children: [] },
    };
    SAMPLE_NODES.forEach((node) => {
      candidates[node.region].children!.push({
        value: node.id,
        label: node.id,
      });
    });

    return [...Object.values(candidates)];
  } else {
    const candidates: { [s: string]: Page.Option } = {};
    SAMPLE_PODS.forEach((pod) => {
      if (candidates[pod.deploymentId] === undefined) {
        candidates[pod.deploymentId] = {
          value: pod.deploymentId,
          label: pod.deploymentId,
          children: [
            {
              value: pod.id,
              label: pod.shortId,
            },
          ],
        };
      } else {
        candidates[pod.deploymentId].children!.push({
          value: pod.id,
          label: pod.shortId,
        });
      }
    });
    return [...Object.values(candidates)];
  }
};

export const fetchPodRelatedResources: Fetcher.FetchPodRelatedResources =
  async () => {
    //developer.mozilla.org/ko/docs/Web/API/Fetch_API/Using_Fetch
    const queries: string[] = ['custom_pod_cpu_usage[1m]'];

    // await Promise.all([
    //   fetch('a'),
    //   fetch('b'),
    //   fetch('c')
    // ]);
    const res = await Promise.all(queries.map((query) => fetch(query)));
    if (res[0].status === 200) {
      console.debug('[Fetcher] res:', res[0]);
    }

    return new Promise((resolve, reject) => {
      try {
        resolve({
          // pods: [{
          //   id: 'string',
          //   shortId: 'string',
          //   deploymentId: 'string',
          //   namespace: 'string',
          //   metrics: []
          // }],
          pods: [],
          nodes: [],
          deployments: [],
          namespaces: [],
        });
      } catch (e) {
        reject('error: ' + e);
      }
    });
  };

export const fetchNodeRelatedResources: Fetcher.FetchNodeRelatedResources =
  async () => {
    const queries: string[] = ['custom_node_cpu_usage[1m]'];
    const res = await Promise.all(
      queries.map((query) => fetch(API_URL + 'query?query=' + query))
    );
    console.debug('[Fetcher] res: ', await res[0].json());
    return new Promise((resolve, reject) => {
      try {
        resolve({
          nodes: [],
          clusters: [],
        });
      } catch (e) {
        reject('error: ' + e);
      }
    });
  };

export const fetchPodMetrics: Fetcher.FetchPodMetrics = async (
  data,
  timeRange
) => {
  return new Promise((resolve, reject) => {
    try {
      const ret: Record<string, Pod.Metric[]> = {};
      data.forEach((pod) => {
        // ret[pod.id] =
        return;
      });
      resolve({});
    } catch (e) {
      reject('error: ' + e);
    }
  });
};

export const fetchNodeMetrics: Fetcher.FetchNodeMetrics = async (
  data,
  timeRange
) => {
  return new Promise((resolve, reject) => {
    try {
      resolve({});
    } catch (e) {
      reject('error: ' + e);
    }
  });
};
