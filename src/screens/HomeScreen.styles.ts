import { StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

export const HomeStyles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  tabButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
  },
  tabButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  activeTabButtonText: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },
  contentArea: {
    flex: 1,
  },
});
