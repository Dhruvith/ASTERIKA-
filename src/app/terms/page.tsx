import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Terms and Conditions — AsterikaFX Journal",
  description:
    "Terms and Conditions governing the use of the AsterikaFX Journal trading platform operated by Asterika LTD.",
};

export default function TermsPage() {
  return (
    <div className="dark min-h-screen bg-background font-sans text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/asterika_logo.png"
              alt="AsterikaFX Logo"
              width={180}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
          Terms and Conditions
        </h1>
        <p className="text-muted-foreground mb-2 text-lg">AsterikaFX Journal</p>
        <p className="text-muted-foreground mb-12 text-sm border-b border-border pb-8">
          Effective Date: 11 March 2026
        </p>

        <p className="text-muted-foreground leading-relaxed mb-8">
          These Terms and Conditions govern the use of www.asterikafxjournal.com and
          the AsterikaFX Journal platform operated by Asterika LTD.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-12">
          By accessing or using the website or platform, you agree to these Terms.
        </p>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">1. Company Information</h2>
          <div className="bg-card/50 border border-border rounded-xl p-6 text-muted-foreground leading-relaxed">
            <p className="font-semibold text-foreground mb-2">Asterika LTD</p>
            <p>12 Archiepiskopou Makariou III Avenue</p>
            <p>Office 401</p>
            <p>Limassol 3030</p>
            <p>Cyprus</p>
            <p className="mt-3">
              Email:{" "}
              <a href="mailto:asterikafxjournal@gmail.com" className="text-primary hover:underline">
                asterikafxjournal@gmail.com
              </a>
            </p>
            <p>
              Website:{" "}
              <a href="https://www.asterikafxjournal.com" className="text-primary hover:underline">
                www.asterikafxjournal.com
              </a>
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">2. Service Description</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            AsterikaFX Journal provides a digital platform allowing traders to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
            <li>record trading activity</li>
            <li>maintain trading journals</li>
            <li>analyze performance</li>
            <li>review trading insights</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            The platform is designed as a trading data journaling and analytics tool.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">3. No Financial Advice</h2>
          <p className="text-muted-foreground leading-relaxed mb-2">
            AsterikaFX Journal does not provide financial, investment, or trading advice.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-2">
            All information provided through the platform is for informational purposes only.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Users are solely responsible for their trading decisions.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">4. User Accounts</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            To access certain features, users may create an account. Users agree to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
            <li>provide accurate information</li>
            <li>maintain account confidentiality</li>
            <li>notify us of unauthorized access</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Asterika LTD reserves the right to suspend accounts that violate these terms.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">5. Acceptable Use</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">Users may not:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
            <li>attempt unauthorized access to the platform</li>
            <li>interfere with system security</li>
            <li>use the platform for illegal activities</li>
            <li>copy or distribute platform software</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">6. Intellectual Property</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            All website content including:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
            <li>software</li>
            <li>branding</li>
            <li>design</li>
            <li>logos</li>
            <li>platform features</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            are the intellectual property of Asterika LTD. Unauthorized use is prohibited.
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">7. Service Availability</h2>
          <p className="text-muted-foreground leading-relaxed mb-2">
            We strive to maintain reliable platform availability but do not guarantee
            uninterrupted service.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Features may be updated, modified, or discontinued at any time.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">8. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Asterika LTD shall not be liable for:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
            <li>trading losses</li>
            <li>indirect damages</li>
            <li>data loss</li>
            <li>platform interruptions</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Trading involves financial risk and users accept full responsibility for their
            decisions.
          </p>
        </section>

        {/* Section 9 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">9. Termination</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Accounts may be suspended or terminated if:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
            <li>terms are violated</li>
            <li>the platform is misused</li>
            <li>required by law</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Users may delete their accounts at any time.
          </p>
        </section>

        {/* Section 10 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">10. Governing Law</h2>
          <p className="text-muted-foreground leading-relaxed mb-2">
            These Terms shall be governed by the laws of Cyprus.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Any disputes shall be subject to the jurisdiction of the courts of Cyprus.
          </p>
        </section>

        {/* Section 11 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">11. Changes to Terms</h2>
          <p className="text-muted-foreground leading-relaxed mb-2">
            We may update these Terms periodically.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Continued use of the platform constitutes acceptance of the updated Terms.
          </p>
        </section>

        {/* Section 12 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">12. Contact</h2>
          <div className="bg-card/50 border border-border rounded-xl p-6 text-muted-foreground leading-relaxed">
            <p className="font-semibold text-foreground mb-2">Asterika LTD</p>
            <p>12 Archiepiskopou Makariou III Avenue</p>
            <p>Office 401</p>
            <p>Limassol 3030</p>
            <p>Cyprus</p>
            <p className="mt-3">
              Email:{" "}
              <a href="mailto:asterikafxjournal@gmail.com" className="text-primary hover:underline">
                asterikafxjournal@gmail.com
              </a>
            </p>
            <p>
              Website:{" "}
              <a href="https://www.asterikafxjournal.com" className="text-primary hover:underline">
                www.asterikafxjournal.com
              </a>
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-card/30 border-t border-border">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/asterika_logo.png"
              alt="AsterikaFX"
              width={140}
              height={36}
              className="h-9 w-auto"
            />
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 AsterikaFX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
