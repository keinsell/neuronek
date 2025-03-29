{
  description = "🧬 Terminal utility to track intake of caffeine (or other stimulants), vitamins, supplements, nootropics and chemical compounds in general.";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flakelight.url = "github:nix-community/flakelight";
    rust-overlay.url = "github:oxalica/rust-overlay";
    rust-overlay.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = {
    self,
    nixpkgs,
    flakelight,
    rust-overlay,
    ...
  }: let
    projectName = "neuronek";
    projectVersion = "0.0.1-alpha.6";
    rustToolchainVersion = "nightly";
  in
    flakelight ./. {
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      withOverlays = [rust-overlay.overlays.default];

      devShell.packages = pkgs: let
        darwinExtras =
          if pkgs.stdenv.isDarwin
          then [
            pkgs.libiconv
            pkgs.darwin.apple_sdk.frameworks.Cocoa
          ]
          else [];
        linuxExtras =
          if pkgs.stdenv.isLinux
          then [
            #  pkgs.pkg-config
            #  pkgs.llvmPackages.bintools
            #  pkgs.glib
            #  pkgs.gtk3
            #  pkgs.libsoup_3
            #  pkgs.webkitgtk_4_1
            #  pkgs.xdotool
          ]
          else [];
      in
        with pkgs;
          [
            (rust-bin.${rustToolchainVersion}.latest.default.override {
              extensions = ["rust-src"];
              targets = [];
            })

            cargo-edit
            cargo-watch
            bacon

            nixd
            nil
            alejandra
            statix
            deadnix
            nix-index
            nix-tree
            manix
            onefetch
            dioxus-cli
          ]
          ++ linuxExtras
          ++ darwinExtras;

      devShell.env = pkgs: {
        # Removed unnecessary RUSTFLAGS
        # Removed explicit RUST_SRC_PATH as rust-src is included in toolchain
      };

      devShell.shellHook = ''
        echo "Entering development shell for ${projectName}..."
        root=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
        export PATH="$root/target/debug:$root/target/release:$PATH"
        onefetch
      '';

      perSystem = {
        pkgs,
        system,
        ...
      }: {
        packages.default = pkgs.rustPlatform.buildRustPackage {
          pname = projectName;
          version = projectVersion;
          src = ./.;

          cargoLock.lockFile = ./Cargo.lock;

          nativeBuildInputs = with pkgs;
            [
              rustPlatform.cargoSetupHook
              (rust-bin.${rustToolchainVersion}.latest.default)
              pkg-config
            ]
            ++ pkgs.lib.optional pkgs.stdenv.isLinux [mold clang];

          buildInputs = with pkgs; [openssl];
          doCheck = false;
        };

        formatter = pkgs.alejandra;
      };

      formatters = {
        "*.nix" = "alejandra";
      };
    };
}
