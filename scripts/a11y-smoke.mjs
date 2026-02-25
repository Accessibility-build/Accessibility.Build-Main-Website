import puppeteer from "puppeteer";
import { AxePuppeteer } from "@axe-core/puppeteer";

const baseUrl = process.env.A11Y_BASE_URL || "http://localhost:3000";
const routes = ["/", "/tools", "/services", "/pricing", "/contact"];
const blockedImpacts = new Set(["critical", "serious"]);

const formatViolation = (violation) => ({
  id: violation.id,
  impact: violation.impact || "unknown",
  help: violation.help,
  description: violation.description,
  nodes: violation.nodes.length,
});

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1024 });

  const report = [];
  let blockedCount = 0;

  try {
    for (const route of routes) {
      const url = `${baseUrl}${route}`;
      await page.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const results = await new AxePuppeteer(page).analyze();
      const violations = results.violations.map(formatViolation);
      const blockedViolations = violations.filter((violation) =>
        blockedImpacts.has(violation.impact),
      );

      blockedCount += blockedViolations.length;
      report.push({
        route,
        totalViolations: violations.length,
        blockedViolations,
      });
    }
  } finally {
    await browser.close();
  }

  console.log(JSON.stringify({ baseUrl, routesChecked: routes.length, report }, null, 2));

  if (blockedCount > 0) {
    process.exitCode = 1;
    throw new Error(
      `Accessibility smoke check failed with ${blockedCount} critical/serious violation(s).`,
    );
  }

  console.log("Accessibility smoke check passed with zero critical/serious violations.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
