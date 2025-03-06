import { test } from "./assets/fixture";
import { expect } from "@playwright/test";

test.describe('Signature extension tests', () => {
  test('Should be able to sign transction using key chain extension.', async ({ page, extensionId, context }) => {
    page.setViewportSize({ width: 500, height: 700 });
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
    await usernameInput.fill('guest4test1');
    const privateKeyInput = page.getByPlaceholder('Private Key ');
    await privateKeyInput.fill('5KdYfc7id78M2xfo3Lr9YcBJygK3vXA6oP1dNMetQYvMYvN6XZJ');
    const submitButton = page.getByTestId('submit-button');
    await submitButton.click();
    await page.getByText('Skip').waitFor();
    await page.goto('localhost:1234', {  waitUntil: 'load' });
    const keyChainButton = page.getByText('Use Keychain');
    const popupPromise = context.waitForEvent('page');
    await keyChainButton.click();
    const popup = await popupPromise;
    const popupSubmitButton = popup.getByText('Confirm');
    await popupSubmitButton.waitFor();
    await popupSubmitButton.click();
    await page.waitForTimeout(500);
    const result = await page.waitForSelector('#tx-result');
    const tx = JSON.parse(await result.textContent() as string);
    expect(tx.signatures).toHaveLength(1);
  });
});