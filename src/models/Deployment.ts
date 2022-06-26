interface Deployment {
  id: string;
  shortId: string;
  replicas: number;
  availableReplicas: number;
  namespace: string;
}

namespace Deployment {}

export default Deployment;
