
const { createClient } = require('@supabase/supabase-js');

const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.resolve(__dirname, '../.env.local');
console.log(`Loading env from: ${envPath}`);
const envVars = {};

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
        const match = line.match(/^\s*(.*?)=(.*)$/);
        if (match) {
            envVars[match[1]] = match[2].trim();
        }
    });
} else {
    console.error("❌ .env.local file not found at:", envPath);
}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing ENV vars. Run with: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/verify_agents.js");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    console.log("🔍 Verifying Agents...");

    const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_agent', true)
        .eq('status', 'active');

    if (error) {
        console.error("❌ Error:", error.message);
    } else {
        console.log(`✅ Found ${count} Active Agents in the Database.`);
    }
}

verify();
