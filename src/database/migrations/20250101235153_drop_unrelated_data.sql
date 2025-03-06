alter table substance
    drop
        brand_names;
drop table substance_interactions;
drop table effect;
drop table psychoactive_class;
drop table chemical_class;
drop table substance_synonym;
drop table substance_tolerance;
drop index substance_inchi_key_key;
drop index substance_cas_number_key;
drop index substance_smiles_key;
drop index substance_systematic_name_key;
drop index substance_substitutive_name_key;
alter table substance
    drop
        systematic_name;
alter table substance
    drop
        substitutive_name;
alter table substance
    drop
        inchi_key;
alter table substance
    drop
        unii;
alter table substance
    drop
        cas_number;
alter table substance
    drop
        smiles;