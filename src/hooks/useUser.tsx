export const useUser = () => {
  const userId = sessionStorage.getItem("id");
  const role = sessionStorage.getItem("role");
  // const userId = "USR-88fecc2e-642a-47f5-b8fa-9d18a9099187"
  // const role = "Student"
  // const userId = "USR-ba2c2e0d-f8d3-449c-be2c-b214e948f173"
  // const role = "Professor"
  return { userId, role };
};

export const useCustomer = () => {
  const customerId = sessionStorage.getItem("id") ?? "";
  // const studentId = "STD-f2e063aa-0401-433f-a32b-e10832675cfd"
  return customerId;
};

export const useVendor = () => {
  const vendorId = sessionStorage.getItem("id") ?? "";
  // const professorId = "PRF-f9b8730a-dddd-47ce-a4cd-4985f78c5223"
  return vendorId;
};
