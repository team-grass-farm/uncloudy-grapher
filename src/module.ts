import { PluginWrapper, PluginWrapperProps } from '~components';
import { useMetaFetcher } from '~hooks';

import { PanelPlugin } from '@grafana/data';

export const plugin = new PanelPlugin<PluginWrapperProps>(
  PluginWrapper
).setPanelOptions((builder) => {
  const [resourceMap] = useMetaFetcher('offline', true);
  return builder.addRadio({
    path: 'panelMode',
    defaultValue: 'dev',
    name: 'panel mode',
    settings: {
      options: [
        { value: 'dev', label: 'Developer' },
        { value: 'admin', label: 'Admin' },
      ],
    },
  });
});