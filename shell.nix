{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_20
    nodePackages.pnpm
    zip
    jq
    web-ext
    chromium
  ];

  shellHook = ''
    # Function to load unpacked extension in Chromium
    function load-extension() {
      chromium --load-extension=./dist/unpacked/chrome
    }

    echo "WebTweaks development environment"
    echo "Available commands:"
    echo "  pnpm run build      - Build both Chrome and Firefox extensions"
    echo "  pnpm run build:chrome - Build Chrome extension only"
    echo "  pnpm run build:firefox - Build Firefox extension only"
    echo "  pnpm run clean     - Clean build artifacts"
    echo "  load-extension     - Load unpacked extension from ./dist/unpacked/chrome in Chromium"
  '';
} 
