# Apps Script OIDC Gateway Adapter

Apps Script is deployed behind an OIDC Verification Gateway. The gateway is the
only component that receives and verifies end-user OAuth/OIDC tokens. It forwards
an HMAC-signed identity envelope in the request body to Apps Script.

Apps Script Script Properties required before deployment:

```text
RDC_OIDC_GATEWAY_SHARED_SECRET
RDC_OIDC_GATEWAY_MAX_CLOCK_SKEW_SECONDS (optional; defaults to 300)
```

The shared secret must be held only by the gateway and Apps Script project. It
must never be added to frontend configuration, source code, Sheets, or Drive.

`verifyGatewayAuthentication_(envelope)` verifies required fields, timestamp,
HMAC signature, and a request-replay nonce. Missing configuration or any failed
check rejects the request. Router handlers must call it before facility scope or
partition resolution.

The first implemented route is `POST /v1/facility-partitions/resolve`. Its
gateway-forwarded request body contains `facilityId` and a date/range lookup.
The resolver reads only matching `facility_id` cells from
`MASTER_DB.facility_partitions`, returns logical partition metadata, and keeps
the physical Spreadsheet ID internal to Apps Script.
