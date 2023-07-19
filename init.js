
(async () => {
  const fse = require('fs-extra');
  const { normalize } = require("@plotset/normalizer")
  const current_settings = fse.readJsonSync('./src/settings.json');
  const new_settings = await normalize(current_settings)
  await fse.writeJson(`./src/normalized-settings.json`, new_settings);
})()