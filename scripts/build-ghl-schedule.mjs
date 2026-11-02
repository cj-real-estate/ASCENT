// Builds ghl-export/schedule/ (the post-form calendar page) from the home
// export's styles, header and footer. Run after build-ghl-export.mjs.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const root = new URL("../ghl-export", import.meta.url).pathname;
const home = readFileSync(`${root}/home/body.html`, "utf8");
const style = home.match(/<style>[\s\S]*?<\/style>/)[0];
const wrapOpen = home.match(/<div class="[^"]*" data-ascent-root>/)[0];
const header = home.match(/<header[\s\S]*?<\/header>/)[0];
const footer = home.match(/<footer[\s\S]*?<\/footer>/g).pop();
const CAL = "https://links.ascentforsponsors.com/widget/booking/2qqDWLxVgjzCoxlnlRPb";
const body = `${style}
${wrapOpen}
<div data-dark="true" data-theme="dark" class="min-h-dvh bg-night text-paper">
${header}
<main>
<section class="py-16 md:py-24">
<div class="section-shell">
<p class="eyebrow text-orange">BOOK A DEMO</p>
<div class="mt-4 flex flex-wrap items-end justify-between gap-4">
<div>
<h1 class="display max-w-[22ch] text-[30px] text-paper md:text-[46px]">Pick a time for your demo</h1>
<p class="mt-5 max-w-[68ch] text-[17px] leading-relaxed text-ash md:text-[18px]">Thirty minutes. Free. No strings. Bring your lawyer if you like.</p>
</div>
<button type="button" id="demo-not-now" class="inline-flex min-h-[44px] items-center rounded-full border border-white/20 px-6 text-[15px] font-medium text-on-dark hover:border-white/45 hover:text-paper">Not now</button>
</div>
<div id="demo-later" hidden class="mt-8 rounded-xl border border-white/15 bg-graphite p-6 md:p-8">
<h2 class="display text-[26px] text-paper md:text-[34px]">Thanks. We'll be in touch.</h2>
<p class="mt-5 max-w-[68ch] text-[17px] leading-relaxed text-ash md:text-[18px]">You'll hear from us within one business day to set a time.</p>
</div>
<iframe id="2qqDWLxVgjzCoxlnlRPb" src="${CAL}" title="Scheduling calendar" scrolling="no" class="mt-8 w-full rounded-md bg-paper" style="width:100%;min-height:700px;border:none;overflow:hidden"></iframe>
</div>
</section>
</main>
${footer}
</div>
</div>
<script src="https://links.ascentforsponsors.com/js/form_embed.js" type="text/javascript"></script>
<script>
document.getElementById("demo-not-now").addEventListener("click", function () {
  document.getElementById("2qqDWLxVgjzCoxlnlRPb").hidden = true;
  document.getElementById("demo-later").hidden = false;
  this.hidden = true;
});
</script>
`;
mkdirSync(`${root}/schedule`, { recursive: true });
writeFileSync(`${root}/schedule/body.html`, body);
writeFileSync(`${root}/schedule/head.html`, `<title>Book a demo | Ascent</title>\n<meta name="robots" content="noindex">\n`);
console.log("schedule", (Buffer.byteLength(body) / 1024).toFixed(0), "KB");
