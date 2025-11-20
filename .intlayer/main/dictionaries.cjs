const _AdSsCUzIiQix8mOtdnXn = require('../dictionary/about.json');
const _fKkuO3VYIsyFb0rIZKHx = require('../dictionary/blog.json');
const _KCpxOVUa9pG8zgNtLRZw = require('../dictionary/header.json');
const _ogMOQST59hWsDHUvMjyy = require('../dictionary/home.json');
const _NxIqpXXQzoOo11htzs5j = require('../dictionary/locale-switcher.json');
const _dF5uPV6j6PgleoMAKmW8 = require('../dictionary/optimize.json');
const _Ndl0oH4ALcOYnNFNdRJu = require('../dictionary/plugins.json');
const _I9K7ZnAU0qou9ydUWuI6 = require('../dictionary/seo.json');

const dictionaries = {
  "about": _AdSsCUzIiQix8mOtdnXn,
  "blog": _fKkuO3VYIsyFb0rIZKHx,
  "header": _KCpxOVUa9pG8zgNtLRZw,
  "home": _ogMOQST59hWsDHUvMjyy,
  "locale-switcher": _NxIqpXXQzoOo11htzs5j,
  "optimize": _dF5uPV6j6PgleoMAKmW8,
  "plugins": _Ndl0oH4ALcOYnNFNdRJu,
  "seo": _I9K7ZnAU0qou9ydUWuI6
};
const getDictionaries = () => dictionaries;

module.exports.getDictionaries = getDictionaries;
module.exports = dictionaries;
