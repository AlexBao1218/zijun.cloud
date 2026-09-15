// tests/content.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("content");
const LOCALES = ["en", "zh"];
const COLOURS = ["towngas", "cathay", "neochain", "igc"];
const DEMO_MODES = ["embed", "recording", "static"];
const SKETCHES = ["insurance-link", "fleet-three", "minutes-two-pass", "cargo-lock-solve", "igc-alarm-agent"];

const read = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
const isStr = (v) => typeof v === "string" && v.length > 0;
const strArray = (v) => Array.isArray(v) && v.every(isStr);

const projectSlugs = () =>
  fs.readdirSync(path.join(ROOT, "projects"), { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("_"))
    .map((e) => e.name);

for (const locale of LOCALES) {
  test(`home/${locale}`, () => {
    const h = read(`home/${locale}.json`);
    for (const k of ["availability", "quoteBefore", "quoteEmphasis", "quoteAfter", "attribution", "punchLead", "punchEmphasis", "byline"]) assert.ok(isStr(h[k]), k);
    if (h.image) {
      assert.ok(isStr(h.image.src) && isStr(h.image.alt), "image needs src and alt");
      assert.ok(fs.existsSync(path.join("public", h.image.src)), `${h.image.src} exists`);
    }
  });

  test(`work/${locale}`, () => {
    const w = read(`work/${locale}.json`);
    assert.ok(isStr(w.title) && isStr(w.subtitle));
    assert.ok(Array.isArray(w.cards) && w.cards.length === 6, "six cards");
    assert.ok(Array.isArray(w.groups) && w.groups.length >= 1, "groups");
    const grouped = w.groups.flatMap((g) => g.slugs);
    assert.deepEqual([...grouped].sort(), w.cards.map((c) => c.slug).sort(), "every card in exactly one group");
    for (const g of w.groups) assert.ok(isStr(g.name) && isStr(g.note), `group ${g.name}`);
    if (w.singles) assert.ok(["row", "carousel"].includes(w.singles), "singles layout");
    if (w.singles === "carousel") assert.ok(isStr(w.showcaseLabel), "showcaseLabel");
    for (const c of w.cards) {
      for (const k of ["slug", "title", "org", "duration", "role"]) assert.ok(isStr(c[k]), `${c.slug}.${k}`);
      assert.ok(COLOURS.includes(c.colour), `${c.slug}.colour`);
      if (c.brief) assert.ok(isStr(c.brief) && c.brief.length <= 220, `${c.slug}.brief short`);
      assert.ok(fs.existsSync(path.join(ROOT, "projects", c.slug, `${locale}.json`)), `${c.slug} has project json`);
      if (c.cover) assert.ok(fs.existsSync(path.join("public", c.cover)), `${c.slug} cover exists`);
    }
  });

  test(`skills/${locale}`, () => {
    const s = read(`skills/${locale}.json`);
    assert.ok(isStr(s.title) && isStr(s.subtitle) && isStr(s.languagesLabel) && isStr(s.languages));
    assert.ok(Array.isArray(s.groups) && s.groups.length >= 2, "groups");
    if (s.ledger) {
      assert.ok(isStr(s.ledger.name) && isStr(s.ledger.subtitle) && strArray(s.ledger.footer), "ledger");
      assert.ok(Array.isArray(s.ledger.rows) && s.ledger.rows.every((r) => isStr(r.course) && isStr(r.grade)), "ledger rows");
    }
    for (const g of s.groups) {
      assert.ok(isStr(g.name) && strArray(g.items) && g.items.length > 0, g.name);
      if (g.note) assert.ok(isStr(g.note), `${g.name} note`);
    }
  });

  test(`about/${locale}`, () => {
    const a = read(`about/${locale}.json`);
    assert.ok(isStr(a.title) && isStr(a.subtitle) && isStr(a.photosIntro));
    assert.ok(strArray(a.paragraphs) && a.paragraphs.length >= 1);
    assert.ok(Array.isArray(a.strips) && a.strips.length >= 1, "strips");
    for (const st of a.strips) {
      assert.ok(isStr(st.name) && Array.isArray(st.photos) && st.photos.length >= 3, `strip ${st.name}`);
      for (const p of st.photos) {
        assert.equal(typeof p.src, "string");
        assert.ok(isStr(p.alt), "alt");
        if (p.src) assert.ok(fs.existsSync(path.join("public", p.src)), `${p.src} exists`);
      }
    }
  });

  test(`contact/${locale}`, () => {
    const c = read(`contact/${locale}.json`);
    for (const k of ["mailLabel", "email", "githubLabel", "githubUrl", "cvLabel", "cvUrl", "footer"]) assert.ok(isStr(c[k]), k);
    assert.ok(fs.existsSync(path.join("public", c.cvUrl)), "cv exists");
  });

  for (const slug of projectSlugs()) {
    test(`projects/${slug}/${locale}`, () => {
      const p = read(`projects/${slug}/${locale}.json`);
      for (const k of ["title", "org", "duration", "role", "summary"]) assert.ok(isStr(p[k]), k);
      assert.ok(COLOURS.includes(p.colour), "colour");
      assert.ok(DEMO_MODES.includes(p.demo?.mode), "demo.mode");
      if (p.demo.mode === "embed") assert.ok(isStr(p.demo.url), "embed needs url");
      for (const k of ["height", "width"]) if (p.demo[k] !== undefined) assert.ok(Number.isInteger(p.demo[k]) && p.demo[k] > 0, `demo.${k} positive integer`);
      if (p.demo.poster) assert.ok(fs.existsSync(path.join("public", p.demo.poster)), "poster exists");
      assert.ok(Array.isArray(p.links), "links");
      for (const l of p.links) assert.ok(isStr(l.label) && isStr(l.url), "link");
      assert.ok(Array.isArray(p.facts) && p.facts.length >= 2 && p.facts.length % 2 === 0, "facts: even count so the 2-col grid has no orphan cell");
      for (const f of p.facts) assert.ok(isStr(f.label) && isStr(f.value), "fact");
      if (p.guide) {
        assert.ok(isStr(p.guide.heading) && Array.isArray(p.guide.steps) && p.guide.steps.length >= 3, "guide");
        for (const st of p.guide.steps) {
          assert.ok(isStr(st.label) && st.label.length <= 28, `guide label short: ${st.label}`);
          if (st.hint) assert.ok(isStr(st.hint) && st.hint.length <= 60, `guide hint short: ${st.hint}`);
        }
      }
      assert.ok(Array.isArray(p.sections) && p.sections.length >= 2, "sections");
      for (const s of p.sections) {
        assert.ok(isStr(s.heading) && strArray(s.paragraphs), s.heading);
        if (s.bullets) assert.ok(strArray(s.bullets));
        if (s.quote) assert.ok(isStr(s.quote));
        if (s.sketch) assert.ok(SKETCHES.includes(s.sketch), `sketch ${s.sketch}`);
        if (s.image) assert.ok(isStr(s.image.src) && isStr(s.image.alt) && fs.existsSync(path.join("public", s.image.src)), `image ${s.image?.src}`);
      }
      assert.ok(strArray(p.tags) && p.tags.length > 0, "tags");
    });
  }
}
