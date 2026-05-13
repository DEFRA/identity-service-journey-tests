Feature: Identity Service Handler - Health Checks

  Background: Ensure the identity service handler is running
    Given the identity service handler is running

  Scenario: Check the health of the identity service handler
    When I check the health endpoint
    Then I should receive a healthy response
