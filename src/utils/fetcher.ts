import { SAMPLE_NODES, SAMPLE_PODS } from '~constants';

import type { Page } from '~models';

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
