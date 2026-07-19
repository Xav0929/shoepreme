import { customerAccountQuery } from "@/lib/shopify-account";

const ADDRESS_FRAGMENT = `
  fragment AddressFragment on CustomerAddress {
    id
    firstName
    lastName
    address1
    address2
    city
    zip
    zoneCode
    territoryCode
    phoneNumber
  }
`;

export async function getCustomerAddresses(accessToken: string) {
  const query = `
    ${ADDRESS_FRAGMENT}
    query {
      customer {
        defaultAddress { id }
        addresses(first: 20) {
          edges { node { ...AddressFragment } }
        }
      }
    }
  `;
  const data = await customerAccountQuery(accessToken, query);
  const customer = data?.data?.customer;
  const defaultId = customer?.defaultAddress?.id;
  const addresses =
    customer?.addresses?.edges?.map((e: any) => ({
      ...e.node,
      isDefault: e.node.id === defaultId,
    })) ?? [];
  return addresses;
}

export interface AddressInput {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
  zoneCode: string; // e.g. "00" region code — see note below
  territoryCode: string; // ISO country code, e.g. "PH"
  phoneNumber?: string;
}

export async function createCustomerAddress(
  accessToken: string,
  input: AddressInput,
  setDefault = false,
) {
  const mutation = `
    ${ADDRESS_FRAGMENT}
    mutation CreateAddress($address: CustomerAddressInput!, $defaultAddress: Boolean) {
      customerAddressCreate(address: $address, defaultAddress: $defaultAddress) {
        customerAddress { ...AddressFragment }
        userErrors { field message }
      }
    }
  `;
  const data = await customerAccountQuery(accessToken, mutation, {
    address: input,
    defaultAddress: setDefault,
  });
  const result = data?.data?.customerAddressCreate;
  if (result?.userErrors?.length) {
    throw new Error(result.userErrors.map((e: any) => e.message).join(", "));
  }
  return result?.customerAddress;
}

export async function updateCustomerAddress(
  accessToken: string,
  addressId: string,
  input: AddressInput,
  setDefault = false,
) {
  const mutation = `
    ${ADDRESS_FRAGMENT}
    mutation UpdateAddress($addressId: ID!, $address: CustomerAddressInput!, $defaultAddress: Boolean) {
      customerAddressUpdate(addressId: $addressId, address: $address, defaultAddress: $defaultAddress) {
        customerAddress { ...AddressFragment }
        userErrors { field message }
      }
    }
  `;
  const data = await customerAccountQuery(accessToken, mutation, {
    addressId,
    address: input,
    defaultAddress: setDefault,
  });
  const result = data?.data?.customerAddressUpdate;
  if (result?.userErrors?.length) {
    throw new Error(result.userErrors.map((e: any) => e.message).join(", "));
  }
  return result?.customerAddress;
}

export async function deleteCustomerAddress(
  accessToken: string,
  addressId: string,
) {
  const mutation = `
    mutation DeleteAddress($addressId: ID!) {
      customerAddressDelete(addressId: $addressId) {
        deletedAddressId
        userErrors { field message }
      }
    }
  `;
  const data = await customerAccountQuery(accessToken, mutation, { addressId });
  const result = data?.data?.customerAddressDelete;
  if (result?.userErrors?.length) {
    throw new Error(result.userErrors.map((e: any) => e.message).join(", "));
  }
  return result?.deletedAddressId;
}

export async function setDefaultCustomerAddress(
  accessToken: string,
  addressId: string,
) {
  const mutation = `
    mutation SetDefault($addressId: ID!) {
      customerDefaultAddressUpdate(addressId: $addressId) {
        customer { defaultAddress { id } }
        userErrors { field message }
      }
    }
  `;
  const data = await customerAccountQuery(accessToken, mutation, { addressId });
  const result = data?.data?.customerDefaultAddressUpdate;
  if (result?.userErrors?.length) {
    throw new Error(result.userErrors.map((e: any) => e.message).join(", "));
  }
  return result?.customer;
}
