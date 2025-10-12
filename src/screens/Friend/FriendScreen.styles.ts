import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../styles/theme';

const { width, height } = Dimensions.get('window');

export const FriendStyles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  contentArea: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 12,
  },
  mainCardLike: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginLeft: 12,
    marginBottom: 10,
  },
  section: {
    paddingVertical: 20,
  },
  sectionLower: {
    marginTop: 10,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  listContent: {
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  threeColRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeholderPanel: {
    flex: 1,
    maxWidth: 56,
    aspectRatio: 0.75,
    backgroundColor: '#F6E8C7',
    borderRadius: 8,
    marginHorizontal: 6,
  },
  centerWrapper: {
    flex: 6,
    maxWidth: 360,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  headerLogoWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowLeft: {
    position: 'absolute',
    left: -18,
    top: '45%',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  arrowRight: {
    position: 'absolute',
    right: -18,
    top: '45%',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  arrowText: {
    fontSize: 18,
    color: '#444',
    fontWeight: '700',
  },
  friendCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    maxWidth: '100%',
  },
  friendName: {
    fontWeight: '700',
    marginBottom: 12,
    fontSize: 18,
  },
  friendTaskList: {
    // remove flex so the list can size naturally; set a maxHeight based on window height
    width: '100%',
    maxHeight: Math.round(height * 0.6),
    paddingBottom: 8,
  },
  friendListColumn: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 24,
  },
  cardImagePlaceholder: {
    backgroundColor: '#E8D3A8',
  },
  card: {
    width: '100%',
    backgroundColor: '#F6E8C7',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    alignSelf: 'center',
    marginVertical: 10,
  },
  cardImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardBody: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardDescription: {
    marginTop: 6,
    color: '#666',
  },
  cardFooter: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardAuthor: {
    fontSize: 12,
    color: '#444',
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
  },
  // end
});
