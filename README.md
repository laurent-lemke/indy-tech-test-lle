# Indy technical tests

Technical tests for indy company

See: https://indyfr.notion.site/Test-technique-Indy-a2ebf77d34b04fb698242c72bcdbdaec

More information to come...

## Potentials improvements

Abbreviations that are used comes from the IETF semantics: Must Have (MH), Should Have (SH), Nice to Have (NH) aka May Have

- MH: contribute to the following [issue](https://github.com/cdimascio/express-openapi-validator/issues/755) that allow the middleware to use `unevaluatedProperties` - thus, more schema constraint (related to anyOf)
- MH: detailed reasons when the promo code is not validated. We could provided more informations regarding which condition has failed and for each restriction a `Map<K, V>` that store the details information of which condition failed.
- MH: A logger system to help to troubleshoot and debug when things are going wrong or just to health check the application

- SH: Better API tests, for example with supertest to test the API with a part of the business logic mocked (e.g externals libs). With the help of portman both fulfilled different objectives.
- SH: Use a [oneOf/anyOf/allOf](https://swagger.io/docs/specification/data-models/oneof-anyof-allof-not/) keyword in the `reasons`. Currently the `reasons` object could be empty and that's a little bit strange (maybe when its accepted ? Still strange)
- SH: Generate typescript type based on open api definition, for safer use of API requests and responses. Some libraries allow to do that, but it would require more effort/times to implement it. Also it would replace the DTOs directory.
- SH: Coherency rules engine to check depending on various rules whether the restrictions are consistent or not (e.g a set of restrictions with an age "eq" and "gt")

- NH: support town not only from France but from different countries. A property such as `country` should be defined in the API and filled with a `town`
- NH: Only one `@date` sub-properties (after and before) could be possible. Currently both must be defined. The underlying idea is to provide the capability to say "this promo code is valid until this date" or "this promo code is valid starting from this date".
- NH: Setup an authentication mechanism to allow only some user to create/validate promo code, through the use of a JWT token for example
