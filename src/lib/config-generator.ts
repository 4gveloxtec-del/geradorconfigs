import {
  CACHE_CONFIG_TEMPLATE,
  MAC_CHARS,
  MAC_PREFIX,
  TEMPLATE_BACKUP_MAC,
} from "./cache-config-template";

const SP_SN_BACKUP_RE =
  /(<string name="SP_SN_BACKUP">)([0-9A-F:]+),1(<\/string>)/;

const KEY_SP_SN_RE = /<string name="KEY_SP_SN">([0-9A-F:]+)<\/string>/;

export type GeneratedConfig = {
  mac: string;
  xml: string;
};

function randomChar(): string {
  return MAC_CHARS[Math.floor(Math.random() * MAC_CHARS.length)]!;
}

/** Generates the last 4 hex-ish characters in the "XX:YY" format. */
export function generateMacSuffix(): string {
  return `${randomChar()}${randomChar()}:${randomChar()}${randomChar()}`;
}

export function isValidMac(mac: string): boolean {
  return new RegExp(
    `^${MAC_PREFIX.replace(/:/g, ":")}[${MAC_CHARS}]{2}:[${MAC_CHARS}]{2}$`,
  ).test(mac);
}

/**
 * Builds a fresh copy of the untouched raw template, replacing ONLY the MAC
 * text inside <string name="SP_SN_BACKUP">...,1</string>.
 * Pure targeted string replacement — no XML parsing/serialization.
 */
export function buildConfigXml(mac: string): string {
  return CACHE_CONFIG_TEMPLATE.replace(SP_SN_BACKUP_RE, `$1${mac},1$3`);
}

/**
 * Round-trip check: putting the original MAC back into the generated string
 * must reproduce the original template exactly, character for character.
 */
export function roundTripsToTemplate(xml: string): boolean {
  return (
    xml.replace(SP_SN_BACKUP_RE, `$1${TEMPLATE_BACKUP_MAC},1$3`) ===
    CACHE_CONFIG_TEMPLATE
  );
}

/**
 * Validates that the generated XML differs from the template only in the
 * SP_SN_BACKUP MAC, that KEY_SP_SN is untouched and that ",1" is preserved.
 */
export function validateConfig(xml: string, mac: string): boolean {
  if (!isValidMac(mac)) return false;

  const backup = xml.match(SP_SN_BACKUP_RE);
  if (!backup || backup[2] !== mac) return false;
  if (!xml.includes(`>${mac},1</string>`)) return false;

  const originalKey = CACHE_CONFIG_TEMPLATE.match(KEY_SP_SN_RE)?.[1];
  const generatedKey = xml.match(KEY_SP_SN_RE)?.[1];
  if (!originalKey || originalKey !== generatedKey) return false;

  return roundTripsToTemplate(xml);
}


/**
 * Generates `quantity` unique configs. `excluded` holds MACs already used in
 * the current page session so regeneration never reuses them.
 */
export function generateConfigs(
  quantity: number,
  excluded: ReadonlySet<string> = new Set(),
): GeneratedConfig[] {
  const used = new Set(excluded);
  const results: GeneratedConfig[] = [];
  let guard = 0;

  while (results.length < quantity && guard < quantity * 500 + 1000) {
    guard++;
    const mac = `${MAC_PREFIX}${generateMacSuffix()}`;
    if (used.has(mac)) continue;
    const xml = buildConfigXml(mac);
    if (!validateConfig(xml, mac)) continue;
    used.add(mac);
    results.push({ mac, xml });
  }

  return results;
}

export function formatAllConfigs(configs: GeneratedConfig[]): string {
  return configs
    .map(
      (c, i) =>
        `===== CONFIG ${String(i + 1).padStart(2, "0")} =====\n${c.xml}`,
    )
    .join("\n\n");
}
