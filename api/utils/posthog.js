// posthog.js
const { PostHog } = require('posthog-node');
require('dotenv').config();

// Create a dummy PostHog client when tracking is disabled
const dummyPosthog = {
  capture: () => {},
  identify: () => {},
  groupIdentify: () => {},
  isFeatureEnabled: () => false,
  getFeatureFlag: () => null,
  shutdown: () => Promise.resolve(),
  captureException: () => {}
};

// Initialize real PostHog client only when POSTHOG_ENABLED is true
const client = process.env.POSTHOG_ENABLED === 'true' 
  ? new PostHog(
      process.env.POSTHOG_API_KEY,
      { apiHost: 'https://us.i.posthog.com' } // Or your self-hosted domain
    )
  : dummyPosthog;

console.log(`PostHog tracking: ${process.env.POSTHOG_ENABLED === 'true' ? 'ENABLED' : 'DISABLED'}`);

module.exports = client;
