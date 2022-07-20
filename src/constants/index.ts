import { Deployment, Node, Pod } from '~models';

export const MAX_WIDTH = 1000;
// NOTE 86400000 === 1 day
export const REFRESH_PERIOD = 86400000;

export const GRID_SIZE = 10;
export const SPACING = 5;
export const MAX_COLUMN_OBJECT = 1000;

// ! Deprecated, just for an example from grass-grapher
export const POS_ZANDIS: Array<Array<[number, number]>> = [
  [
    [-5, -5],
    [-4, -4],
    [-3, -3],
    [-2, -2],
  ],
  [[-3.2, -1]],
];

export const DAYS = ['토', '금', '목', '수', '화', '월', '일'];

export const SAMPLE_NODE_METRICS: Node.Metric[] = [
  {
    time: 123123123,
    values: {
      CPUUsage: 2.4,
      memoryUsage: 123456789101,
      CPUSpec: 64,
      memorySpec: 345678910111,
    },
  },
  {
    time: 123123123,
    values: {
      CPUUsage: 2.4,
      memoryUsage: 123456789101,
      CPUSpec: 64,
      memorySpec: 345678910111,
    },
  },
  {
    time: 123123123,
    values: {
      CPUUsage: 2.4,
      memoryUsage: 123456789101,
      CPUSpec: 64,
      memorySpec: 345678910111,
    },
  },
  {
    time: 123123123,
    values: {
      CPUUsage: 2.4,
      memoryUsage: 123456789101,
      CPUSpec: 64,
      memorySpec: 345678910111,
    },
  },
  {
    time: 123123123,
    values: {
      CPUUsage: 2.4,
      memoryUsage: 123456789101,
      CPUSpec: 64,
      memorySpec: 345678910111,
    },
  },
  {
    time: 123123123,
    values: {
      CPUUsage: 2.4,
      memoryUsage: 123456789101,
      CPUSpec: 64,
      memorySpec: 345678910111,
    },
  },
  {
    time: 123123123,
    values: {
      CPUUsage: 2.4,
      memoryUsage: 123456789101,
      CPUSpec: 64,
      memorySpec: 345678910111,
    },
  },
  {
    time: 123123123,
    values: {
      CPUUsage: 2.4,
      memoryUsage: 123456789101,
      CPUSpec: 64,
      memorySpec: 345678910111,
    },
  },
  {
    time: 123123123,
    values: {
      CPUUsage: 2.4,
      memoryUsage: 123456789101,
      CPUSpec: 64,
      memorySpec: 345678910111,
    },
  },
  {
    time: 123123123,
    values: {
      CPUUsage: 2.4,
      memoryUsage: 123456789101,
      CPUSpec: 64,
      memorySpec: 345678910111,
    },
  },
  {
    time: 123123123,
    values: {
      CPUUsage: 2.4,
      memoryUsage: 123456789101,
      CPUSpec: 64,
      memorySpec: 345678910111,
    },
  },
  {
    time: 123123123,
    values: {
      CPUUsage: 2.4,
      memoryUsage: 123456789101,
      CPUSpec: 64,
      memorySpec: 345678910111,
    },
  },
  {
    time: 123123123,
    values: {
      CPUUsage: 2.4,
      memoryUsage: 123456789101,
      CPUSpec: 64,
      memorySpec: 345678910111,
    },
  },
  {
    time: 123123123,
    values: {
      CPUUsage: 2.4,
      memoryUsage: 123456789101,
      CPUSpec: 64,
      memorySpec: 345678910111,
    },
  },
  {
    time: 123123123,
    values: {
      CPUUsage: 2.4,
      memoryUsage: 123456789101,
      CPUSpec: 64,
      memorySpec: 345678910111,
    },
  },
  {
    time: 123123123,
    values: {
      CPUUsage: 2.4,
      memoryUsage: 123456789101,
      CPUSpec: 64,
      memorySpec: 345678910111,
    },
  },
  {
    time: 123123123,
    values: {
      CPUUsage: 2.4,
      memoryUsage: 123456789101,
      CPUSpec: 64,
      memorySpec: 345678910111,
    },
  },
  {
    time: 123123123,
    values: {
      CPUUsage: 2.4,
      memoryUsage: 123456789101,
      CPUSpec: 64,
      memorySpec: 345678910111,
    },
  },
  {
    time: 123123123,
    values: {
      CPUUsage: 2.4,
      memoryUsage: 123456789101,
      CPUSpec: 64,
      memorySpec: 345678910111,
    },
  },
  {
    time: 123123123,
    values: {
      CPUUsage: 2.4,
      memoryUsage: 123456789101,
      CPUSpec: 64,
      memorySpec: 345678910111,
    },
  },
  {
    time: 123123123,
    values: {
      CPUUsage: 2.4,
      memoryUsage: 123456789101,
      CPUSpec: 64,
      memorySpec: 345678910111,
    },
  },
  {
    time: 123123123,
    values: {
      CPUUsage: 2.4,
      memoryUsage: 123456789101,
      CPUSpec: 64,
      memorySpec: 345678910111,
    },
  },
  {
    time: 123123123,
    values: {
      CPUUsage: 2.4,
      memoryUsage: 123456789101,
      CPUSpec: 64,
      memorySpec: 345678910111,
    },
  },
  {
    time: 123123123,
    values: {
      CPUUsage: 2.4,
      memoryUsage: 123456789101,
      CPUSpec: 64,
      memorySpec: 345678910111,
    },
  },
];

export const SAMPLE_NODES: Node[] = [
  {
    id: 'seoulb01',
    region: 'seoul',
    type: 'bastion',
    os: 'rhel8',
  },
  {
    id: 'seoulm01',
    region: 'seoul',
    type: 'master',
    os: 'rhcos8',
  },
  {
    id: 'seoulm02',
    region: 'seoul',
    type: 'master',
    os: 'rhcos8',
  },
  {
    id: 'seoulm03',
    region: 'seoul',
    type: 'master',
    os: 'rhcos8',
  },
  {
    id: 'seoulh01',
    region: 'seoul',
    type: 'router',
    os: 'rhcos8',
  },
  {
    id: 'seoulh02',
    region: 'seoul',
    type: 'router',
    os: 'rhcos8',
  },
  {
    id: 'seoulh03',
    region: 'seoul',
    type: 'router',
    os: 'rhcos8',
  },
  {
    id: 'seouln01',
    region: 'seoul',
    type: 'worker',
    os: 'rhel8',
  },
  {
    id: 'seouln02',
    region: 'seoul',
    type: 'worker',
    os: 'rhel8',
  },
  {
    id: 'seouln03',
    region: 'seoul',
    type: 'worker',
    os: 'rhel8',
  },
  {
    id: 'seouln04',
    region: 'seoul',
    type: 'worker',
    os: 'rhel8',
  },
  {
    id: 'seouln05',
    region: 'seoul',
    type: 'worker',
    os: 'rhel8',
  },
  {
    id: 'busanb01',
    region: 'busan',
    type: 'bastion',
    os: 'rhel8',
  },
  {
    id: 'busanm01',
    region: 'busan',
    type: 'master',
    os: 'rhcos8',
  },
  {
    id: 'busanm02',
    region: 'busan',
    type: 'master',
    os: 'rhcos8',
  },
  {
    id: 'busanm03',
    region: 'busan',
    type: 'master',
    os: 'rhcos8',
  },
  {
    id: 'busanh01',
    region: 'busan',
    type: 'router',
    os: 'rhcos8',
  },
  {
    id: 'busanh02',
    region: 'busan',
    type: 'router',
    os: 'rhcos8',
  },
  {
    id: 'busanh03',
    region: 'busan',
    type: 'router',
    os: 'rhcos8',
  },
  {
    id: 'busann01',
    region: 'busan',
    type: 'worker',
    os: 'rhel8',
  },
  {
    id: 'busann02',
    region: 'busan',
    type: 'worker',
    os: 'rhel8',
  },
  {
    id: 'busann03',
    region: 'busan',
    type: 'worker',
    os: 'rhel8',
  },
  {
    id: 'busann04',
    region: 'busan',
    type: 'worker',
    os: 'rhel8',
  },
  {
    id: 'busann05',
    region: 'busan',
    type: 'worker',
    os: 'rhel8',
  },
];

export const SAMPLE_POD_METRICS: Pod.Metric[] = [
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
  {
    CPUUsage: 3.2,
    memoryUsage: 67891843072,
    CPUSpec: 16,
    memorySpec: 127891843072,
  },
];

export const SAMPLE_DEPLOYMENTS: Deployment[] = [
  {
    id: 'swagger-deployment-1771418926',
    shortId: 'swagger',
    replicas: 2,
    availableReplicas: 2,
    namespace: 'zandi-backend',
  },
  {
    id: 'nodejs-deployment-2231392811',
    shortId: 'nodejs',
    replicas: 4,
    availableReplicas: 4,
    namespace: 'zandi-backend',
  },
  {
    id: 'mariadb-deployment-2913201382',
    shortId: 'mariadb',
    replicas: 2,
    availableReplicas: 2,
    namespace: 'zandi-backend',
  },
  {
    id: 'zandi-grapher-deployment-9442134208',
    shortId: 'zandi-grapher',
    replicas: 4,
    availableReplicas: 4,
    namespace: 'zandi-frontend',
  },
  {
    id: 'swagger-deployment-8834283721',
    shortId: 'swagger',
    replicas: 0,
    availableReplicas: 0,
    namespace: 'uncloudy-backend',
  },
  {
    id: 'nodejs-deployment-3942392102',
    shortId: 'nodejs',
    replicas: 4,
    availableReplicas: 4,
    namespace: 'uncloudy-backend',
  },
  {
    id: 'mysql-deployment-7532913428',
    shortId: 'mysql',
    replicas: 3,
    availableReplicas: 3,
    namespace: 'uncloudy-backend',
  },
  {
    id: 'uncloudy-grapher-blue-deployment-3291203292',
    shortId: 'uncloudy-grapher-blue',
    replicas: 2,
    availableReplicas: 2,
    namespace: 'uncloudy-frontend',
  },
  {
    id: 'uncloudy-grapher-green-deployment-7253917392',
    shortId: 'uncloudy-grapher-green',
    replicas: 2,
    availableReplicas: 2,
    namespace: 'uncloudy-frontend',
  },
  {
    id: 'monitoring-agent-deployment-8573293182',
    shortId: 'monitoring-agent',
    replicas: 3,
    availableReplicas: 3,
    namespace: 'infra',
  },
  {
    id: 'prometheus-deployment-8347123928',
    shortId: 'prometheus',
    replicas: 2,
    availableReplicas: 2,
    namespace: 'infra',
  },
  {
    id: 'grafana-deployment-5738192321',
    shortId: 'grafana',
    replicas: 1,
    availableReplicas: 1,
    namespace: 'infra',
  },
];
export const SAMPLE_PODS: Pod[] = [
  {
    id: 'swagger-deployment-1771418926-7o5ns',
    shortId: '7o5ns',
    deploymentId: 'swagger-deployment-1771418926',
    namespace: 'zandi-backend',
  },
  {
    id: 'swagger-deployment-1771418926-r18az',
    shortId: 'r18az',
    deploymentId: 'swagger-deployment-1771418926',
    namespace: 'zandi-backend',
  },
  {
    id: 'nodejs-deployment-2231392811-38d2a',
    shortId: '38d2a',
    deploymentId: 'nodejs-deployment-2231392811',
    namespace: 'zandi-backend',
  },
  {
    id: 'nodejs-deployment-2231392811-2dzos',
    shortId: '2dzos',
    deploymentId: 'nodejs-deployment-2231392811',
    namespace: 'zandi-backend',
  },
  {
    id: 'nodejs-deployment-2231392811-29dcs',
    shortId: '29dcs',
    deploymentId: 'nodejs-deployment-2231392811',
    namespace: 'zandi-backend',
  },
  {
    id: 'nodejs-deployment-2231392811-9jdsi',
    shortId: '9jdsi',
    deploymentId: 'nodejs-deployment-2231392811',
    namespace: 'zandi-backend',
  },
  {
    id: 'mariadb-deployment-2913201382-9sjwa',
    shortId: '9sjwa',
    deploymentId: 'mariadb-deployment-2913201382',
    namespace: 'zandi-backend',
  },
  {
    id: 'mariadb-deployment-2913201382-2sadw',
    shortId: '2sadw',
    deploymentId: 'mariadb-deployment-2913201382',
    namespace: 'zandi-backend',
  },
  {
    id: 'zandi-grapher-deployment-9442134208-9dxw2',
    shortId: '9dxw2',
    deploymentId: 'zandi-grapher-deployment-9442134208',
    namespace: 'zandi-frontend',
  },
  {
    id: 'zandi-grapher-deployment-9442134208-23jfd',
    shortId: '23jfd',
    deploymentId: 'zandi-grapher-deployment-9442134208',
    namespace: 'zandi-frontend',
  },
  {
    id: 'zandi-grapher-deployment-9442134208-e29aw',
    shortId: 'e29aw',
    deploymentId: 'zandi-grapher-deployment-9442134208',
    namespace: 'zandi-frontend',
  },
  {
    id: 'zandi-grapher-deployment-9442134208-5djwu',
    shortId: '5djwu',
    deploymentId: 'zandi-grapher-deployment-9442134208',
    namespace: 'zandi-frontend',
  },
  {
    id: 'nodejs-deployment-3942392102-d392a',
    shortId: 'd392a',
    deploymentId: 'nodejs-deployment-3942392102',
    namespace: 'uncloudy-backend',
  },
  {
    id: 'nodejs-deployment-3942392102-93fhs',
    shortId: '93fhs',
    deploymentId: 'nodejs-deployment-3942392102',
    namespace: 'uncloudy-backend',
  },
  {
    id: 'nodejs-deployment-3942392102-8dhwu',
    shortId: '8dhwu',
    deploymentId: 'nodejs-deployment-3942392102',
    namespace: 'uncloudy-backend',
  },
  {
    id: 'nodejs-deployment-3942392102-i28e3',
    shortId: 'i28e3',
    deploymentId: 'nodejs-deployment-3942392102',
    namespace: 'uncloudy-backend',
  },
  {
    id: 'mysql-deployment-7532913428-d48da',
    shortId: 'd48da',
    deploymentId: 'mysql-deployment-7532913428',
    namespace: 'uncloudy-backend',
  },
  {
    id: 'mysql-deployment-7532913428-8saiw',
    shortId: '8saiw',
    deploymentId: 'mysql-deployment-7532913428',
    namespace: 'uncloudy-backend',
  },
  {
    id: 'mysql-deployment-7532913428-9dwja',
    shortId: '9dwja',
    deploymentId: 'mysql-deployment-7532913428',
    namespace: 'uncloudy-backend',
  },
  {
    id: 'uncloudy-grapher-blue-deployment-3291203292-0ad92',
    shortId: '0ad92',
    deploymentId: 'uncloudy-grapher-blue-deployment-3291203292',
    namespace: 'uncloudy-frontend',
  },
  {
    id: 'uncloudy-grapher-blue-deployment-3291203292-8sjaw',
    shortId: '8sjaw',
    deploymentId: 'uncloudy-grapher-blue-deployment-3291203292',
    namespace: 'uncloudy-frontend',
  },
  {
    id: 'uncloudy-grapher-green-deployment-3291203292-38udh',
    shortId: '38udh',
    deploymentId: 'uncloudy-grapher-green-deployment-3291203292',
    namespace: 'uncloudy-frontend',
  },
  {
    id: 'uncloudy-grapher-green-deployment-3291203292-d82hw',
    shortId: 'd82hw',
    deploymentId: 'uncloudy-grapher-green-deployment-3291203292',
    namespace: 'uncloudy-frontend',
  },
  {
    id: 'monitoring-agent-deployment-8573293182-9dwqa',
    shortId: '9dwqa',
    deploymentId: 'monitoring-agent-deployment-8573293182',
    namespace: 'infra',
  },
  {
    id: 'monitoring-agent-deployment-8573293182-vcus1',
    shortId: 'vcus1',
    deploymentId: 'monitoring-agent-deployment-8573293182',
    namespace: 'infra',
  },
  {
    id: 'monitoring-agent-deployment-8573293182-dehy2',
    shortId: 'dehy2',
    deploymentId: 'monitoring-agent-deployment-8573293182',
    namespace: 'infra',
  },
  {
    id: 'prometheus-deployment-8347123928-d9a8w',
    shortId: 'd9a8w',
    deploymentId: 'prometheus-deployment-8347123928',
    namespace: 'infra',
  },
  {
    id: 'prometheus-deployment-8347123928-vn28a',
    shortId: 'vn28a',
    deploymentId: 'prometheus-deployment-8347123928',
    namespace: 'infra',
  },
  {
    id: 'grafana-deployment-5738192321-9sj2a',
    shortId: '9sj2a',
    deploymentId: 'grafana-deployment-5738192321',
    namespace: 'infra',
  },
];
