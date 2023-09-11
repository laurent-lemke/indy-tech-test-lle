#  Indy technical tests

Technical tests for indy company

See: https://indyfr.notion.site/Test-technique-Indy-a2ebf77d34b04fb698242c72bcdbdaec

More information to come...


## Potentials improvements

Abbreviations are used comes from the IETF semantics:
    - MH for Must Have
    - SH for Should Have
    - NTH for Nice To Have

- MH: contribute to the following [issue](https://github.com/cdimascio/express-openapi-validator/issues/755) that allow the middleware to use `unevaluatedProperties` - thus, more schema constraint (related to anyOf)
- SH: Use a [oneOf/anyOf/allOf](https://swagger.io/docs/specification/data-models/oneof-anyof-allof-not/) keyword in the `reasons`. Currently the `reasons` object could be empty and that's a little bit strange (maybe when its accepted ? Still strange)
- NTH: Only one `@date` sub-properties (after and before) could be possible. Currently both must be defined. The underlying idea is to provide the capability to say "this promo code is valid until this date" or "this promo code is valid starting from this date".
- SH: Generate typescript type based on open api definition, for safer use of API requests and responses. Some libraries allow to do that, but it would require more effort/times to implement it.
- SH: Coherency rules engine to check depending on various rules whether the restrictions are consistent or not (e.g a set of restrictions with an age "eq" and "gt")