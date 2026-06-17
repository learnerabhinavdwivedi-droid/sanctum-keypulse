export interface FamousApi {
  id: string;
  name: string;
  category: string;
  endpoint: string;
  envName: string;
  headerFormat: string; // e.g. "Bearer {key}" or "{key}"
  headerName: string; // e.g. "Authorization" or "x-api-key"
}

export const famousApis: FamousApi[] = [
  { id: 'stripe', name: 'Stripe API', category: 'Payments', endpoint: 'https://api.stripe.com/v1/charges', envName: 'STRIPE_API_KEY', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'openai', name: 'OpenAI API', category: 'AI/ML', endpoint: 'https://api.openai.com/v1/models', envName: 'OPENAI_API_KEY', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'github', name: 'GitHub API', category: 'DevTools', endpoint: 'https://api.github.com/user', envName: 'GITHUB_TOKEN', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'aws', name: 'AWS API', category: 'Cloud', endpoint: 'https://ec2.amazonaws.com/', envName: 'AWS_ACCESS_KEY_ID', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'twilio', name: 'Twilio API', category: 'Communication', endpoint: 'https://api.twilio.com/2010-04-01/Accounts.json', envName: 'TWILIO_AUTH_TOKEN', headerFormat: 'Basic {key}', headerName: 'Authorization' },
  { id: 'sendgrid', name: 'SendGrid API', category: 'Email', endpoint: 'https://api.sendgrid.com/v3/user/profile', envName: 'SENDGRID_API_KEY', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'vercel', name: 'Vercel API', category: 'Cloud', endpoint: 'https://api.vercel.com/v2/user', envName: 'VERCEL_TOKEN', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'supabase', name: 'Supabase API', category: 'Database', endpoint: 'https://api.supabase.io/v1/projects', envName: 'SUPABASE_API_KEY', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'algolia', name: 'Algolia API', category: 'Search', endpoint: 'https://api.algolia.net/1/indexes', envName: 'ALGOLIA_API_KEY', headerFormat: '{key}', headerName: 'X-Algolia-API-Key' },
  { id: 'datadog', name: 'Datadog API', category: 'Monitoring', endpoint: 'https://api.datadoghq.com/api/v1/validate', envName: 'DATADOG_API_KEY', headerFormat: '{key}', headerName: 'DD-API-KEY' },
  { id: 'hubspot', name: 'HubSpot API', category: 'CRM', endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts', envName: 'HUBSPOT_API_KEY', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'salesforce', name: 'Salesforce API', category: 'CRM', endpoint: 'https://login.salesforce.com/services/oauth2/userinfo', envName: 'SALESFORCE_TOKEN', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'discord', name: 'Discord API', category: 'Social', endpoint: 'https://discord.com/api/users/@me', envName: 'DISCORD_BOT_TOKEN', headerFormat: 'Bot {key}', headerName: 'Authorization' },
  { id: 'slack', name: 'Slack API', category: 'Communication', endpoint: 'https://slack.com/api/auth.test', envName: 'SLACK_BOT_TOKEN', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'zoom', name: 'Zoom API', category: 'Communication', endpoint: 'https://api.zoom.us/v2/users/me', envName: 'ZOOM_JWT_TOKEN', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'google_maps', name: 'Google Maps API', category: 'Maps', endpoint: 'https://maps.googleapis.com/maps/api/timezone/json?location=39.6034810,-119.6822510&timestamp=1331161200', envName: 'GOOGLE_MAPS_API_KEY', headerFormat: '{key}', headerName: 'x-api-key' },
  { id: 'mapbox', name: 'Mapbox API', category: 'Maps', endpoint: 'https://api.mapbox.com/tokens/v2', envName: 'MAPBOX_ACCESS_TOKEN', headerFormat: '{key}', headerName: 'access_token' },
  { id: 'spotify', name: 'Spotify API', category: 'Media', endpoint: 'https://api.spotify.com/v1/me', envName: 'SPOTIFY_API_KEY', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'youtube', name: 'YouTube API', category: 'Media', endpoint: 'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', envName: 'YOUTUBE_API_KEY', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'twitter', name: 'Twitter API', category: 'Social', endpoint: 'https://api.twitter.com/2/users/me', envName: 'TWITTER_BEARER_TOKEN', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'notion', name: 'Notion API', category: 'Productivity', endpoint: 'https://api.notion.com/v1/users/me', envName: 'NOTION_API_KEY', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'airtable', name: 'Airtable API', category: 'Database', endpoint: 'https://api.airtable.com/v0/meta/bases', envName: 'AIRTABLE_API_KEY', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'linear', name: 'Linear API', category: 'Project Management', endpoint: 'https://api.linear.app/graphql', envName: 'LINEAR_API_KEY', headerFormat: '{key}', headerName: 'Authorization' },
  { id: 'jira', name: 'Jira API', category: 'Project Management', endpoint: 'https://api.atlassian.com/me', envName: 'JIRA_API_TOKEN', headerFormat: 'Basic {key}', headerName: 'Authorization' },
  { id: 'shopify', name: 'Shopify API', category: 'E-commerce', endpoint: 'https://YOUR_SHOP.myshopify.com/admin/api/2023-10/shop.json', envName: 'SHOPIFY_API_KEY', headerFormat: '{key}', headerName: 'X-Shopify-Access-Token' },
  { id: 'plaid', name: 'Plaid API', category: 'Finance', endpoint: 'https://sandbox.plaid.com/item/get', envName: 'PLAID_SECRET', headerFormat: '{key}', headerName: 'PLAID-SECRET' },
  { id: 'paypal', name: 'PayPal API', category: 'Payments', endpoint: 'https://api-m.sandbox.paypal.com/v1/identity/oauth2/userinfo', envName: 'PAYPAL_CLIENT_SECRET', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'square', name: 'Square API', category: 'Payments', endpoint: 'https://connect.squareup.com/v2/merchants', envName: 'SQUARE_ACCESS_TOKEN', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'mailchimp', name: 'Mailchimp API', category: 'Email', endpoint: 'https://usX.api.mailchimp.com/3.0/ping', envName: 'MAILCHIMP_API_KEY', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'postmark', name: 'Postmark API', category: 'Email', endpoint: 'https://api.postmarkapp.com/server', envName: 'POSTMARK_SERVER_TOKEN', headerFormat: '{key}', headerName: 'X-Postmark-Server-Token' },
  { id: 'clerk', name: 'Clerk API', category: 'Auth', endpoint: 'https://api.clerk.dev/v1/users', envName: 'CLERK_SECRET_KEY', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'auth0', name: 'Auth0 API', category: 'Auth', endpoint: 'https://YOUR_DOMAIN.auth0.com/api/v2/users', envName: 'AUTH0_API_KEY', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'sentry', name: 'Sentry API', category: 'Monitoring', endpoint: 'https://sentry.io/api/0/', envName: 'SENTRY_AUTH_TOKEN', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'new_relic', name: 'New Relic API', category: 'Monitoring', endpoint: 'https://api.newrelic.com/v2/applications.json', envName: 'NEW_RELIC_API_KEY', headerFormat: '{key}', headerName: 'Api-Key' },
  { id: 'contentful', name: 'Contentful API', category: 'CMS', endpoint: 'https://api.contentful.com/spaces', envName: 'CONTENTFUL_MANAGEMENT_TOKEN', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'sanity', name: 'Sanity API', category: 'CMS', endpoint: 'https://api.sanity.io/v2021-06-07/projects', envName: 'SANITY_API_TOKEN', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'firebase', name: 'Firebase API', category: 'Cloud', endpoint: 'https://identitytoolkit.googleapis.com/v1/accounts:lookup', envName: 'FIREBASE_API_KEY', headerFormat: '{key}', headerName: 'x-api-key' },
  { id: 'gcp', name: 'Google Cloud API', category: 'Cloud', endpoint: 'https://cloudresourcemanager.googleapis.com/v1/projects', envName: 'GCP_API_KEY', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'azure', name: 'Azure API', category: 'Cloud', endpoint: 'https://management.azure.com/subscriptions?api-version=2020-01-01', envName: 'AZURE_API_KEY', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'digitalocean', name: 'DigitalOcean API', category: 'Cloud', endpoint: 'https://api.digitalocean.com/v2/account', envName: 'DIGITALOCEAN_TOKEN', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'heroku', name: 'Heroku API', category: 'Cloud', endpoint: 'https://api.heroku.com/account', envName: 'HEROKU_API_KEY', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'cloudflare', name: 'Cloudflare API', category: 'CDN', endpoint: 'https://api.cloudflare.com/client/v4/user', envName: 'CLOUDFLARE_API_KEY', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'fastly', name: 'Fastly API', category: 'CDN', endpoint: 'https://api.fastly.com/current_customer', envName: 'FASTLY_API_KEY', headerFormat: '{key}', headerName: 'Fastly-Key' },
  { id: 'anthropic', name: 'Anthropic API', category: 'AI/ML', endpoint: 'https://api.anthropic.com/v1/models', envName: 'ANTHROPIC_API_KEY', headerFormat: '{key}', headerName: 'x-api-key' },
  { id: 'cohere', name: 'Cohere API', category: 'AI/ML', endpoint: 'https://api.cohere.ai/v1/models', envName: 'COHERE_API_KEY', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'huggingface', name: 'Hugging Face API', category: 'AI/ML', endpoint: 'https://huggingface.co/api/whoami-v2', envName: 'HUGGINGFACE_API_KEY', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'replicate', name: 'Replicate API', category: 'AI/ML', endpoint: 'https://api.replicate.com/v1/models', envName: 'REPLICATE_API_TOKEN', headerFormat: 'Token {key}', headerName: 'Authorization' },
  { id: 'pinecone', name: 'Pinecone API', category: 'Database', endpoint: 'https://api.pinecone.io/indexes', envName: 'PINECONE_API_KEY', headerFormat: '{key}', headerName: 'Api-Key' },
  { id: 'weaviate', name: 'Weaviate API', category: 'Database', endpoint: 'https://api.weaviate.io/v1/meta', envName: 'WEAVIATE_API_KEY', headerFormat: 'Bearer {key}', headerName: 'Authorization' },
  { id: 'qdrant', name: 'Qdrant API', category: 'Database', endpoint: 'https://api.qdrant.io/v1/collections', envName: 'QDRANT_API_KEY', headerFormat: 'Bearer {key}', headerName: 'Authorization' }
];
