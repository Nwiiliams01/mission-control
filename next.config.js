/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  outputFileTracingRoot: __dirname,
  env: {
    VAULT_PATH: process.env.VAULT_PATH || '/mnt/nathaniel-os',
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src')
    return config
  },
}

module.exports = nextConfig
