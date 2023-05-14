import * as k8s from '@pulumi/kubernetes'
import * as pulumi from '@pulumi/pulumi'
import * as digitalocean from '@pulumi/digitalocean'

const provider = new digitalocean.Provider('digitalocean', {
	token: process.env.DIGITALOCEAN_TOKEN
})

const cluster = new digitalocean.KubernetesCluster('k8s-1-26-3-do-0-sfo3-1684061638392', {
	nodePool: {
		name: 'pool-ljqejkq2q',
		size: 's-1vcpu-2gb',
		autoScale: false,
		minNodes: 1,
		maxNodes: 1,
		nodeCount: 1
	},
	region: digitalocean.Region.AMS3,
	version: '1.26.3-do.0'
})

// const nodePool = new digitalocean.KubernetesNodePool('default', {
// 	clusterId: cluster.id,
// 	name: 'default',
// 	size: 's-1vcpu-2gb',
// 	autoScale: false,
// 	minNodes: 1,
// 	maxNodes: 1
// })

export const kubeconfig = cluster.kubeConfigs[0].rawConfig

// export const clusterName = cluster.name

// Deploy the app in the cluster.

// const appLabels = { app: 'neuronek-server' }

// const k8sProvider = new k8s.Provider('k8s-provider', {
// 	kubeconfig: doK8sClusterKubeconfig
// })

// const namespace = new k8s.core.v1.Namespace('app-namespace', {}, { provider: k8sProvider })

// const deployment = new k8s.apps.v1.Deployment('neuronek-server-deployment', {
// 	spec: {
// 		selector: { matchLabels: appLabels },
// 		replicas: 1,
// 		template: {
// 			metadata: { labels: appLabels },
// 			spec: {
// 				containers: [
// 					{
// 						name: 'neuronek-server',
// 						image: 'ghcr.io/keinsell/neuronek:latest',
// 						ports: [{ containerPort: 80 }]
// 					}
// 				]
// 			}
// 		}
// 	}
// })
