# Erowid Research Project

A research project analyzing the [experiences](http://www.erowid.org/experiences/exp_front.shtml) available from [Erowid](https://en.wikipedia.org/wiki/Erowid) in the interest of harm reduction.

## Usage

[Gunzip](https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man1/gzip.1.html) the [gzipped](http://www.gzip.org/) [JSON](http://www.json.org/) [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), [install dependencies](https://npmjs.org/doc/install.html), and run [Node](http://nodejs.org/) through [NPM](https://npmjs.org/).

```sh
gunzip -c erowid.json.gz erowid.json > !
npm install
npm start
```

Once you've got everything installed, you should be able to do trival edits through [main.js](https://github.com/christianbundy/erowid-research-project/blob/master/main.js). For example, removing anonymous authors from the data could be done with the following code.

```js
var erowid = require('./erowid.js')

erowid(function (item) {
	if ('author' in item && 'name' in item.author) {
		if (item.author.name.toLowerCase() === 'anonymous') {
			delete item.author.name
			return item
		}
	}
}, true)
```

## Contact

Please [open an issue](https://github.com/christianbundy/erowid-research-project/issues/new) if you have any questions, comments, or concerns. If you need to get a hold of me personally, I'm [@ChristianBundy](http://twitter.com/christianbundy) on Twitter, or you can email me at [me@christianbundy.com](mailto:me@christianbundy.com).

## Copyright

These experiences were downloaded from Erowid and are bound by their [copyright rules](http://www.erowid.org/general/about/about_copyrights.shtml).
