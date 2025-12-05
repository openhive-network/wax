import { test } from "./assets/fixture";
import { BrowserContext, expect, Page } from "@playwright/test";

const configureUserAccount = async (page: Page, accountName: string, privateKey: string): Promise<void> => {
    const useButton = page.getByTestId('add-by-keys-button');
    await useButton.waitFor();
    await useButton.click();
    const usernameInput = page.getByTestId('input-username');
    await usernameInput.click();
    await usernameInput.fill(accountName);
    const privateKeyInput = page.getByTestId('input-private-key');
    await privateKeyInput.click();
    await privateKeyInput.fill(privateKey);

    const submitButton = page.getByTestId('submit-button');
    await submitButton.waitFor();
    await submitButton.click();
};

const importPreferences = async (context: BrowserContext, extensionId: string, baseDirectoryPath: string): Promise<void> => {
    //////////////// Import settings begin (containing mirrornet endpoint configuration)

    const settingFilePath = baseDirectoryPath + '/' + 'settings.kc';

    /// warning preferences page will autoclose, so let's open new one for it
    const newPage = await context.newPage()

    console.log(`Attempting to import settings from: ${settingFilePath}`);

    await newPage.goto(`chrome-extension://${extensionId}/import-preferences.html`, { waitUntil: 'load' });

    newPage.once('filechooser', async fileChooser => {
      await fileChooser.setFiles(settingFilePath);
      }
    );

    await newPage.getByRole('button', { name: 'Choose a file' }).click();

    await newPage.getByRole('button', { name: 'Import' }).click();

    newPage.on("close", async () => {
      console.log("Extension settings page is being closed");
    });
    
    console.log("Attempting to wait for settings form close");
    await newPage.waitForEvent('close');

    //////////////// Import settings end

}

test.describe('Signature extension tests', () => {
  test('Should be able to sign transction using key chain extension.', async ({ page, extensionId, context, baseDirectoryPath, testedAccountAuthorityData}) => {
    page.on("console", (msg) => {
      console.log(`[${msg.type()}]>> Page console: ${msg.text()}`);
    });

    page.setViewportSize({ width: 500, height: 700 });

    /**
     * Seems keychain had some drawbacks when its initial setup (preferences import) has been performed before creating a storage.
     * So, we create a new storage first (by performing initial setup) and then import preferences.
     * To satisfy initial setup requirements, we create first some account already existing on mainnet - hive.fund.
     */
    {
    await page.goto(`chrome-extension://${extensionId}/popup.html`, { waitUntil: 'load' });

    const input = page.getByPlaceholder('New Password');
    const confirm = page.getByPlaceholder('Confirm');
    await input.fill('Password123');
    await confirm.fill('Password123');
    const checkbox = page.locator('#accept-terms-and-condition-inner-input');
    await checkbox.click();

    await page.getByTestId('signup-button').click();
    }

    await page.goto(`chrome-extension://${extensionId}/popup.html`, { waitUntil: 'load' });

    await configureUserAccount(page, 'hive.fund', testedAccountAuthorityData.privateKey);

    const skip = page.getByText('Skip');
    await skip.waitFor();
    await skip.click();

    await importPreferences(context, extensionId, baseDirectoryPath);

    await page.goto(`chrome-extension://${extensionId}/popup.html`, { waitUntil: 'load' });

    /// To reach account import page, after initial setup, dedicated option must be selected from menu
    await page.getByTestId('clickable-settings').locator('path').click();
    await page.getByText('Accounts').click();
    await page.getByText('Add account').click();

    await configureUserAccount(page, testedAccountAuthorityData.accountName, testedAccountAuthorityData.privateKey);

    /// select tested account for current use to avoid transaction signing
    await page.getByTestId('selected-account-name').click();
    await page.getByRole('button', { name: testedAccountAuthorityData.accountName }).click();

    //await page.pause();

    /// Regular keychain setup completed

    const testPage: Page = page;//await context.newPage();

    await testPage.goto('http://127.0.0.1:1234', {  waitUntil: 'load' });

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

//console.log(await testPage.content());
//await testPage.screenshot({path: "test.png", fullPage: true});

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

  //  console.log("waitForTimeout(500);");
//    await testPage.waitForTimeout(500);

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