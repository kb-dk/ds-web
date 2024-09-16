# Changelog
All notable changes to ds-web will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


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

