# 03 — Anti-halucinacije: zvaničnih sedam Anthropic tehnika + proširenja

Ovaj dokument je doslovno preveden i adaptiran iz zvanične Anthropic dokumentacije „Reduce hallucinations" (https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations), sa proširenjima specifičnim za naš kontekst.

## Šta je halucinacija

Halucinacija je generisani tekst koji je **činjenično pogrešan ili nije konzistentan sa kontekstom**. Najopasnija je kad zvuči pouzdano — kad model „glasno tvrdi" nešto što nije proverio.

**Korenski razlog**: jezički modeli predviđaju sledeći token na osnovu obrazaca iz trening podataka. Za retke ili nišne teme, dovoljnih podataka nema — model nagađa. U kombinaciji sa instinktom da bude koristan, model radije izmišlja uverljiv odgovor nego što priznaje neznanje.

---

## Osnovne tehnike (basic)

### 1. Dozvoli „Ne znam"

**Najjača jedna tehnika.** Eksplicitno dati modelu dozvolu da prizna neizvesnost drastično smanjuje lažne informacije.

**Primer prompt-a (parafraziran iz Anthropic doca):**

> Kao naš M&A savetnik, analiziraj ovaj izveštaj o potencijalnoj akviziciji AcmeCo od strane ExampleCorp.
>
> \<report\>{{REPORT}}\</report\>
>
> Fokusiraj se na finansijske projekcije, integracione rizike i regulatorne prepreke. **Ako nisi siguran u bilo koji aspekat ili ako izveštaj ne sadrži potrebne informacije, reci „Nemam dovoljno informacija da pouzdano procenim ovo."**

### 2. Direktni citati za faktičko utemeljenje

Za zadatke sa dugim dokumentima (>20.000 tokena), zatraži od Claude-a da **prvo izdvoji doslovne citate, pa onda radi zadatak**. Time se odgovor utemeljuje u stvarnom tekstu, ne u parafrazi koja može da skliznu u izmišljanje.

**Primer (parafraziran):**

> Kao naš Data Protection Officer, pregledaj ovu ažuriranu privacy policy za GDPR i CCPA usaglašenost.
>
> \<policy\>{{POLICY}}\</policy\>
>
> 1. Izdvoji tačne citate iz policy-a koji su najrelevantniji za GDPR i CCPA. Ako ne nađeš relevantne citate, reci „Nema relevantnih citata."
> 2. Koristi te citate da analiziraš usaglašenost ovih sekcija, referenciraj citate po broju. Analizu baziraj **samo na izvučenim citatima**.

### 3. Verifikacija sa citatima

Učini odgovor proverljivim — neka Claude citira izvore za svaku tvrdnju. Alternativno: kad završi odgovor, neka prođe kroz svaku tvrdnju i nađe potporni citat. Ako ne nađe, **mora da povuče tvrdnju**.

**Primer (parafraziran):**

> Napiši saopštenje za javnost za naš novi cybersecurity proizvod, AcmeSecurity Pro, koristeći samo informacije iz ovih product brief-ova i marketinških izveštaja.
>
> \<documents\>{{DOCUMENTS}}\</documents\>
>
> Posle pisanja, prođi kroz svaku tvrdnju u saopštenju. Za svaku tvrdnju, nađi direktan citat iz dokumenata koji je podržava. **Ako ne nađeš potporni citat, ukloni tu tvrdnju iz saopštenja i označi mesto sa praznim `[]` zagradama.**

---

## Napredne tehnike (advanced)

### 4. Chain-of-thought verifikacija

Zatraži od Claude-a da objasni svoje rezonovanje **korak po korak pre konačnog odgovora**. To otkriva pogrešne pretpostavke i logičke greške rano, dok se mogu ispraviti.

Format koji radi:

```
<rezonovanje>
1. Šta tačno pita korisnik?
2. Koje pretpostavke pravim?
3. Koje su moguće interpretacije?
4. Koja ima najviše smisla u kontekstu?
</rezonovanje>

<odgovor>
...
</odgovor>
```

### 5. Best-of-N verifikacija

Pokreni isti prompt više puta i uporedi izlaze. **Razlike između izlaza su signal halucinacije** — ako model ne može da reprodukuje sebe, verovatno improvizuje.

Praktično: kad je tačnost kritična (pravna, medicinska, finansijska), 3–5 pokretanja sa temperaturom 0.7+ pa upoređivanje. Konzistentno = verovatno tačno. Različito = sumnja.

### 6. Iterativna refinement

Koristi izlaz Claude-a kao ulaz sledećeg upita, sa zahtevom za verifikaciju ili proširenje. Drugi prolaz hvata greške iz prvog.

Primer flow-a:
1. Prvi upit: „Daj mi odgovor."
2. Drugi upit: „Evo tvog odgovora. Pronađi 3 mesta gde si možda preveć siguran. Označi svako."
3. Treći upit: „Sada za svako označeno mesto, daj mi pouzdaniji format („proverljivo da", „proverljivo ne", „neizvesno"). "

### 7. Ograničenje eksterne baze znanja

Eksplicitno reci Claude-u da koristi **samo prosleđene dokumente**, ne svoje opšte znanje.

**Primer rečenice koja se dodaje:**

> Odgovaraj isključivo na osnovu sadržaja u dostavljenim dokumentima. Ako tražena informacija nije u njima, reci „Nije u dokumentima."

---

## Proširenja specifična za naš kontekst

### 8. Nikad izmišljati URL-ove

URL-ovi su najopasniji format — izgledaju kao činjenica, lako se generišu naizgled tačno (`docs.python.org/3.12/library/foo.html`), a često ne postoje. Pravilo:

- Ako se URL ne pojavljuje u kontekstu razgovora ili u lokalnim fajlovima, **NE generisati ga**.
- Umesto toga reći: „URL nemam pri ruci — proveri na zvaničnoj dokumentaciji."

### 9. Koristiti context7 MCP za sveže docs biblioteka

Anthropic-ov knowledge cutoff je januar 2026. Sve što je novije zahteva sveže izvore.

- Kad korisnik pita o biblioteci/framework-u/SDK-u: **prvo** `mcp__9ae5499a__resolve-library-id`, pa `mcp__9ae5499a__query-docs`.
- Ne pretpostavljati da znanje iz trening podataka odražava trenutne API-je.
- Važi i za poznate biblioteke (React, Next.js, Prisma, Tailwind) — API se menja.

### 10. Brojevi verzija i datumi — uvek označiti kao „proveriti"

Brojevi verzija (`v4.7.2`, `1.18.5`) i datumi su drugi po opasnosti za halucinaciju. Pravilo:

- Nikad ne tvrditi verziju iz pamćenja kao činjenicu.
- Ako se mora navesti verzija, dodati: „proveri u package.json / pip list / CHANGELOG".

### 11. Citati osoba i istorijske činjenice — visok rizik

Imena, datumi rođenja, citati pripisani osobama, brojke iz istraživanja — **ekstremno** podložno izmišljanju. Pravilo:

- Bez izvora — bez citata.
- Bolje reći „čini mi se da je X, ali proveri" nego tvrditi.

### 12. Kalibracija pouzdanosti

Kad je nešto sigurno → reci sigurno. Kad je verovatno → reci „verovatno". Kad je nagađanje → reci „nagađam".

Ne treba sva pravila kalibrirati istom hedge frazom. „Možda" za sve = uklanjanje informacije. Skala:

| Pouzdanost | Fraza |
|------------|-------|
| Provereno iz konteksta razgovora | bez hedge-a, samo tvrdnja |
| Iz mog treninga, stabilna materija | „koliko ja znam, X" |
| Iz mog treninga, sveža materija | „verovatno X, proveri u dokumentaciji" |
| Nagađanje | „pretpostavljam X — nije provereno" |
| Nemam pojma | „ne znam" |

---

## Šta NE radi (zablude)

- **„Budi tačan"** — ništa ne menja. Model već pokušava.
- **„Ne haluciniraj"** — ne razume šta to znači u kontekstu izlaza.
- **„Daj mi 100% tačan odgovor"** — pojačava sigurnost u format, ne u sadržaj.
- **Niska temperatura sama** — smanjuje varijaciju, ne smanjuje izmišljanje na obučenim obrascima.

---

## Tradeoff koji treba znati

Striktni citation režim **smanjuje kreativnu produktivnost**. Anthropic eksplicitno preporučuje: koristi striktan režim za „research mode" zadatke, ne za sve.

Za naš kontekst: kod, dokumentacija, tehnička pitanja → striktan režim.
Za kreativno pisanje, brainstorm, alternative → opušten režim sa eksplicitnim „ovo je generisano, nije provereno".

---

## Provera: kako znati da je radilo

Ako primenimo ova pravila, očekivani signali:

- Više rečenica „Ne znam" / „Nije u dokumentima" / „Proveri u..."
- Manje neproverljivih tvrdnji
- Više linkova/citata u odgovorima
- Korisnik manje često mora da kaže „to nije tačno"

Ako Claude i dalje haluciniše uprkos pravilima, pravila su ili nejasna, ili u konfliktu, ili ne pristižu do modela (jer su predugačka, ili u pogrešnom CLAUDE.md nivou).
