/**
 * Abstract base class for storage providers
 * Defines the interface for storing and retrieving wallet data
 */
export abstract class AStorageProviderBase {
  /**
   * Retrieves the content of a file from storage
   * @param name - Name of the file to retrieve
   * @returns The file content as a string
   */
  abstract get (name: string): Promise<string>;

  /**
   * Saves data to a file in storage
   * @param name - Name of the file to save
   * @param data - Data to save
   */
  abstract save (name: string, data: string): Promise<void>;

  /**
   * Deletes a file from storage
   * @param name - Name of the file to delete
   */
  abstract delete (name: string): Promise<void>;

  /**
   * Checks if a file exists in storage
   * @param name - Name of the file to check
   * @returns True if the file exists, false otherwise
   */
  abstract exists (name: string): Promise<boolean>;
}
