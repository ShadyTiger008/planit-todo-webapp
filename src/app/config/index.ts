export const client_api = "http://localhost:3000";
// export const client_api = "https://planit-pi.vercel.app";

export const server_api = `${client_api}/api`;

// Get all the users_api(for admins)
export const users_api = `${server_api}/users`;

export const auth_api = `${server_api}/auth`;

export const category_api = `${server_api}/category`;

export const subcategory_api = `${server_api}/subcategory`;

export const note_api = `${server_api}/note`;

export const upload_api = `${server_api}/upload`;

export const get_file_api = `${server_api}/get-file`;
