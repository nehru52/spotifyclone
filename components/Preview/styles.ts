import { StyleSheet } from 'react-native';
import { COLORS } from '@config';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.PRIMARY,
  },
  flatListContentContainer: {
    backgroundColor: COLORS.PRIMARY,
    gap: 6,
  },
  gradientOverlay: {
    zIndex: -2,
  },
  miniPlayer: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    height: 60,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  miniPlayerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  miniPlayerTitle: {
    color: COLORS.BLACK,
    fontSize: 14,
    fontWeight: '700',
  },
  miniPlayerSubtitle: {
    color: 'rgba(0,0,0,0.6)',
    fontSize: 11,
  },
  miniPlayerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 2,
    backgroundColor: COLORS.TINT,
    borderRadius: 2,
  },
});
