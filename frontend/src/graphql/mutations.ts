import { gql } from "@apollo/client";

export const REGISTER = gql`
  mutation Register($data: UserInput!) {
    register(data: $data)
  }
`;

export const LOGIN = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data)
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export const CONFIRM_EMAIL = gql`
  mutation ConfirmEmail($codeByUser: String!) {
    confirmEmail(code_by_user: $codeByUser)
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($data: ProductInput!) {
    createProduct(data: $data) {
      category {
        title
        id
        image
      }
      created_at
      description
      id
      name
      price
      product_options {
        id
        size
        total_quantity
      }
      pictures {
        id
        url
      }
      tags {
        id
        label
      }
    }
  }
`;
export const CREATE_ORDER = gql`
  mutation CreateNewOrder($data: OrderInput!) {
    createNewOrder(data: $data) {
      created_at
      total_price
      rental_start_date
      rental_end_date
      status
      user {
        id
      }
      products_in_order {
        productOption {
          product {
            id
          }
          size
        }
        quantity
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($data: DeleteUserInput!) {
  deleteUser(data: $data)
}
`;

export const DELETE_ORDER_BY_ID = gql`
  mutation DeleteOrderById($deleteOrderId: Float!) {
    deleteOrderById(id: $deleteOrderId)
  }
`;

export const APPROVED_ORDER_BY_ID = gql`
  mutation approvedOrderById($data: ChangeOrderStatusInput!) {
    changeStatusOrderById(data: $data)
  }
`;

export const EDIT_USER = gql`
  mutation EditUser($data: UpdateOrCreateUserInput!) {
    editUser(data: $data) {
      address {
        city
        country
        street
        zipcode
      }
      email
      created_at
      first_name
      id
      last_name
      phone_number
      role
    }
  }
`;

export const ADD_USER = gql`
  mutation AddUser($data: UpdateOrCreateUserInput!) {
    addUser(data: $data)
  }
`;

export const ADD_USER_CONFIRMATION = gql`
  mutation AddUserConfirmation($password: String!, $randomCode: String!) {
    addUserConfirmation(password: $password, random_code: $randomCode) {
      email
      first_name
      last_name
      id
      role
      address {
        city
        country
        street
        zipcode
      }
    }
  }
`;

export const MODIFY_PRODUCT = gql`
  mutation ModifyProduct($data: ProductInput!) {
    modifyProductById(data: $data) {
      id
      name
      description
      price
      pictures {
        id
        url
      }
      product_options {
        id
        size
        total_quantity
      }
      created_at
      category {
        id
        title
      }
      tags {
        label
        id
      }
    }
  }
`;

export const DELETE_PRODUCT_BY_ID = gql`
  mutation DeleteProductById($id: Float!) {
    deleteProductById(id: $id)
  }
`;

export const DELETE_TEMP_USER = gql`
  mutation DeleteTempUser($deleteTempUserId: Float!) {
    deleteTempUser(id: $deleteTempUserId)
  }
`;

export const CREATE_OR_UPDATE_ADDRESS = gql`
  mutation CreateOrUpdateAddress($data: CreateOrUpdateAddressInput!) {
    createOrUpdateAddress(data: $data) {
      street
      city
      zipcode
      country
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($data: UpdateUserInput!) {
    updateUser(data: $data) {
      first_name
      last_name
      email
      phone_number
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($data: ChangePasswordInput!) {
    changePassword(data: $data)
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($data: ResetPasswordInput!) {
    resetPassword(data: $data)
  }
`;

export const RESET_PASSWORD_REQUEST = gql`
  mutation ForgottenPasswordRequest($data: ForgottenPasswordRequestInput!) {
    forgottenPasswordRequest(data: $data)
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateNewCategory($data: CategoryInput!) {
    createNewCategory(data: $data) {
      id
    }
  }
`;
export const UPDATE_CATEGORY = gql`
  mutation UpdateCategoryById($data: CategoryInput!) {
    modifyCategory(data: $data) {
      id
      title
      image
    }
  }
`;
export const DELETE_CATEGORY = gql`
  mutation DeleteCategoryById($id: Float!) {
    deleteCategory(id: $id)
  }
`;

export const CREATE_SESSION = gql`
  mutation createCheckoutSession($data: [ProductForSessionInput!]!) {
    createCheckoutSession(data: $data)
  }
`;
