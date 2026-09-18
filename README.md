# Gerador de MACs

Build a complete new module called "Gerador de Configs" inside the existing admin panel.

IMPORTANT:

- The implementation instructions are in English, but ALL visible UI text must be in Brazilian Portuguese (pt-BR).

- Do not modify or break any existing feature, route, authentication flow, database table, API, activation endpoint, storage bucket, reseller feature, admin feature, or existing page.

- Create this as an isolated module/page.

- This module is an authorized configuration-template editor/generator only.

- Do not add any functionality that tests, validates, discovers, or attempts third-party licenses or activations.

==================================================

1. BASE TEMPLATE

==================================================

Use the exact original cache.config.xml content as an immutable template.

The template contains fields including:

KEY_SP_SN

SP_SN_BACKUP

key_n_bt

key_device_id_unitvfree

timestamps

IDs

cache values

and other XML values.

STRICT RULE:

Only SP_SN_BACKUP may change.

Everything else must remain EXACTLY identical to the original template.

Never modify:

- KEY_SP_SN

- key_n_bt

- key_device_id_unitvfree

- timestamps

- IDs

- service_time values

- cache values

- any other XML field

- XML structure

- XML ordering

The generator must preserve the template exactly and replace only the MAC portion inside:

<string name="SP_SN_BACKUP">...</string>

Always preserve the final ",1".

==================================================

2. MAC RULES

==================================================

Keep this prefix fixed:

9C:00:D3:CF:

Generate only the final 4 characters in the format:

XX:YY

Example complete generated MAC:

9C:00:D3:CF:A3:B4

Allowed characters for each generated position:

Letters:

A

B

C

D

E

F

Numbers:

1

2

3

4

5

6

7

8

9

STRICT VALIDATION RULES:

- Letters must always be uppercase.

- Never generate lowercase letters.

- Never use 0.

- Never use letters outside A-F.

- Never use Z, X, W, Y, N or any other letter outside A-F.

- Always keep the format XX:YY.

- Never create duplicate generated MACs inside the same batch.

Valid examples:

A3:B4

A5:6D

F2:9C

3E:A7

B9:F4

6C:D2

Invalid examples:

A0:B4

ZZ:12

ab:cd

X3:B4

A3:Y4

==================================================

3. GENERATION QUANTITY

==================================================

At the top of the page show:

Título:

"Gerador de Configs"

Descrição:

"Gere variações do arquivo-base alterando somente o segundo MAC."

Add a numeric selector:

"Quantidade de configs"

Minimum:

1

Maximum:

20

Default:

5

Add button:

"Gerar configs"

When clicked, generate exactly the selected quantity.

==================================================

4. OUTPUT FORMAT

==================================================

Each generated result must contain the FULL XML template.

Do not show only the MAC.

Each result must be a complete copy of cache.config.xml with only SP_SN_BACKUP changed.

Example logic:

Original:

<string name="KEY_SP_SN">9C:00:D3:CF:F7:20</string>

Generated result:

<string name="KEY_SP_SN">9C:00:D3:CF:F7:20</string>

KEY_SP_SN MUST remain unchanged.

Only:

<string name="SP_SN_BACKUP">9C:00:D3:CF:F7:20,1</string>

may become for example:

<string name="SP_SN_BACKUP">9C:00:D3:CF:A3:B4,1</string>

Everything else must remain unchanged.

==================================================

5. RESULT CARDS

==================================================

Display generated configs as horizontal swipeable cards.

This is especially important on mobile.

The user must be able to swipe/drag horizontally to see:

Config 1

Config 2

Config 3

...

Config 20

Use a horizontal carousel/scroll container.

Each card must display:

"Config 01"

"MAC gerado:"

9C:00:D3:CF:A3:B4

Then show the complete XML inside a readable monospaced code box.

The code box must:

- use monospace font

- preserve line breaks

- allow vertical scrolling if necessary

- allow text selection

- work well on mobile

==================================================

6. COPY BUTTON FOR EACH CONFIG

==================================================

Every generated card MUST have its own button:

"Copiar config"

Clicking the button copies ONLY that card's full XML content to clipboard.

After copying, temporarily change feedback to:

"Copiado!"

or show a toast:

"Config copiada com sucesso."

Each config must be independently copyable.

Do not require copying all configs at once.

==================================================

7. NAVIGATION

==================================================

On mobile:

- allow swipe left/right between configs

- use horizontal scroll snap if appropriate

Also show:

"1 de 10"

"2 de 10"

etc.

Optionally add small previous/next controls:

"Anterior"

"Próxima"

but swipe must still work.

==================================================

8. XML VALIDATION

==================================================

Before displaying any generated result:

- Validate that the XML is well-formed.

- Confirm that only SP_SN_BACKUP differs from the original template.

- Confirm that KEY_SP_SN remained unchanged.

- Confirm that ",1" remains present.

- Confirm the generated MAC follows the allowed-character rules.

- Confirm no duplicated MAC exists inside the current batch.

If validation fails, do not display the invalid result.

Generate a replacement automatically.

==================================================

9. DUPLICATE PREVENTION

==================================================

Inside the same generation batch:

never repeat a MAC.

Maintain a Set/list of generated MACs during generation.

If a generated MAC already exists:

generate another one.

==================================================

10. REGENERATE

==================================================

Add button:

"Gerar novamente"

This creates an entirely new batch using the same selected quantity.

Do not reuse MACs from the current batch when regenerating during the same page session.

==================================================

11. COPY ALL OPTIONAL FEATURE

==================================================

Add an optional secondary button:

"Copiar todas"

This can copy all generated XML blocks separated clearly with headers such as:

===== CONFIG 01 =====

[full XML]

===== CONFIG 02 =====

[full XML]

However, individual "Copiar config" buttons are mandatory and are the primary workflow.

==================================================

12. VISUAL DESIGN

==================================================

Use the current panel's existing visual identity.

Do not redesign the entire application.

The generator should feel native to the existing admin panel.

Mobile-first layout.

Suggested structure:

[ Gerador de Configs ]

Quantidade de configs:

[ - ] [ 5 ] [ + ]

[ GERAR CONFIGS ]

---------------------------------

< Config 01 de 05 >

MAC gerado

9C:00:D3:CF:A3:B4

[ complete XML code box ]

[ COPIAR CONFIG ]

---------------------------------

Swipe horizontally to access Config 02, Config 03, etc.

At bottom:

[ GERAR NOVAMENTE ]

==================================================

13. TEMPLATE SAFETY

==================================================

The original cache.config.xml template must be stored separately from generated output.

Do not mutate the original template object/string.

For each result:

create a fresh copy of the original template.

Then replace only SP_SN_BACKUP.

Never progressively modify the previous generated config.

Every generated result must originate from the same untouched original template.

==================================================

14. REQUIRED FINAL TESTS

==================================================

Before considering the feature complete, test:

1 config generation

5 configs generation

20 configs generation

Verify:

- exact quantity generated

- all MACs unique

- all MACs follow the allowed character set

- KEY_SP_SN never changes

- only SP_SN_BACKUP changes

- ",1" remains present

- XML remains valid

- individual Copy button works

- horizontal swipe works on mobile

- regeneration produces a new batch

- existing panel features remain unaffected

Do not modify existing backend activation logic.

Do not modify existing public API endpoints.

Do not modify authentication.

Do not modify Supabase policies.

Do not modify existing storage behavior.

Implement this entire module now.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://geradorconfigs.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a0b8c501-1ae5-4241-a7ea-546570c90dd1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
