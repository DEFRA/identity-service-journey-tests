@delegations
Feature: Identity Service Helper - Delegations

  Background: Create a new CPH delegation
    Given the identity service helper is running
    And a valid CPH exists
    And an active delegating user exists
    And an active delegated user exists
    And I create a new CPH delegation
    And the delegation should be created successfully

  Scenario: Retrieve a CPH delegation using its ID
    Then I can retrieve the delegation using its ID

  Scenario: Retrieve all CPH delegations
    When I retrieve all delegations
    Then the newly created delegation should be in the list of retrieved delegations

  Scenario: Accept a CPH Delegation Invitation
    When I accept the CPH delegation invitation
    Then the delegation should be accepted successfully

  Scenario: Reject a CPH Delegation Invitation
    When I reject the CPH delegation invitation
    Then the delegation should be rejected successfully

  Scenario: Revoke a CPH Delegation
    And I accept the CPH delegation invitation
    And the delegation should be accepted successfully
    When I revoke the CPH delegation
    Then the delegation should be revoked successfully

  Scenario: Expire a CPH Delegation
    And I accept the CPH delegation invitation
    And the delegation should be accepted successfully
    When I expire the CPH delegation
    Then the delegation should be expired successfully