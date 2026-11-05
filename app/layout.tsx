import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AURELIA MOBILE | Flagship Titanium Devices & Crafted Accessories",
  description:
    "Minimalist luxury editorial showcase. Engineered from aerospace-grade titanium with precision triple-lens optics, sculpted aluminum MagSafe charging, and full-grain saddle leather protection.",
};

/**
 * Strips browser-extension injected attributes (such as `bis_skin_checked`,
 * `bis_register`, and `__processed_*`) prior to React hydration so extensions
 * never trigger a hydration mismatch warning in development.
 */
const CLEAN_EXTENSION_ATTRS_SCRIPT = `
(function() {
  try {
    var cleanNode = function(node) {
      if (!node || node.nodeType !== 1) return;
      var attrs = node.attributes;
      if (attrs) {
        for (var i = attrs.length - 1; i >= 0; i--) {
          var name = attrs[i].name;
          if (
            name === "bis_skin_checked" ||
            name === "bis_register" ||
            name.indexOf("bis_") === 0 ||
            name.indexOf("__processed_") === 0
          ) {
            node.removeAttribute(name);
          }
        }
      }
    };
    var cleanAll = function() {
      var all = document.querySelectorAll("[bis_skin_checked],[bis_register]");
      for (var i = 0; i < all.length; i++) cleanNode(all[i]);
      cleanNode(document.documentElement);
      cleanNode(document.body);
    };
    cleanAll();
    var observer = new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.type === "attributes" && m.target) {
          cleanNode(m.target);
        } else if (m.type === "childList" && m.addedNodes) {
          for (var j = 0; j < m.addedNodes.length; j++) {
            cleanNode(m.addedNodes[j]);
          }
        }
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["bis_skin_checked", "bis_register"]
    });
    setTimeout(function() { observer.disconnect(); }, 4000);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="bg-[#E6DAC8] text-[#1C1917] antialiased"
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: CLEAN_EXTENSION_ATTRS_SCRIPT }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="font-sans bg-[#E6DAC8] text-[#1C1917] selection:bg-[#141413] selection:text-white"
      >
        {children}
      </body>
    </html>
  );
}
