import MainItems from "./MainItems";
import MostSelling from "./MostSelling";
import NavBar from "./NavBar";
import { DrupalJsonApiParams } from "drupal-jsonapi-params";

async function Products({ locale }) {
  const params1 = new DrupalJsonApiParams()
    .addFields("node--product", [
      "path",
      "title",
      "body",
      "field_price",
      "field_category",
      "field_image",
      "drupal_internal__nid",
      "body",
      "field_out_of_stock",
      "field_path",
    ])
    .addInclude(["field_category", "field_image"])
    .addFilter("langcode", locale)
    .addPageLimit(200);

  const queryString = params1.getQueryString({ encode: false });

  let products = [];

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_DRUPAL_BASE_URL +
        `/${locale}/` +
        "/jsonapi/node/product?jsonapi_include=1&" +
        queryString,
      {
        cache: "no-cache",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    products = data.data;
  } catch (error) {
    console.error(error);
  }

  const productsMapped = products.map((product) => {
    const itemId = product.drupal_internal__nid;
    const itemName = product.title;
    const itemCategories = product.field_category.map((category) => category);
    const itemPath = product.field_path;

    const itemPrice = parseFloat(product.field_price);
    const itemDescription = product.body?.value || "";
    const itemImage = product.field_image?.uri?.url
      ? process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + product.field_image?.uri.url
      : "/svg/img-placeholder.svg";
    let itemOutOfStock;

    if (product.field_out_of_stock === null) {
      itemOutOfStock = false;
    } else if (product.field_out_of_stock === false) {
      itemOutOfStock = false;
    } else {
      itemOutOfStock = true;
    }

    return {
      id: itemId,
      name: itemName,
      categories: itemCategories,
      price: itemPrice,
      description: itemDescription,
      image: itemImage,
      outOfStock: itemOutOfStock,
      path: itemPath,
      // Add other properties you need
    };
  });

  const allCategories = products
    .reduce((categories, product) => {
      return categories.concat(
        product.field_category
          .filter((category) => category.name !== "Most Selling")
          .map((category) => ({ name: category.name, weight: category.weight }))
      );
    }, [])
    .sort((a, b) => a.weight - b.weight)
    .map((category) => category.name);

  const uniqueCategories = Array.from(new Set(allCategories));

  const mostSellingProducts = productsMapped.filter((product) =>
    product.categories.some((category) => category.name === "Most Selling")
  );

  let categorizedMenu = {};
  let categoryWeights = {};

  productsMapped.forEach((item) => {
    const hasMostSellingCategory = item.categories.some(
      (category) => category.name === "Most Selling"
    );

    if (!hasMostSellingCategory) {
      item.categories.forEach((category) => {
        const categoryName = category.name;

        if (!categorizedMenu[categoryName]) {
          categorizedMenu[categoryName] = [];
        }

        categorizedMenu[categoryName].push({
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          image: item.image,
          path: item.path,
          outOfStock: item.outOfStock,
        });

        // Store category weight information separately
        categoryWeights[categoryName] = category.weight;
      });
    }
  });

  // Sort categories based on their order
  const sortedCategories = Object.keys(categorizedMenu).sort(
    (a, b) => categoryWeights[a] - categoryWeights[b]
  );

  // Create a new object with sorted categories
  const sortedCategorizedMenu = {};
  sortedCategories.forEach((category) => {
    sortedCategorizedMenu[category] = categorizedMenu[category];
  });
  return (
    <div>
      <NavBar categories={uniqueCategories} />

      {mostSellingProducts.length > 0 && (
        <MostSelling mostSelling={mostSellingProducts} />
      )}

      <MainItems data={sortedCategorizedMenu} />
    </div>
  );
}

export default Products;
