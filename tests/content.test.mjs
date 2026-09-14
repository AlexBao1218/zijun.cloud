// tests/content.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("content");
const LOCALES = ["en", "zh"];
const COLOURS = ["towngas", "cathay", "neochain", "igc"];
const DEMO_MODES = ["embed", "recording", "static"];

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
    for (const k of ["availability", "lead", "closing"]) assert.ok(isStr(h[k]), k);
    assert.ok(strArray(h.identities) && h.identities.length >= 2, "identities");
  });

  test(`work/${locale}`, () => {
    const w = read(`work/${locale}.json`);
    assert.ok(isStr(w.title) && isStr(w.subtitle));
    assert.ok(Array.isArray(w.cards) && w.cards.length === 6, "six cards");
    for (const c of w.cards) {
      for (const k of ["slug", "title", "org", "duration", "role", "kind"]) assert.ok(isStr(c[k]), `${c.slug}.${k}`);
      assert.ok(COLOURS.includes(c.colour), `${c.slug}.colour`);
      assert.ok(fs.existsSync(path.join(ROOT, "projects", c.slug, `${locale}.json`)), `${c.slug} has project json`);
      if (c.cover) assert.ok(fs.existsSync(path.join("public", c.cover)), `${c.slug} cover exists`);
    }
  });

  test(`skills/${locale}`, () => {
    const s = read(`skills/${locale}.json`);
    assert.ok(isStr(s.title) && isStr(s.subtitle) && isStr(s.languagesLabel) && isStr(s.languages));
    assert.ok(Array.isArray(s.groups) && s.groups.length === 3, "three groups");
    for (const g of s.groups) assert.ok(isStr(g.name) && strArray(g.items) && g.items.length > 0, g.name);
  });

  test(`about/${locale}`, () => {
    const a = read(`about/${locale}.json`);
    assert.ok(isStr(a.title) && isStr(a.subtitle) && isStr(a.photosIntro));
    assert.ok(strArray(a.paragraphs) && a.paragraphs.length >= 1);
    assert.ok(Array.isArray(a.photos) && a.photos.length >= 4, "photos");
    for (const p of a.photos) {
      assert.equal(typeof p.src, "string");
      assert.ok(isStr(p.alt), "alt");
      if (p.src) assert.ok(fs.existsSync(path.join("public", p.src)), `${p.src} exists`);
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
      if (p.demo.poster) assert.ok(fs.existsSync(path.join("public", p.demo.poster)), "poster exists");
      assert.ok(Array.isArray(p.links), "links");
      for (const l of p.links) assert.ok(isStr(l.label) && isStr(l.url), "link");
      assert.ok(Array.isArray(p.facts) && p.facts.length >= 2 && p.facts.length % 2 === 0, "facts: even count so the 2-col grid has no orphan cell");
      for (const f of p.facts) assert.ok(isStr(f.label) && isStr(f.value), "fact");
      if (p.guide) assert.ok(isStr(p.guide.heading) && strArray(p.guide.steps) && p.guide.steps.length >= 3, "guide");
      assert.ok(Array.isArray(p.sections) && p.sections.length >= 2, "sections");
      for (const s of p.sections) {
        assert.ok(isStr(s.heading) && strArray(s.paragraphs), s.heading);
        if (s.bullets) assert.ok(strArray(s.bullets));
        if (s.quote) assert.ok(isStr(s.quote));
      }
      assert.ok(strArray(p.tags) && p.tags.length > 0, "tags");
    });
  }
}
