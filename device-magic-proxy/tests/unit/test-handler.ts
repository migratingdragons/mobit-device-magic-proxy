import fs from "fs";
import axios from "axios";
import { expect } from "chai";
import sinon from "sinon";
import { lambdaHandler } from "../../app";
import { Event, Context } from "../../types";

describe("Device Magic Proxy Tests", () => {
    let axiosPostStub: sinon.SinonStub;
    let fsReadFileSync: sinon.SinonStub;

    beforeEach(() => {
        axiosPostStub = sinon.stub(axios, "post");
        fsReadFileSync = sinon.stub(fs, "readFileSync").returns(
            JSON.stringify([
                {
                    name: "Installers Check Sheet",
                    form_namespace:
                        "http://www.devicemagic.com/xforms/68c66b50-e67d-0136-94d2-0a7ff68e9068",
                    destination_url: "https://destination.com/location",
                },
            ])
        );
    });

    afterEach(() => {
        axiosPostStub.restore();
        fsReadFileSync.restore();
    });

    it("verifies successful response", async () => {
        const event: Event = {
            body: JSON.stringify({
                metadata: {
                    form_namespace:
                        "http://www.devicemagic.com/xforms/68c66b50-e67d-0136-94d2-0a7ff68e9068",
                    submission_id: "12345",
                },
            }),
        } as Event;

        axiosPostStub.resolves({ status: 200 });

        const result = await lambdaHandler(event, {} as Context);

        expect(result).to.be.an("object");
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.a("string");

        const response = JSON.parse(result.body);
        expect(response).to.be.an("object");
        expect(response.message).to.equal("Request processed successfully");

        sinon.assert.calledOnce(axiosPostStub);
    });

    it("handles errors gracefully", async () => {
        const event: Event = {
            body: JSON.stringify({
                metadata: {
                    form_namespace: "http://www.devicemagic.com/xforms/non-existent",
                    submission_id: "12345",
                },
            }),
        } as Event;

        const result = await lambdaHandler(event, {} as Context);

        expect(result).to.be.an("object");
        expect(result.statusCode).to.equal(500);
        expect(result.body).to.be.a("string");

        const response = JSON.parse(result.body);
        expect(response).to.be.an("object");
        expect(response.error).to.equal("Internal server error");
    });
});