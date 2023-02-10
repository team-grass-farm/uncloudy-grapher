import { useCallback, useState } from 'react';
import { SAMPLE_POD_JSON, SAMPLE_POD_METRICS } from '~constants';
import { report } from '~utils/logger';

export default (
  type: 'production' | 'development' | 'offline' = 'production',
  enableSamples?: boolean
): [Resource.Detail | null, (id: string | null) => void] => {
  const [detailedData, setDetailedData] = useState<Resource.Detail | null>(
    null
  );

  const requestDetailedData = useCallback((id: string | null) => {
    if (!!id) {
      const metric = SAMPLE_POD_METRICS.get(id) ?? null;

      report.log('useDetailedFetcher', {
        msg: `request detailed data (metric ${metric ? 'O' : 'X'})`,
        id,
        metric,
      });

      setDetailedData({
        id,
        kind: 'pod',
        metric,
        api: SAMPLE_POD_JSON as Resource.Pod.API,
      });
    } else {
      setDetailedData(null);
    }
  }, []);

  return [detailedData, requestDetailedData];
};
