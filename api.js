import axios from "axios";
import fs from "fs";

const fewFarApi = axios.create({
	baseURL: "https://www.few-far.co/api/techtest/v1",
});

function fetchSupporters() {
	return fewFarApi
		.get("/supporters")
		.then((res) => {
			return res.data.data;
		})
		.catch((err) => console.log(err));
}

const supporters = await fetchSupporters();

// console.log(supporters, "<-- supporters");

const supporterIds = supporters.map((supporter) => {
	return { id: supporter.id, donationSum: 0 };
});

const donations = [];

// let pageNum = 1;

// function fetchPaginatedDonations() {
// 	// console.log(pageNum);
// 	return fewFarApi
// 		.get(`/donations?page=${pageNum}`)
// 		.then((res) => {
// 			donations.push(res.data.data);
// 			if (res.data.has_more) {
// 				pageNum++;
// 				fetchPaginatedDonations(pageNum);
// 			} else {
// 				pageNum = 1;
// 			}
// 			return res.data.data;
// 		})
// 		.catch((err) => console.log(err));
// }

// await fetchPaginatedDonations();

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

let reportId = "";

function requestDonationsReport() {
	return fewFarApi
		.post("/donations_exports")
		.then((res) => {
			console.log(res.data);
			reportId = res.data.id;
			return res.data;
		})
		.catch((err) => console.log(err));
}

function fetchDonationsReport() {
	return fewFarApi
		.get(`/donations_exports/${reportId}`)
		.then((res) => {
			donations.push(res.data.data);
			return res.data;
		})
		.catch((err) => console.log(err));
}

requestDonationsReport();
await sleep(15000);
await fetchDonationsReport();

// console.log(donations[0], "<-- Donations");

supporterIds.forEach((supporter) => {
	donations[0].forEach((donation) => {
		if (supporter.id === donation.supporter_id) {
			supporter.donationSum += donation.amount;
		}
	});
	return supporterIds;
});

console.log(supporterIds, "<-- IDs & donations");

fs.writeFile(
	"result.json",

	JSON.stringify(supporterIds),

	function (err) {
		if (err) {
			console.error("Sorry, something went wrong, please try again!");
		}
	}
);
