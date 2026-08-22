/**
 * OIDC gateway adapter for Apps Script.
 * The verification gateway validates the original OIDC token and sends a
 * signed identity envelope. Apps Script fails closed if configuration, timing,
 * signature, or nonce validation fails.
 */

var RDC_GATEWAY_CONFIG = {
  SHARED_SECRET_PROPERTY: 'RDC_OIDC_GATEWAY_SHARED_SECRET',
  MAX_CLOCK_SKEW_SECONDS_PROPERTY: 'RDC_OIDC_GATEWAY_MAX_CLOCK_SKEW_SECONDS',
  DEFAULT_MAX_CLOCK_SKEW_SECONDS: 300,
  NONCE_CACHE_PREFIX: 'rdc:oidc-gateway:nonce:',
};

function verifyGatewayAuthentication_(envelope) {
  if (!envelope || !envelope.identity || !envelope.issuedAt || !envelope.nonce || !envelope.signature) {
    throw new GatewayAuthorizationError_('GATEWAY_ENVELOPE_INVALID', 'Gateway authentication envelope is required.');
  }

  var secret = PropertiesService.getScriptProperties().getProperty(
    RDC_GATEWAY_CONFIG.SHARED_SECRET_PROPERTY,
  );
  if (!secret) {
    throw new GatewayAuthorizationError_('GATEWAY_CONFIGURATION_REQUIRED', 'OIDC gateway verification is not configured.');
  }

  var issuedAtMillis = Date.parse(envelope.issuedAt);
  if (isNaN(issuedAtMillis)) {
    throw new GatewayAuthorizationError_('GATEWAY_ISSUED_AT_INVALID', 'Gateway issuedAt must be an ISO-8601 timestamp.');
  }

  var maxClockSkew = getGatewayMaxClockSkewSeconds_();
  if (Math.abs(Date.now() - issuedAtMillis) > maxClockSkew * 1000) {
    throw new GatewayAuthorizationError_('GATEWAY_ENVELOPE_EXPIRED', 'Gateway authentication envelope is outside the allowed time window.');
  }

  var canonicalPayload = JSON.stringify({
    identity: envelope.identity,
    issuedAt: envelope.issuedAt,
    nonce: envelope.nonce,
  });
  var expectedSignature = Utilities.base64EncodeWebSafe(
    Utilities.computeHmacSha256Signature(canonicalPayload, secret),
  ).replace(/=+$/, '');

  if (!constantTimeEquals_(expectedSignature, envelope.signature)) {
    throw new GatewayAuthorizationError_('GATEWAY_SIGNATURE_INVALID', 'Gateway authentication signature is invalid.');
  }

  consumeGatewayNonce_(envelope.nonce, maxClockSkew);
  return envelope.identity;
}

function getGatewayMaxClockSkewSeconds_() {
  var rawValue = PropertiesService.getScriptProperties().getProperty(
    RDC_GATEWAY_CONFIG.MAX_CLOCK_SKEW_SECONDS_PROPERTY,
  );
  if (!rawValue) {
    return RDC_GATEWAY_CONFIG.DEFAULT_MAX_CLOCK_SKEW_SECONDS;
  }

  var value = Number(rawValue);
  if (!isFinite(value) || value <= 0) {
    throw new GatewayAuthorizationError_('GATEWAY_CONFIGURATION_INVALID', 'Gateway clock skew configuration is invalid.');
  }
  return value;
}

function consumeGatewayNonce_(nonce, maxClockSkewSeconds) {
  var cache = CacheService.getScriptCache();
  var cacheKey = RDC_GATEWAY_CONFIG.NONCE_CACHE_PREFIX + nonce;
  if (cache.get(cacheKey)) {
    throw new GatewayAuthorizationError_('GATEWAY_REPLAY_DETECTED', 'Gateway authentication envelope was already used.');
  }
  cache.put(cacheKey, '1', maxClockSkewSeconds);
}

function constantTimeEquals_(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string' || left.length !== right.length) {
    return false;
  }

  var difference = 0;
  for (var index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

function GatewayAuthorizationError_(code, message) {
  this.name = 'GatewayAuthorizationError';
  this.code = code;
  this.message = message;
}
