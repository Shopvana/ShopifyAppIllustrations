import React, { useState, useEffect, useCallback } from "react";
import {
  AppProvider,
  Page,
  Card,
  Button,
  TextField,
  Layout,
  EmptyState,
  FooterHelp,
  Link,
  Pagination,
  Frame,
  Modal,
  FormLayout,
  Toast,
  Box,
  InlineStack,
  ButtonGroup,
  Text,
  BlockStack,
  Spinner,
} from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import TopBarExample from "./TopBarExample.js";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [icons, setIcons] = useState([]);
  const [filteredIcons, setFilteredIcons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const iconsPerPage = 8;
  const [active, setActive] = useState(false);
  const [toastContent, setToastContent] = useState("");
  const [loading, setLoading] = useState(true); // Spinner state

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/images.json`)
      .then((response) => response.json())
      .then((data) => {
        setIcons(data);
        setFilteredIcons(data);
        setLoading(false); // Stop spinner after loading
      })
      .catch(() => {
        setLoading(false); // Stop spinner even if there's an error
        setToastContent("Error loading icons. Please try again.");
        toggleActive();
      });
  }, []);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (value.trim() === "") {
      setFilteredIcons(icons);
    } else {
      const results = icons.filter((icon) =>
        icon.description.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredIcons(results);
      setCurrentPage(1);
    }
  };

  const handleDownload = (iconUrl) => {
    const link = document.createElement("a");
    link.href = `${process.env.PUBLIC_URL}/illustrations/svgs/${iconUrl}`;
    link.download = iconUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(filteredIcons.length / iconsPerPage))
    );
  };

  const displayedIcons = filteredIcons.slice(
    (currentPage - 1) * iconsPerPage,
    currentPage * iconsPerPage
  );



  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const toastMarkup = active ? (
    <Toast
      content={toastContent}
      onDismiss={toggleActive}
      error={toastContent.includes("Error")}
    />
  ) : null;



  const logo = {
    topBarSource: `${process.env.PUBLIC_URL}/logo.png`,
    width: 20,
    url: "https://shopvana.io",
    accessibilityLabel: "Shopvana",
  };

  return (
    <AppProvider i18n={enTranslations}>
      <Frame
        topBar={
          <TopBarExample
            searchValue={searchTerm}
            handleSearchChange={handleSearchChange}
          />
        }
        logo={logo}
      >
        <Page title="Shopify App Illustrations">
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
              <Spinner accessibilityLabel="Loading illustrations" size="large" />
            </div>
          ) : displayedIcons.length > 0 ? (
            <Layout>
              <Layout.Section>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "20px",
                    padding: "0 20px",
                  }}
                >
                  {displayedIcons.map((icon, index) => (
                    <Card key={index} sectioned>
                      <BlockStack gap="200">
                        <Text as="h2" variant="headingSm">
                          {icon.name}
                        </Text>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                          }}
                        >
                          <div
                            style={{
                              width: "100%",
                              height: "150px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginBottom: "20px",
                            }}
                          >
                            <img
                              src={`${process.env.PUBLIC_URL}/illustrations/svgs/${icon.fileName}`}
                              alt={icon.name}
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                              }}
                            />
                          </div>
                          <InlineStack align="center">
                            <ButtonGroup>
                              <Button
                                variant="primary"
                                fullWidth
                                onClick={() => handleDownload(icon.fileName)}
                              >
                                Download
                              </Button>
                            </ButtonGroup>
                          </InlineStack>
                        </div>
                      </BlockStack>
                    </Card>
                  ))}
                </div>
              </Layout.Section>
            </Layout>
          ) : (
            <Card sectioned>
              <EmptyState
                heading="No illustrations found"
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                action={{
                  content: "Request Illustration",
                  onAction: ()=> window.open("https://github.com/Shopvana/ShopifyAppIllustrations/issues"),
                }}
              >
                <p>
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </EmptyState>
            </Card>
          )}

          <Layout.Section>
            <div
              style={{
                padding: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Pagination
                hasPrevious={currentPage > 1}
                onPrevious={handlePreviousPage}
                hasNext={currentPage < Math.ceil(filteredIcons.length / iconsPerPage)}
                onNext={handleNextPage}
              />
            </div>
          </Layout.Section>
          <FooterHelp>
            Made with ❤️ by <Link url="https://shopvana.io">Shopvana</Link>
          </FooterHelp>
          {toastMarkup}
        </Page>
      </Frame>
    </AppProvider>
  );
}

export default App;
