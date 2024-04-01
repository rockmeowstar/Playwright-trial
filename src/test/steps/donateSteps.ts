import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";

import { expect } from "@playwright/test";
import { fixture } from "../../hooks/pageFixture";

setDefaultTimeout(60 * 1000 * 2);

Given("User navigates to the application", async function () {
  await fixture.page.goto(process.env.BASEURL);
  fixture.logger.info("Navigated to the application");
});

Given("User clicks on the Give Now button", async function () {
  const iframeGiveNowButton = fixture.page.frameLocator("#XBGSFAMB");
  await iframeGiveNowButton.locator('[data-qa="fun-element"]').click();
  fixture.logger.info("Waiting for 2 seconds");
  await fixture.page.waitForTimeout(2000);
  // oh my...
});

Given("User chooses the Monthly plan", async function () {
  const iframeDonateWidget = fixture.page.frameLocator("#__checkout2");
  await iframeDonateWidget.locator('[data-qa="more-frequent-button"]').click();
});

Given("User chooses the currency {string}", async function (value) {
  const iframeDonateWidget = fixture.page.frameLocator("#__checkout2");
  await iframeDonateWidget
    .locator('[data-qa="currency-selector"]')
    .selectOption(value);
  // Additional step because of default currencies based on geolocation, missed in test case specification
});

Given("User enters the donate amount {string}", async function (value) {
  const iframeDonateWidget = fixture.page.frameLocator("#__checkout2");
  const amount = iframeDonateWidget.locator('[data-qa="amount"]');
  await amount.fill(value);
});

Given("User clicks on the Donate Monthly button", async function () {
  const iframeDonateWidget = fixture.page.frameLocator("#__checkout2");
  await iframeDonateWidget.locator('[data-qa="donate-button"]').click();
});

Given("User unchecks the Cover Fee checkbox", async function () {
  const iframeDonateWidget = fixture.page.frameLocator("#__checkout2");
  const checkbox = iframeDonateWidget.locator('[data-qa="cover-fee-checkbox"]');
  if (await checkbox.isChecked()) {
    await checkbox.click();
  }
});

Given("User clicks on the Credit Card button", async function () {
  const iframeDonateWidget = fixture.page.frameLocator("#__checkout2");
  await iframeDonateWidget.locator('[data-qa="cc-button"]').click();
});

Given("User enters the credit card number {string}", async function (value) {
  const frames = fixture.page.frames();
  const cardFrame = frames.filter((f) =>
    f.name().startsWith("__privateStripeFrame"),
  );
  for (let cf = 0; cf < cardFrame.length; cf++) {
    if (
      (await cardFrame[cf]
        .locator('[data-elements-stable-field-name="cardNumber"]')
        .count()) > 0
    ) {
      await cardFrame[cf].fill(
        '[data-elements-stable-field-name="cardNumber"]',
        value,
      );
    }
  }
});

Given(
  "User enters the credit card expire date {string}",
  async function (value) {
    const frames = fixture.page.frames();
    const cardFrame = frames.filter((f) =>
      f.name().startsWith("__privateStripeFrame"),
    );
    for (let cf = 0; cf < cardFrame.length; cf++) {
      if (
        (await cardFrame[cf]
          .locator('[data-elements-stable-field-name="cardExpiry"]')
          .count()) > 0
      ) {
        await cardFrame[cf].fill(
          '[data-elements-stable-field-name="cardExpiry"]',
          value,
        );
      }
    }
  },
);

Given("User enters the credit card cvc {string}", async function (value) {
  const frames = fixture.page.frames();
  const cardFrame = frames.filter((f) =>
    f.name().startsWith("__privateStripeFrame"),
  );
  for (let cf = 0; cf < cardFrame.length; cf++) {
    if (
      (await cardFrame[cf]
        .locator('[data-elements-stable-field-name="cardCvc"]')
        .count()) > 0
    ) {
      await cardFrame[cf].fill(
        '[data-elements-stable-field-name="cardCvc"]',
        value,
      );
    }
  }
  // I don't like this approach, but it works the best
});

Given("User clicks on the Continue button", async function () {
  const iframeDonateWidget = fixture.page.frameLocator("#__checkout2");
  await iframeDonateWidget.locator('[data-qa="card-continue"]').click();
});

Given("User enters the first name {string}", async function (value) {
  const iframeDonateWidget = fixture.page.frameLocator("#__checkout2");
  const amount = iframeDonateWidget.locator('[data-qa="personal-first-name"]');
  await amount.fill(value);
});

Given("User enters the last name {string}", async function (value) {
  const iframeDonateWidget = fixture.page.frameLocator("#__checkout2");
  const amount = iframeDonateWidget.locator('[data-qa="personal-last-name"]');
  await amount.fill(value);
});

Given("User enters the email {string}", async function (value) {
  const iframeDonateWidget = fixture.page.frameLocator("#__checkout2");
  const amount = iframeDonateWidget.locator('[data-qa="personal-email"]');
  await amount.fill(value);
});

When("User clicks on the Donate button", async function () {
  const iframeDonateWidget = fixture.page.frameLocator("#__checkout2");
  await iframeDonateWidget.locator('[data-qa="privacy-continue"]').click();
  // data-qa and data-testid naming and consistency issues
});

Then("The card should be declined", async function () {
  const iframeDonateWidget = fixture.page.frameLocator("#__checkout2");
  const errorAlertTooltip = iframeDonateWidget.locator(
    '[data-testid="tooltip-desktop-error-alert"]',
  );
  await expect(errorAlertTooltip).toBeVisible();
  const errorTitle = iframeDonateWidget.locator(
    '[data-qa="card-continue-error-title"]',
  );
  await expect(errorTitle).toHaveText("Your card was declined");
  const errorMessage = iframeDonateWidget.locator(
    '[data-qa="card-continue-error-message"]',
  );
  await expect(errorMessage).toHaveText(
    "Your card was declined. Your request was in live mode, but used a known test card.",
  );
});
