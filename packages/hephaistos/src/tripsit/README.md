# `osiris/tripsit`

[]: # # `osiris/tripsit`

[]: # Integration with `tripsit` to gather all information about substance available in Tripsit.

[]: # ## Installation
[]: # `bash
[]: # yarn add -S @neuronek/osiris-tripsit
[]: # `
[]: # ## Usage
[]: # `js
[]: # import tripsit from '@neuronek/osiris-tripsit';
[]: # `
[]: # The package has only one method available `get` which is used to search for `substance` on Tripsit website.
[]: # `js
[]: # import tripsit from '@neuronek/osiris-tripsit';
[]: # const substance = await tripsit.get('lsd');
[]: # `
[]: # ## Substance entity
[]: # This package returns `Substance` entity which is defined in `osiris` package consisting of following fields:
[]: # | Field | Type | Description |
[]: # |-------|------|-------------|
[]: # | `name` | `string` | Name of the substance |
[]: # | `summary` | `string` | Summary of the substance |
[]: # | `url` | `string` | URL of the substance |
[]: # | `image` | `string` | Image of the substance |
[]: # | `aliases` | `string[]` | List of aliases for the substance |
[]: # | `info` | `string` | Information about the substance |
[]: # | `dangers` | `string[]` | List of dangers for the substance |
[]: # | `symptoms` | `string[]` | List of symptoms for the substance |
[]: # | `dosage` | `string` | Dosage of the substance |
[]: # | `toxicity` | `string` | Toxicity of the substance |
[]: # | `duration` | `string` | Duration of the substance |
[]: # | `tolerance` | `string` | Tolerance of the substance |
[]: # | `other` | `string` | Extra information about the substance |
[]: # | `chemistry` | `string` | Chemistry of the substance |
[]: # | `legal` | `string` | Legal information about the substance |
[]: # | `interactions` | `string[]` | Interactions of the substance |
[]: # | `setAndSetting` | `string` | Set and Setting of the substance |
[]: # | `sources` | `string[]` | Sources of the substance |
[]: # | `tripSitId` | `string` | TripSit ID of the substance |
[]: # | `tripSitWiki` | `string` | TripSit Wiki of the substance |
[]: # | `tripSitWikiSection` | `string` | TripSit Wiki Section of the substance |
[]: # | `tripSitWikiUrl` | `string` | URL to the TripSit Wiki Section of the substance |
[]: # | `tripSitWikiLastUpdated` | `string` | Date when the TripSit Wiki Section was last updated |
[]: # | `tripSitWikiLastUpdatedBy` | `string` | User who last updated the TripSit Wiki Section |
[]: # | `tripSitWikiLastUpdatedByAvatar` | `string` | Avatar of the user who last updated the TripSit Wiki Section |
[]: # | `tripSitWikiLastUpdatedByLink` | `string` | Link to the user who last updated the TripSit Wiki Section |
[]: # | `tripSitWikiLastUpdatedByLink` | `string` | Link to the user who last updated the TripSit Wiki Section |
[]: # | `tripSitWikiLastUpdatedByNickname` | `string` | Nickname of the user who last updated the TripSit Wiki Section |
[]: # | `tripSitWikiLastUpdatedByProfile` | `string` | Profile of the user who last updated the TripSit Wiki Section |
[]: # | `tripSitWikiLastUpdatedByUsername` | `string` | Username of the user who last updated the TripSit Wiki Section
