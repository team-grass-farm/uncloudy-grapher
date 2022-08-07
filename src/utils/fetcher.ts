import { SAMPLE_NODES, SAMPLE_PODS } from '~constants';

import type { Page } from '~models';

const API_URL = 'http://133.186.222.196:9090/api/v1/';
const listMap = new Map();

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
    const podMap = new Map();
    const namespaceMap = new Map();
    const deploymentMap = new Map();

    const getData = await res[0].json();
    if (getData.status === 'success') {
      for (let i = 0; i < getData.data.result.length; i++) {
        const data = getData.data.result[i].metric;
        const podShortId = data.pod.split('-').reverse()[0];
        const deploymentShortId = data.pod.split('-')[0];

        podMap.set(data.pod, {
          id: data.pod,
          shortId: podShortId,
          deploymentId: data.deployment,
          namespace: data.namespace,
          nodeId: data.instance,
        });
        namespaceMap.set(data.pod, data.namespace);
        deploymentMap.set(data.deployment, {
          id: data.deployment,
          shortId: deploymentShortId,
          replicas: 4,
          availableReplicas: 4,
          namespace: data.namespace,
        });
      }
    }

    return new Promise((resolve, reject) => {
      try {
        resolve({
          pods: podMap,
          deployments: deploymentMap,
          namespaces: namespaceMap,
        });
      } catch (e) {
        reject('error: ' + e);
      }
    });
  };

export const fetchNodeRelatedResources: Fetcher.FetchNodeRelatedResources =
  () => {
    return new Promise(async (resolve, reject) => {
      try {
        const queries: string[] = ['custom_node_cpu_usage[1m]'];

        const res = await Promise.all(
          queries.map((query) => fetch(API_URL + 'query?query=' + query))
        );

        const clusterMap = new Map();
        const nodeMap = new Map();

        const getData = await res[0].json();

        if (getData.status === 'success') {
          for (let i = 0; i < getData.data.result.length; i++) {
            const data = getData.data.result[i].metric;
            const validationType = data.instance.split('').reverse()[2];
            nodeMap.set(data.instance, {
              id: data.instance,
              region: data.cluster,
              os: data.os,
              type:
                validationType === 'b'
                  ? 'bastion'
                  : validationType === 'm'
                  ? 'master'
                  : validationType === 'h'
                  ? 'router'
                  : 'worker',
            });
            clusterMap.set(data.instance, data.cluster);
          }
        }
        resolve({
          nodes: nodeMap,
          clusters: clusterMap,
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
      const ret: Record<string, Resource.Pod.Metric[]> = {};
      data.forEach((pod: any) => {
        console.log(pod);
        // ret[pod.id] =
      });
      resolve(listMap.set('dd', []));
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
      const ret: Record<string, Resource.Node.Metric[]> = {};

      resolve(listMap.set('dd', []));
    } catch (e) {
      reject('error: ' + e);
    }
  });
};
