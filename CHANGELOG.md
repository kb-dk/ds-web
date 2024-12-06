# Changelog
All notable changes to ds-web will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.12] - 2024-12-06

### Changed
- z-index changed to account for new position on current filters.

## [1.0.11] - 2024-12-06
### Added
- Updated dependencies in the entire repo.

### Changed
- Changed a reset button to a more solid functionality.
- Fixed a tiny check in breadcrumb to make a better pathing.
- Small change to icons on resultpage.
- Updated UX / styling on 0-hits page.
- Updated styling on 404 page.

## [1.0.10] - 2024-12-05
### Changed
- Changed some descriptions on the frontpage.
- A more solid check for nohits on /find path.

## [1.0.9] - 2024-12-05
### Added
- Added tracking scripts for various UX platforms.
- Added main category translations.
- Added support for error messages throughout the platform.
- Added curated content on the frontpage

### Changed
- Fixed a bug where the breadcrumb was not selecting the right path based on previous page.
- Fixed a bug where an empty /find path would result in nothing shown.
- Fixed a bug where headline selections were not updated on reload.
- Split facet-call and search-call in two - making facet-call optional based on user interaction.
- Fixed an issue with videos not changing when selecting a related record.
- Various UX fixes on frontpage.
- Various UX fixes on filters and search-page

## [1.0.8] - 2024-11-18
### Added
- Added a check for the video and audio-player to rebuild with new kaltura id when selecting a related record

### Changed
- Fixed a duplicate in the change log.

## [1.0.7] - 2024-11-18
### Added
- better support for keeping filters when using browser forward/backward navigation.
- New "how to search"-button added below the searchbar.

### Changed
- Autcomplete updated with new values from backend (for timeouts and the likes).
- Some changes to some translations.
- Timesearch component had initial values updated to reflect the real corpus.
- Timesearch links updated.
- A fair amount of small bugfixes.
- Small changes on design for some filter buttons.
- Sort bugs fixed.
- Update to "not allowed" content design.

## [1.0.6] - 2024-11-06
### Changed
- Fixed a bug where daypicker link was not updated on month/year selection.

## [1.0.5] - 2024-11-06
### Added
- New design of zero-hits page.
- Added new content from backend in "cool stuff from this month"-section.

### Changed
- Fixed a bug when removing all filters.
- Fixed sorting of main categories.
- Fixed a lot of translations.
- A fair amount of small fixes here and there.

## [1.0.4] - 2024-10-31
### Added
- Added summary for categories and genres.
- Fixed backlink from fullpost no longer doing a search.
- Added hero image and archive explanation.
- Added 404 page.

### Changed
- Fixed a bug where filters were not correctly removed.
- Restyled the time filters on the searchpage.
- Fixed a bunch of translations.
- Some web optimizations have been done all around the application.

## [1.0.3] - 2024-09-26
### Added
- Added messages service call to bff for kaltura ids on app start.

## [1.0.2] - 2024-09-17
### Added

### Changed
- Fix bug where website would go into an infinite authenticate loop when authentication returned 200 but all other requests through bff subsequently returned 401

## [1.0.1] - 2024-09-12
### Added

### Changed
Bumped:
- vue from 3.4.19 to 3.5.4
- vue-router from 4.2.5 to 4.4.4
- pinia from 2.1.7 to 2.2.2
- axios from 1.6.2 to 1.7.7
    
- Fix bug in error message when deselecting both radio and tv 'radio buttons' in search result
- Remove console.log in ResultItem.vue

## [1.0.0] - 2024-09-09
### Added
- Handling for authentication cookie supplied by BFF
- Handling of 401 response from BFF due to expired session cookie or rotation of secret salt
- Session cookie automatically refreshes 15 minutes before expire (cookie session time is currently set to 36 hours)
- Added data-test-id atrribute to all dynamic DOM elements for automatic test purpose
- Time search is now available from the search page as well as the landing page

### Changed
- Facets moved and completely reworked
- Accessibility adjustments based on Lighthouse test
- Time search functionality expanded and reworked
- Switched to use entry_id when streaming video/audio from Kaltura
- Adjustments to mobile styling in search result
- New tv/radio toggle buttons (search filters)
- Brush-up of 0 hits page

## [0.2.0] - 2024-06-27
### Added
- New time search function on front page
### Changed
- New base path handling in app

## [0.1.2] - 2024-05-16
### Added

### Changed
- New version tag

## [0.1.1] - 2024-05-16
### Added

### Changed
- New partner ID
- Slightly change of partner ID config handling

## [0.1.0] - 2024-05-15
### Added

- First official initial release of project
### Changed

