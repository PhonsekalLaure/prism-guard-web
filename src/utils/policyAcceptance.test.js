import assert from 'node:assert/strict';
import test from 'node:test';
import {
  REQUIRED_SETUP_POLICIES,
  buildAcceptedPolicies,
  hasAcceptedAllRequiredPolicies,
} from './policyAcceptance.js';

test('requires privacy notice and terms acceptance for setup', () => {
  assert.deepEqual(
    REQUIRED_SETUP_POLICIES.map(({ policyKey, policyVersion }) => ({ policyKey, policyVersion })),
    [
      { policyKey: 'privacy_notice', policyVersion: 'v1' },
      { policyKey: 'terms_and_conditions', policyVersion: 'v1' },
    ]
  );
});

test('buildAcceptedPolicies emits only accepted current policy versions', () => {
  assert.deepEqual(buildAcceptedPolicies({
    privacy_notice: true,
    terms_and_conditions: false,
  }), [
    { policyKey: 'privacy_notice', policyVersion: 'v1' },
  ]);
});

test('hasAcceptedAllRequiredPolicies gates setup completion', () => {
  assert.equal(hasAcceptedAllRequiredPolicies({
    privacy_notice: true,
    terms_and_conditions: false,
  }), false);
  assert.equal(hasAcceptedAllRequiredPolicies({
    privacy_notice: true,
    terms_and_conditions: true,
  }), true);
});