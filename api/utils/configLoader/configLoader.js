const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

let cachedConfig = null;

function loadConfig() {
  if (cachedConfig) return cachedConfig;

  const configPath = path.resolve(__dirname, '../../config/default.yaml');

  if (!fs.existsSync(configPath)) {
    console.error(`Config file not found at: ${configPath}`);
    return null;
  }

  const fileContents = fs.readFileSync(configPath, 'utf-8');
  cachedConfig = yaml.load(fileContents);

  return cachedConfig;
}

module.exports = loadConfig;
