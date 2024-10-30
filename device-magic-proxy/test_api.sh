#!/bin/bash

API_ENDPOINT="https://e6goocpt8a.execute-api.eu-west-2.amazonaws.com/Prod/proxy/"

# Read the first form namespace from config.json
FORM_NAMESPACE="http://www.devicemagic.com/xforms/752ba230-5cae-013d-8a0b-620dcf7168bf"

# Create a payload using the form namespace
PAYLOAD=$(cat <<EOF
{
	"metadata": {
		"device_id": "iPad_A8093B1F-64B1-417F-BF0F-B037D262B8F2",
		"user_id": null,
		"username": "TEST TEST",
		"submitted_at": "2024-10-17 16:45:38 +01:00",
		"received_at": "2024-10-17 15:45:40 +00:00",
		"submission_id": "00000",
		"device_submission_identifier": "C7E762E9-CB89-4F93-B367-5969A1C3CC07",
		"submission_counter": "22",
		"author_identifier": "iPad_A8093B1F-64B1-417F-BF0F-B037D262B8F2",
		"form_name": "Non Compliant Installation Audit Form",
		"form_namespace": "http://www.devicemagic.com/xforms/752ba230-5cae-013d-8a0b-620dcf7168bf?8fd0b280-6d6b-013d-b51b-0edc13c680b0",
		"form_version": "1.01"
	},
	"answers": {
		"Job_Type": {
			"value": "Installation"
		},
		"Audit_Type": {
			"value": "Desk"
		},
		"Forwarded_for_approval": {
			"value": true
		},
		"Forwarded_by": {
			"value": "Mobit Graham"
		},
		"Job_No": {
			"value": "TAY-BIS-PH5"
		},
		"Plot_No": {
			"value": "71"
		},
		"Installer": {
			"value": "TEST TEST"
		},
		"Install_date": {
			"value": "2024-10-15"
		},
		"Auditor": {
			"value": "TEST TESTn"
		},
		"Authorised_for_NC": {
			"value": "YES"
		},
		"Auditor_Company": {
			"value": "TEST "
		},
		"Audit_Date": {
			"value": "2024-10-15"
		},
		"Compliant": {
			"value": true,
			"geostamp": "",
			"timestamp": "2024-10-17 16:45:28"
		},
		"Remedial_Required": {
			"value": false
		},
		"Notes": {
			"value": "This is a test - please delete"
		},
		"Approval_Notes": {
			"value": "please delete"
		},
		"Pic_6": {
			"value": "/home/testlolasdfa/Pic_6[1].JPEG"
		}
	}
}
EOF
)

# Send POST request
curl -X POST $API_ENDPOINT \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD"

echo # Print a newline for better readability
