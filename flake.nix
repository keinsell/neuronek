{
  description = "🧬 Terminal utility to track intake of caffeine (or other stimulants), vitamins, supplements, nootropics and chemical compounds in general.";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    rust-overlay.url = "github:oxalica/rust-overlay";
    flake-utils.url = "github:numtide/flake-utils";
    crane = {
      url = "github:ipetkov/crane";
    };
    treefmt-nix.url = "github:numtide/treefmt-nix";
  };

  outputs = {
    self,
    nixpkgs,
    rust-overlay,
    flake-utils,
    crane,
    treefmt-nix,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        overlays = [(import rust-overlay)];
        pkgs = import nixpkgs {
          inherit system overlays;
        };

        rustToolchain = pkgs.rust-bin.nightly.latest.default.override {
          extensions = [
            "rust-src"
            "llvm-tools-preview"
            "miri"
          ];
        };

        craneLib = (crane.mkLib pkgs).overrideToolchain rustToolchain;

        buildInputs = with pkgs;
          [
            openssl
            pkg-config
          ]
          ++ lib.optionals stdenv.isDarwin [
            darwin.apple_sdk.frameworks.Security
          ];

        commonArgs = {
          src = craneLib.cleanCargoSource (craneLib.path ./.);
          buildInputs = buildInputs;
          nativeBuildInputs = with pkgs; [pkg-config];
        };

        cargoArtifacts = craneLib.buildDepsOnly commonArgs;

        treefmtEval = treefmt-nix.lib.evalModule pkgs {
          projectRootFile = "flake.nix";
          programs.nixfmt-rfc-style.enable = true;
          programs.deadnix.enable = true;
          programs.statix.enable = true;
        };
      in {
        devShells.default = pkgs.mkShell {
          inputsFrom = [];

          packages = with pkgs;
            [
              rustToolchain
              cargo-edit
              cargo-watch
              rust-analyzer
              bacon
              nixd
              nixfmt-rfc-style
              nil
              statix
              deadnix
              nix-index
              nix-info
              treefmt
              alejandra
              nix-tree
              manix
            ]
            ++ buildInputs;

          shellHook = ''
            export RUST_BACKTRACE=1
            export RUST_SRC_PATH="${rustToolchain}/lib/rustlib/src/rust/library"

            echo "Using Rust nightly: $(rustc --version)"
            root=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
            export PATH=$PATH:$root/target/debug:$root/target/release
          '';
        };

        formatter = treefmtEval.config.build.wrapper;

        packages = {
          default = craneLib.buildPackage (commonArgs
            // {
              inherit cargoArtifacts;
              pname = "neuronek";
              version = "0.0.1-alpha.3";

              doCheck = false;

              preBuild = ''
                export CARGO_INCREMENTAL=0
              '';

              postInstall = ''
                ${pkgs.file}/bin/file $out/bin/*
              '';
            });

          check = craneLib.cargoNextest (commonArgs
            // {
              inherit cargoArtifacts;
              cargoNextestExtraArgs = "--workspace";
            });
        };

        checks = {
          clippy = craneLib.cargoClippy (commonArgs
            // {
              inherit cargoArtifacts;
              cargoClippyExtraArgs = "--all-targets";
              # cargoClippyExtraArgs = "--all-targets -- --deny warnings";
            });

          fmt = craneLib.cargoFmt {
            src = ./.;
          };
        };
      }
    );
}
