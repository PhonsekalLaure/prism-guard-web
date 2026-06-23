import assert from 'node:assert/strict';
import test from 'node:test';

import { buildGovernmentRemittanceSummary } from './payrollRemittanceUtils.js';

test('buildGovernmentRemittanceSummary maps monthly agency totals', () => {
  const context = {
    agencies: [
      {
        agency: 'sss',
        employee_share: 190,
        employer_share: 400,
        ec_amount: 25,
        total_amount: 615,
      },
      {
        agency: 'philhealth',
        employee_share: 150,
        employer_share: 150,
        ec_amount: 0,
        total_amount: 300,
      },
      {
        agency: 'pagibig',
        employee_share: 100,
        employer_share: 100,
        ec_amount: 0,
        total_amount: 200,
      },
    ],
  };

  const summaries = buildGovernmentRemittanceSummary(context);
  const sss = summaries.find((item) => item.key === 'sss');
  const philhealth = summaries.find((item) => item.key === 'philhealth');
  const pagibig = summaries.find((item) => item.key === 'pagibig');

  assert.deepEqual(
    {
      employeeShare: sss.employeeShare,
      employerShare: sss.employerShare,
      ecAmount: sss.ecAmount,
      totalAmount: sss.totalAmount,
    },
    {
      employeeShare: 190,
      employerShare: 400,
      ecAmount: 25,
      totalAmount: 615,
    }
  );
  assert.equal(philhealth.totalAmount, 300);
  assert.equal(pagibig.totalAmount, 200);
});

test('buildGovernmentRemittanceSummary uses persisted remittance status', () => {
  const remittance = {
    agency: 'sss',
    total_amount: 700,
    reference_number: 'SSS-REF',
  };
  const [sss] = buildGovernmentRemittanceSummary({
    agencies: [{
      agency: 'sss',
      remittance,
    }],
  });

  assert.equal(sss.remittance, remittance);
});
