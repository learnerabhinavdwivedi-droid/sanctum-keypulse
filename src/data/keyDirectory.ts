export interface KeyProvider {
  id: string;
  name: string;
  category: string;
  primaryUse: string;
  devPortal: string;
  description: string;
}

export const keyDirectory: KeyProvider[] = [
  // Database & Auth
  {
    id: "supabase",
    name: "Supabase",
    category: "Database & Auth",
    primaryUse: "Postgres Database & Auth",
    devPortal: "https://supabase.com/dashboard/project/_/settings/api",
    description: "Supabase provides an open-source Firebase alternative. Your API keys are split into 'anon' (public, safe for browsers) and 'service_role' (private, bypasses RLS). Never expose your service_role key to the client. Keep your Postgres connection strings secure."
  },
  {
    id: "clerk",
    name: "Clerk",
    category: "Database & Auth",
    primaryUse: "React/Next.js Authentication",
    devPortal: "https://dashboard.clerk.com",
    description: "Clerk is a comprehensive identity and user management system. It issues a Publishable Key (safe for frontend) and a Secret Key (backend only). Ensure your Secret Key is rotated immediately if leaked."
  },
  {
    id: "firebase",
    name: "Firebase",
    category: "Database & Auth",
    primaryUse: "NoSQL Database & Auth",
    devPortal: "https://console.firebase.google.com",
    description: "Firebase keys identify your project to Google's servers. While the config object is often public, strict Firebase Security Rules are required to prevent unauthorized database read/writes."
  },
  {
    id: "auth0",
    name: "Auth0",
    category: "Database & Auth",
    primaryUse: "Enterprise Identity",
    devPortal: "https://manage.auth0.com",
    description: "Auth0 secures enterprise applications. Your Client ID is public, but your Client Secret must remain firmly on your server to exchange authorization codes for tokens securely."
  },
  {
    id: "kinde",
    name: "Kinde",
    category: "Database & Auth",
    primaryUse: "Passwordless Auth",
    devPortal: "https://app.kinde.com",
    description: "Kinde provides modern, passwordless authentication. Protect your Kinde Client Secret as it grants full administrative access to your user directories."
  },
  {
    id: "stytch",
    name: "Stytch",
    category: "Database & Auth",
    primaryUse: "Fraud & Authentication",
    devPortal: "https://stytch.com/dashboard/api-keys",
    description: "Stytch focuses on fraud prevention and passwordless auth. Like other identity providers, separate your public tokens from your backend secrets."
  },
  {
    id: "mongodb-atlas",
    name: "MongoDB Atlas",
    category: "Database & Auth",
    primaryUse: "Managed Document Database",
    devPortal: "https://cloud.mongodb.com",
    description: "MongoDB Atlas connection strings contain your database credentials. Use database users with least-privilege roles, and restrict network access via IP whitelisting."
  },
  {
    id: "planetscale",
    name: "PlanetScale",
    category: "Database & Auth",
    primaryUse: "Serverless MySQL",
    devPortal: "https://app.planetscale.com",
    description: "PlanetScale issues service tokens or passwords for serverless MySQL branches. Use read-only passwords for reporting tasks and rotate passwords using their CLI."
  },
  {
    id: "upstash",
    name: "Upstash",
    category: "Database & Auth",
    primaryUse: "Serverless Redis & Kafka",
    devPortal: "https://console.upstash.com",
    description: "Upstash provides REST APIs for Redis. Keep the UPSTASH_REDIS_REST_TOKEN strictly server-side, as it grants full read/write capabilities to your fast caching layer."
  },
  {
    id: "neon",
    name: "Neon",
    category: "Database & Auth",
    primaryUse: "Serverless Postgres",
    devPortal: "https://console.neon.tech",
    description: "Neon connection strings provide direct access to your serverless Postgres database. Use pooled connections and role-based access for production apps."
  },
  {
    id: "hasura",
    name: "Hasura",
    category: "Database & Auth",
    primaryUse: "Instant GraphQL APIs",
    devPortal: "https://cloud.hasura.io",
    description: "The HASURA_GRAPHQL_ADMIN_SECRET grants root access to your entire data graph. Use JWTs and role-based permissions instead of the admin secret in production."
  },

  // AI & Machine Learning
  {
    id: "google-ai-studio",
    name: "Google AI Studio",
    category: "AI & Machine Learning",
    primaryUse: "Gemini LLM",
    devPortal: "https://aistudio.google.com/app/apikey",
    description: "Google AI Studio keys grant access to Gemini's powerful multimodal LLMs. Never embed these in client-side code; use an intermediary API route to proxy requests."
  },
  {
    id: "openai",
    name: "OpenAI",
    category: "AI & Machine Learning",
    primaryUse: "Text, Image, & Audio Models",
    devPortal: "https://platform.openai.com/api-keys",
    description: "OpenAI API keys start with 'sk-'. Keep them strictly server-side to prevent malicious actors from racking up massive billing charges on GPT-4 inference."
  },
  {
    id: "anthropic",
    name: "Anthropic",
    category: "AI & Machine Learning",
    primaryUse: "Claude LLM",
    devPortal: "https://console.anthropic.com/settings/keys",
    description: "Anthropic keys grant access to Claude models. Use these server-side to proxy requests and handle rate limiting securely."
  },
  {
    id: "hugging-face",
    name: "Hugging Face",
    category: "AI & Machine Learning",
    primaryUse: "Open-source ML Models",
    devPortal: "https://huggingface.co/settings/tokens",
    description: "Hugging Face tokens (Read/Write/Fine-grained) allow you to download private models or upload weights. Use read-only tokens for production inference."
  },
  {
    id: "cohere",
    name: "Cohere",
    category: "AI & Machine Learning",
    primaryUse: "Enterprise AI Models",
    devPortal: "https://dashboard.cohere.com/api-keys",
    description: "Cohere API keys enable text generation and RAG pipelines. Keep the keys server-side and scope them specifically to production or trial environments."
  },
  {
    id: "mistral-ai",
    name: "Mistral AI",
    category: "AI & Machine Learning",
    primaryUse: "Open-weight LLMs",
    devPortal: "https://console.mistral.ai/api-keys",
    description: "Mistral provides high-performance API endpoints for their open-weight models. Protect these keys to avoid unauthorized generation costs."
  },
  {
    id: "replicate",
    name: "Replicate",
    category: "AI & Machine Learning",
    primaryUse: "Hosted AI Models",
    devPortal: "https://replicate.com/account/api-tokens",
    description: "Replicate tokens allow you to run specialized open-source models (like Stable Diffusion) via API. Tokens must be kept completely private."
  },
  {
    id: "pinecone",
    name: "Pinecone",
    category: "AI & Machine Learning",
    primaryUse: "Vector Database for AI",
    devPortal: "https://app.pinecone.io",
    description: "Pinecone API keys access your vector embeddings. Since this data powers your RAG models, secure the keys on your backend to prevent data poisoning."
  },

  // Hosting, Cloud & Version Control
  {
    id: "vercel",
    name: "Vercel",
    category: "Hosting & Cloud",
    primaryUse: "Frontend & Edge Hosting",
    devPortal: "https://vercel.com/account/tokens",
    description: "Vercel tokens allow CI/CD pipelines to trigger deployments or manipulate environment variables. Scope these tokens strictly and rotate them periodically."
  },
  {
    id: "github",
    name: "GitHub",
    category: "Hosting & Cloud",
    primaryUse: "Version Control & Actions",
    devPortal: "https://github.com/settings/tokens",
    description: "GitHub Personal Access Tokens (PATs) can grant full repository access. Always use fine-grained PATs to limit access strictly to what the script needs."
  },
  {
    id: "gitlab",
    name: "GitLab",
    category: "Hosting & Cloud",
    primaryUse: "Git Repositories & CI/CD",
    devPortal: "https://gitlab.com/-/profile/personal_access_tokens",
    description: "GitLab tokens can trigger CI pipelines and modify source code. Set expiration dates on all GitLab tokens."
  },
  {
    id: "bitbucket",
    name: "Bitbucket",
    category: "Hosting & Cloud",
    primaryUse: "Git Repository Hosting",
    devPortal: "https://bitbucket.org/account/settings/app-passwords",
    description: "Bitbucket App Passwords serve as API tokens. Scope them carefully to avoid unauthorized code cloning."
  },
  {
    id: "netlify",
    name: "Netlify",
    category: "Hosting & Cloud",
    primaryUse: "Static & Jamstack Hosting",
    devPortal: "https://app.netlify.com/user/applications",
    description: "Netlify Personal Access Tokens allow programmatic site deployments. Do not expose these to untrusted CI environments."
  },
  {
    id: "render",
    name: "Render",
    category: "Hosting & Cloud",
    primaryUse: "Cloud Application Hosting",
    devPortal: "https://dashboard.render.com/account/api-keys",
    description: "Render API keys manage your web services and databases. Protect them from unauthorized infrastructure manipulation."
  },
  {
    id: "aws-iam",
    name: "AWS IAM",
    category: "Hosting & Cloud",
    primaryUse: "Comprehensive Cloud Services",
    devPortal: "https://console.aws.amazon.com/iamv2",
    description: "AWS Access Key IDs and Secret Access Keys are incredibly powerful. NEVER commit them to source control. Use short-lived STS tokens and IAM roles whenever possible."
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    category: "Hosting & Cloud",
    primaryUse: "DNS, CDN, & Edge Computing",
    devPortal: "https://dash.cloudflare.com/profile/api-tokens",
    description: "Cloudflare API tokens should be scoped to specific zones (domains) and permissions (e.g., Cache Purge only) to minimize the blast radius of a leak."
  },
  {
    id: "digitalocean",
    name: "DigitalOcean",
    category: "Hosting & Cloud",
    primaryUse: "Cloud Infrastructure (Droplets)",
    devPortal: "https://cloud.digitalocean.com/account/api/tokens",
    description: "DigitalOcean Personal Access Tokens can spin up droplets. Treat them like AWS keys—never expose them, or attackers may mine cryptocurrency on your account."
  },

  // Payments & Finance
  {
    id: "stripe",
    name: "Stripe",
    category: "Payments & Finance",
    primaryUse: "Payment Processing",
    devPortal: "https://dashboard.stripe.com/apikeys",
    description: "Stripe provides Publishable (pk_) and Secret (sk_) keys. Secret keys have absolute power over charges, refunds, and payouts. NEVER let a secret key touch the frontend."
  },
  {
    id: "razorpay",
    name: "Razorpay",
    category: "Payments & Finance",
    primaryUse: "Indian Payment Gateway",
    devPortal: "https://dashboard.razorpay.com/app/keys",
    description: "Razorpay Key ID and Key Secret work together. The Secret is strictly for backend webhook verification and API calls."
  },
  {
    id: "paypal",
    name: "PayPal Developer",
    category: "Payments & Finance",
    primaryUse: "Global Online Payments",
    devPortal: "https://developer.paypal.com/dashboard",
    description: "PayPal uses Client IDs and Secrets to generate OAuth bearer tokens. Ensure the Secret is protected in your backend vault."
  },
  {
    id: "lemonsqueezy",
    name: "Lemon Squeezy",
    category: "Payments & Finance",
    primaryUse: "Software Payments & MoR",
    devPortal: "https://app.lemonsqueezy.com/settings/api",
    description: "Lemon Squeezy API keys can manage your store's subscriptions and licenses. Keep them strictly server-side."
  },
  {
    id: "plaid",
    name: "Plaid",
    category: "Payments & Finance",
    primaryUse: "Banking Data Integration",
    devPortal: "https://dashboard.plaid.com/team/keys",
    description: "Plaid provides Client ID, Secret, and Public keys. The Secret is used to exchange public tokens for access tokens—it grants access to sensitive financial data."
  },

  // Communication (Email, SMS & Video)
  {
    id: "resend",
    name: "Resend",
    category: "Communication",
    primaryUse: "Developer-focused Email",
    devPortal: "https://resend.com/api-keys",
    description: "Resend API keys allow you to dispatch transactional emails. Restrict key domains so attackers cannot use leaked keys for phishing."
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    category: "Communication",
    primaryUse: "Transactional & Marketing Email",
    devPortal: "https://app.sendgrid.com/settings/api_keys",
    description: "SendGrid keys are high-value targets for spammers. Scope the key specifically to 'Mail Send' and nothing else."
  },
  {
    id: "postmark",
    name: "Postmark",
    category: "Communication",
    primaryUse: "Fast Transactional Email",
    devPortal: "https://account.postmarkapp.com",
    description: "Postmark provides Server and Account API tokens. Server tokens are used for sending mail and should be stored securely on your backend."
  },
  {
    id: "mailgun",
    name: "Mailgun",
    category: "Communication",
    primaryUse: "Email API Services",
    devPortal: "https://app.mailgun.com/settings/api_security",
    description: "Mailgun API keys are heavily abused if leaked. Lock down sending IP addresses and rotate keys if you suspect a breach."
  },
  {
    id: "twilio",
    name: "Twilio",
    category: "Communication",
    primaryUse: "SMS, Voice, & WhatsApp",
    devPortal: "https://console.twilio.com",
    description: "Twilio Account SID and Auth Tokens can incur massive SMS toll-fraud costs if leaked. Never commit them. Use restricted API keys when possible."
  },
  {
    id: "stream",
    name: "Stream",
    category: "Communication",
    primaryUse: "Chat & Activity Feeds",
    devPortal: "https://getstream.io/dashboard",
    description: "Stream provides an API Key and Secret. The Secret generates user tokens securely on the backend; the Key is safe for the client."
  },
  {
    id: "agora",
    name: "Agora",
    category: "Communication",
    primaryUse: "Real-time Voice & Video",
    devPortal: "https://console.agora.io",
    description: "Agora App IDs are public, but App Certificates must remain on your backend to generate temporary RTC access tokens securely."
  },

  // Maps & Weather
  {
    id: "google-maps",
    name: "Google Maps Platform",
    category: "Maps & Weather",
    primaryUse: "Geocoding & Routing",
    devPortal: "https://console.cloud.google.com/google/maps-apis",
    description: "Google Maps keys are often exposed in the browser. You MUST restrict the key to specific HTTP referrers (your domains) to prevent abuse."
  },
  {
    id: "mapbox",
    name: "Mapbox",
    category: "Maps & Weather",
    primaryUse: "Custom Maps & Navigation",
    devPortal: "https://account.mapbox.com/access-tokens",
    description: "Mapbox provides Public and Secret tokens. Public tokens are safe for WebGL maps, but restrict their URLs to prevent quota theft."
  },
  {
    id: "openweathermap",
    name: "OpenWeatherMap",
    category: "Maps & Weather",
    primaryUse: "Global Weather Data",
    devPortal: "https://home.openweathermap.org/api_keys",
    description: "OpenWeatherMap API keys are passed via URL query string. Proxy requests through your backend if you want to keep the key private."
  },
  {
    id: "weatherapi",
    name: "WeatherAPI",
    category: "Maps & Weather",
    primaryUse: "Real-time Weather & Forecasts",
    devPortal: "https://weatherapi.com/my",
    description: "WeatherAPI keys should be securely stored on your backend, and client requests should be proxied to avoid exposing the key."
  },

  // Collaboration & Platforms
  {
    id: "discord",
    name: "Discord Developer",
    category: "Collaboration & Platforms",
    primaryUse: "Bot & Server Automation",
    devPortal: "https://discord.com/developers/applications",
    description: "Discord Bot Tokens grant total control over your bot identity. If exposed, Discord will automatically revoke them if pushed to public GitHub repos."
  },
  {
    id: "reddit",
    name: "Reddit Developer",
    category: "Collaboration & Platforms",
    primaryUse: "Subreddit Data & Bots",
    devPortal: "https://reddit.com/prefs/apps",
    description: "Reddit API keys (Client ID and Secret) are used for OAuth. Keep the Secret secure to prevent malicious bot activity under your app's name."
  },
  {
    id: "slack",
    name: "Slack API",
    category: "Collaboration & Platforms",
    primaryUse: "Workspace Integrations",
    devPortal: "https://api.slack.com/apps",
    description: "Slack Bot User OAuth Tokens (xoxb-) grant extensive workspace permissions. Never commit these tokens, as attackers can exfiltrate sensitive company chat logs."
  },
  {
    id: "telegram",
    name: "Telegram BotFather",
    category: "Collaboration & Platforms",
    primaryUse: "Telegram Bot Creation",
    devPortal: "https://t.me/BotFather",
    description: "Telegram Bot Tokens grant complete control over the bot's messaging capabilities. Secure them to prevent spam or impersonation."
  },
  {
    id: "notion",
    name: "Notion API",
    category: "Collaboration & Platforms",
    primaryUse: "Workspace Database Syncing",
    devPortal: "https://notion.so/my-integrations",
    description: "Notion Internal Integration Tokens grant access to specifically shared pages and databases. Scope access strictly to what the integration requires."
  },
  {
    id: "figma",
    name: "Figma Developers",
    category: "Collaboration & Platforms",
    primaryUse: "Design System Integrations",
    devPortal: "https://figma.com/developers/api",
    description: "Figma Personal Access Tokens can read design files and assets. Use OAuth for multi-tenant applications instead of PATs."
  }
];
