/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 'use strict';

 const { describe, it, beforeEach } = intern.getPlugin('interface.bdd');
 const selectors = require('../lib/selectors');
 const FunctionalHelpers = require('../lib/helpers');
 const FunctionalSettingsHelpers = require('./lib/helpers');
 const { navigateToSettingsV2 } = FunctionalSettingsHelpers;
 const password = 'passwordzxcv';

 const {
   click,
   testElementExists,
   type,
   visibleByQSA,
 } = FunctionalHelpers.helpersRemoteWrapped;

describe('Delete account', () => {
  beforeEach(async ({ remote }) => {
    await navigateToSettingsV2(remote);
  });

  /* it('can delete account', async ({ remote }) => {
    await click(
      selectors.SETTINGS_V2.DELETE_ACCOUNT.DELETE_ACCOUNT_BUTTON,
      remote
    );
    await testElementExists(
      selectors.SETTINGS_V2.DELETE_ACCOUNT.DELETE_ACCOUNT_MODAL,
      remote
    );

    // Check all the checkboxes before continuing
    await click(
      selectors.SETTINGS_V2.DELETE_ACCOUNT.CHECKBOX_1,
      remote
    );
    await click(
      selectors.SETTINGS_V2.DELETE_ACCOUNT.CHECKBOX_2,
      remote
    );
    await click(
      selectors.SETTINGS_V2.DELETE_ACCOUNT.CHECKBOX_3,
      remote
    );
    await click(
      selectors.SETTINGS_V2.DELETE_ACCOUNT.CHECKBOX_4,
      remote
    );

    // Click continue
    await click(
      selectors.SETTINGS_V2.DELETE_ACCOUNT.CONTINUE_BUTTON,
      remote
    );

    // Enter incorrect password
    await testElementExists(
      selectors.SETTINGS_V2.DELETE_ACCOUNT.DELETE_ACCOUNT_MODAL,
      remote
    );
    await click(
      selectors.SETTINGS_V2.DELETE_ACCOUNT.PASSWORD_LABEL,
      remote
    );
    await type(
      selectors.SETTINGS_V2.DELETE_ACCOUNT.PASSWORD_INPUT,
      'invalid password',
      remote
    );
    await click(
      selectors.SETTINGS_V2.DELETE_ACCOUNT.DELETE_CONFIRM_BUTTON,
      remote
    );
    await visibleByQSA(
      selectors.SETTINGS_V2.DELETE_ACCOUNT.TOOLTIP_INCORRECT_PASSWORD,
      remote
    );

    // Enter correct password
    await click(
      selectors.SETTINGS_V2.DELETE_ACCOUNT.PASSWORD_LABEL,
      remote
    );
    await type(
      selectors.SETTINGS_V2.DELETE_ACCOUNT.PASSWORD_INPUT,
      password,
      remote
    );
    await click(
      selectors.SETTINGS_V2.DELETE_ACCOUNT.DELETE_CONFIRM_BUTTON,
      remote
    );
  }) */

  it('cancel delete account', async ({ remote }) => {
    await click(
      selectors.SETTINGS_V2.DELETE_ACCOUNT.DELETE_ACCOUNT_BUTTON,
      remote
    );

    // Check all the checkboxes before continuing
    await findAllByCssSelector(
      selectors.SETTINGS_V2.DELETE_ACCOUNT.CHECKBOXES
    );
    (labels) => labels.map((label) => label.click())
    end();

    // Click continue
    await click(
      selectors.SETTINGS_V2.DELETE_ACCOUNT.CONTINUE_BUTTON,
      remote
    );
    await click(
      selectors.SETTINGS_V2.DELETE_ACCOUNT.PASSWORD_LABEL,
      remote
    );
    await type(
      selectors.SETTINGS_V2.DELETE_ACCOUNT.PASSWORD_INPUT,
      password,
      remote
    );
    });

  });
