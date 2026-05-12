import axios from 'axios';

import { AlbumModel, TrackModel } from '@models';
import { AlbumResponseType, SEPARATOR } from '@config';
import { parseToAlbum } from '@utils';

import { BASE_URL, getSessionlessToken } from '../config';
import { fetchTours } from '../../src/services/content';

export const getAlbum = async (albumId: string): Promise<AlbumModel> => {
  try {
    // INTERCEPT: Check if this is a Wonders of Rome tour
    const tours = await fetchTours();
    const tour = tours.find(t => t.id === albumId);
    
    if (tour) {
      // Map Tour to AlbumModel for compatibility with the existing UI
      return {
        id: tour.id,
        name: tour.title,
        albumType: 'album',
        artists: [{ id: 'wonders-of-rome', name: 'Wonders of Rome' }],
        releaseDate: '2024-01-01',
        imageURL: tour.thumbnail || '',
        label: 'Wonders of Rome',
        copyrights: [{ text: 'Wonders of Rome', type: 'C' }],
        description: tour.description, // Pass through our custom scripts
        kidsMyth: tour.stops[0]?.kidsMyth,
        tips: tour.stops[0]?.tips,
        tracks: {
          total: tour.stops.length,
          items: tour.stops.map((stop, index) => ({
            id: stop.id,
            title: stop.name,
            subtitle: `Stop ${index + 1} ${SEPARATOR} ${stop.category}`,
            imageURL: stop.thumbnail || tour.thumbnail || '',
            isSaved: false,
            isPlaying: false,
            isDownloaded: false,
            explicit: false,
            // Custom field for the player
            audioUrl: stop.audioFiles.en?.deep?.url || '',
            audioFiles: stop.audioFiles,
            description: stop.description,
            kidsMyth: stop.kidsMyth,
            tips: stop.tips
          } as TrackModel))
        },
        duration: '600000', // Mock duration
      } as AlbumModel;
    }

    const { token } = await getSessionlessToken();

    const response = (await axios.get(`${BASE_URL}/albums/${albumId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })) as { data: AlbumResponseType };

    return parseToAlbum(response.data);
  } catch (error) {
    console.error(`Error fetching album with an ID: ${albumId}`, error);
    throw error;
  }
};
