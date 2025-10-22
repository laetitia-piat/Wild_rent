import { gql } from "@apollo/client";

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    getAllCategories {
      id
      image
      title
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductByCategory($category: Float!) {
    getProductByCategory(category: $category) {
      category {
        title
      }
      name
      price
      pictures {
        id
        url
      }
      id
    }
  }
`;

export const GET_PRODUCTS_BY_FILTERS = gql`
  query GetProductWithFilters(
    $maxPrice: Float!
    $minPrice: Float!
    $categoryId: Float!
    $tags: [String!]!
    $keyword: String!
  ) {
    getProductWithFilters(
      maxPrice: $maxPrice
      minPrice: $minPrice
      categoryId: $categoryId
      tags: $tags
      keyword: $keyword
    ) {
      category {
        title
      }
      name
      price
      pictures {
        id
        url
      }
      id
    }
  }
`;

export const GET_PRODUCT_OPTIONS_BY_ID_PRODUCT = gql`
  query GetProductOptions($productId: Float!) {
    getProductOptions(productId: $productId) {
      id
      size
      total_quantity
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($getProductByIdId: Float!) {
    getProductById(id: $getProductByIdId) {
      id
      name
      description
      price
      created_at
      category {
        # id
        title
      }
      pictures {
        id
        url
      }
      product_options {
        size
        id
        total_quantity
      }
      tags {
        id
        label
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetAllUsers(
    $offset: Float!
    $limit: Float!
    $role: String
    $search: String
  ) {
    getAllUsers(offset: $offset, limit: $limit, role: $role, search: $search) {
      totalUsersLength
      users {
        address {
          city
          country
          street
          zipcode
        }
        created_at
        email
        first_name
        id
        last_name
        phone_number
        role
      }
    }
  }
`;

export const GET_USER_INFO = gql`
  query GetUserInfo {
    getUserInfo {
      first_name
      last_name
      email
      phone_number
      role
      created_at
      address {
        street
        city
        zipcode
        country
      }
    }
  }
`;

export const WHO_AM_I = gql`
  query Whoami {
    whoami {
      id
      email
      role
    }
  }
`;

export const GET_ALL_TAGS = gql`
  query GetAllTags {
    getAllTags {
      id
      label
    }
  }
`;

export const GET_TAGS_BY_CATEGORY = gql`
  query GetTagsByCategory($category: Float!) {
    getTagsByCategory(category: $category) {
      id
      label
    }
  }
`;

export const GET_ALL_CATEGORIES_AND_ALL_TAGS = gql`
  query GetAllCategoriesAndTags {
    getAllTags {
      id
      label
    }
    getAllCategories {
      id
      title
    }
  }
`;

export const GET_ALL_ORDERS = gql`
  query GetAllOrders {
    getAllOrders {
      created_at
      total_price
      rental_start_date
      rental_end_date
      status
      user {
        id
      }
      products_in_order {
        quantity
        productOption {
          product {
            id
            name
          }
          size
          id
        }
      }
    }
  }
`;

export const GET_ORDER_BY_ID = gql`
  query getOrderById($getOrderById: Float!) {
    getOrderById(id: $getOrderById) {
      created_at
      total_price
      rental_start_date
      rental_end_date
      status
      user {
        id
      }
      products_in_order {
        quantity
        productOption {
          product {
            name
            id
          }
          id
          size
        }
      }
    }
  }
`;

export const GET_ALL_ORDERS_AND_DETAILS = gql`
  query GetAllOrdersAndDetails {
    getAllOrders {
      id
      user {
        email
      }
      total_price
      status
      rental_start_date
      rental_end_date
      created_at
      products_in_order {
        quantity
        productOption {
          size
          product {
            name
            price
          }
        }
      }
    }
  }
`;

export const GET_ALL_ORDERS_BY_USER_ID = gql`
  query GetOrdersByUserId($id: Float!) {
    getOrdersByUserId(id: $id) {
      created_at
      id
      status
      total_price
      rental_end_date
      rental_start_date
      products_in_order {
        quantity
        productOption {
          product {
            name
            price
          }
          size
        }
      }
    }
  }
`;

export const GET_ALL_TEMP_USERS = gql`
  query GetTempUsers {
    getAllTempUsers {
      email
      first_name
      id
      last_name
      phone_number
      role
    }
  }
`;

export const SEARCH_PRODUCTS_BY_OPTIONS = gql`
  query SearchProductsByOptions($options: ProductSearchOptions!) {
    searchProductsByOptions(options: $options) {
      name
      category {
        title
        id
        image
      }
      description
      id
      pictures {
        url
        id
      }
      price
      product_options {
        size
        id
        total_quantity
      }
      tags {
        id
        label
      }
    }
  }
`;

export const GET_AVAILABLE_PRODUCTS = gql`
  query GetAvailableProductForDates(
    $endDate: DateTimeISO!
    $startDate: DateTimeISO!
    $categoryId: Float
    $keyword: String
    $minPrice: Float
    $maxPrice: Float
    $tags: [String!]!
  ) {
    getAvailableProductForDates(
      endDate: $endDate
      startDate: $startDate
      categoryId: $categoryId
      keyword: $keyword
      minPrice: $minPrice
      maxPrice: $maxPrice
      tags: $tags
    ) {
      name
      id
      pictures {
        id
        url
      }
      description
      category {
        id
        title
      }
      price
      tags {
        id
        label
      }
    }
  }
`;

export const GET_AVAILABLE_PRODUCT_OPTION = gql`
  query GetAvailableProductOptions(
    $productId: Float
    $endDate: DateTimeISO!
    $startDate: DateTimeISO!
  ) {
    getAvailableProductOptions(
      productId: $productId
      endDate: $endDate
      startDate: $startDate
    ) {
      id
      product {
        name
      }
      size
      total_quantity
    }
  }
`;
export const GET_INVENTORY = gql`
  query GetInventoryByOptions($endDate: String!, $startDate: String!) {
    getInventoryByOptions(endDate: $endDate, startDate: $startDate) {
      option
      product
      reservations {
        reservedQty
        date
        availableQty
      }
      totalQty
      id
      category {
        title
      }
    }
  }
`;

export const GET_RESET_PASSWORD_TOKEN = gql`
  query GetResetPasswordToken($token: String!) {
    getResetPasswordToken(token: $token)
  }
`;

export const CHECK_PRODUCT_AVAILABILITY = gql`
  query CheckProductAvailability(
    $quantity: Float!
    $productId: Float!
    $endDate: String!
    $startDate: String!
  ) {
    checkProductAvailability(
      quantity: $quantity
      product_id: $productId
      endDate: $endDate
      startDate: $startDate
    ) {
      available
      availableQty
      productOptionId
    }
  }
`;

