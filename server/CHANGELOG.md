# [timeclicker_server-v2.0.3](https://github.com/educorvi/timeclicker/compare/timeclicker_server-v2.0.2...timeclicker_server-v2.0.3) (2024-09-06)


### Bug Fixes

* vacation day calculation ([818e4a2](https://github.com/educorvi/timeclicker/commit/818e4a24564eebb85cc0d2a394116b932d1f4347))

# [timeclicker_server-v2.0.2](https://github.com/educorvi/timeclicker/compare/timeclicker_server-v2.0.1...timeclicker_server-v2.0.2) (2024-09-05)


### Bug Fixes

* don't allow users without remaining vacation days to create a vacation entry ([31384f9](https://github.com/educorvi/timeclicker/commit/31384f94dd6ff18e99bb142b5bde9bf2eedfa9d1)), closes [#TIM-7](https://github.com/educorvi/timeclicker/issues/TIM-7)
* time balance calculation bug, where entries in the future break the balance calculation ([396e5a1](https://github.com/educorvi/timeclicker/commit/396e5a16b80f303c5ced2b4de2b2a8dbf4d1456f)), closes [#TIM-6](https://github.com/educorvi/timeclicker/issues/TIM-6)

# [timeclicker_server-v2.0.1](https://github.com/educorvi/timeclicker/compare/timeclicker_server-v2.0.0...timeclicker_server-v2.0.1) (2024-08-30)


### Bug Fixes

* allow non Integers for hoursPerWeek ([9767f6d](https://github.com/educorvi/timeclicker/commit/9767f6d9e3190978488e7de56a1b5943a317d6ab))

# [timeclicker_server-v2.0.0](https://github.com/educorvi/timeclicker/compare/timeclicker_server-v1.8.1...timeclicker_server-v2.0.0) (2024-08-30)


### Continuous Integration

* fix release ([4a95a52](https://github.com/educorvi/timeclicker/commit/4a95a52970be16cad22a3d0dd1a45c7a272ad6de))


### BREAKING CHANGES

* Release v2. Major Changes to ui and api

# [timeclicker_server-v1.7.1](https://github.com/educorvi/timeclicker/compare/timeclicker_server-v1.7.0...timeclicker_server-v1.7.1) (2023-04-24)

### Bug Fixes

-   fix vulnerability ([a0b5007](https://github.com/educorvi/timeclicker/commit/a0b5007d07d8296d4b8e7771d5b4a83e68e62ee0))

# [timeclicker_server-v1.7.0](https://github.com/educorvi/timeclicker/compare/timeclicker_server-v1.6.2...timeclicker_server-v1.7.0) (2023-04-14)

### Bug Fixes

-   remove private note on orga-endpoint ([503dd04](https://github.com/educorvi/timeclicker/commit/503dd0423f6c8268bb72569bfb8f3cb1439b3c7f))

### Features

-   add unauthenticated api endpoint for pinging and version information ([8f76130](https://github.com/educorvi/timeclicker/commit/8f76130478fcc8f7c1dc34b56c608f14928c0ffe))
-   serve modified swaggerUI in client with authentication ([a3deb6f](https://github.com/educorvi/timeclicker/commit/a3deb6f0c6cfd5612a7f85014dbb582a206f7a31))
-   serve swaggerUI ([db54c31](https://github.com/educorvi/timeclicker/commit/db54c3153f48c104357cd331dead145f43afb452))

# [timeclicker_server-v1.6.2](https://github.com/educorvi/timeclicker/compare/timeclicker_server-v1.6.1...timeclicker_server-v1.6.2) (2023-04-12)

### Bug Fixes

-   fix CVE-2023-0842 ([0e7f577](https://github.com/educorvi/timeclicker/commit/0e7f577bfef23e818dcb784caf938b1cdc9a7797))

# [timeclicker_server-v1.6.1](https://github.com/educorvi/timeclicker/compare/timeclicker_server-v1.6.0...timeclicker_server-v1.6.1) (2023-04-05)

### Bug Fixes

-   don't log undefined ([301f9e4](https://github.com/educorvi/timeclicker/commit/301f9e485b675f1bb295afa0e364357c4f53b844))

# [timeclicker_server-v1.6.0](https://github.com/educorvi/timeclicker/compare/timeclicker_server-v1.5.0...timeclicker_server-v1.6.0) (2023-03-30)

### Bug Fixes

-   oder tasks alphabetically ([2cdf4fe](https://github.com/educorvi/timeclicker/commit/2cdf4fe19957258329c6b200b3d6909e650ed78d))

### Features

-   add break time feature ([e406edc](https://github.com/educorvi/timeclicker/commit/e406edc65ad01ffae01e858309ebf83d3496535b))

# [timeclicker_server-v1.5.0](https://github.com/educorvi/timeclicker/compare/timeclicker_server-v1.4.0...timeclicker_server-v1.5.0) (2023-03-24)

### Features

-   create database if it does not exist ([97df9a8](https://github.com/educorvi/timeclicker/commit/97df9a81dc2b0e6bf9849ebb5c471e3718786235))

# [timeclicker_server-v1.4.0](https://github.com/educorvi/timeclicker/compare/timeclicker_server-v1.3.0...timeclicker_server-v1.4.0) (2023-03-02)

### Features

-   enable compression for static files ([40afe25](https://github.com/educorvi/timeclicker/commit/40afe25ac4995f1f6851622dde8820cfe708fc30))

# [timeclicker_server-v1.3.0](https://github.com/educorvi/timeclicker/compare/timeclicker_server-v1.2.0...timeclicker_server-v1.3.0) (2023-03-02)

### Bug Fixes

-   fix bug with serving client ([4912653](https://github.com/educorvi/timeclicker/commit/49126535bf79c2239acd053cc8eb8f932a78b315))

### Features

-   make used keycloak configurable with the .env files ([0fedcee](https://github.com/educorvi/timeclicker/commit/0fedcee26db21a744b2914218145f96dd92a68f9)), closes [#9](https://github.com/educorvi/timeclicker/issues/9)

# [timeclicker_server-v1.2.0](https://github.com/educorvi/timeclicker/compare/timeclicker_server-v1.1.0...timeclicker_server-v1.2.0) (2023-02-20)

### Features

-   **server:** move api to /api and serve client under root ([2866caa](https://github.com/educorvi/timeclicker/commit/2866caa21489b7a29aa773944096e2e70b27dfc3))
-   **server:** rate limiting ([f17cf8b](https://github.com/educorvi/timeclicker/commit/f17cf8b5499ca596c4a7883cce4ab92edd6eab1d))
