import { Facebook, Instagram, Twitter, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white px-8 py-8 font-sans">
      <div className="max-w-300 mx-auto">
        {/* Top section */}
        <div className="flex flex-col gap-8 md:flex-row md:justify-between md:items-start">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <h5 className="text-2xl font-bold">GHARSEWA</h5>
          </div>

          {/* Link Groups */}
          <div className="flex flex-col gap-6 md:flex-row md:gap-12">
            {/* About */}
            <div>
              <h2 className="text-base font-semibold mb-2">About</h2>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="text-gray-500 text-sm hover:underline">
                    Gharsewa
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 text-sm hover:underline">
                    Article
                  </a>
                </li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h2 className="text-base font-semibold mb-2">Follow Us</h2>
              <ul className="space-y-1">
                <li>
                  <a
                    href="https://github.com/"
                    className="text-gray-500 text-sm hover:underline"
                  >
                    Github
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.com/"
                    className="text-gray-500 text-sm hover:underline"
                  >
                    Discord
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h2 className="text-base font-semibold mb-2">Legal</h2>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="text-gray-500 text-sm hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 text-sm hover:underline">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-t border-gray-700" />

        {/* Bottom section */}
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <span className="text-sm text-gray-400">© 2025 Gharsewa</span>

          {/* Social Icons */}
          <div className="flex gap-4">
            <a
              href="https://facebook.com/"
              aria-label="Facebook"
              className="text-gray-500 hover:text-white transition"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://instagram.com/"
              aria-label="Instagram"
              className="text-gray-500 hover:text-white transition"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://twitter.com/"
              aria-label="Twitter"
              className="text-gray-500 hover:text-white transition"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://github.com/"
              aria-label="GitHub"
              className="text-gray-500 hover:text-white transition"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
