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

    const res = await Promise.all(
      queries.map((query) => fetch(API_URL + 'query?query=' + query))
    );

    const podList: Pod[] = [];
    const nodeList: Node[] = [];
    const namespaceList: string[] = [];
    const deploymentList: string[] = [];

    const getData: any = await res[0].json();
    if (getData.status === 'success') {
      for (let i = 0; i < getData.data.result.length; i++) {
        const data = getData.data.result[i].metric;
        const splitShortId = data.pod.split('-').at(-1);
        podList[i] = {
          id: data.pod,
          shortId: splitShortId,
          deploymentId: data.deployment,
          namespace: data.namespace,
        };
        nodeList.push(data.instance);
        namespaceList.push(data.namespace);
        deploymentList.push(data.deployment);
      }
    }

    return new Promise((resolve, reject) => {
      try {
        resolve({
          pods: podList,
          nodes: nodeList,
          deployments: deploymentList,
          namespaces: namespaceList,
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

    const nodeList: Node[] = [];
    const clusterList: Cluster[] = [];

    const getData: any = await res[0].json();

    if (getData.status === 'success') {
      for (let i = 0; i < getData.data.result.length; i++) {
        const data = getData.data.result[i].metric;
        nodeList[i] = {
          id: data.instance,
          region: data.cluster,
          os: 'ubuntu',
          type: 'worker',
        };
        clusterList.push(data.result[i].metric.cluster);
      }
    }

    return new Promise((resolve, reject) => {
      try {
        resolve({
          nodes: nodeList,
          clusters: clusterList,
        });
      } catch (e) {
        reject('error: ' + e);
      }
    });
  };

export const fetchPodMetrics: Fetcher.FetchPodMetrics = async (
  data: any,
  timeRange: any
) => {
  return new Promise((resolve, reject) => {
    try {
      console.log('data:', data);
      const ret: Record<string, Pod.Metric[]> = {};
      data.forEach((pod: any) => {
        console.log(pod);
        // ret[pod.id] =
      });
      resolve({});
    } catch (e) {
      reject('error: ' + e);
    }
  });
};

export const fetchNodeMetrics: Fetcher.FetchNodeMetrics = async (
  data: any,
  timeRange: any
) => {
  return new Promise((resolve, reject) => {
    try {
      const ret: Record<string, Node.Metric[]> = {};

      resolve({});
    } catch (e) {
      reject('error: ' + e);
    }
  });
};
