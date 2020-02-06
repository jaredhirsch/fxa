/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// TODO remove when ready
/* eslint-disable */

const { assert } = require('chai');
const sinon = require('sinon');
const jsonwebtoken = require('jsonwebtoken');
const proxyquire = require('proxyquire');

const AppError = require('../../lib/oauth/error');

const config = require('../../config');
const ISSUER = config.get('oauthServer.openid.issuer');
const {
  publicPEM,
  SIGNING_PEM,
  SIGNING_KID,
  SIGNING_ALG,
} = require('../../lib/oauth/keys');

// TODO
// const validToken = ...

describe('lib/jwt_id_token', () => {
  let JWTIdToken;

  beforeEach(() => {
    JWTIdToken = require('../../lib/oauth/jwt_id_token');
  });

  describe('verify', () => {
    it('fails if JWT is invalid', async () => {
      try {
        await JWTIdToken.verify('invalid token');
        assert.fail();
      } catch (err) {
        assert.instanceOf(err, AppError);
      }
    });

    /*
    it('succeeds if valid', async () => {
      const validToken = jsonwebtoken.sign(
        {
          iss: ISSUER,
          alg: SIGNING_ALG,
          // TODO add missing claims
        },
        SIGNING_PEM,
        {
          algorithm: SIGNING_ALG,
          keyid: SIGNING_KID,
        }
      );

      let result;
      try {
        result = await JWTIdToken.verify(validToken);
      } catch (err) {
        assert.fail();
      }
    });
    */
  });
});
