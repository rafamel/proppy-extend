const fs = require('fs');
const path = require('path');
const registerSx = (sx, _ = (global.SX = {})) =>
  Object.keys(sx).forEach((key) => (global.SX[key] = sx[key]));
const sx = (name) => `node -r ./package-scripts.js -e "global.SX.${name}()"`;
const scripts = (x) => ({ scripts: x });
const exit0 = (x) => `${x} || shx echo `;
const series = (x) => `(${x.join(') && (')})`;
// const intrim = (x) => x.replace(/\n/g, ' ').replace(/ {2,}/g, ' ');

process.env.LOG_LEVEL = 'disable';
module.exports = scripts({
  build: series([
    'nps validate',
    exit0('shx rm -r lib'),
    'shx mkdir lib',
    'babel src --out-dir lib',
    'shx cp LICENSE ./lib',
    sx('package')
  ]),
  publish: 'nps build && cd ./lib && npm publish',
  watch: 'onchange "./src/**/*.{js,jsx,ts}" -i -- nps private.watch',
  fix: `prettier --write "./**/*.{js,jsx,ts,json,scss}"`,
  lint: {
    default: 'eslint ./src --ext .js',
    test: 'eslint ./test --ext .js',
    md: 'markdownlint *.md --config markdown.json'
  },
  test: {
    default: 'nps lint.test && jest ./test/.*.test.js',
    watch:
      'onchange "./{test,src}/**/*.{js,jsx,ts}" -i -- nps private.test_watch'
  },
  validate: 'nps fix lint lint.test lint.md test private.validate_last',
  update: 'npm update --save/save-dev && npm outdated',
  clean: `${exit0('shx rm -r lib coverage')} && shx rm -rf node_modules`,
  // Private
  private: {
    watch: `${sx('clear')} && nps lint && babel src --out-dir lib`,
    test_watch: `${sx('clear')} && nps test`,
    validate_last: `npm outdated || ${sx('countdown')}`
  }
});

registerSx({
  clear: () => console.log('\x1Bc'),
  countdown: (i = 8) => {
    if (!process.env.MSG) return;
    console.log('');
    const t = setInterval(() => {
      process.stdout.write('\r' + process.env.MSG + ' ' + i);
      !i-- && (clearInterval(t) || true) && console.log('\n');
    }, 1000);
  },
  package: () => {
    const plain = fs.readFileSync(path.join(__dirname, 'package.json'));
    const package = JSON.parse(plain);

    package.main = './index.js';
    delete package.scripts.prepublishOnly;

    fs.writeFileSync(
      path.join(__dirname, 'lib/package.json'),
      JSON.stringify(package, null, 2)
    );
  }
});
