/**
 * Download Manager Service
 * Handles downloading audio files for offline playback
 */

import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUDIO_CDN_BASE_URL = process.env.EXPO_PUBLIC_AUDIO_CDN_BASE_URL || 'https://wondersofrome-audio-worker.wondersofrome.workers.dev/audio';
const DOWNLOAD_DIR = `${FileSystem.documentDirectory}audio/`;
const STORAGE_KEY = 'downloaded_tours';

export interface DownloadedTour {
  id: string;
  title: string;
  language: string;
  filePath: string;
  fileSize: number;
  downloadedAt: number;
  thumbnail?: string;
}

export interface DownloadProgress {
  tourId: string;
  language: string;
  progress: number; // 0-1
  totalBytes: number;
  downloadedBytes: number;
}

class DownloadManagerService {
  private downloadCallbacks: Map<string, (progress: DownloadProgress) => void> = new Map();
  private activeDownloads: Map<string, FileSystem.DownloadResumable> = new Map();
  private initialized: boolean = false;

  /**
   * Ensure the download directory exists (lazy initialization)
   */
  private async ensureDirectoryExists() {
    if (this.initialized) return;
    
    try {
      const dirInfo = await FileSystem.getInfoAsync(DOWNLOAD_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(DOWNLOAD_DIR, { intermediates: true });
        console.log('[DownloadManager] Created download directory:', DOWNLOAD_DIR);
      }
      this.initialized = true;
    } catch (error) {
      console.error('[DownloadManager] Error creating directory:', error);
    }
  }

  /**
   * Generate unique key for tour + language combination
   */
  private getDownloadKey(tourId: string, language: string): string {
    return `${tourId}_${language}`;
  }

  /**
   * Get local file path for a tour
   */
  private getLocalFilePath(tourId: string, language: string): string {
    return `${DOWNLOAD_DIR}${tourId}_${language}.m3u8`;
  }

  /**
   * Get remote audio URL
   */
  private getRemoteUrl(tourId: string, language: string): string {
    return `${AUDIO_CDN_BASE_URL}/${language}/${tourId}/deep/playlist.m3u8`;
  }

  /**
   * Check if a tour is downloaded
   */
  async isDownloaded(tourId: string, language: string): Promise<boolean> {
    try {
      await this.ensureDirectoryExists();
      const filePath = this.getLocalFilePath(tourId, language);
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      return fileInfo.exists;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get local file path if downloaded, otherwise return remote URL
   */
  async getAudioPath(tourId: string, language: string): Promise<string> {
    try {
      await this.ensureDirectoryExists();
      const isDownloaded = await this.isDownloaded(tourId, language);
      if (isDownloaded) {
        return this.getLocalFilePath(tourId, language);
      }
    } catch (error) {
      console.log('[DownloadManager] Error checking download, using remote URL:', error);
    }
    return this.getRemoteUrl(tourId, language);
  }

  /**
   * Download a tour for offline playback
   */
  async downloadTour(
    tourId: string,
    title: string,
    language: string,
    thumbnail?: string,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<boolean> {
    await this.ensureDirectoryExists();
    
    const downloadKey = this.getDownloadKey(tourId, language);
    
    // Check if already downloading
    if (this.activeDownloads.has(downloadKey)) {
      console.log('[DownloadManager] Already downloading:', downloadKey);
      return false;
    }

    // Check if already downloaded
    if (await this.isDownloaded(tourId, language)) {
      console.log('[DownloadManager] Already downloaded:', downloadKey);
      return true;
    }

    try {
      const remoteUrl = this.getRemoteUrl(tourId, language);
      const localPath = this.getLocalFilePath(tourId, language);

      console.log('[DownloadManager] Starting download:', {
        tourId,
        language,
        remoteUrl,
        localPath,
      });

      // Create download resumable
      const downloadResumable = FileSystem.createDownloadResumable(
        remoteUrl,
        localPath,
        {},
        (downloadProgress) => {
          const progress: DownloadProgress = {
            tourId,
            language,
            progress: downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite,
            totalBytes: downloadProgress.totalBytesExpectedToWrite,
            downloadedBytes: downloadProgress.totalBytesWritten,
          };

          // Call callback if provided
          if (onProgress) {
            onProgress(progress);
          }

          // Call registered callback
          const callback = this.downloadCallbacks.get(downloadKey);
          if (callback) {
            callback(progress);
          }
        }
      );

      this.activeDownloads.set(downloadKey, downloadResumable);

      // Start download
      const result = await downloadResumable.downloadAsync();
      
      if (result && result.uri) {
        console.log('[DownloadManager] Download complete:', result.uri);

        // Get file size
        const fileInfo = await FileSystem.getInfoAsync(result.uri);
        const fileSize = fileInfo.exists && 'size' in fileInfo ? fileInfo.size : 0;

        // Save to storage
        await this.saveDownloadedTour({
          id: tourId,
          title,
          language,
          filePath: result.uri,
          fileSize,
          downloadedAt: Date.now(),
          thumbnail,
        });

        this.activeDownloads.delete(downloadKey);
        this.downloadCallbacks.delete(downloadKey);
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('[DownloadManager] Download error:', error);
      this.activeDownloads.delete(downloadKey);
      this.downloadCallbacks.delete(downloadKey);
      return false;
    }
  }

  /**
   * Cancel an active download
   */
  async cancelDownload(tourId: string, language: string): Promise<void> {
    const downloadKey = this.getDownloadKey(tourId, language);
    const download = this.activeDownloads.get(downloadKey);
    
    if (download) {
      try {
        await download.pauseAsync();
        this.activeDownloads.delete(downloadKey);
        this.downloadCallbacks.delete(downloadKey);
        console.log('[DownloadManager] Download cancelled:', downloadKey);
      } catch (error) {
        console.error('[DownloadManager] Error cancelling download:', error);
      }
    }
  }

  /**
   * Delete a downloaded tour
   */
  async deleteTour(tourId: string, language: string): Promise<boolean> {
    try {
      const filePath = this.getLocalFilePath(tourId, language);
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(filePath);
        console.log('[DownloadManager] Deleted file:', filePath);
      }

      // Remove from storage
      await this.removeDownloadedTour(tourId, language);
      
      return true;
    } catch (error) {
      console.error('[DownloadManager] Error deleting tour:', error);
      return false;
    }
  }

  /**
   * Get all downloaded tours
   */
  async getDownloadedTours(): Promise<DownloadedTour[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    } catch (error) {
      console.error('[DownloadManager] Error getting downloaded tours:', error);
      return [];
    }
  }

  /**
   * Save downloaded tour to storage
   */
  private async saveDownloadedTour(tour: DownloadedTour): Promise<void> {
    try {
      const tours = await this.getDownloadedTours();
      
      // Remove existing entry if any
      const filtered = tours.filter(
        t => !(t.id === tour.id && t.language === tour.language)
      );
      
      // Add new entry
      filtered.push(tour);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      console.log('[DownloadManager] Saved downloaded tour:', tour.id, tour.language);
    } catch (error) {
      console.error('[DownloadManager] Error saving downloaded tour:', error);
    }
  }

  /**
   * Remove downloaded tour from storage
   */
  private async removeDownloadedTour(tourId: string, language: string): Promise<void> {
    try {
      const tours = await this.getDownloadedTours();
      const filtered = tours.filter(
        t => !(t.id === tourId && t.language === language)
      );
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      console.log('[DownloadManager] Removed downloaded tour:', tourId, language);
    } catch (error) {
      console.error('[DownloadManager] Error removing downloaded tour:', error);
    }
  }

  /**
   * Get total storage used by downloads
   */
  async getTotalStorageUsed(): Promise<number> {
    try {
      const tours = await this.getDownloadedTours();
      return tours.reduce((total, tour) => total + tour.fileSize, 0);
    } catch (error) {
      console.error('[DownloadManager] Error calculating storage:', error);
      return 0;
    }
  }

  /**
   * Delete all downloaded tours
   */
  async deleteAllTours(): Promise<void> {
    try {
      const tours = await this.getDownloadedTours();
      
      for (const tour of tours) {
        await this.deleteTour(tour.id, tour.language);
      }
      
      await AsyncStorage.removeItem(STORAGE_KEY);
      console.log('[DownloadManager] Deleted all tours');
    } catch (error) {
      console.error('[DownloadManager] Error deleting all tours:', error);
    }
  }

  /**
   * Register a progress callback for a download
   */
  registerProgressCallback(
    tourId: string,
    language: string,
    callback: (progress: DownloadProgress) => void
  ): void {
    const downloadKey = this.getDownloadKey(tourId, language);
    this.downloadCallbacks.set(downloadKey, callback);
  }

  /**
   * Unregister a progress callback
   */
  unregisterProgressCallback(tourId: string, language: string): void {
    const downloadKey = this.getDownloadKey(tourId, language);
    this.downloadCallbacks.delete(downloadKey);
  }

  /**
   * Check if a download is in progress
   */
  isDownloading(tourId: string, language: string): boolean {
    const downloadKey = this.getDownloadKey(tourId, language);
    return this.activeDownloads.has(downloadKey);
  }
}

// Export singleton instance
export const downloadManager = new DownloadManagerService();
