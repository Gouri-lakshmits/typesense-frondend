import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { SYSTEM_CONFIG } from "../apollo/queries/config";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import searchListStyle from "./styles/search_listing.module.scss";
import { count } from "console";

const SearchListing = () => {
  const router = useRouter();
  const [productDetails, setProductDetails] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAttribute, setSortAttribute] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const { data: configData } = useQuery(SYSTEM_CONFIG);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPriceFilters, setSelectedPriceFilters] = useState<string[]>(
    []
  );
  const [selectedSizeFilters, setselectedSizeFilters] = useState<string[]>([]);
  const [selectedCategoryFilters, setselectedCategoryFilters] = useState<
    string[]
  >([]);
  const [selectedNewnessFilters, setselectedNewnessFilters] = useState<
    string[]
  >([]);
  const [searchResults, setSearchResults] = useState<any[]>([]); // Store search results

  useEffect(() => {
    const productDetailsParam = router.query.productDetails;
    if (productDetailsParam) {
      try {
        const parsedProductDetails = JSON.parse(productDetailsParam as string);
        setProductDetails(parsedProductDetails);
        setSearchResults(parsedProductDetails);
      } catch (error) {
        console.error("Error parsing product details:", error);
      }
    }
  }, [router.query.productDetails]);

  const categoryCounts: Record<string, number> = {};
  searchResults.forEach((product) => {
    const category = product.category;
    if (category) {
      if (categoryCounts[category]) {
        categoryCounts[category]++;
      } else {
        categoryCounts[category] = 1;
      }
    }
  });

  const sizeCounts: Record<string, number> = {};
  searchResults.forEach((product) => {
    const sizes = product.size;
    if (sizes && Array.isArray(sizes)) {
      sizes.forEach((size) => {
        const sizeKey = size.toUpperCase();
        if (sizeKey) {
          if (sizeCounts[sizeKey]) {
            sizeCounts[sizeKey]++;
          } else {
            sizeCounts[sizeKey] = 1;
          }
        }
      });
    }
  });

  const handleSizeFilterChange = (size: string) => {
    if (selectedSizeFilters.includes(size)) {
      setselectedSizeFilters((prevFilters) =>
        prevFilters.filter((filter) => filter !== size)
      );
    } else {
      setselectedSizeFilters((prevFilters) => [...prevFilters, size]);
    }
  };

  const colorCounts: Record<string, number> = {};
  searchResults.forEach((product) => {
    const colors = product.color;

    if (colors && Array.isArray(colors)) {
      colors.forEach((color) => {
        if (color) {
          if (colorCounts[color]) {
            colorCounts[color]++;
          } else {
            colorCounts[color] = 1;
          }
        }
      });
    }
  });

  const priceCounts: Record<string, number> = {};
  searchResults.forEach((product) => {
    const price = product.price;
    if (price) {
      if (priceCounts[price]) {
        priceCounts[price]++;
      } else {
        priceCounts[price] = 1;
      }
    }
  });

  const newnessCounts: Record<string, number> = {};
  searchResults.forEach((product) => {
    const newness = product.newness;
    if (newness) {
      if (newnessCounts[newness]) {
        newnessCounts[newness]++;
      } else {
        newnessCounts[newness] = 1;
      }
    }
  });

  const handleNewnessFilterChange = (newness: string) => {
    if (selectedNewnessFilters.includes(newness)) {
      setselectedNewnessFilters((prevFilters) =>
        prevFilters.filter((filter) => filter !== newness)
      );
    } else {
      setselectedNewnessFilters((prevFilters) => [...prevFilters, newness]);
    }
  };

  const handleColorFilterChange = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors((prevFilters) =>
        prevFilters.filter((filter) => filter !== color)
      );
    } else {
      setSelectedColors((prevFilters) => [...prevFilters, color]);
    }
  };
  const uniquePriceValues = Array.from(
    new Set(searchResults.map((product) => product.price))
  );
  const combinedCategories = searchResults.map((product) => product.category);
  const allCategories = combinedCategories.join(",").split(",");

  const uniquecategoryValues = Array.from(new Set(allCategories));

  uniquecategoryValues.forEach((category) => {
    categoryCounts[category] = allCategories.filter(
      (c) => c === category
    ).length;
  });

  const uniquecolorsValues = Array.from(
    new Set(
      searchResults
        .map((product) => product.color)
        .join(",")
        .split(",")
    )
  );
  const uniquesizeValues = Array.from(
    new Set(
      searchResults.flatMap((product) => {
        const sizes = product.size;
        if (sizes && Array.isArray(sizes)) {
          return sizes.map((size) => size.toUpperCase());
        }
        return [];
      })
    )
  );

  const uniqueNewValues = Array.from(
    new Set(searchResults.map((product) => product.new))
  );

  const totalPages = Math.ceil(searchResults.length / productsPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredProducts = productDetails.filter(
      (item) =>
        item.product_name.toLowerCase().includes(query) ||
        item.product_name.toLowerCase().startsWith(query)
    );

    setSearchResults(filteredProducts);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    router.push({
      pathname: router.pathname,
      query: { ...router.query, search: searchQuery },
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSortChange = (attribute: string) => {
    if (attribute === sortAttribute) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortAttribute(attribute);
      setSortOrder("asc");
    }
  };

  const handlePriceFilterChange = (priceValue: string) => {
    if (selectedPriceFilters.includes(priceValue)) {
      setSelectedPriceFilters((prevFilters) =>
        prevFilters.filter((filter) => filter !== priceValue)
      );
    } else {
      setSelectedPriceFilters((prevFilters) => [...prevFilters, priceValue]);
    }
  };

  const handleCategoryFilterChange = (category: string) => {
    if (selectedCategoryFilters.includes(category)) {
      setselectedCategoryFilters((prevFilters) =>
        prevFilters.filter((filter) => filter !== category)
      );
    } else {
      setselectedCategoryFilters((prevFilters) => [...prevFilters, category]);
    }
  };

  const filteredProducts = searchResults.filter((item) => {
    const passesNewnessFilter =
      selectedNewnessFilters.length === 0 ||
      selectedNewnessFilters.includes(item?.newness);
    const hasPriceFilter = selectedPriceFilters.length > 0;
    const passesPriceFilter =
      !hasPriceFilter || selectedPriceFilters.includes(item?.price);
    const category = item.category;
    const passesCategoryFilter =
      selectedCategoryFilters.length === 0 ||
      (Array.isArray(category) &&
        category.some((cat) => selectedCategoryFilters.includes(cat)));
    const size = item?.size;
    const selectedSizeFiltersAsStrings = selectedSizeFilters.map(String);
    const passesSizeFilter =
      selectedSizeFilters.length === 0 ||
      (Array.isArray(size) &&
        size.some((s) => selectedSizeFiltersAsStrings.includes(String(s))));
    const color = item?.color;
    const passesColorFilter =
      selectedColors.length === 0 ||
      (Array.isArray(color) && color.some((c) => selectedColors.includes(c)));
    return (
      passesCategoryFilter &&
      passesColorFilter &&
      passesSizeFilter &&
      passesNewnessFilter &&
      passesPriceFilter
    );
  });

  const sortedProducts = filteredProducts.slice().sort((a, b) => {
    if (sortAttribute && sortOrder) {
      const valueA = a[sortAttribute];
      const valueB = b[sortAttribute];
      if (valueA !== undefined && valueB !== undefined) {
        if (sortOrder === "asc") {
          return valueA.localeCompare(valueB);
        } else {
          return valueB.localeCompare(valueA);
        }
      }
    }
    return 0;
  });
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const displayedProducts = sortedProducts.slice(startIndex, endIndex);
  const totalCount = Object.values(sizeCounts).reduce(
    (acc, count) => acc + count,
    0
  );
  const newCount = Object.values(newnessCounts).reduce(
    (acc, count) => acc + count,
    0
  );
  const colorCount = Object.values(colorCounts).reduce(
    (acc, count) => acc + count,
    0
  );
  const categoryCount = Object.values(categoryCounts).reduce(
    (acc, count) => acc + count,
    0
  );
  const priceCount = Object.values(priceCounts).reduce(
    (acc, count) => acc + count,
    0
  );
  return (
    <div className={searchListStyle.search_list_main}>
      {/* <h1>Search Listing Page</h1> */}
      <div className="search_area_wrapper">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search Products"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </form>
        <div className="sort_wrapper">
          <label>Sort by:</label>
          <Select
            sx={{
              height: "25px",
            }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sortAttribute}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            {configData?.typeseSenseSystemConfig.search_result.sort_option.map(
              (option: any) => (
                <MenuItem key={option.attribute} value={option.attribute}>
                  {option.label}
                </MenuItem>
              )
            )}
          </Select>
        </div>
      </div>
      {filteredProducts.length > 0 ? (
        <div className="serach_list_container">
          <div className="filter_wrapper">
            {priceCount > 0 && (
              <div className="filter_inner_wrapper">
                <h3>Price:</h3>
                {uniquePriceValues.map((priceValue: string) => (
                  <p key={priceValue} className="filter_item_wraper">
                    <input
                      type="checkbox"
                      value={priceValue}
                      checked={selectedPriceFilters.includes(priceValue)}
                      onChange={() => handlePriceFilterChange(priceValue)}
                    />
                    <span>
                      {`${priceValue} (${priceCounts[priceValue] || 0})`}{" "}
                    </span>
                  </p>
                ))}
              </div>
            )}
            {categoryCount > 0 && (
              <div className="filter_inner_wrapper">
                <h3>Category:</h3>
                {uniquecategoryValues.map((category: string) => (
                  <p key={category} className="filter_item_wraper">
                    <input
                      type="checkbox"
                      value={category}
                      checked={selectedCategoryFilters.includes(category)}
                      onChange={() => handleCategoryFilterChange(category)}
                    />
                    <span>{`${category} (${
                      categoryCounts[category] || 0
                    })`}</span>
                  </p>
                ))}
              </div>
            )}
            {colorCount > 0 && (
              <div className="filter_inner_wrapper">
                <h3>Color:</h3>
                {uniquecolorsValues.map((color: string) => (
                  <p key={color} className="filter_item_wraper">
                    <input
                      type="checkbox"
                      value={color}
                      checked={selectedColors.includes(color)}
                      onChange={() => handleColorFilterChange(color)}
                    />
                    <span>{`${color.toLowerCase()} (${
                      colorCounts[color] || 0
                    })`}</span>
                  </p>
                ))}
              </div>
            )}
            {totalCount > 0 && (
              <div className="filter_inner_wrapper">
                <h3>Size:</h3>
                {uniquesizeValues.map(
                  (size: string) =>
                    sizeCounts[size] > 0 && (
                      <p key={size} className="filter_item_wraper">
                        <input
                          type="checkbox"
                          value={size}
                          checked={selectedSizeFilters.includes(size)}
                          onChange={() => handleSizeFilterChange(size)}
                        />
                        <span>
                          {`${size.toUpperCase()} (${sizeCounts[size] || 0})`}
                        </span>
                      </p>
                    )
                )}
              </div>
            )}
            {newCount > 0 && (
              <div className="filter_inner_wrapper">
                <h3>New:</h3>
                {uniqueNewValues.map((newness: string) => (
                  <p key={newness} className="filter_item_wraper">
                    <input
                      type="checkbox"
                      value={newness}
                      checked={selectedNewnessFilters.includes(newness)}
                      onChange={() => handleNewnessFilterChange(newness)}
                    />
                    <span>{`${newness} (${newnessCounts[newness] || 0})`}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="products_wrapper">
            <ul className="search_list_item_wrapper">
              {displayedProducts.map((item, index) => (
                <div className="card" key={index}>
                  <img src={item.image_url} alt="Denim Jeans" />
                  <h1>{item.product_name}</h1>
                  <p className="price">{item.price}</p>
                  <p>{item.sku}</p>
                </div>
              ))}
            </ul>
          </div>
        </div>
      ) : (<h1 className="no-products"> No Products available</h1>)}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchListing;
