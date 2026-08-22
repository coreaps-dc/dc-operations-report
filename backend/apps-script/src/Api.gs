function doPost(event) {
  var requestId = Utilities.getUuid();
  try {
    var payload = JSON.parse(event.postData && event.postData.contents ? event.postData.contents : '{}');
    verifyGatewayAuthentication_(payload.gatewayAuthentication);
    var response = routeGatewayRequest_(payload.request || {});
    return jsonResponse_({ ok: true, data: response, meta: { requestId: requestId, apiVersion: 'v1' } });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: { code: error.code || 'REQUEST_FAILED', message: error.message || 'Request failed.' },
      meta: { requestId: requestId, apiVersion: 'v1' },
    });
  }
}

function routeGatewayRequest_(request) {
  if (request.method === 'POST' && request.path === '/v1/facility-partitions/resolve') {
    return resolveFacilityPartition_(request.body.facilityId, request.body.lookup);
  }
  throw new Error('ROUTE_NOT_FOUND');
}

function jsonResponse_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
