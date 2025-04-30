default:
    @just --list

reqs:
    cargo install cargo-binstall
    cargo binstall -y cargo-machete cargo-sort cargo-nextest cargo-zigbuild cargo-expand cargo-mommy bacon cargo-deny just cargo-tarpaulin xargo cargo-outdated cargo-smart-release cargo-prebuilt cargo-cache present bacon-ls # rustowl 

lint:
    cargo clippy --summary
    cargo fmt --check
    cargo deny check
    cargo outdated

check:
    cargo check

format:
    cargo fmt
    just --fmt --unstable

fix:
    @just format
    cargo fix
    cargo-machete --fix

build:
    cargo build

test:
    cargo nextest r

run +args='--help':
    cargo run -- {{ args }}

watch:
    bacon

#- major:   Increase the major version (x.0.0)
#- minor:   Increase the minor version (x.y.0)
#- patch:   Increase the patch version (x.y.z)
#- release: Remove the pre-version (x.y.z)
#- rc:      Increase the rc pre-version (x.y.z-rc.M)
#- beta:    Increase the beta pre-version (x.y.z-beta.M)

# - alpha:   Increase the alpha pre-version (x.y.z-alpha.M)
release:
    cargo release alpha --execute --no-publish --no-push
    #    cargo smart-release --execute --update-crates-index -h
