// usage: node uploadViz.js directoryWhereVizIsStored urlOfVizOnVizHub
// requires that api key is saved as the environment variable VIZHUB_API_KEY

const AdmZip = require("adm-zip");
const https = require("https");

require("dotenv").config();

function main() {
  const directory = process.argv[2];
  const zip = new AdmZip();
  zip.addLocalFolder(directory);

  const zipAsBuffer = zip.toBuffer()

  const vizPageURL = process.argv[3];

  console.log(`Processing ${vizPageURL}...`);
  const parts = vizPageURL.split("/");
  if (parts.length < 2) {
    console.warn(`Skipping invalid URL (not enough parts): ${vizPageURL}`);
  }
  const user = parts[parts.length - 2];
  const slug = parts[parts.length - 1];

  if (!user || !slug) {
    console.warn(
      `Skipping invalid URL (could not parse user/slug): ${vizPageURL}`
    );
  }

  const formData = new FormData()
  formData.append("file", new Blob([ zipAsBuffer]))

  fetch(`https://vizhub.com/api/set-viz/${user}/${slug}`, {
    method: "POST",

    headers: { Authorization: `${process.env["VIZHUB_API_KEY"]}` },
    body: formData
  }).then((response) => response.json().then((output) => console.log(output)));
}

main();
