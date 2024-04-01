Feature: User Donate Form tests

  Background:
    Given User navigates to the application
    And User clicks on the Give Now button

  Scenario: Donate should not be successful
    And User chooses the Monthly plan
    And User chooses the currency "USD"
    And User enters the donate amount "100"
    And User clicks on the Donate Monthly button
    And User unchecks the Cover Fee checkbox
    And User clicks on the Credit Card button
    And User enters the credit card number "4242 4242 4242 4242"
    And User enters the credit card expire date "4/24"
    And User enters the credit card cvc "000"
    And User clicks on the Continue button
    And User enters the first name "Ivan"
    And User enters the last name "Petrov"
    And User enters the email "kote27@yandex.ru"
    When User clicks on the Donate button
    Then The card should be declined

