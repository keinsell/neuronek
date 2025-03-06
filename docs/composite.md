# Composite

Composite is a collection of various dosages of substances typically ingested through same route of administration,
think about it as pills that you might have which contain few supplement. This entity would represent a container with
multiple things inside, could be actually useful to avoid necessary scripting for making a set of ingestions.

- `Composite`
    - id
    - name
    - description
    - route_of_administration
    - form
    - items (`CompositeItems`)
        - id
        - substance_name
        - substance_dosage

```yaml
# $HOME/.config/neuronek/formulas/*.yaml
id: swissherbal-neuro-adek
name: "adek"
formula:
  - substance_name: calcium
    dosage: 180mg
  - substance_name: iron
    dosage: 20mg
  - substance_name: vitamin a
    dosage: 18000 UI
  - substance_name: vitamin d3
    dosage: 4000 UI
  - substance_name: vitamin e
    dosage: 150mcg
```