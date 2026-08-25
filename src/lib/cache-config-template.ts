/**
 * IMMUTABLE BASE TEMPLATE — cache.config.xml (original anexo)
 *
 * This string is frozen and must NEVER be mutated at runtime.
 * Every generated config is a fresh copy of this exact string with ONLY the
 * MAC inside <string name="SP_SN_BACKUP">...,1</string> replaced.
 *
 * The content below is the verbatim content of the attached cache.config.xml
 * file and must be preserved exactly (declaration, elements, values, order,
 * timestamps, IDs, UUIDs, empty values and formatting).
 */
export const CACHE_CONFIG_TEMPLATE = `<?xml version='1.0' encoding='utf-8' standalone='yes' ?>
<map>
    <string name="live_last_channel_code">SBTHD</string>
    <string name="unitvsiptv_free"></string>
    <string name="unitvsiptv_live"></string>
    <int name="recommends_cache_time" value="96" />
    <int name="all_Column_key" value="68143" />
    <long name="service_time_column_10002" value="1765661800299" />
    <long name="service_time_column_10001" value="1765661799861" />
    <long name="service_time_column_10006" value="1765661800282" />
    <int name="live_last_column_id" value="68143" />
    <string name="key_user_id">515863542</string>
    <long name="service_time_column_0" value="1765325027991" />
    <string name="KEY_SP_SN">9C:00:D3:CF:F7:20</string>
    <string name="_free"></string>
    <string name="_special"></string>
    <string name="Special_root"></string>
    <string name="SP_SN_BACKUP">9C:00:D3:CF:F7:20,1</string>
    <int name="column_cache_time" value="65" />
    <string name="_live"></string>
    <string name="key_user_identity">4</string>
    <int name="live_last_tab" value="3" />
    <string name="_search"></string>
    <string name="unitvsiptv_special"></string>
    <int name="heartbeat_cache_time" value="120" />
    <long name="dcs_realtime" value="5777429" />
    <string name="key_n_bt">04f7b9cb-5b0b-4754-ac1d-7225b02aedbd</string>
    <string name="key_device_id_unitvfree">515863542</string>
    <string name="cache_key_recommend"></string>
    <string name="unitvsiptv_search"></string>
    <string name="68143">946b2cd8-d75c-11f0-b76f-a304a7c797c8LiveDataV6;1766172909</string>
    <string name="key_renew_flag">0</string>
    <long name="service_time_recommends" value="1765568698111" />
</map>
`;

/** Fixed MAC prefix — never changes. */
export const MAC_PREFIX = "9C:00:D3:CF:";

/** Allowed characters for each generated MAC position. */
export const MAC_CHARS = "ABCDEF123456789";

/** Original MAC found in SP_SN_BACKUP (used for reference/validation). */
export const TEMPLATE_BACKUP_MAC = "9C:00:D3:CF:F7:20";
