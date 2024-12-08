"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateClientCode = generateClientCode;
const supabase_1 = require("../lib/supabase");
async function generateClientCode() {
    const { data: lastUser } = await supabase_1.supabase
        .from('users')
        .select('client_code')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
    let lastNumber = 0;
    if (lastUser === null || lastUser === void 0 ? void 0 : lastUser.client_code) {
        const match = lastUser.client_code.match(/\d+/);
        if (match) {
            lastNumber = parseInt(match[0], 10);
        }
    }
    const nextNumber = lastNumber + 1;
    return `TE-${nextNumber.toString().padStart(4, '0')}`;
}
//# sourceMappingURL=client-code.js.map