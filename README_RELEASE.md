# Release to internal nexus repository.

## Make the release

<ol>
  <li>Change the <version>1.0.0</version> in the pom.xml to the next version (1.0.1 etc.). It must not be a SNAPSHOT version.</li>
  <li>Open URL: https://sbprojects.statsbiblioteket.dk/nexus/#view-repositories;releases~browsestorage
  <li>Select "Artifact upload"</li>
  <li>For GAV definition select 'From POM'</li>
  <li>Click "Select POM" to upload and pick the pom.xml in the ds-web project.</li>
  <li>Click Artifacts to upload. Select the tar.gz file. Type "tar.gz" in extension text. Press  'Add artifact'.</li>
  <li>Click 'Upload artifact(s)'</li>
  <li>Commit the pom.xml </li>
</ol>

## Download the release
The release can now be downloaded from: https://sbprojects.statsbiblioteket.dk/nexus/service/local/repositories/releases/content/dk/kb/dsweb/ds-web/1.0/ds-web-1.0.tar.gz

(change version  in path and filename)

## Delete a release
In case of error you can delete a release from the repository select the release folder (1.0.0) etc. and right click and 'Delete' (to the right).
