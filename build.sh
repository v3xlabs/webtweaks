#!/usr/bin/env bash
set -e

# Create dist directory
mkdir -p dist/unpacked/{chrome,firefox}

# Function to copy common files
copy_common_files() {
    local target_dir="$1"
    cp -r src/icons "$target_dir/"
    cp -r src/popup "$target_dir/"
    cp -r src/scripts "$target_dir/"
    cp src/background.js "$target_dir/"
}

# Build Chrome version
build_chrome() {
    echo "Building Chrome extension..."
    local target_dir="dist/unpacked/chrome"
    rm -rf "$target_dir"
    mkdir -p "$target_dir"

    copy_common_files "$target_dir"
    cp manifest.json "$target_dir/"

    # Create ZIP for Chrome
    (cd "$target_dir" && zip -r ../../webtweaks-chrome.zip .)
}

# Build Firefox version
build_firefox() {
    echo "Building Firefox extension..."
    local target_dir="dist/unpacked/firefox"
    rm -rf "$target_dir"
    mkdir -p "$target_dir"

    copy_common_files "$target_dir"

    # Create Firefox-specific manifest
    jq '.manifest_version = 2 | 
        .background = {"scripts": ["background.js"]} | 
        .browser_specific_settings = {"gecko": {"id": "webtweaks@v3x.company"}}' \
        manifest.json >"$target_dir/manifest.json"

    # Build XPI using web-ext
    npx web-ext build --source-dir "$target_dir" --artifacts-dir "./dist" --filename webtweaks-firefox.xpi --overwrite-dest
}

# Main build process
case "${1:-all}" in
"chrome")
    build_chrome
    ;;
"firefox")
    build_firefox
    ;;
"all")
    build_chrome
    build_firefox
    ;;
*)
    echo "Invalid build target. Use: chrome, firefox, or all"
    exit 1
    ;;
esac
