# [timeclicker_client-v3.0.0](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v2.1.1...timeclicker_client-v3.0.0) (2026-01-22)


### Bug Fixes

* update dependencies ([3678fbd](https://github.com/educorvi/timeclicker/commit/3678fbde880045ee6c7def206b09b0d4b3c71bfd))


### Features

* remove working hours from client ([550f85c](https://github.com/educorvi/timeclicker/commit/550f85c897c39462e77d6f15e7d2f87ecfb9a01f))


### BREAKING CHANGES

* Removed working hours

# [timeclicker_client-v2.1.1](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v2.1.0...timeclicker_client-v2.1.1) (2025-06-04)


### Bug Fixes

* update keycloak-js version ([26c0185](https://github.com/educorvi/timeclicker/commit/26c01856a476c57915f061c2137373ab4e57d8d0))
* update VueJsonForm ([d6d7426](https://github.com/educorvi/timeclicker/commit/d6d7426b988cb5496bf2d1aac139babe2f794c12))

# [timeclicker_client-v2.1.0](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v2.0.7...timeclicker_client-v2.1.0) (2025-01-28)


### Bug Fixes

* fix account dropdown not showing if no avatar is set ([dbe18d1](https://github.com/educorvi/timeclicker/commit/dbe18d1db68a79ffa3f15ea4d3a9ce347d8693f5)), closes [#Tim-11](https://github.com/educorvi/timeclicker/issues/Tim-11)


### Features

* set today as default date in entry modals ([d9235e1](https://github.com/educorvi/timeclicker/commit/d9235e1f29249e209f4d1f6463f0c07e7ecc3d74)), closes [#TIM-13](https://github.com/educorvi/timeclicker/issues/TIM-13)

# [timeclicker_client-v2.0.7](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v2.0.6...timeclicker_client-v2.0.7) (2025-01-07)


### Bug Fixes

* do not display loading spinner forever if request failed in libraries modal ([d3f9199](https://github.com/educorvi/timeclicker/commit/d3f9199e0e3b00039b52418de37e1df206576821))
* use short units in time balance view so it does not overflow ([6ed0927](https://github.com/educorvi/timeclicker/commit/6ed09279233792f282b97bb69a95b1a411404987))
* WorkingHour entries on the last day of a month not displayed in ui ([9186ffb](https://github.com/educorvi/timeclicker/commit/9186ffba24a5beaeef17c3573a14b3cbefc5c388)), closes [#Tim-10](https://github.com/educorvi/timeclicker/issues/Tim-10)

# [timeclicker_client-v2.0.6](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v2.0.5...timeclicker_client-v2.0.6) (2024-11-29)


### Bug Fixes

* round humanized duration in WorkingHours View ([4949aca](https://github.com/educorvi/timeclicker/commit/4949acaa16e886536285d7e41856ad4d6b645c66))

# [timeclicker_client-v2.0.5](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v2.0.4...timeclicker_client-v2.0.5) (2024-11-26)


### Bug Fixes

* humanize duration in WorkingHoursView ([f79ebdf](https://github.com/educorvi/timeclicker/commit/f79ebdf335a2f86018300feb1c44adbd0687232e))

# [timeclicker_client-v2.0.4](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v2.0.3...timeclicker_client-v2.0.4) (2024-09-06)


### Bug Fixes

* fix activity orga view not reloading after filter change ([ed76e58](https://github.com/educorvi/timeclicker/commit/ed76e58ff15119dca1ccf958c9be26bd76fa2922))
* remove unnecessary console.log ([ea4bb45](https://github.com/educorvi/timeclicker/commit/ea4bb45bb053309d23bba167405a49f9e1092951))

# [timeclicker_client-v2.0.3](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v2.0.2...timeclicker_client-v2.0.3) (2024-09-05)


### Bug Fixes

* contract entry modal not resetting after closing ([a1acc6e](https://github.com/educorvi/timeclicker/commit/a1acc6e91d5e1fadd1f6f3eaa2e7df221e0cebe6)), closes [#TIM-5](https://github.com/educorvi/timeclicker/issues/TIM-5)
* don't allow users without remaining vacation days to create a vacation entry ([31384f9](https://github.com/educorvi/timeclicker/commit/31384f94dd6ff18e99bb142b5bde9bf2eedfa9d1)), closes [#TIM-7](https://github.com/educorvi/timeclicker/issues/TIM-7)
* improve error handling ([355eac8](https://github.com/educorvi/timeclicker/commit/355eac8cd9a54a3b655d96c45b6d70656dbaa456)), closes [#TIM-4](https://github.com/educorvi/timeclicker/issues/TIM-4)
* improve ui for working hours ([951e20a](https://github.com/educorvi/timeclicker/commit/951e20a60edf2cb9c331bb2509c805e1caedb577)), closes [#TIM-8](https://github.com/educorvi/timeclicker/issues/TIM-8)
* time balance calculation bug, where entries in the future break the balance calculation ([396e5a1](https://github.com/educorvi/timeclicker/commit/396e5a16b80f303c5ced2b4de2b2a8dbf4d1456f)), closes [#TIM-6](https://github.com/educorvi/timeclicker/issues/TIM-6)

# [timeclicker_client-v2.0.2](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v2.0.1...timeclicker_client-v2.0.2) (2024-08-30)


### Bug Fixes

* fetch timeBalance when hours changed ([a616cba](https://github.com/educorvi/timeclicker/commit/a616cba9a546fdfd12b9a3752e2c54fe502a1e2a))

# [timeclicker_client-v2.0.1](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v2.0.0...timeclicker_client-v2.0.1) (2024-08-30)


### Bug Fixes

* allow non Integers for hoursPerWeek ([9767f6d](https://github.com/educorvi/timeclicker/commit/9767f6d9e3190978488e7de56a1b5943a317d6ab))
* change pwa background color ([53c319f](https://github.com/educorvi/timeclicker/commit/53c319fbbeb6c1e980f271a7f4c55b1e5f07bb73))

# [timeclicker_client-v2.0.0](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v1.12.1...timeclicker_client-v2.0.0) (2024-08-30)


### Continuous Integration

* fix release ([4a95a52](https://github.com/educorvi/timeclicker/commit/4a95a52970be16cad22a3d0dd1a45c7a272ad6de))


### BREAKING CHANGES

* Release v2. Major Changes to ui and api

# [timeclicker_client-v1.12.1](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v1.12.0...timeclicker_client-v1.12.1) (2023-11-10)


### Bug Fixes

* improve orga table ([68c7c80](https://github.com/educorvi/timeclicker/commit/68c7c80ed315fd1545e7c4f874a9f3bb112aa83f))

# [timeclicker_client-v1.12.0](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v1.11.0...timeclicker_client-v1.12.0) (2023-10-13)


### Bug Fixes

* fix changelog regex ([5121039](https://github.com/educorvi/timeclicker/commit/5121039cf255a570c6bff8e9ece5df6f18e0fc76))


### Features

* show break time extra and subtract from time in overview ([2b5887a](https://github.com/educorvi/timeclicker/commit/2b5887a80c0a539de0fc7126f06375c8f6f0e324))

# [timeclicker_client-v1.10.0](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v1.9.1...timeclicker_client-v1.10.0) (2023-06-16)


### Bug Fixes

* do not show closed tasks in entryEditor dropdown ([2452e1b](https://github.com/educorvi/timeclicker/commit/2452e1b034814558fb4c91d0c63e68600046a4cf)), closes [#36](https://github.com/educorvi/timeclicker/issues/36)
* do not show the "failed to refreshed token" error multiple times ([9c887df](https://github.com/educorvi/timeclicker/commit/9c887df9943befa28e8520f4ab6259a6a3575329)), closes [#34](https://github.com/educorvi/timeclicker/issues/34)
* translate language setting values ([0743973](https://github.com/educorvi/timeclicker/commit/07439733dfa6ff2c1a3032021a1d8990cc85f6fe)), closes [#33](https://github.com/educorvi/timeclicker/issues/33)


### Features

* show break time in overview ([114fcf8](https://github.com/educorvi/timeclicker/commit/114fcf8cc027f1636615945b4ac055928310d93c)), closes [#35](https://github.com/educorvi/timeclicker/issues/35)

# [timeclicker_client-v1.9.1](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v1.9.0...timeclicker_client-v1.9.1) (2023-04-21)


### Bug Fixes

* fix swagger ui in production ([e827f2a](https://github.com/educorvi/timeclicker/commit/e827f2a0aebcff6c61460ce56ec7f6334e8a7d5c))

# [timeclicker_client-v1.9.0](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v1.8.0...timeclicker_client-v1.9.0) (2023-04-14)


### Features

* serve modified swaggerUI in client with authentication ([a3deb6f](https://github.com/educorvi/timeclicker/commit/a3deb6f0c6cfd5612a7f85014dbb582a206f7a31))
* server version in about page ([5f0fadf](https://github.com/educorvi/timeclicker/commit/5f0fadf3db1954147563138a6cf3bc19c574685f))

# [timeclicker_client-v1.8.0](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v1.7.2...timeclicker_client-v1.8.0) (2023-04-07)


### Bug Fixes

* fix missing translation ([1a82929](https://github.com/educorvi/timeclicker/commit/1a82929c5e076865c780ae549281d45c926e4202))


### Features

* open activity editor with preselected task via link ([bbd83c1](https://github.com/educorvi/timeclicker/commit/bbd83c14806df228cbb46f5091aa2b71abdc3d74))

# [timeclicker_client-v1.7.2](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v1.7.1...timeclicker_client-v1.7.2) (2023-04-05)


### Bug Fixes

* fix ui bug that broke ui ([58c15c4](https://github.com/educorvi/timeclicker/commit/58c15c42e1bca4d11d25579c65cb80349da924c8))


### Reverts

* revert dependencies to fix build ([302536b](https://github.com/educorvi/timeclicker/commit/302536be9469005bb25c1ad3f2318cf061e2e8cf))

# [timeclicker_client-v1.7.1](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v1.7.0...timeclicker_client-v1.7.1) (2023-04-05)


### Bug Fixes

* bug with entry editor when creating new activity ([4ad8bee](https://github.com/educorvi/timeclicker/commit/4ad8bee72fca375698a3c067daedbe8a61e67eb1))
* set client unauthenticated when token refresh fails ([f7e6657](https://github.com/educorvi/timeclicker/commit/f7e6657183ddee878aa060d36773b247c18136d0))

# [timeclicker_client-v1.7.0](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v1.6.3...timeclicker_client-v1.7.0) (2023-03-30)


### Features

* add break time feature ([e406edc](https://github.com/educorvi/timeclicker/commit/e406edc65ad01ffae01e858309ebf83d3496535b))

# [timeclicker_client-v1.6.3](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v1.6.2...timeclicker_client-v1.6.3) (2023-03-17)


### Bug Fixes

* style input elements to respect dark mode ([29a7e50](https://github.com/educorvi/timeclicker/commit/29a7e50fbd22af1759db04dda47bf5606e705700))

# [timeclicker_client-v1.6.2](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v1.6.1...timeclicker_client-v1.6.2) (2023-03-15)


### Bug Fixes

* improve overview card style ([d785bec](https://github.com/educorvi/timeclicker/commit/d785becbb05aaeaea3fffce8cf2435df7f4db27f))
* improve styling of changelog view ([444cdfa](https://github.com/educorvi/timeclicker/commit/444cdfad8767d5f9cf8346b5da08fcb870869c7b))

# [timeclicker_client-v1.6.1](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v1.6.0...timeclicker_client-v1.6.1) (2023-03-07)


### Bug Fixes

* improve desktop ui ([a7b0c06](https://github.com/educorvi/timeclicker/commit/a7b0c067a36b838eb11af724466d4378ea4522ce))

# [timeclicker_client-v1.6.0](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v1.5.1...timeclicker_client-v1.6.0) (2023-03-07)


### Features

* i18n ([603b42a](https://github.com/educorvi/timeclicker/commit/603b42a31c0da8b8d7851ee6573236c2d9a8fe43)), closes [#14](https://github.com/educorvi/timeclicker/issues/14)

# [timeclicker_client-v1.5.1](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v1.5.0...timeclicker_client-v1.5.1) (2023-03-05)


### Bug Fixes

* minor style fixes ([c9235e7](https://github.com/educorvi/timeclicker/commit/c9235e752d23f92c0c4ee02d43a5ed952a31ee0d))

# [timeclicker_client-v1.5.0](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v1.4.1...timeclicker_client-v1.5.0) (2023-03-02)


### Bug Fixes

* add background color to manifest ([ec7f82a](https://github.com/educorvi/timeclicker/commit/ec7f82a1914cc5a6e52068412df70545084865f7))
* don't use webfonts ([9f13923](https://github.com/educorvi/timeclicker/commit/9f13923c6f09b652b13af6da1e6c96af4485b2d1))
* educorvi logo in about page ([523ec35](https://github.com/educorvi/timeclicker/commit/523ec351f1b238572b3615708a1c791b06ad251b))


### Features

* error alerts ([3ca773b](https://github.com/educorvi/timeclicker/commit/3ca773b167605a66e7a9ea243342b52bd74e095f))

# [timeclicker_client-v1.4.1](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v1.4.0...timeclicker_client-v1.4.1) (2023-03-02)


### Bug Fixes

* add background color to manifest ([16ca315](https://github.com/educorvi/timeclicker/commit/16ca3155c6594db8a2da569289446b6ea4c94b04))

# [timeclicker_client-v1.4.0](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v1.3.0...timeclicker_client-v1.4.0) (2023-03-02)


### Bug Fixes

* about page design ([f1b5866](https://github.com/educorvi/timeclicker/commit/f1b586660e2a34ec8767ba16f3f5432d19b6138d))
* some smaller design improvements ([d5a6347](https://github.com/educorvi/timeclicker/commit/d5a6347588502d1b93415d886f0e9d77c74d2bd5))
* validate times in entry editor ([13367ad](https://github.com/educorvi/timeclicker/commit/13367ade7b78e555401cf18188019d3a0494f38d)), closes [#8](https://github.com/educorvi/timeclicker/issues/8)


### Features

* make timeclicker a pwa ([8251eab](https://github.com/educorvi/timeclicker/commit/8251eab3b785762a267ad96c9a3d901fe9cc9371)), closes [#3](https://github.com/educorvi/timeclicker/issues/3)

# [timeclicker_client-v1.3.0](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v1.2.0...timeclicker_client-v1.3.0) (2023-02-20)


### Bug Fixes

* **client:** fix some bugs ([76f5aaf](https://github.com/educorvi/timeclicker/commit/76f5aafadeff97c8333236b16318b7d23c95e441))


### Features

* about page ([3495a93](https://github.com/educorvi/timeclicker/commit/3495a93bb56341271d91eda0de58f2e395ec8793))
* **client:** confirm dialog before removing activity ([b86ed2f](https://github.com/educorvi/timeclicker/commit/b86ed2fccc8cae02011a7eca54e7bc770566caa2))
* **client:** show libraries and their licenses on about page ([815accc](https://github.com/educorvi/timeclicker/commit/815acccf0ef68b2bcf13cddb1bade93b05623618))
* dark theme ([0eb7725](https://github.com/educorvi/timeclicker/commit/0eb7725ec16f58229975176961e2a9ee65bdce6a))

# [timeclicker_client-v1.2.0](https://github.com/educorvi/timeclicker/compare/timeclicker_client-v1.1.0...timeclicker_client-v1.2.0) (2023-02-14)


### Features

* **client:** styling ([307d1f2](https://github.com/educorvi/timeclicker/commit/307d1f2a427405b5f0720d90f952e8c4d9e8fadf))
