// console.log("web scraping")

const axios = require("axios");
const fs = require("fs");
const cheerio = require("cheerio");
const { log } = require("console");

const getData = async () => {
  const response = await axios.get(
    "https://internshala.com/jobs/software-development-jobs-in-bangalore/",
    {
      Headers: {
        "Content-Type": "text/html",
      },
    }
  );
  const data = response.data;
  fs.writeFileSync("data.json", data);
  // console.log("File successfully")
};
getData();

const html = fs.readFileSync("data.json");
const $ = cheerio.load(html.toString());
// console.log($);

const jobTitle = $(".job-internship-name");
const jobTitleData = [];
jobTitle.each((index, element) => {
  jobTitleData.push($(element).text().trim());
});
// console.log(jobTitleData);

const companyName = $(".company-name");
const companyNameData = [];
companyName.each((index, element) => {
  companyNameData.push($(element).text().trim());
});
// console.log(companyNameData);

const location = $(".row-1-item.locations span a");
const locationData = [];
location.each((index, element) => {
  locationData.push($(element).text());
});
// console.log(locationData);

const posted = $(".status-success span");
const postedData = [];
posted.each((index, element) => {
  postedData.push($(element).text());
});
// console.log(postedData);

const details = [];
jobTitleData.map((item, index) => {
  details.push({
    title: item,
    companyName: companyNameData[index],
    location: locationData[index],
    posted: postedData[index],
  });
});

// console.log(details);
fs.writeFileSync("information.json", JSON.stringify(details));

const xlsx = require("xlsx");
const workbook = xlsx.utils.book_new();
const sheetdata = xlsx.utils.json_to_sheet(details);
xlsx.utils.book_append_sheet(workbook, sheetdata, "Jobs");
xlsx.writeFile(workbook, "jobs.xlsx");
console.log("Sheet created successfully");

