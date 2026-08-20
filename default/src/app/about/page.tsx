import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — SHOP (Demo)",
  description: "About the SHOP demo project: nothing is for sale, images from Unsplash.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">About This Project</h1>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-4 text-gray-700 leading-relaxed">
          <p>
            <strong>SHOP is a demonstration (portfolio) project.</strong>{" "}
            It exists to showcase full-stack web development and is{" "}
            <strong>not a real store — nothing is sold or purchased here.</strong>{" "}
            Orders, checkout and any &quot;payment&quot; flows are simulated; no real payments are
            processed and no products are shipped.
          </p>
          <p>
            Product photographs used on this site are free images from{" "}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noreferrer"
              className="text-gray-900 underline underline-offset-2"
            >
              Unsplash
            </a>{" "}
            and are used under the{" "}
            <a
              href="https://unsplash.com/license"
              target="_blank"
              rel="noreferrer"
              className="text-gray-900 underline underline-offset-2"
            >
              Unsplash License
            </a>
            . SHOP is not affiliated with or endorsed by Unsplash. Images belong to their
            respective authors and are shown here solely to illustrate the user interface.
          </p>
          <p>
            The project is built with Next.js, TypeScript, tRPC, Prisma and MySQL, and includes
            unit &amp; E2E tests (Vitest + Playwright) and a CI pipeline.
          </p>
        </div>
      </div>
    </div>
  );
}
