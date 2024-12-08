"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = require("../config");
if (!config_1.config.supabase.url)
    throw new Error('Missing SUPABASE_URL');
if (!config_1.config.supabase.serviceRoleKey)
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
exports.supabase = (0, supabase_js_1.createClient)(config_1.config.supabase.url, config_1.config.supabase.serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
//# sourceMappingURL=supabase.js.map