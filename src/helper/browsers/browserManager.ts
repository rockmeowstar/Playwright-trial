import { LaunchOptions, chromium } from "@playwright/test";

const options: LaunchOptions = {
  headless: true,
};

export const invokeBrowser = () => {
  const browserType = process.env.BROWSER;
  switch (browserType) {
    case "chrome":
      return chromium.launch(options);
    default:
      throw new Error("Please set the proper browser!");
  }
};
