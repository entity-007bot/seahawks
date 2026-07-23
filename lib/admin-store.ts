import fs from "fs";
import path from "path";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  password?: string;
  superAdmin: boolean;
  status: "Active" | "Suspended";
  createdAt: string;
  createdBy?: string;
}

const ADMINS_FILE = path.join(process.cwd(), "admin-accounts.json");

let memoryAdmins: AdminUser[] = [
  {
    id: "admin_super_1",
    name: "Lord Admiral David Chukwuyem",
    email: "davidchukwuyem73@gmail.com",
    role: "Lord Admiral / Grand Admiral",
    password: "admiral_secret_command_2026",
    superAdmin: true,
    status: "Active",
    createdAt: "2026-01-01T00:00:00.000Z",
    createdBy: "System Initializer"
  },
  {
    id: "admin_super_2",
    name: "Primary Admiralty Command",
    email: "admin@saeahawks.org",
    role: "Grand Admiral",
    password: "admiral_secret_command_2026",
    superAdmin: true,
    status: "Active",
    createdAt: "2026-01-01T00:00:00.000Z",
    createdBy: "System Initializer"
  }
];

export function getAdminAccounts(): AdminUser[] {
  try {
    if (fs.existsSync(ADMINS_FILE)) {
      const data = fs.readFileSync(ADMINS_FILE, "utf-8");
      memoryAdmins = JSON.parse(data);
      return memoryAdmins;
    }
  } catch (err) {
    console.warn("Could not read admin accounts file, using memory store:", err);
  }
  return memoryAdmins;
}

export function saveAdminAccounts(admins: AdminUser[]) {
  memoryAdmins = admins;
  try {
    fs.writeFileSync(ADMINS_FILE, JSON.stringify(admins, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write admin accounts file:", err);
  }
}
