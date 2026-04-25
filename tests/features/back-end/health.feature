Feature: Health Checks

  Background:
    Given the identity service helper is running

  Scenario: Check the health of the identity service helper
    When I check the health endpoint
    Then I should receive a healthy response