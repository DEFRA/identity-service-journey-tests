@api @backend @userRoles
Feature: Identity Service Helper - User Roles

  Background: Ensure the identity service helper is running
    Given the identity service helper is running

  Scenario: Retrieve user roles
    When I request all user roles
    Then I should receive a list of user roles