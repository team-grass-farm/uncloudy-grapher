import React, { useEffect, useState } from 'react';
import { SAMPLE_NODES, SAMPLE_PODS } from '~constants';

export default (
  type: 'production' | 'development' | 'offline' = 'production'
): [Resource.Map] => {
  const [pods, setPods] = useState<Resource.Pod[]>([]);
  const [nodes, setNodes] = useState<Resource.Node[]>([]);
  const [deployments, setDeployments] = useState<Resource.Deployment[]>([]);
  const [namespaces, setNamespaces] = useState<string[]>([]);
  const [clusters, setClusters] = useState<Resource.Cluster[]>([]);

  useEffect(() => {
    if (type === 'offline') {
      setPods(SAMPLE_PODS);
      setNodes(SAMPLE_NODES);
    }
  }, []);

  useEffect(() => {
    const info: Set<[string, string]> = new Set();
    const deployments: Resource.Deployment[] = [];
    const namespaces: string[] = [];

    pods.forEach((pod) => info.add([pod.deploymentId, pod.namespace]));
    Array.from(info).forEach((val) => {
      deployments.push({
        id: val[0],
        shortId: val[0].split('-deployment-')[0],
        replicas: 0,
        availableReplicas: 0,
        namespace: val[1],
      });
      namespaces.push(val[1]);
    });

    setDeployments(deployments);
    setNamespaces(namespaces);
  }, [pods]);

  useEffect(() => {
    const info: Set<string> = new Set();

    nodes.forEach((node) => info.add(node.region));
    setClusters(Array.from(info).map((val) => ({ id: val })));
  }, [nodes]);

  return [{ pods, nodes, deployments, namespaces, clusters }];
};
