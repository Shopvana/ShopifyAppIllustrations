import { TopBar, ActionList, Icon, Frame, Text } from '@shopify/polaris';
import { PlusIcon } from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';

export const TopBarExample = ({ searchValue, handleSearchChange }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const toggleIsUserMenuOpen = useCallback(
    () => setIsUserMenuOpen((isUserMenuOpen) => !isUserMenuOpen),
    [],
  );

  const toggleIsSecondaryMenuOpen = useCallback(
    () => setIsSecondaryMenuOpen((isSecondaryMenuOpen) => !isSecondaryMenuOpen),
    [],
  );

  const handleSearchResultsDismiss = useCallback(() => {
    setIsSearchActive(false);
    handleSearchChange('');
  }, [handleSearchChange]);

  const handleSearchFieldChange = useCallback((value) => {
    handleSearchChange(value);
    setIsSearchActive(value.length > 0);
  }, [handleSearchChange]);

  const handleSearchFieldBlur = useCallback(() => {
    setIsSearchActive(false);
  }, []);

  const handleNavigationToggle = useCallback(() => {
    console.log('toggle navigation visibility');
  }, []);

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={[]}
      name="Polaris Dev"
      detail="Shopify Plus"
      initials="D"
      open={isUserMenuOpen}
      onToggle={toggleIsUserMenuOpen}
    />
  );

  const searchResultsMarkup = (
    <ActionList
      items={[]}
    />
  );

  const searchFieldMarkup = (
    <TopBar.SearchField
      onChange={handleSearchFieldChange}
      value={searchValue}
      placeholder="Search"
      showFocusBorder
      onBlur={handleSearchFieldBlur}
    />
  );

  const secondaryMenuMarkup = (
    <TopBar.Menu
      activatorContent={
        <span>
          <Icon source={PlusIcon} />
          <Text as="span" visuallyHidden>
            Secondary menu
          </Text>
        </span>
      }
      open={isSecondaryMenuOpen}
      onOpen={() => window.open("https://github.com/Shopvana/ShopifyAppIllustrations/issues")}    />
  );

  return (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      secondaryMenu={secondaryMenuMarkup}
      searchField={searchFieldMarkup}
      searchResults={searchResultsMarkup}
      onSearchResultsDismiss={handleSearchResultsDismiss}
      onNavigationToggle={handleNavigationToggle}
    />
  );
}

export default TopBarExample;
