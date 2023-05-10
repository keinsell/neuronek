import * as k8s from '@pulumi/kubernetes'

const appLabels = { app: 'neuronek-server' }

const deployment = new k8s.apps.v1.Deployment('neuronek-server-deployment', {
	spec: {
		selector: { matchLabels: appLabels },
		replicas: 1,
		template: {
			metadata: { labels: appLabels },
			spec: {
				containers: [
					{
						name: 'neuronek-server',
						image: 'ghcr.io/keinsell/neuronek:latest',
						ports: [{ containerPort: 80 }]
					}
				]
			}
		}
	}
})
