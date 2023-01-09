import * as IPFS from "ipfs-core";

const IpfsInfrastructure = await IPFS.create({
	// eslint-disable-next-line unicorn/prefer-module
	repo: `.cache/ipfs/${Math.random()}`,
	silent: true,
});

export { IpfsInfrastructure };
