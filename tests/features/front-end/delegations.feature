@delegations @delegationsUi
Feature: Identity Service Handler - Delegations

  Scenario Outline: User with <cphs_held> CPH's can invite a delegate to manage their CPH's
    Given I am signed in as a delegator with <cphs_held> CPH's
    And I am on the identity service handler delegations page
    And I invite a delegate to manage my CPH's
    And the delegate is signed in as an active user
    And the delegate is on the identity service handler invitations page
    And the delegate should see an invitation to manage the delegator's CPH's
    When the delegate accepts the invitation
    And I am signed in as a delegator with <cphs_held> CPH's
    Then I should see the delegate listed as managing my CPH's

    Examples:
      | cphs_held |
      | multiple  |
      | single    |

  Scenario: User with no CPH's cannot invite a delegate to manage their CPH's
    Given I am signed in as a delegator with no CPH
    When I am on the identity service handler delegations page
    Then I should not be able to invite a delegate

  Scenario: Delegate can decline an invitation to manage a delegator's single CPH
    Given I am signed in as a delegator with a single CPH
    And I am on the identity service handler delegations page
    And I invite a delegate to manage my CPH's
    And the delegate is signed in as an active user
    And the delegate is on the identity service handler invitations page
    And the delegate should see an invitation to manage the delegator's CPH's
    When the delegate rejects the invitation
    And I am signed in as a delegator with a single CPH
    Then I should not see the delegate listed as managing my CPH's

  Scenario: Delegate can accept and decline invitations to manage a delegators multiple CPH
    Given I am signed in as a delegator with multiple CPH's
    And I am on the identity service handler delegations page
    And I invite a delegate to manage 2 of my CPH's
    And the delegate is signed in as an active user
    And the delegate is on the identity service handler invitations page
    And the delegate should see an invitation to manage the delegator's CPH's
    When the delegate accepts 1 invitation
    And the delegate rejects 1 invitation
    And I am signed in as a delegator with multiple CPH's
    Then I should see the delegate listed as managing my CPH's
