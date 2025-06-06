# Changelog
All notable changes to ds-web will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.4] - 2025-05-22 

### Changed
- Fixed various minor styling issues.
- Rebuild pager buttons to links instead.
- Small bugfix for whenusing tv/radio toggles, they now reset the startparam to 0.

### Added
- Rebuild /find without query, so we now have a neutral page guiding the user to a search.
- Better titles on the search page, reflecting the current query.
 
## [1.1.3] - 2025-04-07

### Changed
- Removed jest and the few disabled tests - all testing moved to our test repository.
- Fixed a bug where it was possible to deeplink into a video by using the kaltura time stamp functionality.
- Changed a few h1 to h2.
- A few translation updates.
- Fixed a bug where the suggested searches wasn't cleared before a new search, resulting in some weird suggestions.
- Fixed title on the page for SoMe.

## [1.1.2] - 2025-03-28

### Changed
- Fixed a bug with datepicker not setting the correct end hours for the filter.
- Fixed a bug where the apply button for time filters did not show correct state
- Fixed a bug where some filters would not be shown as active.

## [1.1.1] - 2025-03-27

### Changed
- Thumbnails no longer deeplink to a certain time in the video.
- Extra thumbnail count set to 20 instead of 10.
- Removed all traces of startAt param in routing, preventing any time deeplinking to videos.

## [1.1.0] - 2025-03-26
### Added
- Added a check for maximum 100 pages og results shown.
- Added input fields for the calendars.
- Added various missing test-ids.

### Changed
- Updates to translations.
- Various small UX tweaks and fixes.
- Fixed an authentication bug where a loop was not reset before retrying.
- Various accessability updates.
- genre call changed to genre_facet.

## [1.0.16] - 2024-02-11
### Changed
- Fixed a broken link due to changes in genre_facets.
- Fixed an issue where a wrong header would be shown when searching with *:*.

## [1.0.15] - 2024-01-30
### Added
- Unavailable records now has their own template.
- Added contact the library a bunch of places. (UX wanted this.)

### Changed
- Styling on channel checkboxes and changed direction of added items.
- Autocomplete bug fixed.
- Portal dropdown now closes if you click outside of it.
- Genre now changed to genre_facets in the code.
- Some refactoring done on web components to vue components.
- Breadcrumb can now be opened/closed on hover/click.
- Small Safari bug in the header fixed.
- Choosing a category now brings you to the top of the search results.
- Fixed a small bug when you searched for the same query twice in a row.
- Fixed minor bug with positioning of the thumbnails.
- Various small styling corrections.

## [1.0.14] - 2024-12-17

### Changed
- centered daypicker on desktop view.
- small hover effect was not applied correctly.

## [1.0.13] - 2024-12-16

### Changed
- Categories on the front page is now fodled up on load on desktop aswell as mobile.
- Page scrolls to the top of search when we come from a selected genre.
- Small fix for fewer calls for the facets from backend.
- mobile styling fixes on resultpage.
- small transition changes on the autocomplete component.
- small bug in autocomplete fixed.
- Links to searchguide now opens in a new tab.
- Small changes to categories container behavior.
- Hover effect now added on the categories component on the frontpage.

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

