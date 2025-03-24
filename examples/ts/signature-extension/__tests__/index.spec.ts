import { test } from "./assets/fixture";
import { expect, Page } from "@playwright/test";

test.describe('Signature extension tests', () => {
  test('Should be able to sign transction using key chain extension.', async ({ page, extensionId, context, baseDirectoryPath, testedAccountAuthorityData}) => {
    page.on("console", (msg) => {
      console.log(`[${msg.type()}]>> Page console: ${msg.text()}`);
    });

    page.setViewportSize({ width: 500, height: 700 });

    //////////////// Import settings begin (containing mirrornet endpoint configuration)

    const settingFilePath = baseDirectoryPath + '/' + 'settings.kc';

    console.log(`Attempting to import settings from: ${settingFilePath}`);

    await page.goto(`chrome-extension://${extensionId}/import-preferences.html`, { waitUntil: 'load' });

    page.once('filechooser', async fileChooser => {
      await fileChooser.setFiles(settingFilePath);
      }
    );

    await page.getByRole('button', { name: 'Choose a file' }).click();

    await page.getByRole('button', { name: 'Import' }).click();

    //////////////// Import settings end

    await page.goto(`chrome-extension://${extensionId}/popup.html`, { waitUntil: 'load' });
    const input = page.getByPlaceholder('New Password');
    const confirm = page.getByPlaceholder('Confirm');
    await input.fill('Password123');
    await confirm.fill('Password123');
    const checkbox = page.locator('#accept-terms-and-condition-inner-input');
    await checkbox.click();

    const button = page.getByTestId('signup-button');
    await button.click();
    const useButton = page.getByTestId('add-by-keys-button');
    await useButton.click();
    const usernameInput = page.getByPlaceholder('Username');
    await usernameInput.fill(testedAccountAuthorityData.accountName);
    const privateKeyInput = page.getByPlaceholder('Private Key ');
    await privateKeyInput.fill(testedAccountAuthorityData.privateKey);

    const submitButton = page.getByTestId('submit-button');
    await submitButton.click();
    const skip = page.getByText('Skip');

    await skip.waitFor();
    await skip.click();

    /// Regular keychain setup completed

    const testPage: Page = page;

    await testPage.goto('localhost:1234', {  waitUntil: 'load' });

    /// uncomment to allow debugging and recording while playwright performs actions
    //await page.pause();

    console.log("Acquiring a popupPromise");

    const popupPromise = context.waitForEvent('page');

    const keyChainButton = testPage.getByRole('button', {name: 'Use Keychain'});
    await keyChainButton.waitFor();

    console.log("Attempting to press 'Use keychain'");

     await keyChainButton.focus();
     await keyChainButton.click({delay: 750});

     console.log("Awaiting popupPromise");

    const popup = await popupPromise;
    console.log("new popup detected");
    console.log("Looking for Confirm button");
    const popupSubmitButton = popup.getByRole('button', {name: 'Confirm'});
    await popupSubmitButton.waitFor();
    console.log("Attempting to click Confirm button");
    await popupSubmitButton.focus();
    await popupSubmitButton.click({delay: 750});

    console.log("Attempting to wait for form close");
    await popup.waitForEvent('close');

    console.log("waitForTimeout(500);");
    await testPage.waitForTimeout(500);

    console.log("waitForSelector");

    const keyMatchState = await testPage.waitForSelector("#key-matching-result");
    const keyMatchText = await keyMatchState.textContent() as string;

    const result = await testPage.waitForSelector('#tx-result');
    const tx = JSON.parse(await result.textContent() as string);

    console.log(`Received keyMatchText: ${keyMatchText}`);
    //await page.pause();

    expect(tx.signatures).toHaveLength(1);
    expect(keyMatchText).toBe('Decoded and signing key match. Remote endpoint accepted transaction authority. Transaction has been signed using: HF26 serialization form');
  });
});