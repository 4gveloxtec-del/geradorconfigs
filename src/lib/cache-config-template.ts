/**
 * IMMUTABLE BASE TEMPLATE — cache.config.xml
 *
 * This string is frozen and must NEVER be mutated at runtime.
 * Every generated config is a fresh copy of this exact string with ONLY the
 * MAC inside <string name="SP_SN_BACKUP">...,1</string> replaced.
 *
 * If you need to update the base file, paste the original cache.config.xml
 * content here verbatim (keeping the SP_SN_BACKUP line intact).
 */
export const CACHE_CONFIG_TEMPLATE = `<?xml version='1.0' encoding='utf-8' standalone='yes' ?>
<map>
    <string name="KEY_SP_SN">9C:00:D3:CF:F7:20</string>
    <string name="SP_SN_BACKUP">9C:00:D3:CF:F7:20,1</string>
    <string name="key_n_bt">9C:00:D3:CF:F7:21</string>
    <string name="key_device_id_unitvfree">86e4f2a1c93b47d8</string>
    <long name="key_first_launch_time" value="1716482391000" />
    <long name="key_last_service_time" value="1716568791000" />
    <int name="key_service_time" value="86400" />
    <string name="key_cache_id">4f2b8c1d-90ae-4d61-9a77-3c5e1b0f8d42</string>
    <string name="key_cache_value">eyJ2IjoxLCJjIjoiY2FjaGUiLCJ0IjoxNzE2NTY4NzkxfQ==</string>
    <int name="key_cache_version" value="3" />
    <boolean name="key_cache_valid" value="true" />
</map>`;

/** Fixed MAC prefix — never changes. */
export const MAC_PREFIX = "9C:00:D3:CF:";

/** Allowed characters for each generated MAC position. */
export const MAC_CHARS = "ABCDEF123456789";

/** Original MAC found in SP_SN_BACKUP (used for reference/validation). */
export const TEMPLATE_BACKUP_MAC = "9C:00:D3:CF:F7:20";
