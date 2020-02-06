/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const AppError = require('./error');
const jwt = require('./jwt');

const HEADER_TYP = 'at+JWT';

/**
 * Verify an OIDC ID Token, following the flow in 3.1.3.7 of the spec:
 * https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation
 *
 * @param {String} idToken
 * @param {String} clientId
 * @throws `invalidToken` error if ID Token is invalid.
 * @returns {Promise<Object>} resolves with claims in Token
 */
exports.verify = async function verify(idToken, clientId) {
  // Steps 1 and 2 of the verification flow are already handled by jwt.js:
  //
  // 1. if the ID Token is encrypted, decrypt it using the keys and algorithms
  //    negotiated at Registration time between OpenID Provider and Client.
  //    If encryption was negotiated but the token is not encrypted, RP SHOULD
  //    reject it.
  // 2. The issuer identifier for the OpenID Provider MUST exactly match the
  //    'iss' Claim.
  let claims;
  try {
    claims = await jwt.verify(idToken, { typ: HEADER_TYP });
  } catch (err) {
    throw AppError.invalidToken();
  }

  // TODO: what is the canonical list of trusted audiences? Do we ever issue
  // ID Tokens with multiple audiences?
  //
  // 3. Client MUST validate that the 'aud' Claim contains its 'client_id'
  // value registered at the Issuer identifier by the 'iss' Claim as an
  // audience. If the ID Token doesn't list the Client as a valid audience,
  // or if the ID Token contains additional audiences not trusted by the
  // Client, the ID Token MUST be rejected.
  if (typeof claims.aud === 'string' && claims.aud !== clientId) {
    throw AppError.invalidToken();
  } else if (!claims.aud.includes(clientId)) {
    throw AppError.invalidToken();
  }

  // Skipping these steps, because we never use the 'azp' claim:
  //
  // 4. If the ID Token contains multiple audiences, the Client SHOULD verify
  //    that an 'azp' field is present.
  // 5. If an 'azp' Claim is present, the Client SHOULD verify that its
  //    client_id is the Claim Value.

  // Skipping this optional step:
  //
  // 6. Optionally, TLS server validation can be used if the token was received
  // directly by the Client from the Token Endpoint.

  // TODO: is this always RS256? AFAICT yes...
  //
  // 7. The 'alg' value should be the default of 'RS256' or the value of
  //    'id_token_signed_response_alg' set at Registration.
  if (claims.alg !== 'RS256') {
    throw AppError.invalidToken();
  }

  // TODO: Related to the above TODO for step 7 (unnecessary if we always use
  // RS256 as the 'alg' for our ID Tokens).
  //
  // 8. If the JWT `alg` Header Parameter uses a MAC based algorithm such as
  //    `HS256`, `HS384`, or `HS512`, the octets of the UTF-8 representation of
  //    the `client_secret` corresponding to the `client_id` contained in the
  //    `aud` (audience) Claim are used as the key to validate the signature.
  //    For MAC based algorithms, the behavior is unspecified if the `aud` is
  //    multi-valued or if an `azp` value is present that is different than
  //    the `aud` value.

  // 9. The current time MUST be before the time represented by the `exp` Claim.
  //    TODO: should we allow for clock skew?
  if (claims.exp < Date.now() / 1000) {
    throw AppError.invalidToken();
  }

  // TODO: do we need to reject tokens with iat values outside some threshold?
  //
  // 10. The `iat` claim can be used to reject tokens issued too far away from
  //     the current time, limiting the amount of time that nonces need to be
  //     stored to prevent attacks. The acceptable range is Client specific.

  // TODO: AFAICT we don't use the `nonce` claim in our ID Tokens, skipping:
  //
  // 11. If a nonce value was sent in the Authentication Request, a `nonce`
  //     Claim MUST be present and its value checked to verify that it is the
  //     same value as the one that was sent in the Authentication Request.
  //     The Client SHOULD check the nonce value for replay attacks. The
  //     precise method for detecting replay attacks is Client specific.

  // TODO: in the case of forcing 2FA, we should expect that acr=AAL2 was
  // requested. But I don't think this is the correct spot to check that.
  //
  // 12. If the `acr` Claim was requested, Client SHOULD check the asserted
  //     Claim Value is appropriate. The meaning and processing of `acr` Claim
  //     Values is out of scope for the OIDC spec.

  // TODO: AFAICT we don't use the `auth_time` or `max_age` at all, skipping:
  //
  // 13. If the `auth_time` Claim was requested, either specifically or by
  //     using the `max_age` parameter, the Client SHOULD check the `auth_time`
  //     Claim Value and request re-authentication if it determines too much
  //     time has elapsed since the last End-User authentication.

  return claims;
};
