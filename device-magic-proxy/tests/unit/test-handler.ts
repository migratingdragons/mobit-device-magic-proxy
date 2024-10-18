import fs from "fs";
import axios from "axios";
import { expect } from "chai";
import sinon from "sinon";
import { lambdaHandler } from "../../app";
import { Event, Context } from "../../types";

describe("Device Magic Proxy Tests", () => {
    let axiosPostStub: sinon.SinonStub;
    let fsReadFileSync: sinon.SinonStub;
    let consoleLogStub: sinon.SinonStub;
    let consoleErrorStub: sinon.SinonStub;

    const testConfig = [
        {
            name: "UPOWA 6.Audit Form",
            form_namespace: "http://www.devicemagic.com/xforms/752ba230-5cae-013d-8a0b-620dcf7168bf",
            destination_url: "https://script.google.com/macros/s/test-script-id/exec"
        }
    ];

    const testPayload = {
        metadata: {
            device_id: "iPad_A8093B1F-64B1-417F-BF0F-B037D262B8F2",
            user_id: null,
            username: "UPOWA-Jamie Barron",
            submitted_at: "2024-10-17 16:45:38 +01:00",
            received_at: "2024-10-17 15:45:40 +00:00",
            submission_id: "97685176",
            device_submission_identifier: "C7E762E9-CB89-4F93-B367-5969A1C3CC07",
            submission_counter: "22",
            author_identifier: "iPad_A8093B1F-64B1-417F-BF0F-B037D262B8F2",
            form_name: "Non Compliant Installation Audit Form",
            form_namespace: "http://www.devicemagic.com/xforms/752ba230-5cae-013d-8a0b-620dcf7168bf?8fd0b280-6d6b-013d-b51b-0edc13c680b0",
            form_version: "1.01"
        },
        answers: {
            Job_Type: { value: "Installation" },
            Audit_Type: { value: "Desk" },
            Forwarded_for_approval: { value: true },
            Forwarded_by: { value: "Mobit Graham" },
            Job_No: { value: "TAY-BIS-PH5" },
            Plot_No: { value: "71" },
            Installer: { value: "Jay Macgill-Patel" },
            Install_date: { value: "2024-10-15" },
            Auditor: { value: "Jamie Barron" },
            Authorised_for_NC: { value: "YES" },
            Auditor_Company: { value: "Upowa" },
            Audit_Date: { value: "2024-10-15" },
            Compliant: { value: true, geostamp: "", timestamp: "2024-10-17 16:45:28" },
            Remedial_Required: { value: false },
            Notes: { value: "? Are the bottom flashings installed ok," },
            Approval_Notes: { value: "Will speak with installer" },
            Pic_6: { value: "/home/testlolasdfa/Pic_6[1].JPEG" }
        }
    };

    beforeEach(() => {
        axiosPostStub = sinon.stub(axios, "post");
        fsReadFileSync = sinon.stub(fs, "readFileSync").returns(JSON.stringify(testConfig));
        consoleLogStub = sinon.stub(console, "log");
        consoleErrorStub = sinon.stub(console, "error");
    });

    afterEach(() => {
        axiosPostStub.restore();
        fsReadFileSync.restore();
        consoleLogStub.restore();
        consoleErrorStub.restore();
    });

    it("verifies successful response", async () => {
        const event: Event = {
            body: JSON.stringify(testPayload)
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
        sinon.assert.calledWith(axiosPostStub, testConfig[0].destination_url, testPayload);

        sinon.assert.calledWith(consoleLogStub, `Namespace: ${testPayload.metadata.form_namespace}`);
        sinon.assert.calledWith(consoleLogStub, `Submission ID: ${testPayload.metadata.submission_id}`);
        sinon.assert.calledWith(consoleLogStub, sinon.match(/Datetime: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/));
        sinon.assert.calledWith(consoleLogStub, "Status: Success");
    });

    it("handles form namespace not found", async () => {
        const event: Event = {
            body: JSON.stringify({
                ...testPayload,
                metadata: {
                    ...testPayload.metadata,
                    form_namespace: "http://www.devicemagic.com/xforms/non-existent"
                }
            })
        } as Event;

        const result = await lambdaHandler(event, {} as Context);

        expect(result).to.be.an("object");
        expect(result.statusCode).to.equal(404);
        expect(result.body).to.be.a("string");

        const response = JSON.parse(result.body);
        expect(response).to.be.an("object");
        expect(response.error).to.equal("Form namespace not found in configuration");
        expect(response.namespace).to.equal("http://www.devicemagic.com/xforms/non-existent");

        sinon.assert.calledOnce(consoleErrorStub);
    });

    it("handles axios error", async () => {
        const event: Event = {
            body: JSON.stringify(testPayload)
        } as Event;

        axiosPostStub.rejects(new Error("Network error"));

        const result = await lambdaHandler(event, {} as Context);

        expect(result).to.be.an("object");
        expect(result.statusCode).to.equal(500);
        expect(result.body).to.be.a("string");

        const response = JSON.parse(result.body);
        expect(response).to.be.an("object");
        expect(response.error).to.equal("Internal server error");
        expect(response.message).to.equal("Network error");

        sinon.assert.calledOnce(consoleErrorStub);
    });
});
