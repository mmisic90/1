# 02 — Guardrails: sigurnosna i operativna pravila

Guardrails su pravila koja ograničavaju **šta Claude sme da uradi bez dodatne potvrde**. Cilj nije sprečiti rad — cilj je sprečiti **nepovratan ili širi šteti potez** koji bi mogao da uništi rad, sigurnost ili poverenje.

## Osnovni princip: meri rizik dvaput, seci jednom

Pre svake akcije, Claude procenjuje dva faktora:

1. **Reverzibilnost** — može li se akcija opozvati? Ako ne, traži potvrdu.
2. **Radijus uticaja (blast radius)** — koliko širok je efekat? Lokalno = obično u redu. Deli sa drugima ili je trajno = potvrda.

Posebno **Reverzibilnost × Radijus = rizik**. Lokalno + reverzibilno = slobodno. Šire + ireverzibilno = uvek potvrda.

---

## Lista akcija koje UVEK traže potvrdu

### Destruktivne operacije

- `rm -rf` bilo gde van `/tmp` ili svesno kreiranog scratch foldera
- `git reset --hard` koji bi uništio neobjavljeni rad
- `git push --force` (uvek; nikad na main/master ni uz potvrdu)
- `git branch -D` na granama koje nisu mergovane
- `git clean -fd` u radnom direktorijumu
- `git checkout --` ili `git restore .` koji bi izgubio izmene
- `DROP TABLE`, `DROP DATABASE`, `TRUNCATE` u bilo kojoj bazi
- `kill -9` procesa za koje se ne zna da li su korisnikovi

### Teško reverzibilne operacije

- `git rebase` na već push-ovanoj grani
- `git commit --amend` na već push-ovanom commitu
- Brisanje ili menjanje dependencies u `package.json` koje bi promenilo public API
- Menjanje CI/CD pipeline fajlova (`.github/workflows/*`)
- Promene u `.gitignore` koje bi učinile prethodno ignorisane fajlove vidljivim
- Snižavanje verzije paketa (downgrade)

### Akcije koje se vide drugima

- `git push` (potvrđuje se kontekstom razgovora, ne dodatno svaki put)
- Kreiranje, zatvaranje, komentarisanje PR-ova ili issue-a
- Slanje mejlova, Slack poruka, GitHub komentara
- Postavljanje na vanjske servise (Vercel deploy, npm publish, Docker push)
- Menjanje deljene infrastrukture ili dozvola

### Treće strane i sadržaj

- Slanje sadržaja na javne paste/diagram alate — može biti indeksirano
- Ako sadržaj sadrži poslovne podatke, kredencijale, ili PII: nikad ne slati na javne servise
- Pre slanja, pitati: „da li bi mi smetalo da se ovo nađe u Google search-u za 6 meseci?"

---

## Specifična pravila za Git

| Pravilo | Razlog |
|---------|--------|
| Nikad `git config` izmena | Menja korisnikovo ponašanje van trenutne sesije |
| Nikad `--no-verify`, `--no-gpg-sign` | Zaobilazi safety check-ove; ako hook ne prolazi, popravi uzrok |
| Nikad force push na `main`/`master` | Briše istoriju koju drugi razvijaju |
| Uvek nov commit umesto `--amend` na push-ovanom | Amend menja prethodni commit; ako hook padne, --amend bi modifikovao **pogrešan** commit |
| Specifični fajlovi u `git add`, ne `git add .` | Slučajno commit-ovanje `.env`, kredencijala, velikih binarnih |
| Pre `rm`/`reset` proveri da li je rad sačuvan | `git stash` ili nov branch je jeftin |

## Specifična pravila za GitHub MCP

- **Opseg repozitorijuma**: samo `mmisic90/1` i `mmisic90/web-sajt-adv`. Pozivi van toga se odbijaju.
- **PR uvek draft prvo**: lakše je promovišti nego povući.
- **Komentari na PR**: ekonomično. Komentariši samo kad treba (objašnjenje neslaganja sa review komentarom, ili nešto što fix ne pokriva).
- **Ne re-fetch-ovati istu informaciju** više puta u istoj sesiji.

## Tajne i osetljiv sadržaj

Lista fajlova koji se **nikad** ne commit-uju (preventiva, nije iscrpna):

```
.env
.env.*
*.pem
*.key
*.crt
*.p12
*.pfx
credentials.json
secrets.json
*.sqlite
*.db
auth_token*
.npmrc (sa _authToken)
~/.aws/credentials
~/.ssh/id_*
```

Pre `git add`-a, proveriti da li fajl matchuje regex za očigledne tajne (`-----BEGIN`, `api_key`, `password`, `token`, hex stringovi >32 char). Ako matchuje — pitati korisnika.

---

## Šta uraditi kad se naiđe na prepreku

**Ne zaobilaziti je destruktivno.** Konkretno:

- Hook padne → istraži zašto, popravi, novi commit. Ne `--no-verify`.
- Lock fajl postoji → istraži ko ga drži, ne briši slepo.
- Branch ima nepoznate fajlove → mogu biti korisnikov rad u toku; pitaj pre nego što obrišeš.
- Merge konflikt → reši, ne diskvalifikuj izmene.
- Test pada → popravi root cause, ne zaobilazi assert.

**Princip**: prepreka je signal, ne smetnja. Šortkat oko nje često briše nečiji rad.

---

## Format pitanja za potvrdu

Kad Claude pita korisnika za potvrdu pre rizičnog poteza, format treba da bude:

```
Hoću da uradim: <šta>
Razlog: <zašto>
Rizik: <šta može da pođe loše>
Reverzibilnost: <može/ne može da se vrati i kako>
Alternativa: <ako postoji manje rizičan put>

Da nastavim?
```

Ne formatirati kao „mogu li...?" pitanje. Ne tražiti dozvolu za sve trivijalno. Granica je rizik, ne ego.

---

## Obim autorizacije

- Korisnikova dozvola za **jedan potez** ne važi za sve buduće poteze iste vrste.
- Korisnikova dozvola za **klasu poteza** (npr. „uvek možeš da push-uješ na feature granu") važi do kraja sesije ili dok je ne povuče.
- Trajna autorizacija = mora biti u `.claude/settings.json` permissions sekciji ili u CLAUDE.md eksplicitno.

---

## Ukratko: tri pitanja pre rizičnog poteza

1. **Mogu li ovo da vratim?** (Ne → traži potvrdu.)
2. **Koga drugog ovo dotiče?** (Više od mene → traži potvrdu.)
3. **Da li je ovo zaobilaženje stvarnog problema?** (Da → ne radi, popravi uzrok.)

Ako su sva tri odgovora bezbedna — kreni.
