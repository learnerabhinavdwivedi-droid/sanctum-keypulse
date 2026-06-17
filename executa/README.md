# KeyPulse Executa

This directory contains the **Sanctum KeyPulse Executa plugin** — a Node.js process that implements the Anna JSON-RPC 2.0 stdio protocol.

## How to test locally

```bash
# Test describe
echo '{"jsonrpc":"2.0","id":1,"method":"describe","params":{}}' | node keypulse-tools.js

# Test llm.complete
echo '{"jsonrpc":"2.0","id":2,"method":"call","params":{"name":"llm.complete","args":{"prompt":"audit security risks"}}}' | node keypulse-tools.js

# Test storage.ping
echo '{"jsonrpc":"2.0","id":3,"method":"call","params":{"name":"storage.ping","args":{}}}' | node keypulse-tools.js
```

## Registration in Anna Developer Console

1. Go to [anna.partners/developer](https://anna.partners/developer)
2. Create a new Executa with:
   - **Plugin name**: `keypulse_llm`
   - **Entry point**: `node executa/keypulse-tools.js`
   - **Tool IDs**: `llm.complete`, `storage.ping`
   - **Visibility**: `app_bundled`
3. Link it in the App manifest as `required_executas[0].tool_id`
