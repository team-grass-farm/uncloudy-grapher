import { useCallback, useEffect, useState } from 'react';
import {
  SAMPLE_DEPLOYMENTS,
  SAMPLE_NODES,
  SAMPLE_POD_JSON,
  SAMPLE_POD_METRICS,
  SAMPLE_PODS,
} from '~constants';
import { report } from '~utils/logger';

export default (
  type: 'production' | 'development' | 'offline' = 'production',
  enableSamples?: boolean
): [
  Resource.Map,
  { metric: Resource.Pod.Metric[] | null; api: Resource.Pod.API | null },
  (s: string) => void
] => {
  const [pods, setPods] = useState<Map<string, Resource.Pod>>(new Map());
  const [nodes, setNodes] = useState<Map<string, Resource.Node>>(new Map());
  const [deployments, setDeployments] = useState<
    Map<string, Resource.Deployment>
  >(new Map());
  const [namespaces, setNamespaces] = useState<Map<string, null>>(new Map());
  const [clusters, setClusters] = useState<Map<string, Resource.Cluster>>(
    new Map()
  );

  const [podMetric, setPodMetric] = useState<Resource.Pod.Metric[] | null>(
    null
  );
  const [podAPI, setPodAPI] = useState<Resource.Pod.API | null>(null);

  const requestDetailedData = useCallback((id: string) => {
    report.log('useFetcher', {
      msg: 'request detailed data',
      id,
      metric: SAMPLE_POD_METRICS.get(id),
    });
    setPodMetric(SAMPLE_POD_METRICS.get(id) ?? null);
    setPodAPI(SAMPLE_POD_JSON as Resource.Pod.API);
  }, []);

  useEffect(() => {
    if (type === 'offline' && enableSamples) {
      setPods(SAMPLE_PODS);
      setNodes(SAMPLE_NODES);
      setDeployments(SAMPLE_DEPLOYMENTS);
    }
  }, [enableSamples]);

  useEffect(() => {
    // const info: Set<[string, string]> = new Set();
    // const deployments: Resource.Deployment[] = [];
    // const namespaces: string[] = [];
    // pods.forEach((pod) => info.add([pod.deploymentId, pod.namespace]));
    // Array.from(info).forEach((val) => {
    //   deployments.push({
    //     id: val[0],
    //     shortId: val[0].split('-deployment-')[0],
    //     replicas: 0,
    //     availableReplicas: 0,
    //     namespace: val[1],
    //   });
    //   namespaces.push(val[1]);
    // });
    // setDeployments(deployments);
    // setNamespaces(namespaces);
  }, [pods]);

  useEffect(() => {
    // const info: Set<string> = new Set();
    // nodes.forEach((node) => info.add(node.region));
    // setClusters(Array.from(info).map((val) => ({ id: val })));
  }, [nodes]);

  return [
    { pods, nodes, deployments, namespaces, clusters },
    {
      metric: podMetric,
      api: podAPI,
    },
    requestDetailedData,
  ];
};
