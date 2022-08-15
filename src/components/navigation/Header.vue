<template lang="">
	<header
		id="mainHeader"
		class="global-header sub-page"
	>
		<div class="header-bg-wrapper theme-bg">
			<div class="container">
				<!-- TODO: remove mock height when logo works -->
				<div
					class="row justify-content-between"
					style="height: 95px"
				>
					<div class="col logo-col">
						<a
							href="http://www.kb.dk"
							class="logo"
						>
							<span class="sr-only"></span>
						</a>
					</div>
					<div
						class="col-auto d-lg-none search-col"
						role="search"
					>
						<button
							id="mobileMainSearchButton"
							type="button"
							class="icon-button search-button d-lg-none"
							data-toggle="collapse"
							data-target="#mainSearch"
							aria-expanded="true"
							aria-controls="mainSearch"
							aria-label=""
						>
							<i
								class="material-icons"
								aria-hidden="true"
							>
								search
							</i>

							<span
								class="open-search"
								aria-hidden="true"
							>
								Søg
							</span>
							<span
								class="close-search"
								aria-hidden="true"
							>
								Luk
							</span>
						</button>
					</div>
					<div class="col-auto d-lg-none burger-col">
						<div
							id="mobileNavToggle"
							data-toggle="collapse"
							data-target="#mobileNavigation"
							aria-expanded="false"
							aria-controls="mobileNavigation"
							aria-label="Åbn eller luk navigation"
						>
							<button
								id="mobileNavButton"
								class="btn burger"
								data-toggle="button"
								aria-pressed="false"
							>
								<span class="line"></span>
								<span class="line"></span>
								<span class="line"></span>
								<span>Menu</span>
							</button>
						</div>
					</div>
				</div>
				<div class="row rdl-system-messages-wrapper"></div>
				<div
					class="rdl-main-search collapse"
					id="mainSearch"
					data-parent="#mainHeader"
					style=""
				>
					<SearchBar />
				</div>
				<div class="dropdown-edge d-lg-none"></div>
				<div
					class="collapse rdl-main-navigation-wrapper"
					id="mobileNavigation"
					data-parent="#mainHeader"
				>
					<nav
						class="rdl-main-navigation"
						aria-label="Hovednavigation"
					>
						<ul
							class="rdl-primary-nav"
							role="menubar"
						>
							<li>
								<router-link
									class="nav-item level-1"
									to="/find-materiale"
								>
									Find materiale
								</router-link>

								<button
									class="icon-button"
									type="button"
									data-toggle="collapse"
									data-target="#subItems-862861867"
									aria-expanded="false"
									aria-controls="subItems-862861867"
									aria-label="Åbn eller luk underpunkter i navigationen"
								>
									<i
										class="material-icons"
										aria-hidden="true"
									></i>
								</button>

								<ul
									id="subItems-862861867"
									class="collapse"
								>
									<li>
										<a
											href="https://www.kb.dk/find-materiale/guides"
											class="nav-item level-2"
										>
											Guides
										</a>

										<button
											class="icon-button"
											type="button"
											data-toggle="collapse"
											data-target="#subItems-2013982329"
											aria-expanded="false"
											aria-controls="subItems-2013982329"
											aria-label="Åbn eller luk underpunkter i navigationen"
										>
											<i
												class="material-icons"
												aria-hidden="true"
											></i>
										</button>

										<ul
											id="subItems-2013982329"
											class="collapse"
										>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/guides/musik"
													class="nav-item level-3"
												>
													Musik
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/guides/arkitektur"
													class="nav-item level-3"
												>
													Arkitektur
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/guides/skuespil-og-scenekunst"
													class="nav-item level-3"
												>
													Skuespil og scenekunst
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/guides/billeder"
													class="nav-item level-3"
												>
													Billeder
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/guides/computerspil"
													class="nav-item level-3"
												>
													Computerspil
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/guides/aviser"
													class="nav-item level-3"
												>
													Aviser
												</a>

												<button
													class="icon-button"
													type="button"
													data-toggle="collapse"
													data-target="#subItems-666871216"
													aria-expanded="false"
													aria-controls="subItems-666871216"
													aria-label="Åbn eller luk underpunkter i navigationen"
												>
													<i
														class="material-icons"
														aria-hidden="true"
													></i>
												</button>

												<ul
													id="subItems-666871216"
													class="collapse"
												>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/guides/aviser/bestil-avis"
															class="nav-item level-4"
														>
															Bestil avis
														</a>
													</li>
												</ul>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/guides/danske-radio-og-tv-udsendelser"
													class="nav-item level-3"
												>
													Danske radio- og tv-udsendelser
												</a>

												<button
													class="icon-button"
													type="button"
													data-toggle="collapse"
													data-target="#subItems-157580448"
													aria-expanded="false"
													aria-controls="subItems-157580448"
													aria-label="Åbn eller luk underpunkter i navigationen"
												>
													<i
														class="material-icons"
														aria-hidden="true"
													></i>
												</button>

												<ul
													id="subItems-157580448"
													class="collapse"
												>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/guides/danske-radio-og-tv-udsendelser/bestil"
															class="nav-item level-4"
														>
															Bestil
														</a>
													</li>
												</ul>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/guides/folkeminder-og-materiale-om-dagliglivets-kultur"
													class="nav-item level-3"
												>
													Folkeminder og materiale om dagliglivets kultur
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/guides/haandskrifter"
													class="nav-item level-3"
												>
													Håndskrifter
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/guides/kort"
													class="nav-item level-3"
												>
													Kort
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/guides/noder"
													class="nav-item level-3"
												>
													Noder
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/guides/reklamefilm"
													class="nav-item level-3"
												>
													Reklamefilm
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/guides/smaatryk"
													class="nav-item level-3"
												>
													Småtryk
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/guides/videoer"
													class="nav-item level-3"
												>
													Videoer
												</a>
											</li>
										</ul>
									</li>
									<li>
										<a
											href="https://www.kb.dk/find-materiale/tjenester"
											class="nav-item level-2"
										>
											Tjenester
										</a>

										<button
											class="icon-button"
											type="button"
											data-toggle="collapse"
											data-target="#subItems-2045834635"
											aria-expanded="false"
											aria-controls="subItems-2045834635"
											aria-label="Åbn eller luk underpunkter i navigationen"
										>
											<i
												class="material-icons"
												aria-hidden="true"
											></i>
										</button>

										<ul
											id="subItems-2045834635"
											class="collapse"
										>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/tjenester/bibliotekssystem"
													class="nav-item level-3"
												>
													Bibliotekssystem
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/tjenester/danmark-set-fra-luften"
													class="nav-item level-3"
												>
													Danmark set fra luften
												</a>

												<button
													class="icon-button"
													type="button"
													data-toggle="collapse"
													data-target="#subItems-1420958060"
													aria-expanded="false"
													aria-controls="subItems-1420958060"
													aria-label="Åbn eller luk underpunkter i navigationen"
												>
													<i
														class="material-icons"
														aria-hidden="true"
													></i>
												</button>

												<ul
													id="subItems-1420958060"
													class="collapse"
												>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/tjenester/danmark-set-fra-luften/om-danmark-set-fra-luften"
															class="nav-item level-4"
														>
															Om Danmark set fra luften
														</a>
													</li>
												</ul>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/tjenester/mediestream"
													class="nav-item level-3"
												>
													Mediestream
												</a>

												<button
													class="icon-button"
													type="button"
													data-toggle="collapse"
													data-target="#subItems-1688050815"
													aria-expanded="false"
													aria-controls="subItems-1688050815"
													aria-label="Åbn eller luk underpunkter i navigationen"
												>
													<i
														class="material-icons"
														aria-hidden="true"
													></i>
												</button>

												<ul
													id="subItems-1688050815"
													class="collapse"
												>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/tjenester/mediestream/soeg-efter-avisartikler-annoncer-osv"
															class="nav-item level-4"
														>
															Søg efter avisartikler, annoncer osv.
														</a>
													</li>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/tjenester/mediestream/soeg-efter-bestemt-avistitel-og-evt-dato"
															class="nav-item level-4"
														>
															Søg efter bestemt avistitel og evt. dato
														</a>
													</li>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/tjenester/mediestream/avisid-oversigt"
															class="nav-item level-4"
														>
															AvisID oversigt
														</a>
													</li>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/tjenester/mediestream/kendte-radio-og-tv-mangler"
															class="nav-item level-4"
														>
															Kendte radio- og tv-mangler
														</a>
													</li>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/tjenester/mediestream/emner-i-radio-og-tv-udsendelser"
															class="nav-item level-4"
														>
															Emner i radio- og tv-udsendelser
														</a>
													</li>
												</ul>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/tjenester/digitale-samlinger"
													class="nav-item level-3"
												>
													Digitale samlinger
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/tjenester/kunstbibliotekets-digitale-samlinger"
													class="nav-item level-3"
												>
													Kunstbibliotekets digitale samlinger
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/tjenester/tidsskriftdk"
													class="nav-item level-3"
												>
													Tidsskrift.dk
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/tjenester/tekster"
													class="nav-item level-3"
												>
													Tekster
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/tjenester/skolehistorie"
													class="nav-item level-3"
												>
													Skolehistorie
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/tjenester/digitale-aarboeger"
													class="nav-item level-3"
												>
													Digitale årbøger
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/tjenester/danmarks-breve"
													class="nav-item level-3"
												>
													Danmarks Breve
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/tjenester/dansk-lyd"
													class="nav-item level-3"
												>
													Dansk lyd
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/tjenester/loar"
													class="nav-item level-3"
												>
													LOAR
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/tjenester/api"
													class="nav-item level-3"
												>
													API
												</a>
											</li>
										</ul>
									</li>
									<li>
										<a
											href="https://www.kb.dk/find-materiale/samlinger"
											class="nav-item level-2"
										>
											Samlinger
										</a>

										<button
											class="icon-button"
											type="button"
											data-toggle="collapse"
											data-target="#subItems-1922210960"
											aria-expanded="false"
											aria-controls="subItems-1922210960"
											aria-label="Åbn eller luk underpunkter i navigationen"
										>
											<i
												class="material-icons"
												aria-hidden="true"
											></i>
										</button>

										<ul
											id="subItems-1922210960"
											class="collapse"
										>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/samlinger/haandskriftsamlingen"
													class="nav-item level-3"
												>
													Håndskriftsamlingen
												</a>

												<button
													class="icon-button"
													type="button"
													data-toggle="collapse"
													data-target="#subItems-1947770980"
													aria-expanded="false"
													aria-controls="subItems-1947770980"
													aria-label="Åbn eller luk underpunkter i navigationen"
												>
													<i
														class="material-icons"
														aria-hidden="true"
													></i>
												</button>

												<ul
													id="subItems-1947770980"
													class="collapse"
												>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/haandskriftsamlingen/haandskriftsamlingens-historie"
															class="nav-item level-4"
														>
															Håndskriftsamlingens historie
														</a>
													</li>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/haandskriftsamlingen/oversigt-over-haandskriftsamlingens-delsamlinger-og-deres-signaturer"
															class="nav-item level-4"
														>
															Oversigt over håndskriftsamlingens delsamlinger og deres signaturer
														</a>
													</li>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/haandskriftsamlingen/oversigt-over-materiale-i-haandskriftsamlingen-i-aarhus"
															class="nav-item level-4"
														>
															Oversigt over materiale i håndskriftsamlingen i Aarhus
														</a>
													</li>
												</ul>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/samlinger/luftfotosamlingen"
													class="nav-item level-3"
												>
													Luftfotosamlingen
												</a>

												<button
													class="icon-button"
													type="button"
													data-toggle="collapse"
													data-target="#subItems-562830390"
													aria-expanded="false"
													aria-controls="subItems-562830390"
													aria-label="Åbn eller luk underpunkter i navigationen"
												>
													<i
														class="material-icons"
														aria-hidden="true"
													></i>
												</button>

												<ul
													id="subItems-562830390"
													class="collapse"
												>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/luftfotosamlingen/luftfotosamlingens-historie"
															class="nav-item level-4"
														>
															Luftfotosamlingens historie
														</a>
													</li>
												</ul>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/samlinger/teatersamlingen"
													class="nav-item level-3"
												>
													Teatersamlingen
												</a>

												<button
													class="icon-button"
													type="button"
													data-toggle="collapse"
													data-target="#subItems-241639890"
													aria-expanded="false"
													aria-controls="subItems-241639890"
													aria-label="Åbn eller luk underpunkter i navigationen"
												>
													<i
														class="material-icons"
														aria-hidden="true"
													></i>
												</button>

												<ul
													id="subItems-241639890"
													class="collapse"
												>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/teatersamlingen/oversigt-over-teatersamlingen"
															class="nav-item level-4"
														>
															Oversigt over teatersamlingen
														</a>
													</li>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/teatersamlingen/knud-hegermann-lindencrones-baandarkiv"
															class="nav-item level-4"
														>
															Knud Hegermann-Lindencrones båndarkiv
														</a>
													</li>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/teatersamlingen/teatersamlingens-historie"
															class="nav-item level-4"
														>
															Teatersamlingens historie
														</a>
													</li>
												</ul>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/samlinger/nodesamlingen"
													class="nav-item level-3"
												>
													Nodesamlingen
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/samlinger/nationaldiskoteket"
													class="nav-item level-3"
												>
													Nationaldiskoteket
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/samlinger/lydoptagelser-i-samlingerne"
													class="nav-item level-3"
												>
													Lydoptagelser i samlingerne
												</a>

												<button
													class="icon-button"
													type="button"
													data-toggle="collapse"
													data-target="#subItems-1897981799"
													aria-expanded="false"
													aria-controls="subItems-1897981799"
													aria-label="Åbn eller luk underpunkter i navigationen"
												>
													<i
														class="material-icons"
														aria-hidden="true"
													></i>
												</button>

												<ul
													id="subItems-1897981799"
													class="collapse"
												>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/lydoptagelser-i-samlingerne/valser-i-ruben-samlingen"
															class="nav-item level-4"
														>
															Valser i Ruben-samlingen
														</a>
													</li>
												</ul>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/samlinger/folkemindesamlingen"
													class="nav-item level-3"
												>
													Folkemindesamlingen
												</a>

												<button
													class="icon-button"
													type="button"
													data-toggle="collapse"
													data-target="#subItems-1468182761"
													aria-expanded="false"
													aria-controls="subItems-1468182761"
													aria-label="Åbn eller luk underpunkter i navigationen"
												>
													<i
														class="material-icons"
														aria-hidden="true"
													></i>
												</button>

												<ul
													id="subItems-1468182761"
													class="collapse"
												>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/folkemindesamlingen/dansk-folkemindesamlings-historie"
															class="nav-item level-4"
														>
															Dansk Folkemindesamlings historie
														</a>
													</li>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/folkemindesamlingen/palsbos-visesamling"
															class="nav-item level-4"
														>
															Palsbos visesamling
														</a>
													</li>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/folkemindesamlingen/topografinumre"
															class="nav-item level-4"
														>
															Topografinumre
														</a>
													</li>
												</ul>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/samlinger/billedsamlingen"
													class="nav-item level-3"
												>
													Billedsamlingen
												</a>

												<button
													class="icon-button"
													type="button"
													data-toggle="collapse"
													data-target="#subItems-1075763929"
													aria-expanded="false"
													aria-controls="subItems-1075763929"
													aria-label="Åbn eller luk underpunkter i navigationen"
												>
													<i
														class="material-icons"
														aria-hidden="true"
													></i>
												</button>

												<ul
													id="subItems-1075763929"
													class="collapse"
												>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/billedsamlingen/oversigt-over-billedsamlingen"
															class="nav-item level-4"
														>
															Oversigt over billedsamlingen
														</a>
													</li>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/billedsamlingen/billedsamlingens-historie"
															class="nav-item level-4"
														>
															Billedsamlingens historie
														</a>
													</li>
												</ul>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/samlinger/computerspilsamlingen"
													class="nav-item level-3"
												>
													Computerspilsamlingen
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/samlinger/judaistisk-samling"
													class="nav-item level-3"
												>
													Judaistisk samling
												</a>

												<button
													class="icon-button"
													type="button"
													data-toggle="collapse"
													data-target="#subItems-1631423917"
													aria-expanded="false"
													aria-controls="subItems-1631423917"
													aria-label="Åbn eller luk underpunkter i navigationen"
												>
													<i
														class="material-icons"
														aria-hidden="true"
													></i>
												</button>

												<ul
													id="subItems-1631423917"
													class="collapse"
												>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/judaistisk-samling/samlingens-historie"
															class="nav-item level-4"
														>
															Samlingens historie
														</a>
													</li>
												</ul>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/samlinger/kortsamlingen"
													class="nav-item level-3"
												>
													Kortsamlingen
												</a>

												<button
													class="icon-button"
													type="button"
													data-toggle="collapse"
													data-target="#subItems-4451406"
													aria-expanded="false"
													aria-controls="subItems-4451406"
													aria-label="Åbn eller luk underpunkter i navigationen"
												>
													<i
														class="material-icons"
														aria-hidden="true"
													></i>
												</button>

												<ul
													id="subItems-4451406"
													class="collapse"
												>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/kortsamlingen/regionalkatalog-kortsamlingen-danmark"
															class="nav-item level-4"
														>
															Regionalkatalog for kortsamlingen - Danmark
														</a>
													</li>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/kortsamlingen/regionalkatalog-kortsamlingen-resten-af-verden"
															class="nav-item level-4"
														>
															Regionalkatalog for kortsamlingen - resten af verden
														</a>
													</li>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/kortsamlingen/oversigt-over-temaer"
															class="nav-item level-4"
														>
															Oversigt over temaer
														</a>
													</li>
												</ul>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/samlinger/netarkivet"
													class="nav-item level-3"
												>
													Netarkivet
												</a>

												<button
													class="icon-button"
													type="button"
													data-toggle="collapse"
													data-target="#subItems-1974499529"
													aria-expanded="false"
													aria-controls="subItems-1974499529"
													aria-label="Åbn eller luk underpunkter i navigationen"
												>
													<i
														class="material-icons"
														aria-hidden="true"
													></i>
												</button>

												<ul
													id="subItems-1974499529"
													class="collapse"
												>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/netarkivet/forskningsadgang"
															class="nav-item level-4"
														>
															Forskningsadgang
														</a>
													</li>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/netarkivet/samarbejde-om-webarkiver"
															class="nav-item level-4"
														>
															Samarbejde om webarkiver
														</a>
													</li>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/netarkivet/om-indsamling-af-internetmateriale"
															class="nav-item level-4"
														>
															Om indsamling af internetmateriale
														</a>
													</li>
												</ul>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/samlinger/orientalsk-samling"
													class="nav-item level-3"
												>
													Orientalsk samling
												</a>

												<button
													class="icon-button"
													type="button"
													data-toggle="collapse"
													data-target="#subItems-1499056878"
													aria-expanded="false"
													aria-controls="subItems-1499056878"
													aria-label="Åbn eller luk underpunkter i navigationen"
												>
													<i
														class="material-icons"
														aria-hidden="true"
													></i>
												</button>

												<ul
													id="subItems-1499056878"
													class="collapse"
												>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/orientalsk-samling/kataloger-over-orientalske-haandskrifter-i-danmark"
															class="nav-item level-4"
														>
															Kataloger over orientalske håndskrifter i Danmark
														</a>
													</li>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/orientalsk-samling/samlingens-historie"
															class="nav-item level-4"
														>
															Samlingens historie
														</a>
													</li>
												</ul>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/samlinger/radio-og-tv-samlingen"
													class="nav-item level-3"
												>
													Radio- og tv-samlingen
												</a>

												<button
													class="icon-button"
													type="button"
													data-toggle="collapse"
													data-target="#subItems-325687095"
													aria-expanded="false"
													aria-controls="subItems-325687095"
													aria-label="Åbn eller luk underpunkter i navigationen"
												>
													<i
														class="material-icons"
														aria-hidden="true"
													></i>
												</button>

												<ul
													id="subItems-325687095"
													class="collapse"
												>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/radio-og-tv-samlingen/radiokanaler"
															class="nav-item level-4"
														>
															Radiokanaler
														</a>
													</li>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/radio-og-tv-samlingen/tv-kanaler"
															class="nav-item level-4"
														>
															Tv-kanaler
														</a>
													</li>
												</ul>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/samlinger/reklamefilmsamlingen"
													class="nav-item level-3"
												>
													Reklamefilmsamlingen
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/samlinger/skolehistoriske-samlinger"
													class="nav-item level-3"
												>
													Skolehistoriske samlinger
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/samlinger/smaatryksamlingen"
													class="nav-item level-3"
												>
													Småtryksamlingen
												</a>

												<button
													class="icon-button"
													type="button"
													data-toggle="collapse"
													data-target="#subItems-1943791589"
													aria-expanded="false"
													aria-controls="subItems-1943791589"
													aria-label="Åbn eller luk underpunkter i navigationen"
												>
													<i
														class="material-icons"
														aria-hidden="true"
													></i>
												</button>

												<ul
													id="subItems-1943791589"
													class="collapse"
												>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/smaatryksamlingen/oversigt-over-digitale-smaatryk"
															class="nav-item level-4"
														>
															Oversigt over digitale småtryk
														</a>
													</li>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/smaatryksamlingen/smaatryksamlingens-historie"
															class="nav-item level-4"
														>
															Småtryksamlingens historie
														</a>
													</li>
												</ul>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/samlinger/avissamlingen"
													class="nav-item level-3"
												>
													Avissamlingen
												</a>

												<button
													class="icon-button"
													type="button"
													data-toggle="collapse"
													data-target="#subItems-126392066"
													aria-expanded="false"
													aria-controls="subItems-126392066"
													aria-label="Åbn eller luk underpunkter i navigationen"
												>
													<i
														class="material-icons"
														aria-hidden="true"
													></i>
												</button>

												<ul
													id="subItems-126392066"
													class="collapse"
												>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/avissamlingen/digitalisering-af-aviserne"
															class="nav-item level-4"
														>
															Digitalisering af aviserne
														</a>
													</li>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/avissamlingen/historien-om-statens-avissamling"
															class="nav-item level-4"
														>
															Historien om Statens Avissamling
														</a>
													</li>
													<li>
														<a
															href="https://www.kb.dk/find-materiale/samlinger/avissamlingen/lister"
															class="nav-item level-4"
														>
															Lister over aviser i samlingen
														</a>
													</li>
												</ul>
											</li>
											<li>
												<a
													href="https://www.kb.dk/find-materiale/samlinger/videosamlingen"
													class="nav-item level-3"
												>
													Videosamlingen
												</a>
											</li>
										</ul>
									</li>
								</ul>
							</li>
							<li>
								<router-link
									class="nav-item level-1"
									to="/inspiration"
								>
									Inspiration
								</router-link>
								<button
									class="icon-button"
									type="button"
									data-toggle="collapse"
									data-target="#subItems-646203777"
									aria-expanded="true"
									aria-controls="subItems-646203777"
									aria-label="Åbn eller luk underpunkter i navigationen"
								>
									<i
										class="material-icons"
										aria-hidden="true"
									></i>
								</button>

								<ul
									id="subItems-646203777"
									class="collapse show"
								>
									<li>
										<a
											href="https://www.kb.dk/inspiration/hoensefarmeren-fra-hoesterkoeb"
											class="nav-item level-2 current active"
											aria-current="page"
										>
											Hønsefarmeren fra Høsterkøb
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/inspiration/paaske"
											class="nav-item level-2"
										>
											Påske
										</a>

										<button
											class="icon-button"
											type="button"
											data-toggle="collapse"
											data-target="#subItems-1393377845"
											aria-expanded="false"
											aria-controls="subItems-1393377845"
											aria-label="Åbn eller luk underpunkter i navigationen"
										>
											<i
												class="material-icons"
												aria-hidden="true"
											></i>
										</button>

										<ul
											id="subItems-1393377845"
											class="collapse"
										>
											<li>
												<a
													href="https://www.kb.dk/inspiration/paaske/paaskefrokost"
													class="nav-item level-3"
												>
													Påskefrokost
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/paaske/paaskeaeggets-symbolik"
													class="nav-item level-3"
												>
													Påskeæggets symbolik
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/paaske/hvor-kommer-vores-paasketraditioner-fra"
													class="nav-item level-3"
												>
													Hvor kommer vores påsketraditioner fra?
												</a>
											</li>
										</ul>
									</li>
									<li>
										<a
											href="https://www.kb.dk/inspiration/kvinders-kamp-medborgerskab"
											class="nav-item level-2"
										>
											Kvinders kamp for medborgerskab
										</a>

										<button
											class="icon-button"
											type="button"
											data-toggle="collapse"
											data-target="#subItems-1625346345"
											aria-expanded="false"
											aria-controls="subItems-1625346345"
											aria-label="Åbn eller luk underpunkter i navigationen"
										>
											<i
												class="material-icons"
												aria-hidden="true"
											></i>
										</button>

										<ul
											id="subItems-1625346345"
											class="collapse"
										>
											<li>
												<a
													href="https://www.kb.dk/inspiration/kvinders-kamp-medborgerskab/danmarks-foerste-kvindeorganisation"
													class="nav-item level-3"
												>
													Danmarks første kvindeorganisation
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/kvinders-kamp-medborgerskab/politisk-medborgerskab"
													class="nav-item level-3"
												>
													Politisk medborgerskab
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/kvinders-kamp-medborgerskab/kampen-om-de-kvindelige-praester"
													class="nav-item level-3"
												>
													Kampen om de kvindelige præster
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/kvinders-kamp-medborgerskab/flere-kvinder-paa-rigsdagen-tak"
													class="nav-item level-3"
												>
													Flere kvinder på Rigsdagen, tak!
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/kvinders-kamp-medborgerskab/et-eget-kvindehus"
													class="nav-item level-3"
												>
													Et eget kvindehus
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/kvinders-kamp-medborgerskab/da-gifte-kvinder-blev-skatteborgere"
													class="nav-item level-3"
												>
													Da gifte kvinder blev skatteborgere
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/kvinders-kamp-medborgerskab/kvindepolitiske-milepaele"
													class="nav-item level-3"
												>
													Kvindepolitiske milepæle
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/kvinders-kamp-medborgerskab/hvis-du-vil-vide-mere"
													class="nav-item level-3"
												>
													Hvis du vil vide mere
												</a>
											</li>
										</ul>
									</li>
									<li>
										<a
											href="https://www.kb.dk/inspiration/digtoplaesninger-i-bibliotekshaven"
											class="nav-item level-2"
										>
											Digtoplæsninger i Bibliotekshaven
										</a>

										<button
											class="icon-button"
											type="button"
											data-toggle="collapse"
											data-target="#subItems-1711986491"
											aria-expanded="false"
											aria-controls="subItems-1711986491"
											aria-label="Åbn eller luk underpunkter i navigationen"
										>
											<i
												class="material-icons"
												aria-hidden="true"
											></i>
										</button>

										<ul
											id="subItems-1711986491"
											class="collapse"
										>
											<li>
												<a
													href="https://www.kb.dk/inspiration/digtoplaesninger-i-bibliotekshaven/digte-fra-bibliotekshaven-2021"
													class="nav-item level-3"
												>
													Digte fra Bibliotekshaven 2021
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/digtoplaesninger-i-bibliotekshaven/digte-fra-bibliotekshaven-2020"
													class="nav-item level-3"
												>
													Digte fra Bibliotekshaven 2020
												</a>
											</li>
										</ul>
									</li>
									<li>
										<a
											href="https://www.kb.dk/inspiration/fredag-den-13"
											class="nav-item level-2"
										>
											Fredag den 13.
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/inspiration/kom-med-bag-facaden"
											class="nav-item level-2"
										>
											Kom med bag facaden
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/inspiration/podcast-margrete-i"
											class="nav-item level-2"
										>
											Podcast - Margrete I
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/inspiration/racismens-roedder"
											class="nav-item level-2"
										>
											Racismens rødder
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/inspiration/karen-blixen-bag-om-forfatteren"
											class="nav-item level-2"
										>
											Karen Blixen - Bag om forfatteren
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/inspiration/copenhagen-2021"
											class="nav-item level-2"
										>
											Copenhagen 2021
										</a>

										<button
											class="icon-button"
											type="button"
											data-toggle="collapse"
											data-target="#subItems-1204969412"
											aria-expanded="false"
											aria-controls="subItems-1204969412"
											aria-label="Åbn eller luk underpunkter i navigationen"
										>
											<i
												class="material-icons"
												aria-hidden="true"
											></i>
										</button>

										<ul
											id="subItems-1204969412"
											class="collapse"
										>
											<li>
												<a
													href="https://www.kb.dk/inspiration/copenhagen-2021/christine-jorgensen"
													class="nav-item level-3"
												>
													Christine Jorgensen
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/copenhagen-2021/siri-von-essen-og-marie-caroline-david"
													class="nav-item level-3"
												>
													Siri von Essen og Marie Caroline David
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/copenhagen-2021/herman-bang"
													class="nav-item level-3"
												>
													Herman Bang
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/copenhagen-2021/doris-pollas"
													class="nav-item level-3"
												>
													Doris Pollas
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/copenhagen-2021/leonora-christina-skov"
													class="nav-item level-3"
												>
													Leonora Christina Skov
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/copenhagen-2021/boessernes-befrielses-front-og-lesbisk-bevaegelse"
													class="nav-item level-3"
												>
													Bøssernes Befrielses Front og Lesbisk Bevægelse
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/copenhagen-2021/et-aabent-oejeblik"
													class="nav-item level-3"
												>
													Et åbent øjeblik
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/copenhagen-2021/lgbti-materialer-paa-det-kgl-bibliotek"
													class="nav-item level-3"
												>
													LGBTI+ materialer på Det Kgl. Bibliotek
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/copenhagen-2021/baggrundshistorie"
													class="nav-item level-3"
												>
													Baggrundshistorie
												</a>
											</li>
										</ul>
									</li>
									<li>
										<a
											href="https://www.kb.dk/inspiration/det-kreative-bibliotek-derhjemme"
											class="nav-item level-2"
										>
											Det kreative bibliotek - derhjemme
										</a>

										<button
											class="icon-button"
											type="button"
											data-toggle="collapse"
											data-target="#subItems-1623703124"
											aria-expanded="false"
											aria-controls="subItems-1623703124"
											aria-label="Åbn eller luk underpunkter i navigationen"
										>
											<i
												class="material-icons"
												aria-hidden="true"
											></i>
										</button>

										<ul
											id="subItems-1623703124"
											class="collapse"
										>
											<li>
												<a
													href="https://www.kb.dk/inspiration/det-kreative-bibliotek-derhjemme/pimp-din-cykel"
													class="nav-item level-3"
												>
													Pimp din cykel
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/det-kreative-bibliotek-derhjemme/lav-din-egen-plantepresse"
													class="nav-item level-3"
												>
													Lav din egen plantepresse
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/det-kreative-bibliotek-derhjemme/lav-en-fugl-af-en-toiletrulle"
													class="nav-item level-3"
												>
													Lav en fugl af en toiletrulle
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/det-kreative-bibliotek-derhjemme/lav-en-sommerfugl-af-toejklemmer"
													class="nav-item level-3"
												>
													Lav en sommerfugl af tøjklemmer
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/det-kreative-bibliotek-derhjemme/lav-en-aakande"
													class="nav-item level-3"
												>
													Lav en åkande
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/det-kreative-bibliotek-derhjemme/lav-en-solopgang"
													class="nav-item level-3"
												>
													Lav en solopgang
												</a>
											</li>
										</ul>
									</li>
									<li>
										<a
											href="https://www.kb.dk/inspiration/mens-du-venter"
											class="nav-item level-2"
										>
											Mens du venter
										</a>

										<button
											class="icon-button"
											type="button"
											data-toggle="collapse"
											data-target="#subItems-1833422306"
											aria-expanded="false"
											aria-controls="subItems-1833422306"
											aria-label="Åbn eller luk underpunkter i navigationen"
										>
											<i
												class="material-icons"
												aria-hidden="true"
											></i>
										</button>

										<ul
											id="subItems-1833422306"
											class="collapse"
										>
											<li>
												<a
													href="https://www.kb.dk/inspiration/mens-du-venter/bliv-klogere-paa-vores-skatte"
													class="nav-item level-3"
												>
													Bliv klogere på vores skatte
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/mens-du-venter/bliv-klogere-paa-flere-af-vores-skatte"
													class="nav-item level-3"
												>
													Bliv klogere på flere af vores skatte
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/mens-du-venter/hjaelp-os-med-luftfotos"
													class="nav-item level-3"
												>
													Hjælp os med luftfotos
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/mens-du-venter/lyt-til-breve"
													class="nav-item level-3"
												>
													Lyt til breve
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/mens-du-venter/lyt-til-en-podcast"
													class="nav-item level-3"
												>
													Lyt til en podcast
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/mens-du-venter/laes-et-folkeeventyr"
													class="nav-item level-3"
												>
													Læs et folkeeventyr
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/mens-du-venter/laes-hc-andersens-dagbog"
													class="nav-item level-3"
												>
													Læs H.C. Andersens Dagbog
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/mens-du-venter/laes-i-vores-aviser"
													class="nav-item level-3"
												>
													Læs i vores aviser
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/mens-du-venter/paa-skolen-aabner-igen"
													class="nav-item level-3"
												>
													På at skolen åbner igen
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/mens-du-venter/se-hvordan-vi-saa-ud"
													class="nav-item level-3"
												>
													Se hvordan vi så ud
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/mens-du-venter/se-vores-billedalbum"
													class="nav-item level-3"
												>
													Se vores billedalbum
												</a>
											</li>
										</ul>
									</li>
									<li>
										<a
											href="https://www.kb.dk/inspiration/roedstroemper"
											class="nav-item level-2"
										>
											Rødstrømper
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/inspiration/trykkefrihedens-skrifter"
											class="nav-item level-2"
										>
											Trykkefrihedens skrifter
										</a>

										<button
											class="icon-button"
											type="button"
											data-toggle="collapse"
											data-target="#subItems-503820250"
											aria-expanded="false"
											aria-controls="subItems-503820250"
											aria-label="Åbn eller luk underpunkter i navigationen"
										>
											<i
												class="material-icons"
												aria-hidden="true"
											></i>
										</button>

										<ul
											id="subItems-503820250"
											class="collapse"
										>
											<li>
												<a
													href="https://www.kb.dk/inspiration/trykkefrihedens-skrifter/moed-bolle-willum-luxdorph-en-af-historiens-ukendte-helte"
													class="nav-item level-3"
												>
													Mød Bolle Willum Luxdorph - en af historiens ukendte helte
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/trykkefrihedens-skrifter/moed-christian-thurah-doemt-til-bo-paa-bornholm"
													class="nav-item level-3"
												>
													Mød Christian Thurah: Dømt til at bo på Bornholm
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/trykkefrihedens-skrifter/jacob-chr-bie-en-irriterende-type"
													class="nav-item level-3"
												>
													Jacob Chr. Bie - en irriterende type
												</a>
											</li>
										</ul>
									</li>
									<li>
										<a
											href="https://www.kb.dk/inspiration/bogfestival-paa-det-kgl-bibliotek"
											class="nav-item level-2"
										>
											Bogfestival på Det Kgl. Bibliotek
										</a>

										<button
											class="icon-button"
											type="button"
											data-toggle="collapse"
											data-target="#subItems-1192372795"
											aria-expanded="false"
											aria-controls="subItems-1192372795"
											aria-label="Åbn eller luk underpunkter i navigationen"
										>
											<i
												class="material-icons"
												aria-hidden="true"
											></i>
										</button>

										<ul
											id="subItems-1192372795"
											class="collapse"
										>
											<li>
												<a
													href="https://www.kb.dk/inspiration/bogfestival-paa-det-kgl-bibliotek/da-hc-andersen-soegte-job-paa-kongens-bibliotek"
													class="nav-item level-3"
												>
													Da H.C. Andersen søgte job på kongens bibliotek
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/bogfestival-paa-det-kgl-bibliotek/den-aeldste-trykte-bog-gutenbergbiblen"
													class="nav-item level-3"
												>
													Den ældste trykte bog - Gutenbergbiblen
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/bogfestival-paa-det-kgl-bibliotek/carl-og-anne-marie"
													class="nav-item level-3"
												>
													Carl og Anne Marie
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/bogfestival-paa-det-kgl-bibliotek/den-mindste-bog"
													class="nav-item level-3"
												>
													Den mindste bog
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/bogfestival-paa-det-kgl-bibliotek/den-stoerste-bog"
													class="nav-item level-3"
												>
													Den største bog
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/bogfestival-paa-det-kgl-bibliotek/inger-christensen-digteren-og-sommerfugledalen"
													class="nav-item level-3"
												>
													Inger Christensen - digteren og sommerfugledalen
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/bogfestival-paa-det-kgl-bibliotek/den-afrikanske-farm-blixens-selvbiografiske-vaerk"
													class="nav-item level-3"
												>
													Den afrikanske farm - Blixens selvbiografiske værk
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/bogfestival-paa-det-kgl-bibliotek/eventyrforfatteren-hc-andersen"
													class="nav-item level-3"
												>
													Eventyrforfatteren H.C. Andersen
												</a>
											</li>
										</ul>
									</li>
									<li>
										<a
											href="https://www.kb.dk/inspiration/genforeningen"
											class="nav-item level-2"
										>
											Genforeningen
										</a>

										<button
											class="icon-button"
											type="button"
											data-toggle="collapse"
											data-target="#subItems-1961608853"
											aria-expanded="false"
											aria-controls="subItems-1961608853"
											aria-label="Åbn eller luk underpunkter i navigationen"
										>
											<i
												class="material-icons"
												aria-hidden="true"
											></i>
										</button>

										<ul
											id="subItems-1961608853"
											class="collapse"
										>
											<li>
												<a
													href="https://www.kb.dk/inspiration/genforeningen/tidslinje"
													class="nav-item level-3"
												>
													Tidslinje
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/genforeningen/er-der-en-graense"
													class="nav-item level-3"
												>
													Er der en grænse?
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/genforeningen/introduktion"
													class="nav-item level-3"
												>
													Introduktion
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/genforeningen/kulturel-oprustning"
													class="nav-item level-3"
												>
													Kulturel oprustning
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/genforeningen/kvindekamp"
													class="nav-item level-3"
												>
													Kvindekamp
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/inspiration/genforeningen/skolen-og-boernene"
													class="nav-item level-3"
												>
													Skolen og børnene
												</a>
											</li>
										</ul>
									</li>
									<li>
										<a
											href="https://www.kb.dk/inspiration/en-ballademager-krydser-sine-spor"
											class="nav-item level-2"
										>
											En ballademager krydser sine spor
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/inspiration/saaledes-forandres-verden"
											class="nav-item level-2"
										>
											Således forandres verden
										</a>
									</li>
								</ul>
							</li>
							<li>
								<router-link
									class="nav-item level-1"
									to="/arrangementer"
								>
									Arrangementer
								</router-link>
								<button
									class="icon-button"
									type="button"
									data-toggle="collapse"
									data-target="#subItems-2036827437"
									aria-expanded="false"
									aria-controls="subItems-2036827437"
									aria-label="Åbn eller luk underpunkter i navigationen"
								>
									<i
										class="material-icons"
										aria-hidden="true"
									></i>
								</button>

								<ul
									id="subItems-2036827437"
									class="collapse"
								>
									<li>
										<a
											href="https://www.kb.dk/arrangementer/boern-og-deres-voksne"
											class="nav-item level-2"
										>
											Børn og deres voksne
										</a>

										<button
											class="icon-button"
											type="button"
											data-toggle="collapse"
											data-target="#subItems-1024082831"
											aria-expanded="false"
											aria-controls="subItems-1024082831"
											aria-label="Åbn eller luk underpunkter i navigationen"
										>
											<i
												class="material-icons"
												aria-hidden="true"
											></i>
										</button>

										<ul
											id="subItems-1024082831"
											class="collapse"
										>
											<li>
												<a
													href="https://www.kb.dk/arrangementer/boern-og-deres-voksne/den-hemmelige-have-paa-magtens-oe"
													class="nav-item level-3"
												>
													Den hemmelige have på magtens ø
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/arrangementer/boern-og-deres-voksne/den-store-diamantjagt"
													class="nav-item level-3"
												>
													Den Store Diamantjagt
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/arrangementer/boern-og-deres-voksne/skattejagt-i-udstillingen-skatte"
													class="nav-item level-3"
												>
													Skattejagt i udstillingen SKATTE
												</a>
											</li>
										</ul>
									</li>
									<li>
										<a
											href="https://www.kb.dk/arrangementer/finlandssvenske-kjell-westo-i-samtale-med-martin-glaz-serup"
											class="nav-item level-2"
										>
											Finlandssvenske Kjell Westö i samtale med Martin Glaz Serup
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/arrangementer/kind-cyan-fyraftenskoncert"
											class="nav-item level-2"
										>
											Kind of Cyan - Fyraftenskoncert
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/arrangementer/udstillinger"
											class="nav-item level-2"
										>
											Udstillinger
										</a>

										<button
											class="icon-button"
											type="button"
											data-toggle="collapse"
											data-target="#subItems-1602842652"
											aria-expanded="false"
											aria-controls="subItems-1602842652"
											aria-label="Åbn eller luk underpunkter i navigationen"
										>
											<i
												class="material-icons"
												aria-hidden="true"
											></i>
										</button>

										<ul
											id="subItems-1602842652"
											class="collapse"
										>
											<li>
												<a
													href="https://www.kb.dk/arrangementer/udstillinger/rum"
													class="nav-item level-3"
												>
													TO RUM
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/arrangementer/udstillinger/aarets-pressefoto-2021"
													class="nav-item level-3"
												>
													Årets Pressefoto 2021
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/arrangementer/udstillinger/displaced"
													class="nav-item level-3"
												>
													Displaced
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/arrangementer/udstillinger/kameraet-og-os-mennesket-i-fotografiet-1839-2021"
													class="nav-item level-3"
												>
													Kameraet og os - mennesket i fotografiet 1839-2021
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/arrangementer/udstillinger/last-folio"
													class="nav-item level-3"
												>
													Last Folio
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/arrangementer/udstillinger/lee-miller"
													class="nav-item level-3"
												>
													Lee Miller
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/arrangementer/udstillinger/skatte-i-det-kgl-bibliotek"
													class="nav-item level-3"
												>
													SKATTE i Det Kgl. Bibliotek
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/arrangementer/udstillinger/trine-soendergaard-works"
													class="nav-item level-3"
												>
													Trine Søndergaard: WORKS
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/arrangementer/udstillinger/tidligere-udstillinger"
													class="nav-item level-3"
												>
													Tidligere udstillinger
												</a>
											</li>
										</ul>
									</li>
									<li>
										<a
											href="https://www.kb.dk/arrangementer/serier"
											class="nav-item level-2"
										>
											Serier
										</a>

										<button
											class="icon-button"
											type="button"
											data-toggle="collapse"
											data-target="#subItems-567840862"
											aria-expanded="false"
											aria-controls="subItems-567840862"
											aria-label="Åbn eller luk underpunkter i navigationen"
										>
											<i
												class="material-icons"
												aria-hidden="true"
											></i>
										</button>

										<ul
											id="subItems-567840862"
											class="collapse"
										>
											<li>
												<a
													href="https://www.kb.dk/arrangementer/serier/bibliotekshaven-live"
													class="nav-item level-3"
												>
													Bibliotekshaven LIVE
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/arrangementer/serier/fredagsjazz-paa-havnefronten"
													class="nav-item level-3"
												>
													Fredagsjazz på havnefronten
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/arrangementer/serier/sommer-paa-pladsen"
													class="nav-item level-3"
												>
													Sommer på pladsen
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/arrangementer/serier/det-kreative-bibliotek"
													class="nav-item level-3"
												>
													Det kreative bibliotek
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/arrangementer/serier/fyraftenskoncerter"
													class="nav-item level-3"
												>
													Fyraftenskoncerter
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/arrangementer/serier/guld-fra-arkiverne"
													class="nav-item level-3"
												>
													Guld fra arkiverne
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/arrangementer/serier/international-forfatterscene"
													class="nav-item level-3"
												>
													International Forfatterscene
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/arrangementer/serier/international-fotoscene"
													class="nav-item level-3"
												>
													International Fotoscene
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/arrangementer/serier/musikkens-ansigter"
													class="nav-item level-3"
												>
													Musikkens ansigter
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/arrangementer/serier/strygekvartetter-i-diamanten"
													class="nav-item level-3"
												>
													Strygekvartetter i Diamanten
												</a>
											</li>
										</ul>
									</li>
									<li>
										<a
											href="https://www.kb.dk/arrangementer/diamantklubben"
											class="nav-item level-2"
										>
											Diamantklubben
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/arrangementer/students-only"
											class="nav-item level-2"
										>
											Students Only!
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/arrangementer/praktisk-information"
											class="nav-item level-2"
										>
											Praktisk information
										</a>
									</li>
								</ul>
							</li>
							<li>
								<router-link
									class="nav-item level-1"
									to="/services"
								>
									Services
								</router-link>
								<button
									class="icon-button"
									type="button"
									data-toggle="collapse"
									data-target="#subItems-22043484"
									aria-expanded="false"
									aria-controls="subItems-22043484"
									aria-label="Åbn eller luk underpunkter i navigationen"
								>
									<i
										class="material-icons"
										aria-hidden="true"
									></i>
								</button>

								<ul
									id="subItems-22043484"
									class="collapse"
								>
									<li>
										<a
											href="https://www.kb.dk/services/laan-og-aflevering"
											class="nav-item level-2"
										>
											Lån og aflevering
										</a>

										<button
											class="icon-button"
											type="button"
											data-toggle="collapse"
											data-target="#subItems-1318605775"
											aria-expanded="false"
											aria-controls="subItems-1318605775"
											aria-label="Åbn eller luk underpunkter i navigationen"
										>
											<i
												class="material-icons"
												aria-hidden="true"
											></i>
										</button>

										<ul
											id="subItems-1318605775"
											class="collapse"
										>
											<li>
												<a
													href="https://www.kb.dk/services/laan-og-aflevering/afhentning-og-aflevering"
													class="nav-item level-3"
												>
													Afhentning og aflevering
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/services/laan-og-aflevering/bliv-bruger"
													class="nav-item level-3"
												>
													Bliv bruger
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/services/laan-og-aflevering/brugerreglement"
													class="nav-item level-3"
												>
													Brugerreglement
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/services/laan-og-aflevering/ekspeditionstid"
													class="nav-item level-3"
												>
													Ekspeditionstid
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/services/laan-og-aflevering/find-dit-laanernummer"
													class="nav-item level-3"
												>
													Find dit lånernummer
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/services/laan-og-aflevering/fornyelse"
													class="nav-item level-3"
												>
													Fornyelse
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/services/laan-og-aflevering/forslag-til-indkoeb"
													class="nav-item level-3"
												>
													Forslag til indkøb
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/services/laan-og-aflevering/glemt-pinkode"
													class="nav-item level-3"
												>
													Glemt pinkode
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/services/laan-og-aflevering/hjemmeadgang"
													class="nav-item level-3"
												>
													Hjemmeadgang
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/services/laan-og-aflevering/laanetid-og-gebyrer"
													class="nav-item level-3"
												>
													Lånetid og gebyrer
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/services/laan-og-aflevering/mine-laan-og-reservationer"
													class="nav-item level-3"
												>
													Mine lån og reservationer
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/services/laan-og-aflevering/priser-fjernlaan"
													class="nav-item level-3"
												>
													Priser for fjernlån
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/services/laan-og-aflevering/vi-skaffer-det"
													class="nav-item level-3"
												>
													Vi skaffer det
												</a>
											</li>
										</ul>
									</li>
									<li>
										<a
											href="https://www.kb.dk/services/print-og-kopi"
											class="nav-item level-2"
										>
											Print og kopi
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/services/digitalisering"
											class="nav-item level-2"
										>
											Digitalisering
										</a>

										<button
											class="icon-button"
											type="button"
											data-toggle="collapse"
											data-target="#subItems-540295981"
											aria-expanded="false"
											aria-controls="subItems-540295981"
											aria-label="Åbn eller luk underpunkter i navigationen"
										>
											<i
												class="material-icons"
												aria-hidden="true"
											></i>
										</button>

										<ul
											id="subItems-540295981"
											class="collapse"
										>
											<li>
												<a
													href="https://www.kb.dk/services/digitalisering/fotos-boeger-breve-kort-mv"
													class="nav-item level-3"
												>
													Fotos, bøger, breve, kort med videre
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/services/digitalisering/affotografering-af-avisside"
													class="nav-item level-3"
												>
													Affotografering af avisside
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/services/digitalisering/musik-og-lydudgivelser-til-privat-brug"
													class="nav-item level-3"
												>
													Musik- og lydudgivelser til privat brug
												</a>
											</li>
										</ul>
									</li>
									<li>
										<a
											href="https://www.kb.dk/services/danske-boeger-demand"
											class="nav-item level-2"
										>
											Danske bøger on demand
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/services/rundvisninger"
											class="nav-item level-2"
										>
											Rundvisninger
										</a>
									</li>
								</ul>
							</li>
							<li>
								<router-link
									class="nav-item level-1"
									to="/besoeg-os"
								>
									Besøg os
								</router-link>
								<button
									class="icon-button"
									type="button"
									data-toggle="collapse"
									data-target="#subItems-1416194111"
									aria-expanded="false"
									aria-controls="subItems-1416194111"
									aria-label="Åbn eller luk underpunkter i navigationen"
								>
									<i
										class="material-icons"
										aria-hidden="true"
									></i>
								</button>

								<ul
									id="subItems-1416194111"
									class="collapse"
								>
									<li>
										<a
											href="https://www.kb.dk/besoeg-os/den-sorte-diamant"
											class="nav-item level-2"
										>
											Den Sorte Diamant
										</a>

										<button
											class="icon-button"
											type="button"
											data-toggle="collapse"
											data-target="#subItems-414418952"
											aria-expanded="false"
											aria-controls="subItems-414418952"
											aria-label="Åbn eller luk underpunkter i navigationen"
										>
											<i
												class="material-icons"
												aria-hidden="true"
											></i>
										</button>

										<ul
											id="subItems-414418952"
											class="collapse"
										>
											<li>
												<a
													href="https://www.kb.dk/besoeg-os/den-sorte-diamant/om-bygningen"
													class="nav-item level-3"
												>
													Om bygningen
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/besoeg-os/den-sorte-diamant/mad-og-drikke"
													class="nav-item level-3"
												>
													Mad og drikke
												</a>
											</li>
										</ul>
									</li>
									<li>
										<a
											href="https://www.kb.dk/besoeg-os/victor-albecks-vej"
											class="nav-item level-2"
										>
											Victor Albecks Vej
										</a>

										<button
											class="icon-button"
											type="button"
											data-toggle="collapse"
											data-target="#subItems-506917406"
											aria-expanded="false"
											aria-controls="subItems-506917406"
											aria-label="Åbn eller luk underpunkter i navigationen"
										>
											<i
												class="material-icons"
												aria-hidden="true"
											></i>
										</button>

										<ul
											id="subItems-506917406"
											class="collapse"
										>
											<li>
												<a
													href="https://www.kb.dk/besoeg-os/victor-albecks-vej/mad-og-drikke"
													class="nav-item level-3"
												>
													Mad og drikke
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/besoeg-os/victor-albecks-vej/om-bygningen"
													class="nav-item level-3"
												>
													Om bygningen
												</a>
											</li>
										</ul>
									</li>
									<li>
										<a
											href="https://www.kb.dk/besoeg-os/kunstbiblioteket"
											class="nav-item level-2"
										>
											Kunstbiblioteket
										</a>

										<button
											class="icon-button"
											type="button"
											data-toggle="collapse"
											data-target="#subItems-1165663387"
											aria-expanded="false"
											aria-controls="subItems-1165663387"
											aria-label="Åbn eller luk underpunkter i navigationen"
										>
											<i
												class="material-icons"
												aria-hidden="true"
											></i>
										</button>

										<ul
											id="subItems-1165663387"
											class="collapse"
										>
											<li>
												<a
													href="https://www.kb.dk/besoeg-os/kunstbiblioteket/om-bygningen-paa-charlottenborg"
													class="nav-item level-3"
												>
													Om bygningen på Charlottenborg
												</a>
											</li>
										</ul>
									</li>
									<li>
										<a
											href="https://www.kb.dk/besoeg-os/tangen"
											class="nav-item level-2"
										>
											Tangen
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/besoeg-os/koebenhavns-universitetsbibliotek"
											class="nav-item level-2"
										>
											Københavns Universitetsbibliotek
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/besoeg-os/au-library"
											class="nav-item level-2"
										>
											AU Library
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/besoeg-os/roskilde-universitetsbibliotek"
											class="nav-item level-2"
										>
											Roskilde Universitetsbibliotek
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/besoeg-os/it-universitetet-i-koebenhavn"
											class="nav-item level-2"
										>
											IT-Universitetet i København
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/besoeg-os/det-administrative-bibliotek"
											class="nav-item level-2"
										>
											Det Administrative Bibliotek
										</a>
									</li>
								</ul>
							</li>
							<li>
								<button
									id="mainSearchButton"
									type="button"
									class="d-none d-lg-inline-flex search-button"
									data-toggle="collapse"
									data-target="#mainSearch"
									aria-expanded="true"
									aria-controls="mainSearch"
									aria-label=""
								>
									<i
										class="material-icons"
										aria-hidden="true"
									>
										search
									</i>

									<span
										class="open-search"
										aria-hidden="true"
									>
										Søg
									</span>
									<span
										class="close-search"
										aria-hidden="true"
									>
										Luk
									</span>
								</button>
							</li>
						</ul>
						<div class="dropdown-edge d-inline-block d-lg-none"></div>
						<ul class="rdl-secondary-nav">
							<li>
								<a
									href="https://www.kb.dk/services/laan-og-aflevering"
									class="nav-item level-1"
								>
									Lån og aflevering
								</a>

								<button
									class="icon-button"
									type="button"
									data-toggle="collapse"
									data-target="#subItems-376870451"
									aria-expanded="false"
									aria-controls="subItems-376870451"
									aria-label="Åbn eller luk underpunkter i navigationen"
								>
									<i
										class="material-icons"
										aria-hidden="true"
									></i>
								</button>

								<ul
									id="subItems-376870451"
									class="collapse"
								>
									<li>
										<a
											href="https://www.kb.dk/services/laan-og-aflevering/afhentning-og-aflevering"
											class="nav-item level-2"
										>
											Afhentning og aflevering
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/services/laan-og-aflevering/bliv-bruger"
											class="nav-item level-2"
										>
											Bliv bruger
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/services/laan-og-aflevering/brugerreglement"
											class="nav-item level-2"
										>
											Brugerreglement
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/services/laan-og-aflevering/ekspeditionstid"
											class="nav-item level-2"
										>
											Ekspeditionstid
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/services/laan-og-aflevering/find-dit-laanernummer"
											class="nav-item level-2"
										>
											Find dit lånernummer
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/services/laan-og-aflevering/fornyelse"
											class="nav-item level-2"
										>
											Fornyelse
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/services/laan-og-aflevering/forslag-til-indkoeb"
											class="nav-item level-2"
										>
											Forslag til indkøb
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/services/laan-og-aflevering/glemt-pinkode"
											class="nav-item level-2"
										>
											Glemt pinkode
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/services/laan-og-aflevering/hjemmeadgang"
											class="nav-item level-2"
										>
											Hjemmeadgang
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/services/laan-og-aflevering/laanetid-og-gebyrer"
											class="nav-item level-2"
										>
											Lånetid og gebyrer
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/services/laan-og-aflevering/mine-laan-og-reservationer"
											class="nav-item level-2"
										>
											Mine lån og reservationer
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/services/laan-og-aflevering/priser-fjernlaan"
											class="nav-item level-2"
										>
											Priser for fjernlån
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/services/laan-og-aflevering/vi-skaffer-det"
											class="nav-item level-2"
										>
											Vi skaffer det
										</a>
									</li>
								</ul>
							</li>
							<li>
								<a
									href="https://www.kb.dk/bliv-bruger"
									class="nav-item level-1"
								>
									Bliv bruger
								</a>
							</li>
							<li>
								<a
									href="https://www.kb.dk/om-os"
									class="nav-item level-1"
								>
									Om os
								</a>

								<button
									class="icon-button"
									type="button"
									data-toggle="collapse"
									data-target="#subItems-916971251"
									aria-expanded="false"
									aria-controls="subItems-916971251"
									aria-label="Åbn eller luk underpunkter i navigationen"
								>
									<i
										class="material-icons"
										aria-hidden="true"
									></i>
								</button>

								<ul
									id="subItems-916971251"
									class="collapse"
								>
									<li>
										<a
											href="https://www.kb.dk/om-os/kontakt"
											class="nav-item level-2"
										>
											Kontakt
										</a>

										<button
											class="icon-button"
											type="button"
											data-toggle="collapse"
											data-target="#subItems-2111218714"
											aria-expanded="false"
											aria-controls="subItems-2111218714"
											aria-label="Åbn eller luk underpunkter i navigationen"
										>
											<i
												class="material-icons"
												aria-hidden="true"
											></i>
										</button>

										<ul
											id="subItems-2111218714"
											class="collapse"
										>
											<li>
												<a
													href="https://www.kb.dk/om-os/kontakt/fakturering"
													class="nav-item level-3"
												>
													Fakturering
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/om-os/kontakt/gaver-og-donationer"
													class="nav-item level-3"
												>
													Gaver og donationer
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/om-os/kontakt/legater"
													class="nav-item level-3"
												>
													Legater
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/om-os/kontakt/udbud"
													class="nav-item level-3"
												>
													Udbud
												</a>
											</li>
										</ul>
									</li>
									<li>
										<a
											href="https://www.kb.dk/om-os/foelg-os"
											class="nav-item level-2"
										>
											Følg os
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/om-os/job-og-karriere"
											class="nav-item level-2"
										>
											Job og karriere
										</a>

										<button
											class="icon-button"
											type="button"
											data-toggle="collapse"
											data-target="#subItems-1157123385"
											aria-expanded="false"
											aria-controls="subItems-1157123385"
											aria-label="Åbn eller luk underpunkter i navigationen"
										>
											<i
												class="material-icons"
												aria-hidden="true"
											></i>
										</button>

										<ul
											id="subItems-1157123385"
											class="collapse"
										>
											<li>
												<a
													href="https://www.kb.dk/om-os/job-og-karriere/biblioteket-som-arbejdsplads"
													class="nav-item level-3"
												>
													Biblioteket som arbejdsplads
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/om-os/job-og-karriere/ledige-stillinger"
													class="nav-item level-3"
												>
													Ledige stillinger
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/om-os/job-og-karriere/studiejob-elevuddannelse-og-praktik"
													class="nav-item level-3"
												>
													Studiejob, elevuddannelse og praktik
												</a>
											</li>
										</ul>
									</li>
									<li>
										<a
											href="https://www.kb.dk/om-os/presse"
											class="nav-item level-2"
										>
											Presse
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/om-os/opgaver-og-maal"
											class="nav-item level-2"
										>
											Opgaver og mål
										</a>

										<button
											class="icon-button"
											type="button"
											data-toggle="collapse"
											data-target="#subItems-1985411772"
											aria-expanded="false"
											aria-controls="subItems-1985411772"
											aria-label="Åbn eller luk underpunkter i navigationen"
										>
											<i
												class="material-icons"
												aria-hidden="true"
											></i>
										</button>

										<ul
											id="subItems-1985411772"
											class="collapse"
										>
											<li>
												<a
													href="https://www.kb.dk/om-os/opgaver-og-maal/rammeaftale"
													class="nav-item level-3"
												>
													Rammeaftale
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/om-os/opgaver-og-maal/strategi"
													class="nav-item level-3"
												>
													Strategi
												</a>
											</li>
											<li>
												<a
													href="https://www.kb.dk/om-os/opgaver-og-maal/aarsrapporter"
													class="nav-item level-3"
												>
													Årsrapporter
												</a>
											</li>
										</ul>
									</li>
									<li>
										<a
											href="https://www.kb.dk/om-os/organisation"
											class="nav-item level-2"
										>
											Organisation
										</a>

										<button
											class="icon-button"
											type="button"
											data-toggle="collapse"
											data-target="#subItems-2036738805"
											aria-expanded="false"
											aria-controls="subItems-2036738805"
											aria-label="Åbn eller luk underpunkter i navigationen"
										>
											<i
												class="material-icons"
												aria-hidden="true"
											></i>
										</button>

										<ul
											id="subItems-2036738805"
											class="collapse"
										>
											<li>
												<a
													href="https://www.kb.dk/om-os/organisation/direktion"
													class="nav-item level-3"
												>
													Direktion
												</a>

												<button
													class="icon-button"
													type="button"
													data-toggle="collapse"
													data-target="#subItems-1790352254"
													aria-expanded="false"
													aria-controls="subItems-1790352254"
													aria-label="Åbn eller luk underpunkter i navigationen"
												>
													<i
														class="material-icons"
														aria-hidden="true"
													></i>
												</button>

												<ul
													id="subItems-1790352254"
													class="collapse"
												>
													<li>
														<a
															href="https://www.kb.dk/om-os/organisation/direktion/svend-larsen"
															class="nav-item level-4"
														>
															Svend Larsen
														</a>
													</li>
													<li>
														<a
															href="https://www.kb.dk/om-os/organisation/direktion/cecile-anne-christensen"
															class="nav-item level-4"
														>
															Cecile Anne Christensen
														</a>
													</li>
													<li>
														<a
															href="https://www.kb.dk/om-os/organisation/direktion/kira-stine-hansen"
															class="nav-item level-4"
														>
															Kira Stine Hansen
														</a>
													</li>
													<li>
														<a
															href="https://www.kb.dk/om-os/organisation/direktion/line-renate-hanssen"
															class="nav-item level-4"
														>
															Line Renate Hanssen
														</a>
													</li>
													<li>
														<a
															href="https://www.kb.dk/om-os/organisation/direktion/mette-mejlvang"
															class="nav-item level-4"
														>
															Mette Mejlvang
														</a>
													</li>
													<li>
														<a
															href="https://www.kb.dk/om-os/organisation/direktion/tonny-skovgaard-jensen"
															class="nav-item level-4"
														>
															Tonny Skovgård Jensen
														</a>
													</li>
												</ul>
											</li>
										</ul>
									</li>
									<li>
										<a
											href="https://www.kb.dk/om-os/partnerskaber-og-stoette"
											class="nav-item level-2"
										>
											Partnerskaber og støtte
										</a>

										<button
											class="icon-button"
											type="button"
											data-toggle="collapse"
											data-target="#subItems-118883630"
											aria-expanded="false"
											aria-controls="subItems-118883630"
											aria-label="Åbn eller luk underpunkter i navigationen"
										>
											<i
												class="material-icons"
												aria-hidden="true"
											></i>
										</button>

										<ul
											id="subItems-118883630"
											class="collapse"
										>
											<li>
												<a
													href="https://www.kb.dk/om-os/partnerskaber-og-stoette/stoet-det-kgl-bibliotek"
													class="nav-item level-3"
												>
													Støt Det Kgl. Bibliotek
												</a>
											</li>
										</ul>
									</li>
									<li>
										<a
											href="https://www.kb.dk/om-os/bibliotekets-tidslinje"
											class="nav-item level-2"
										>
											Bibliotekets tidslinje
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/om-os/digital-pligtaflevering"
											class="nav-item level-2"
										>
											Digital pligtaflevering
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/om-os/forskning"
											class="nav-item level-2"
										>
											Forskning
										</a>
									</li>
									<li>
										<a
											href="https://www.kb.dk/om-os/whistleblowerordning-det-kgl-bibliotek"
											class="nav-item level-2"
										>
											Whistleblowerordning for Det Kgl. Bibliotek
										</a>
									</li>
								</ul>
							</li>
							<li>
								<a
									href="https://www.kb.dk/aabningstider"
									class="nav-item level-1"
								>
									Åbningstider
								</a>
							</li>
							<li>
								<a
									href="https://www.kb.dk/en/inspiration/chicken-farmer-hosterkob"
									class="nav-item level-1"
									hreflang="en"
									lang="en"
								>
									In English
								</a>
							</li>
							<li>
								<a
									href="https://soeg.kb.dk/discovery/account?vid=45KBDK_KGL%3AKGL&amp;section=overview&amp;lang=da"
									class="nav-item level-1 login"
								>
									Login
									<i
										class="material-icons d-none d-lg-inline"
										aria-hidden="true"
									>
										account_circle
									</i>
								</a>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</div>
		<div class="header-edge d-none d-lg-inline-block"></div>
	</header>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import SearchBar from '../search/SearchBar.vue';
export default defineComponent({
	name: 'Header',
	components: { SearchBar },
});
</script>
<style lang=""></style>
