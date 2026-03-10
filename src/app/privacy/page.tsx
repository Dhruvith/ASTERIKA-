import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Privacy Policy — AsterikaFX Journal",
  description:
    "Privacy Policy explaining how Asterika LTD collects, uses, discloses, and safeguards your information on the AsterikaFX Journal platform.",
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-2 text-lg">AsterikaFX Journal</p>
        <p className="text-muted-foreground mb-12 text-sm border-b border-border pb-8">
          Effective Date: 11 March 2026
        </p>

        <p className="text-muted-foreground leading-relaxed mb-4">
          Asterika LTD (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;)
          operates the website www.asterikafxjournal.com and the AsterikaFX Journal platform
          (&quot;Service&quot;).
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          This Privacy Policy explains how we collect, use, disclose, and safeguard your
          information when you use our website and services.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-12">
          By accessing or using AsterikaFX Journal, you agree to the collection and use of
          information in accordance with this Privacy Policy.
        </p>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>

          <h3 className="text-lg font-semibold text-foreground mb-3">Personal Information</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We may collect personal information that you voluntarily provide when you:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
            <li>Create an account</li>
            <li>Subscribe to updates</li>
            <li>Contact us</li>
            <li>Use the journaling platform</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-4">This may include:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-6">
            <li>Name</li>
            <li>Email address</li>
            <li>Account login credentials</li>
            <li>Communication information</li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground mb-3">Trading Data</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            When using AsterikaFX Journal, users may input trading-related information including:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
            <li>Trade entries</li>
            <li>Trade history</li>
            <li>Trading notes and journal entries</li>
            <li>Performance statistics</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-6">
            This information is used to generate analytics and performance insights within the
            platform.
          </p>

          <h3 className="text-lg font-semibold text-foreground mb-3">
            Automatically Collected Data
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            When you access the website we may collect:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
            <li>IP address</li>
            <li>Browser type</li>
            <li>Device information</li>
            <li>Website usage data</li>
            <li>Cookies and analytics information</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            2. How We Use Information
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We use collected information to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
            <li>Provide and maintain the platform</li>
            <li>Improve the functionality of the service</li>
            <li>Generate trading analytics and insights</li>
            <li>Respond to support requests</li>
            <li>Monitor usage and prevent fraud</li>
            <li>Communicate service updates</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">3. Cookies</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The website may use cookies and similar technologies to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
            <li>Remember user preferences</li>
            <li>Analyze website traffic</li>
            <li>Improve user experience</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Users may disable cookies through browser settings.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">4. Sharing of Information</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Asterika LTD does not sell personal information.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Information may be shared with:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
            <li>hosting providers</li>
            <li>analytics providers</li>
            <li>technical service partners</li>
            <li>legal authorities when required by law</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">5. Data Security</h2>
          <p className="text-muted-foreground leading-relaxed mb-2">
            We implement appropriate security measures to protect user data.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            However, no online system is completely secure and we cannot guarantee absolute
            protection of information.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">6. Data Retention</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We retain user information only as long as necessary to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
            <li>provide services</li>
            <li>maintain platform functionality</li>
            <li>comply with legal obligations</li>
            <li>resolve disputes</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Users may request deletion of their accounts.
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">7. GDPR Rights</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            If you are located within the European Economic Area, you have the right to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
            <li>access your personal data</li>
            <li>correct inaccurate information</li>
            <li>request deletion</li>
            <li>restrict processing</li>
            <li>request data portability</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Requests may be submitted via email.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">8. Third-Party Services</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Our platform may integrate third-party services including:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
            <li>analytics tools</li>
            <li>cloud hosting</li>
            <li>authentication providers</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            These services may collect data according to their own privacy policies.
          </p>
        </section>

        {/* Section 9 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            9. Children&apos;s Privacy
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-2">
            AsterikaFX Journal is not intended for individuals under the age of 18.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We do not knowingly collect personal information from minors.
          </p>
        </section>

        {/* Section 10 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            10. Changes to this Privacy Policy
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-2">
            This Privacy Policy may be updated periodically.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Updates will be posted on this page with the revised effective date.
          </p>
        </section>

        {/* Section 11 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">11. Contact Information</h2>
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
