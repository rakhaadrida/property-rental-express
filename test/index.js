const chai = require("chai");
const chaiHttp = require("chai-http");
const fs = require("fs");

chai.use(chaiHttp);
const expect = chai.expect;

const app = require("../app");

describe("API Testing", () => {
    it(`GET Index Property`, (done) => {
        chai.request(app)
            .get("/api/properties")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("Object");
                done();
            });
    });

    it(`GET Detail Property`, (done) => {
        chai.request(app)
            .get("/api/property/6a561e81f0731c0037f99bef")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("Object");
                expect(res.body).to.have.property("data");
                expect(res.body.data).to.have.property("name");
                expect(res.body.data).to.have.property("country");
                expect(res.body.data).to.have.property("city");
                expect(res.body.data).to.have.property("description");
                expect(res.body.data).to.have.property("propertyImageIds");
                expect(res.body.data.propertyImageIds).to.have.an("array");
                expect(res.body.data).to.have.property("activityIds");
                expect(res.body.data.activityIds).to.have.an("array");
                done();
            });
    });

    it(`POST Booking`, (done) => {
        const image = __dirname + "/bukti.jpeg";
        const dataSample = {
            image,
            startDate: "2026-07-20",
            endDate: "2026-07-22",
            propertyId: "6a58bfb2e4a1816ed35d8aee",
            duration: 2,
            firstName: "Rakha",
            lastName: "Adrida",
            email: "rakha@gmail.com",
            phoneNumber: "08123456789",
            sourceBank: "BCA",
            sourceBankHolder: "Rakha",
        };
        chai.request(app)
            .post("/api/booking")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .field("startDate", dataSample.startDate)
            .field("endDate", dataSample.endDate)
            .field("propertyId", dataSample.propertyId)
            .field("firstName", dataSample.firstName)
            .field("lastName", dataSample.lastName)
            .field("email", dataSample.email)
            .field("phoneNumber", dataSample.phoneNumber)
            .field("sourceBank", dataSample.sourceBank)
            .field("sourceBankHolder", dataSample.sourceBankHolder)
            .field("duration", dataSample.duration)
            .attach("image", fs.readFileSync(dataSample.image), "bukti.jpeg")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("Object");
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("Booking Successfull");
                expect(res.body).to.have.property("data");
                expect(res.body.data).to.have.all.keys(
                    "_id",
                    "__v",
                    "startDate",
                    "endDate",
                    "invoice",
                    "total",
                    "customerId",
                    "payment",
                    "propertyId",
                );
                expect(res.body.data.payment).to.have.all.keys(
                    "proofOfPayment",
                    "sourceBank",
                    "sourceBankHolder",
                    "status",
                );
                expect(res.body.data.propertyId).to.have.all.keys(
                    "_id",
                    "name",
                    "price",
                    "duration",
                );
                done();
            });
    });
});
