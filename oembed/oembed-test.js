/* global describe, it */

"use strict";

require("babel-core/register");

const regexes = require("./regexes");

global.fetch = require("node-fetch");
global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const mockery = require("mockery");

mockery.enable({
	warnOnReplace: false,
	warnOnUnregistered: false
});
mockery.registerMock("react-native", require("../mocks/react-native"));

const oembed = require("./oembed");
const assert = require("assert");

describe("oembed", function() {
	this.timeout(50000);

	it("should return oembed data", () => {
		return oembed.get("https://www.youtube.com/watch?v=uVdV-lxRPFo")
		.then(data => {
			assert.equal(data.type, "video");
			assert.equal(data.title, "Captain America: Civil War - Trailer World Premiere");
			assert.equal(data.thumbnail_url, "https://i.ytimg.com/vi/uVdV-lxRPFo/hqdefault.jpg");
			assert.equal(data.thumbnail_height, 360);
			assert.equal(data.thumbnail_width, 480);
		});
	});

	it("should return opengraph data", () => {
		return oembed.get("http://on.aol.com/video/officials-fox-lake-officer-s-death-a-suicide-519216799?context=PC:homepage:PL1944:1446706878971")
		.then(data => {
			assert.equal(data.type, "video");
			assert.equal(data.title, "Officials: Fox Lake Officer&#x27;s Death a Suicide");
			assert.equal(data.thumbnail_url, "http://feedapi.b2c.on.aol.com/v1.0/app/videos/aolon/519216799/images/470x264.jpg?region=US");
			assert.equal(data.thumbnail_height, 264);
			assert.equal(data.thumbnail_width, 470);
		});
	});

	it("should return meta data", () => {
		return oembed.get("http://www.w3schools.com/")
		.then(data => {
			assert.equal(data.title, "W3Schools Online Web Tutorials");
		});
	});

	it("should return image data", () => {
		return oembed.get("http://1.images.comedycentral.com/images/shows/GetSpooked/getspooked_thumbnail.jpg?width=640&height=360&crop=true")
		.then(data => {
			assert.equal(data.type, "image");
			assert.equal(data.thumbnail_url, "http://1.images.comedycentral.com/images/shows/GetSpooked/getspooked_thumbnail.jpg?width=640&height=360&crop=true");
		});
	});

	it("should return correct data", () => {
		return oembed.get("http://www.deccanherald.com/content/514998/bjp-mps-asked-avoid-making.html")
		.then(data => {
			assert.equal(data.type, "article");
			assert.equal(data.thumbnail_url, "http://www.deccanherald.com/page_images/original/2015/12/01/514998.jpg");
			assert.equal(data.title, "BJP MPs asked to avoid making provocative statements");
			assert.equal(data.description, "BJP MPs were today asked to avoid making provocative statements amid the debate in Parliament over the issue of intolerance where controversial comments by some party leaders, including ministers, have come in handy for the opposition in its attack on the government.");
		});
	});

	it("should return correct data", () => {
		return oembed.get("http://www.storypick.com/mark-priscilla-max/")
		.then(data => {
			assert.equal(data.type, "article");
			assert.equal(data.thumbnail_url, "http://www.storypick.com/wp-content/uploads/2015/12/mark-priscilla-cover.jpg");
			assert.equal(data.title, "Mark Zuckerberg Just Became Dad Of A Baby Girl, Pledges To Donate 99% Of Facebook Shares.");
			assert.equal(data.description, "Congratulations, Mark and Priscilla!");
		});
	});

	it("should return correct data", () => {
		return oembed.get("http://9gag.com/gag/aNK6m3b")
		.then(data => {
			assert.equal(data.type, "article");
			assert.equal(data.thumbnail_url, "http://images-cdn.9gag.com/photo/aNK6m3b_700b.jpg");
			assert.equal(data.title, "I am a film student. This was a question on my sound recording test.");
			assert.equal(data.description, "Click to see the pic and write a comment...");
		});
	});

	it("should return correct data", () => {
		return oembed.get("https://twitter.com/HackerEarth/status/671949412956901376")
		.then(data => {
			assert.equal(data.type, "rich");
		});
	});

	it("should return correct data", () => {
		return oembed.get("http://timesofindia.indiatimes.com/city/chennai/Chennai-Floods-City-reels-even-as-more-rain-predicted-airport-closed-trains-canceled/articleshow/50008799.cms")
		.then(data => {
			assert.equal(data.type, "article");
			assert.equal(data.thumbnail_url, "http://timesofindia.indiatimes.com/photo/50008874.cms");
			assert.equal(data.title, "Chennai Floods: City reels even as more rain predicted; airport closed, trains canceled - The Times of India");
			assert.equal(data.description, "Chennai is at a standstill because of floods caused by the worst rains in a 100 years. The airport has been closed and trains canceled. But things could get worse, with the Met Department predicting more rain for northern Tamil Nadu in coming days.");
		});
	});

	it("should return correct data", () => {
		return oembed.get("http://www.collegehumor.com/post/7034949/what-the-world-looks-like-when-youre-hungry?ref=homepage")
		.then(data => {
			assert.equal(data.type, "article");
			assert.equal(data.thumbnail_url, "http://2.media.collegehumor.cvcdn.com/31/46/dfaed81e7bce3deebb492bc6a070e5bd.jpg");
			assert.equal(data.title, "7 Ways The World Changes When You&#039;re Hungry");
			assert.equal(data.description, "Everything looks a lot more delicious when you&#039;re hungry.");
		});
	});

	it("should return correct data", () => {
		return oembed.get("http://www.scoopwhoop.com/news/spirit-of-chennai-come-rain-or-floods-this-woman-will-continue-to-do-her-job/")
		.then(data => {
			assert.equal(data.type, "article");
			assert.equal(data.thumbnail_url, "http://s3.scoopwhoop.com/anj/636386272.jpg");
			assert.equal(data.title, "Radha Has Been Delivering Milk For 25 Years & Even The Chennai Floods Couldn’t Stop Her");
			assert.equal(data.description, "Against all odds");
		});
	});

});


describe("oembed: regexes", () => {
	const link = regexes.link;
	const meta = regexes.propertyRegex("type");
	const cont = regexes.content;

	it("testing link regex : ", () => {
		const test1 = "<link>".match(link);
		const test2 = "<link type='application/json+oembed'".match(link);
		const test3 = "<link something type='application/json+oembed'>".match(link);
		const test4 = "<link something type='application/json+oembed' something>".match(link);

		assert(test1 === null, "the value should be null");
		assert(test2 === null, "the value should be null");
		assert(test3 !== null, "the value should not be null");
		assert(test4 !== null, "the value should not be null");
	});
	it("testing link and href regex : ", () => {
		const href = regexes.matchHTTP;
		const test1 = "<link href='http://manoj' type='application/json+oembed'>".match(link)[0].match(href);
		const test2 = "<link type='application/json+oembed' href='https://manoj' >".match(link)[0].match(href);
		const test3 = "<link something type='application/json+oembed'>".match(link)[0].match(href);

		assert(test1 !== null, "the value should not be null test1");
		assert(test2 !== null, "the value should not be null test2");
		assert(test3 === null, "the value should be null");
	});
	it("testing meta regex : ", () => {
		const test1 = "<meta>".match(meta);
		const test2 = "<meta property='og:time'>".match(meta);
		const test3 = "<meta manoj property='og:type' content='some'>".match(meta);

		assert(test1 === null, "the value of the test1 should be null");
		assert(test2 === null, "the value of the test2 should be null");
		assert(test3 !== null, "the value of the test3 should not be null");
	});
	it("testing meta with content regex : ", () => {
		const test1 = "<meta manoj property='og:type' content='some'>".match(meta)[0].match(cont);
		const test2 = "<meta content='some'manoj property='og:type'>".match(meta)[0].match(cont);

		assert(test1 !== null, "the value of test1 should not be null");
		assert(test2 !== null, "the value of test2 should not be null");
	});
});
