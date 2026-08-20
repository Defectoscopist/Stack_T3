import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — SHOP (Demo)",
  description: "Contact information for the SHOP demo project.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact</h1>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-4 text-gray-700 leading-relaxed">
          <p>
            This is a demonstration (portfolio) project. If you have a question about the code,
            found a bug, or want to request deletion of your data, feel free to reach out.
          </p>
          <p>
            Email:{" "}
            <a href="mailto:hello@example.com" className="text-gray-900 underline underline-offset-2">
              hello@example.com
            </a>{" "}
            (replace with a real address)
          </p>
          <p className="text-sm text-gray-500">
            Note: please do not enter any real personal or payment details in this demo.
          </p>
        </div>
      </div>
    </div>
  );
}
