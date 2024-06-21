import React, { useState, useEffect } from "react";
import {
  AppProvider,
  Page,
  LegacyCard,
  Button,
  TextField,
  Layout,
} from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import '@shopify/polaris/build/esm/styles.css';

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [icons, setIcons] = useState([]);
  const [filteredIcons, setFilteredIcons] = useState([]);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/images.json`)
      .then((response) => response.json())
      .then((data) => {
        setIcons(data);
        setFilteredIcons(data);
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
    }
  };

  const handleDownload = (iconUrl) => {
    const link = document.createElement("a");
    link.href = `${process.env.PUBLIC_URL}/illustrations/${iconUrl}`;
    link.download = iconUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppProvider i18n={enTranslations}>
      <Page title="Icon Downloader">
        <Layout>
          <Layout.Section>
            <LegacyCard sectioned>
              <TextField
                label="Search Icons"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Enter a keyword..."
              />
            </LegacyCard>
          </Layout.Section>
          <Layout.Section>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", 
              gap: "20px" 
            }}>
              {filteredIcons.map((icon, index) => (
                <LegacyCard key={index} sectioned>
                  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <img
                      src={`${process.env.PUBLIC_URL}/illustrations/${icon.thumbnailPath}`}
                      alt={icon.name}
                      style={{ width: "100%", height: "150px", objectFit: "contain" }}
                      onClick={(e) => e.currentTarget.src = `${process.env.PUBLIC_URL}/illustrations/${icon.downloadPath}`}
                    />
                    <div style={{ marginTop: "auto" }}>
                      <Button fullWidth onClick={() => handleDownload(icon.downloadPath)}>
                        Download
                      </Button>
                    </div>
                  </div>
                </LegacyCard>
              ))}
            </div>
          </Layout.Section>
        </Layout>
      </Page>
    </AppProvider>
  );
}

export default App;
